// =============================================
//   PromptCraft - Express Backend Server
// =============================================

const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// ── Startup validation ────────────────────────
if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "your_groq_api_key_here") {
  console.error("\n❌  ERROR: GROQ_API_KEY is not set in your .env file.");
  console.error("   Get your free key at: https://console.groq.com/keys\n");
  process.exit(1);
}

const groqRouter = require("./routes/groq");
const app = express();
const PORT = process.env.PORT || 3000;

// ── Rate Limiting ─────────────────────────────
const limiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute window
  max: 25,                    // max 25 requests per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait a moment and try again." },
});

// ── Middleware ────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use("/api", limiter);

// ── API Routes ────────────────────────────────
app.use("/api", groqRouter);

// ── Health Check ─────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "PromptCraft is running 🚀" });
});

// ── Catch-all ─────────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// ── Global Error Handler ─────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error. Please try again." });
});

// ── Start ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅  PromptCraft running at http://localhost:${PORT}`);
  console.log(`   Model : llama-3.3-70b-versatile (Groq)`);
  console.log(`   Limit : 25 req/min per IP`);
  console.log(`   Press Ctrl+C to stop.\n`);
});
