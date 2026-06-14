// =============================================
//   PromptCraft - Groq API Route
//   All AI features: streaming, auto-detect,
//   confidence score, tone analyzer, multi-lang,
//   prompt improver, chaining, caching
// =============================================

const express = require("express");
const Groq = require("groq-sdk");
const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Response Cache (10 min TTL) ───────────────
const responseCache = new Map();
const CACHE_TTL_MS  = 10 * 60 * 1000;

function getCached(key) {
  const e = responseCache.get(key);
  if (!e) return null;
  if (Date.now() - e.timestamp > CACHE_TTL_MS) { responseCache.delete(key); return null; }
  return e;
}
function setCache(key, value) {
  if (responseCache.size >= 100) responseCache.delete(responseCache.keys().next().value);
  responseCache.set(key, { ...value, timestamp: Date.now() });
}

// ── Supported Languages ───────────────────────
const LANGUAGES = {
  en: "English", hi: "Hindi", es: "Spanish", fr: "French",
  de: "German", ja: "Japanese", zh: "Chinese", ar: "Arabic",
  pt: "Portuguese", ru: "Russian",
};

// ── Prompt Templates ─────────────────────────
const PROMPT_TEMPLATES = {
  eli5:         (i) => `Explain the following concept as if you are teaching a 5-year-old child. Use simple words, relatable examples, and short sentences:\n\n${i}`,
  professional: (i) => `Rewrite the following text in a professional, polished, and business-friendly tone while preserving the original meaning:\n\n${i}`,
  summarize:    (i) => `Provide a concise summary of the following text. Highlight only the most important points:\n\n${i}`,
  quiz:         (i) => `Generate exactly 5 quiz questions with clear answers based on the following topic. Format EXACTLY as:\nQ1: [question]\nA1: [answer]\nQ2: [question]\nA2: [answer]\nQ3: [question]\nA3: [answer]\nQ4: [question]\nA4: [answer]\nQ5: [question]\nA5: [answer]\n\nTopic:\n${i}`,
  interview:    (i) => `Generate 7 insightful interview questions (mix of technical and behavioral) with ideal answer guidelines for the following role or topic. Format each as:\nQ: [question]\nTips: [key points to cover in the answer]\n\nTopic:\n${i}`,
  studyplan:    (i) => `Create a detailed, structured study plan for the following topic or subject. Include: weekly breakdown, recommended resources, milestones, and revision strategy. Make it practical and achievable:\n\n${i}`,
  teacher:      (i) => `Act as an experienced teacher. Explain the following topic step-by-step, provide relatable examples, and include key takeaways at the end:\n\n${i}`,
  mentor:       (i) => `Act as a senior mentor giving honest, actionable advice. Address the following situation or question with empathy, real-world perspective, and concrete next steps:\n\n${i}`,
};

const LENGTH_SUFFIX = {
  short:    "\n\nRespond concisely in about 100-150 words.",
  medium:   "\n\nRespond in about 250-350 words.",
  detailed: "\n\nRespond in detail, around 500+ words with thorough explanations.",
};

// ── Quick Groq call helper ────────────────────
async function quickCall(prompt, maxTokens = 300, temperature = 0.5) {
  const r = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature,
    max_tokens: maxTokens,
  });
  return r.choices[0]?.message?.content?.trim() || "";
}

// ── Auto Mode Detector ────────────────────────
router.post("/detect-mode", async (req, res) => {
  const { userInput } = req.body;
  if (!userInput?.trim()) return res.status(400).json({ error: "Input required." });
  try {
    const raw = await quickCall(
      `Analyze this text and return ONLY a JSON object with these exact keys:
       {"mode": "<one of: eli5|professional|summarize|quiz|interview|studyplan|teacher|mentor>",
        "reason": "<one short sentence why>"}
       
       Text: "${userInput.slice(0, 500)}"
       
       Rules:
       - If it's a concept/question → eli5 or teacher
       - If it's messy/informal writing → professional
       - If it's a long article/passage → summarize
       - If it's a topic to be tested on → quiz
       - If it's a job role/company/skill → interview
       - If it's a subject to learn → studyplan
       - If it needs expert advice → mentor
       Return ONLY the JSON, no markdown.`,
      150
    );
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return res.json(parsed);
  } catch {
    return res.json({ mode: "eli5", reason: "Could not detect automatically." });
  }
});

// ── Prompt Improver ───────────────────────────
router.post("/improve-prompt", async (req, res) => {
  const { userInput, mode } = req.body;
  if (!userInput?.trim()) return res.status(400).json({ error: "Input required." });
  try {
    const improved = await quickCall(
      `You are a prompt engineering expert. Improve the following user input to get a better AI response for the "${mode}" mode.
       Make it more specific, clear, and detailed while keeping the core intent.
       Return ONLY the improved text, nothing else.
       
       Original: ${userInput}`,
      300, 0.6
    );
    return res.json({ original: userInput, improved });
  } catch {
    return res.json({ original: userInput, improved: userInput });
  }
});

// ── Tone Analyzer ─────────────────────────────
router.post("/analyze-tone", async (req, res) => {
  const { before, after } = req.body;
  if (!before || !after) return res.status(400).json({ error: "Both texts required." });
  try {
    const raw = await quickCall(
      `Analyze the tone of these two texts and return ONLY a JSON object:
       {
         "before": { "tone": "<2-3 words>", "score": <formality 1-10>, "keywords": ["word1","word2","word3"] },
         "after":  { "tone": "<2-3 words>", "score": <formality 1-10>, "keywords": ["word1","word2","word3"] }
       }
       
       Text 1 (before): "${before.slice(0, 400)}"
       Text 2 (after): "${after.slice(0, 400)}"
       
       Return ONLY the JSON, no markdown.`,
      250
    );
    const clean = raw.replace(/```json|```/g, "").trim();
    return res.json(JSON.parse(clean));
  } catch {
    return res.json({ before: { tone: "Informal", score: 3, keywords: [] }, after: { tone: "Professional", score: 8, keywords: [] } });
  }
});

// ── Confidence Score ──────────────────────────
router.post("/confidence", async (req, res) => {
  const { response, mode } = req.body;
  if (!response?.trim()) return res.status(400).json({ error: "Response required." });
  try {
    const raw = await quickCall(
      `You just generated this AI response for "${mode}" mode. Rate your own answer.
       Return ONLY a JSON object: {"score": <number 60-99>, "reason": "<one sentence>"}
       
       Response: "${response.slice(0, 600)}"
       
       Return ONLY the JSON, no markdown.`,
      100
    );
    const clean = raw.replace(/```json|```/g, "").trim();
    return res.json(JSON.parse(clean));
  } catch {
    return res.json({ score: 82, reason: "Response appears well-structured and relevant." });
  }
});

// ── Follow-up Generator ───────────────────────
async function generateFollowUps(topic, mode) {
  try {
    const raw = await quickCall(
      `Based on this topic (mode: ${mode}), generate exactly 3 short curious follow-up questions a learner might ask next.
       Return ONLY a JSON array of 3 strings. Example: ["Q1?","Q2?","Q3?"]
       Topic: ${topic}`,
      200, 0.8
    );
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch { return []; }
}

// ── POST /api/generate (cached, non-streaming) ─
router.post("/generate", async (req, res) => {
  const { userInput, mode, language = "en", length = "medium" } = req.body;
  if (!userInput?.trim()) return res.status(400).json({ error: "Input cannot be empty." });
  if (!PROMPT_TEMPLATES[mode]) return res.status(400).json({ error: `Invalid mode "${mode}".` });

  const cacheKey = `${mode}::${language}::${length}::${userInput.trim().toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json({ success: true, mode, userInput: userInput.trim(), response: cached.text, followUps: cached.followUps, fromCache: true });

  try {
    const langSuffix = language !== "en" ? `\n\nIMPORTANT: Respond entirely in ${LANGUAGES[language] || "English"}.` : "";
    const prompt = PROMPT_TEMPLATES[mode](userInput.trim()) + (LENGTH_SUFFIX[length] || "") + langSuffix;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a helpful, knowledgeable assistant. Provide clear, accurate, and well-structured responses." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7, max_tokens: 1024,
    });

    const text = completion.choices[0]?.message?.content || "";
    const followUps = await generateFollowUps(userInput.trim(), mode);
    setCache(cacheKey, { text, followUps });
    return res.json({ success: true, mode, userInput: userInput.trim(), response: text, followUps, fromCache: false });
  } catch (err) {
    console.error("Groq error:", err.message);
    if (err.status === 401) return res.status(401).json({ error: "Invalid Groq API key." });
    if (err.status === 429) return res.status(429).json({ error: "Rate limit reached. Please wait." });
    return res.status(500).json({ error: "Failed to get a response. Please try again." });
  }
});

// ── GET /api/stream (SSE streaming) ───────────
router.get("/stream", async (req, res) => {
  const { userInput, mode, language = "en", length = "medium" } = req.query;
  if (!userInput?.trim()) return res.status(400).json({ error: "Input required." });
  if (!PROMPT_TEMPLATES[mode]) return res.status(400).json({ error: `Invalid mode.` });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  try {
    const langSuffix = language !== "en" ? `\n\nIMPORTANT: Respond entirely in ${LANGUAGES[language] || "English"}.` : "";
    const prompt = PROMPT_TEMPLATES[mode](userInput.trim()) + (LENGTH_SUFFIX[length] || "") + langSuffix;

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a helpful, knowledgeable assistant. Provide clear, accurate, and well-structured responses." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7, max_tokens: 1024, stream: true,
    });

    let fullText = "";
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || "";
      if (delta) { fullText += delta; send({ type: "delta", text: delta }); }
    }

    const followUps = await generateFollowUps(userInput.trim(), mode);
    send({ type: "followups", followUps });
    send({ type: "done", fullText });
  } catch (err) {
    console.error("Stream error:", err.message);
    send({ type: "error", message: "Streaming failed. Please try again." });
  } finally {
    res.end();
  }
});

module.exports = router;
