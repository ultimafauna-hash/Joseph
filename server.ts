import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import db from "./src/lib/db.ts";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper for auth
  const getUserByToken = async (token: string) => {
    if (token === "hardcoded-admin-token") {
      return { id: 999, email: "akwabanewsinfo@gmail.com", displayname: "Administrateur", role: "superadmin" };
    }
    const [rows]: any = await db.execute('SELECT id, email, displayname, role, is_blocked FROM users WHERE token = ?', [token]);
    return rows[0];
  };

  const requireAuth = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const user = await getUserByToken(token);
    if (!user || user.is_blocked) return res.status(401).json({ error: "Unauthorized" });
    req.user = user;
    next();
  };

  const requireAdmin = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const user = await getUserByToken(token);
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }
    req.user = user;
    next();
  };

  // Auth Endpoint handling (.php for compatibility)
  app.all("/api/auth.php", async (req, res) => {
    const action = req.query.action || req.body.action;
    const data = req.body;

    try {
      switch (action) {
        case 'register': {
          const { email, password, displayname } = data;
          if (!email || !password) return res.status(400).json({ error: "Email et mot de passe requis" });
          
          const [existing]: any = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
          if (existing.length > 0) return res.status(409).json({ error: "Cet email est déjà utilisé" });

          const hashedPassword = bcrypt.hashSync(password, 10);
          const token = crypto.randomBytes(32).toString('hex');
          
          const [result]: any = await db.execute('INSERT INTO users (email, password, displayname, token) VALUES (?, ?, ?, ?)', [email, hashedPassword, displayname, token]);
          const userId = result.insertId;
          
          await db.execute('INSERT INTO profiles (uid, email, displayname) VALUES (?, ?, ?)', [userId, email, displayname]);
          
          return res.json({ token, user: { id: userId, email, displayname, role: "user" } });
        }

        case 'login': {
          const { email, password } = data;
          const [rows]: any = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
          const user = rows[0];

          if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: "Identifiants invalides" });
          }
          if (user.is_blocked) return res.status(403).json({ error: "Ce compte est bloqué" });

          const token = crypto.randomBytes(32).toString('hex');
          await db.execute('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);
          
          return res.json({ token, user: { id: user.id, email: user.email, displayname: user.displayname, role: user.role } });
        }

        case 'admin-login': {
          const { login, password } = data;
          // Hardcoded fallback
          if ((login === 'Admin' || login === 'kassiri') && password === 'Akwaba2024') {
            return res.json({
              token: "hardcoded-admin-token",
              user: { id: 999, email: "akwabanewsinfo@gmail.com", displayname: "Administrateur", role: "superadmin" }
            });
          }

          const [rows]: any = await db.execute('SELECT * FROM users WHERE email = ? AND (role = "admin" OR role = "superadmin")', [login]);
          const user = rows[0];

          if (user && bcrypt.compareSync(password, user.password)) {
            const token = crypto.randomBytes(32).toString('hex');
            await db.execute('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);
            return res.json({ token, user: { id: user.id, email: user.email, displayname: user.displayname, role: user.role } });
          }
          return res.status(401).json({ error: "Identifiants administrateur invalides" });
        }

        case 'me': {
          const authHeader = req.headers.authorization;
          const token = authHeader?.split(' ')[1];
          if (!token) return res.status(401).json({ error: "Unauthorized" });
          const user = await getUserByToken(token);
          if (!user || user.is_blocked) return res.status(401).json({ error: "Unauthorized" });
          return res.json({ id: user.id, email: user.email, displayname: user.displayname, role: user.role });
        }

        case 'logout': {
          const authHeader = req.headers.authorization;
          const token = authHeader?.split(' ')[1];
          if (token) {
            await db.execute('UPDATE users SET token = NULL WHERE token = ?', [token]);
          }
          return res.json({ success: true });
        }

        default:
          return res.status(404).json({ error: "Action inconnue" });
      }
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  });

  // Articles Endpoint
  app.all("/api/articles.php", async (req, res) => {
    const { method } = req;
    const { action } = req.query;
    const data = req.body;

    try {
      if (method === 'GET') {
        if (req.query.slug) {
          const [rows]: any = await db.execute('SELECT * FROM articles WHERE slug = ?', [req.query.slug]);
          const article = rows[0];
          if (article) {
            article.gallery = JSON.parse(article.gallery || '[]');
            article.reactions = JSON.parse(article.reactions || '{}');
            article.tags = JSON.parse(article.tags || '[]');
            return res.json(article);
          }
          return res.status(404).json({ error: "Article non trouvé" });
        }

        let queryStr = "SELECT * FROM articles WHERE status = 'published'";
        const params: any[] = [];

        if (req.query.category && req.query.category !== 'Tout') {
          queryStr += " AND category = ?";
          params.push(req.query.category);
        }

        if (req.query.search) {
          queryStr += " AND (title LIKE ? OR content LIKE ?)";
          const searchTerm = `%${req.query.search}%`;
          params.push(searchTerm, searchTerm);
        }

        queryStr += " ORDER BY created_at DESC";

        if (req.query.limit) {
          queryStr += ` LIMIT ${parseInt(req.query.limit as string)}`;
        }

        const [articles]: any = await db.execute(queryStr, params);
        articles.forEach((art: any) => {
          art.gallery = JSON.parse(art.gallery || '[]');
          art.reactions = JSON.parse(art.reactions || '{}');
          art.tags = JSON.parse(art.tags || '[]');
        });
        return res.json(articles);
      }

      if (method === 'POST') {
        if (action === 'like') {
          return await requireAuth(req, res, async () => {
            const { id } = data;
            if (!id) return res.status(400).json({ error: "ID requis" });
            try {
              await db.execute('INSERT IGNORE INTO article_likes (article_id, user_id) VALUES (?, ?)', [id, (req as any).user.id]);
              await db.execute('UPDATE articles SET likes = likes + 1 WHERE id = ?', [id]);
            } catch (e) {}
            return res.json({ success: true });
          });
        }

        if (action === 'view') {
          const { id } = data;
          if (!id) return res.status(400).json({ error: "ID requis" });
          await db.execute('UPDATE articles SET views = views + 1 WHERE id = ?', [id]);
          return res.json({ success: true });
        }

        // Save article
        return await requireAdmin(req, res, async () => {
          const article = data;
          const id = article.id;
          
          const gallery = JSON.stringify(article.gallery || []);
          const reactions = JSON.stringify(article.reactions || {});
          const tags = JSON.stringify(article.tags || []);

          if (id && (typeof id === 'number' || !isNaN(parseInt(id)))) {
            const sql = `UPDATE articles SET 
              slug = ?, title = ?, content = ?, date = ?, category = ?, 
              rubric = ?, country = ?, is_featured = ?,
              image = ?, video = ?, audiourl = ?, gallery = ?, author = ?, 
              authorrole = ?, excerpt = ?, readingtime = ?, imagecredit = ?, source = ?, 
              tags = ?, status = ?, ispremium = ?, seotitle = ?, seodescription = ?, socialimage = ?,
              reactions = ?
              WHERE id = ?`;
            await db.execute(sql, [
              article.slug || '', article.title || '', article.content || '', article.date || new Date().toISOString(),
              article.category || '', article.rubric || null, article.country || null, article.is_featured ? 1 : 0,
              article.image || null, article.video || null, article.audiourl || null, gallery,
              article.author || 'Rédaction', article.authorrole || 'Journaliste', article.excerpt || '',
              article.readingtime || '4 min', article.imagecredit || '', article.source || '',
              tags, article.status || 'published', article.ispremium ? 1 : 0,
              article.seotitle || '', article.seodescription || '', article.socialimage || '',
              reactions, id
            ]);
            return res.json({ success: true, id });
          } else {
            const sql = `INSERT INTO articles (
              slug, title, content, date, category, rubric, country, is_featured, image, video, audiourl, gallery, author, 
              authorrole, excerpt, readingtime, imagecredit, source, tags, status, ispremium, 
              seotitle, seodescription, socialimage, reactions
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const [result]: any = await db.execute(sql, [
              article.slug || '', article.title || '', article.content || '', article.date || new Date().toISOString(),
              article.category || '', article.rubric || null, article.country || null, article.is_featured ? 1 : 0,
              article.image || null, article.video || null, article.audiourl || null, gallery,
              article.author || 'Rédaction', article.authorrole || 'Journaliste', article.excerpt || '',
              article.readingtime || '4 min', article.imagecredit || '', article.source || '',
              tags, article.status || 'published', article.ispremium ? 1 : 0,
              article.seotitle || '', article.seodescription || '', article.socialimage || '',
              reactions
            ]);
            return res.json({ success: true, id: result.insertId });
          }
        });
      }

      if (method === 'DELETE') {
        return await requireAdmin(req, res, async () => {
          const { id } = req.query;
          if (!id) return res.status(400).json({ error: "ID requis" });
          await db.execute('DELETE FROM articles WHERE id = ?', [id]);
          return res.json({ success: true });
        });
      }

    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  });

  // Events Endpoint
  app.all("/api/events.php", async (req, res) => {
    const { method } = req;
    try {
      if (method === 'GET') {
        const [events] = await db.execute("SELECT * FROM events ORDER BY created_at DESC");
        return res.json(events);
      }
      if (method === 'POST') {
        return await requireAdmin(req, res, async () => {
          const event = req.body;
          const id = event.id;
          if (id && (typeof id === 'number' || !isNaN(parseInt(id)))) {
            await db.execute('UPDATE events SET title=?, description=?, date=?, time=?, location=?, category=?, image=?, video=?, isurgent=?, status=? WHERE id=?', [
              event.title, event.description, event.date, event.time, event.location, event.category, event.image, event.video, event.isurgent ? 1 : 0, event.status, id
            ]);
            return res.json({ success: true, id });
          } else {
            const [result]: any = await db.execute('INSERT INTO events (title, description, date, time, location, category, image, video, isurgent, status) VALUES (?,?,?,?,?,?,?,?,?,?)', [
              event.title, event.description, event.date, event.time, event.location, event.category, event.image, event.video, event.isurgent ? 1 : 0, event.status
            ]);
            return res.json({ success: true, id: result.insertId });
          }
        });
      }
      if (method === 'DELETE') {
        return await requireAdmin(req, res, async () => {
          await db.execute('DELETE FROM events WHERE id = ?', [req.query.id]);
          return res.json({ success: true });
        });
      }
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  // Settings Endpoint
  app.all("/api/settings.php", async (req, res) => {
    const { method } = req;
    try {
      // Ensure table and columns exist
      await db.execute(`CREATE TABLE IF NOT EXISTS settings (
        id INT PRIMARY KEY,
        sitename VARCHAR(255),
        description TEXT,
        abouttext TEXT,
        adminemail VARCHAR(255),
        whatsappnumber VARCHAR(255),
        paymentlinks TEXT,
        activepaymentmethods TEXT,
        donationamounts TEXT,
        maintenance_mode TINYINT(1) DEFAULT 0,
        urgentbannertext TEXT,
        orangemoneynumber VARCHAR(50),
        mtnmoneynumber VARCHAR(50),
        moovmoneynumber VARCHAR(50),
        wavenumber VARCHAR(50),
        paypalid VARCHAR(255),
        stripepublickey TEXT
      )`);

      if (method === 'GET') {
        const [rows]: any = await db.execute('SELECT * FROM settings WHERE id = 1');
        const dbSettings = rows[0] || {};
        
        // Merge with defaults to ensure all fields exist for the frontend
        const settings = {
          sitename: dbSettings.sitename || 'Akwaba Info',
          description: dbSettings.description || 'Portail d\'information ivoirien et international',
          abouttext: dbSettings.abouttext || 'Akwaba Info est votre source fiable d\'actualités.',
          email: dbSettings.adminemail || 'contact@akwaba.info',
          phone: dbSettings.whatsappnumber || '+225 0707070707',
          address: 'Abidjan, Côte d\'Ivoire',
          urgentbannertext: dbSettings.urgentbannertext || '',
          urgentbanneractive: !!dbSettings.urgentbannertext,
          flashnews: "Côte d'Ivoire : Lancement d'un nouveau programme de soutien aux startups.;Économie : La ZLECAf annonce une progression record.;Sport : Préparatifs de la CAN en cours.",
          maintenancemode: !!dbSettings.maintenance_mode,
          donationamounts: dbSettings.donationamounts ? JSON.parse(dbSettings.donationamounts) : [5000, 10000, 25000],
          donationpaymentmethods: ['PayPal', 'Orange Money', 'Wave', 'MTN', 'Moov', 'Stripe', 'Flutterwave'],
          premiumprice: 5000,
          isdonationactive: true,
          ispremiumactive: true,
          activepaymentmethods: dbSettings.activepaymentmethods ? JSON.parse(dbSettings.activepaymentmethods) : {
            paypal: true,
            stripe: true,
            flutterwave: true,
            orangeMoney: true,
            mtn: true,
            moov: true,
            wave: true
          },
          orangemoneynumber: dbSettings.orangemoneynumber || '07 07 07 07 07',
          mtnmoneynumber: dbSettings.mtnmoneynumber || '05 05 05 05 05',
          moovmoneynumber: dbSettings.moovmoneynumber || '01 01 01 01 01',
          wavenumber: dbSettings.wavenumber || '07 08 09 10 11',
          paypalid: dbSettings.paypalid || '',
          stripepublickey: dbSettings.stripepublickey || '',
          paymentlinks: dbSettings.paymentlinks ? JSON.parse(dbSettings.paymentlinks) : {},
          categories: ['À LA UNE', 'POLITIQUE', 'ÉCONOMIE', 'SOCIÉTÉ', 'AFRIQUE', 'MONDE', 'CULTURE', 'SPORT', 'TECH'],
        };
        return res.json(settings);
      }
      
      if (method === 'POST') {
        return await requireAdmin(req, res, async () => {
          const s = req.body;
          const sql = `INSERT INTO settings (id, sitename, description, abouttext, urgentbannertext, adminemail, whatsappnumber, paymentlinks, activepaymentmethods, donationamounts, maintenance_mode, orangemoneynumber, mtnmoneynumber, moovmoneynumber, wavenumber, paypalid, stripepublickey) 
                       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                       ON DUPLICATE KEY UPDATE 
                       sitename=?, description=?, abouttext=?, urgentbannertext=?, adminemail=?, whatsappnumber=?, paymentlinks=?, activepaymentmethods=?, donationamounts=?, maintenance_mode=?, orangemoneynumber=?, mtnmoneynumber=?, moovmoneynumber=?, wavenumber=?, paypalid=?, stripepublickey=?`;
          const pl = JSON.stringify(s.paymentlinks || {});
          const apm = JSON.stringify(s.activepaymentmethods || {
            paypal: true, stripe: true, flutterwave: true, orangeMoney: true, mtn: true, moov: true, wave: true
          });
          const dam = JSON.stringify(s.donationamounts || [5000, 10000, 25000]);
          const params = [
            s.sitename, s.description, s.abouttext, s.urgentbannertext, s.email, s.phone, pl, apm, dam, s.maintenancemode ? 1 : 0, s.orangemoneynumber, s.mtnmoneynumber, s.moovmoneynumber, s.wavenumber, s.paypalid, s.stripepublickey,
            s.sitename, s.description, s.abouttext, s.urgentbannertext, s.email, s.phone, pl, apm, dam, s.maintenancemode ? 1 : 0, s.orangemoneynumber, s.mtnmoneynumber, s.moovmoneynumber, s.wavenumber, s.paypalid, s.stripepublickey
          ];
          await db.execute(sql, params);
          return res.json({ success: true });
        });
      }
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  });

  // Payments Endpoint
  app.all("/api/payments.php", async (req, res) => {
    const { method } = req;
    try {
      if (method === 'GET') {
        return await requireAdmin(req, res, async () => {
          const [rows] = await db.execute('SELECT t.*, u.email as user_email FROM transactions t LEFT JOIN users u ON t.userid = u.id ORDER BY t.created_at DESC');
          return res.json(rows);
        });
      }
      if (method === 'POST') {
        const { userid, amount, method: p_method, type, status, reference } = req.body;
        const [result]: any = await db.execute(
          'INSERT INTO transactions (userid, amount, method, type, status, transaction_id) VALUES (?, ?, ?, ?, ?, ?)',
          [userid || null, amount, p_method, type, status || 'pending', reference || null]
        );
        return res.json({ success: true, id: result.insertId });
      }
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  });

  // Mock response for other API endpoints to avoid 404 until implemented
  app.all("/api/*.php", (req, res) => {
    res.json([]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
