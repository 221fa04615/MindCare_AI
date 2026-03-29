import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import admin from "firebase-admin";

// Initialize Firebase Admin
try {
  admin.initializeApp({
    projectId: "gen-lang-client-0849779577"
  });
  console.log("✅ Firebase Admin initialized");
} catch (err) {
  console.error("❌ Firebase Admin initialization failed:", err);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || "mindcare_secret_key_123";

// --- Models ---
// ... (rest of the models remain same)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: Number,
  gender: String,
  personalityType: String,
  onboarded: { type: Boolean, default: false },
  role: { type: String, default: 'user' }, // 'user' or 'admin'
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: String,
  sender: String, // 'user' or 'bot'
  sentiment: String,
  timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model("Chat", chatSchema);

const moodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: Number, // 1-5
  note: String,
  date: { type: Date, default: Date.now }
});

const Mood = mongoose.model("Mood", moodSchema);

const crisisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  timestamp: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false }
});

const Crisis = mongoose.model("Crisis", crisisSchema);

const feedbackSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adminName: String,
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

// --- Server Setup ---
async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  app.use(express.json());

  // Connect to MongoDB with infinite retry logic and fallback
  const BACKUP_URI = "mongodb+srv://niharikaadigoppula102_db_user:JNmuAhwxdWycZ4C3@mentalchatbot1.qcdzpln.mongodb.net/?appName=Mentalchatbot1";
  
  const connectDB = async (retryCount = 0, useBackup = false) => {
    const uri = useBackup ? BACKUP_URI : MONGODB_URI;
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        family: 4,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      console.log(`✅ Connected to MongoDB (${useBackup ? 'Backup' : 'Primary'})`);

      // Drop stale username index if it exists
      try {
        const db = mongoose.connection.db;
        if (db) {
          const collections = await db.listCollections({ name: 'users' }).toArray();
          if (collections.length > 0) {
            const indexes = await db.collection('users').indexes();
            if (indexes.some(idx => idx.name === 'username_1')) {
              await db.collection('users').dropIndex('username_1');
              console.log("✅ Successfully dropped stale 'username' index.");
            }
          }
        }
      } catch (indexErr) {
        console.log("ℹ️ No stale 'username' index found or already dropped.");
      }
    } catch (err) {
      console.error(`❌ MongoDB connection error (${useBackup ? 'Backup' : 'Primary'}):`, err);
      
      // Calculate delay with backoff (max 30s)
      const delay = Math.min(5000 * Math.pow(1.2, retryCount), 30000);
      const nextUseBackup = !useBackup;
      
      console.log(`Retrying connection in ${Math.round(delay/1000)} seconds... (Attempt ${retryCount + 1}) using ${nextUseBackup ? 'Backup' : 'Primary'}`);
      setTimeout(() => connectDB(retryCount + 1, nextUseBackup), delay);
    }
  };

  connectDB();

  // Disable buffering to avoid "buffering timed out" errors
  mongoose.set('bufferCommands', false);

  // --- Auth Middleware ---
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // --- API Routes ---

  app.get("/api/health", (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    res.status(isConnected ? 200 : 503).json({ 
      status: isConnected ? "ok" : "error",
      db: isConnected ? "connected" : "disconnected"
    });
  });

  // Auth
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET);
      res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET);
      
      // Try to generate a Firebase custom token if possible
      let firebaseToken = null;
      try {
        firebaseToken = await admin.auth().createCustomToken(user._id.toString(), {
          email: user.email,
          email_verified: true // We assume verified since they logged in via our backend
        });
      } catch (e) {
        console.log("ℹ️ Could not create Firebase custom token (likely missing service account):", e.message);
      }

      res.json({ 
        token, 
        firebaseToken,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, onboarded: user.onboarded, gender: user.gender } 
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get("/api/auth/firebase-token", authenticateToken, async (req: any, res) => {
    try {
      const firebaseToken = await admin.auth().createCustomToken(req.user.id, {
        email: req.user.email,
        email_verified: true
      });
      res.json({ token: firebaseToken });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // User Profile & Onboarding
  app.get("/api/user/profile", authenticateToken, async (req: any, res) => {
    const user = await User.findById(req.user.id);
    res.json(user);
  });

  app.post("/api/user/onboard", authenticateToken, async (req: any, res) => {
    try {
      const { age, gender, personalityType } = req.body;
      const user = await User.findByIdAndUpdate(req.user.id, {
        age, gender, personalityType, onboarded: true
      }, { new: true });
      res.json(user);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Chats
  app.get("/api/chats", authenticateToken, async (req: any, res) => {
    try {
      if (mongoose.connection.readyState !== 1) return res.json([]);
      const chats = await Chat.find({ userId: req.user.id }).sort({ timestamp: 1 });
      res.json(chats);
    } catch (err) {
      res.json([]);
    }
  });

  app.post("/api/chats", authenticateToken, async (req: any, res) => {
    try {
      const { message, sender, sentiment } = req.body;
      if (mongoose.connection.readyState === 1) {
        const chat = new Chat({ userId: req.user.id, message, sender, sentiment });
        await chat.save();
        res.json(chat);
      } else {
        // Return a mock object if DB is offline so the frontend doesn't break
        res.json({ _id: Date.now().toString(), userId: req.user.id, message, sender, sentiment, timestamp: new Date() });
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Moods
  app.get("/api/moods", authenticateToken, async (req: any, res) => {
    try {
      if (mongoose.connection.readyState !== 1) return res.json([]);
      const moods = await Mood.find({ userId: req.user.id }).sort({ date: 1 });
      res.json(moods);
    } catch (err) {
      res.json([]);
    }
  });

  app.post("/api/moods", authenticateToken, async (req: any, res) => {
    try {
      const { mood, note } = req.body;
      if (mongoose.connection.readyState === 1) {
        const newMood = new Mood({ userId: req.user.id, mood, note });
        await newMood.save();
        res.json(newMood);
      } else {
        res.json({ _id: Date.now().toString(), userId: req.user.id, mood, note, date: new Date() });
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Crisis
  app.post("/api/crisis", authenticateToken, async (req: any, res) => {
    const { message } = req.body;
    const crisis = new Crisis({ userId: req.user.id, message });
    await crisis.save();
    res.json(crisis);
  });

  // Feedback Routes
  app.get("/api/feedback", authenticateToken, async (req: any, res) => {
    try {
      const feedbacks = await Feedback.find().sort({ timestamp: -1 });
      res.json(feedbacks);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/feedback", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    try {
      const { message } = req.body;
      const adminUser = await User.findById(req.user.id);
      const feedback = new Feedback({ 
        adminId: req.user.id, 
        adminName: adminUser?.name || 'Administrator',
        message 
      });
      await feedback.save();
      res.json(feedback);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin Routes
  app.get("/api/admin/stats", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const userCount = await User.countDocuments();
    const chatCount = await Chat.countDocuments();
    const crisisCount = await Crisis.countDocuments({ resolved: false });
    res.json({ userCount, chatCount, crisisCount });
  });

  app.get("/api/admin/crisis", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const alerts = await Crisis.find().populate('userId', 'name email').sort({ timestamp: -1 });
    res.json(alerts);
  });

  // Socket.io
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("join", (userId) => {
      socket.join(userId);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      configFile: path.resolve(__dirname, 'vite.config.ts')
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  httpServer.listen(3000, "0.0.0.0", () => {
    console.log("Server running on http://localhost:3000");
  });
}

startServer();
