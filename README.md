# ✦ PromptCraft — AI Prompt Toolkit v3

> A full-stack AI-powered web app using **Groq LLaMA 3.3 70B** with real-time streaming, 8 prompt modes, flashcards, heatmap, word cloud, tone analyzer, prompt improver, and much more.

---

## 📌 Project Overview

PromptCraft is a production-ready, uniquely featured AI toolkit built with Node.js, Express, and vanilla HTML/CSS/JS. It goes far beyond a basic LLM wrapper — featuring auto mode detection, prompt quality scoring, live prompt preview, drag & drop file input, confidence scoring, tone analysis, flashcard mode, activity heatmap, word cloud, personal insights, response chaining, and multi-language support.

---

## ✨ Complete Feature List

### 🤖 AI Features
| Feature | Description |
|---------|-------------|
| ⚡ Real SSE Streaming | Responses stream word-by-word in real time |
| 🤖 Auto Mode Detector | AI picks the best mode for your input automatically |
| ✨ Prompt Improver | AI rewrites your input for better results, shown side-by-side |
| 📊 Confidence Score | AI rates its own response (shown as a progress bar) |
| 🎨 Tone Analyzer | Before/after tone breakdown for Professional Rewrite mode |
| 💡 Follow-up Questions | 3 clickable follow-up suggestions after every response |
| 🗄 Response Caching | Same query returns instantly (10 min TTL) with ⚡ badge |
| 🌐 Multi-Language Output | Respond in 10 languages via dropdown |
| ⛓ Prompt Chaining | Chain response into another mode automatically |

### 🎨 UI / UX
| Feature | Description |
|---------|-------------|
| 🃏 Flashcard Mode | Quiz responses auto-convert to flip flashcards with scoring |
| 📅 Activity Heatmap | GitHub-style calendar showing daily usage |
| 🔤 Word Cloud | Visual of your most studied topics from history |
| 🧠 Personal Insights | Auto-generated summary of your usage patterns |
| 📏 Prompt Quality Score | Live 0–100% bar showing input strength before submitting |
| 👁 Live Prompt Preview | See the exact prompt being sent to Groq as you type |
| 🎵 Typewriter Sound | Subtle audio tick as response streams in (via Web Audio API) |
| 📂 Drag & Drop File | Drop a .txt file onto the textarea to load it |
| 🌙 Dark / Light Mode | Full theme toggle, persisted in localStorage |
| 💀 Skeleton Loading | Shimmer skeleton animation during load |
| 🃏 Animated Mode Cards | Visual card grid replaces plain dropdown for mode selection |

### 📦 Export & History
| Feature | Description |
|---------|-------------|
| 📄 Export Markdown | Download response as a .md file |
| 📑 Export PDF | Open print dialog for clean PDF export |
| 📋 Copy to Clipboard | One-click copy |
| 👍👎 Response Rating | Rate helpfulness, stored in history |
| 🔍 History Search | Filter 20 past entries by keyword |
| 🔁 Restore History | Click any past entry to restore it |
| ⛓ Prompt Chain | Feed response into next mode with one click |

### ⚙️ Technical
| Feature | Description |
|---------|-------------|
| 🛡 Rate Limiting | 25 req/min per IP via express-rate-limit |
| ✅ Startup Validation | Server exits early with clear error if API key missing |
| ⌨ Keyboard Shortcuts | 8 shortcuts with dedicated modal |
| 📊 Usage Stats Modal | Total responses, ratings, avg time, mode breakdown chart |
| 📏 Response Length Control | Short / Medium / Detailed toggles |

---

## 🧠 Prompt Modes

| Mode | Description |
|------|-------------|
| 🧒 ELI5 | Explains any concept like you're 5 years old |
| 💼 Professional Rewrite | Rewrites text in a polished business tone + tone analysis |
| 📋 Summarize Text | Extracts the most important points |
| 🧠 Quiz Generator | 5 Q&A pairs → auto-converts to interactive flashcards |
| 🎯 Interview Questions | 7 questions with ideal answer guidelines |
| 📅 Study Plan Generator | Weekly plan with resources & milestones |
| 👩‍🏫 Teacher Mode | Step-by-step with examples & key takeaways |
| 🧭 Mentor Mode | Honest, actionable advice with real-world perspective |

---

## 📁 Project Structure

```
prompt-craft/
├── public/
│   ├── index.html           # Full UI — all modals, panels, sections
│   ├── css/
│   │   └── style.css        # Complete styles for all features
│   └── js/
│       └── app.js           # All frontend logic (~600 lines)
├── src/
│   ├── server.js            # Express + rate limiting + startup validation
│   └── routes/
│       └── groq.js          # /api/stream, /api/generate, /api/detect-mode,
│                            #   /api/improve-prompt, /api/analyze-tone,
│                            #   /api/confidence
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🔑 How to Get a Groq API Key

1. Go to **[https://console.groq.com/keys](https://console.groq.com/keys)**
2. Sign up / sign in — completely free, no credit card needed
3. Click **"Create API Key"**
4. Copy the key (starts with `gsk_...`)
5. Paste it in your `.env` file

> 💡 Groq's free tier runs LLaMA 3.3 70B at thousands of tokens/second.

---

## 🚀 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- Free Groq API key

### Step 1 — Clone
```bash
git clone https://github.com/YOUR_USERNAME/prompt-craft.git
cd prompt-craft
```

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Configure environment
```bash
cp .env.example .env
```
Edit `.env`:
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=3000
```

### Step 4 — Run
```bash
npm run dev     # development (auto-restart)
npm start       # production
```

### Step 5 — Open
```
http://localhost:3000
```

Expected output:
```
✅  PromptCraft running at http://localhost:3000
   Model : llama-3.3-70b-versatile (Groq)
   Limit : 25 req/min per IP
   Press Ctrl+C to stop.
```

---

## ⌨ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Enter` | Submit / Generate |
| `Ctrl + K` | Clear input |
| `Ctrl + D` | Toggle dark mode |
| `Ctrl + Shift + C` | Copy response |
| `Ctrl + I` | Improve prompt |
| `Ctrl + M` | Auto-detect mode |
| `?` | Open shortcuts panel |
| `Esc` | Close any modal |

---

## 🖥️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stream` | SSE streaming response |
| POST | `/api/generate` | Cached non-streaming response |
| POST | `/api/detect-mode` | Auto-detect best mode for input |
| POST | `/api/improve-prompt` | AI-improve the user's input |
| POST | `/api/analyze-tone` | Before/after tone breakdown |
| POST | `/api/confidence` | Self-rate the AI response |
| GET | `/api/health` | Server health check |


## 🔧 Future Improvements

- [ ] Real-time token streaming progress indicator
- [ ] Model picker (Mixtral, Gemma 2, DeepSeek via Groq)
- [ ] Shareable links via URL query params
- [ ] User auth + cloud history with database
- [ ] Voice input via Web Speech API
- [ ] Leitner spaced repetition system for flashcards
- [ ] Custom prompt template builder with `{input}` placeholder
- [ ] Deploy to Railway / Render with one-click


## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES2022) |
| Backend | Node.js, Express.js |
| AI / LLM | Groq API · LLaMA 3.3 70B Versatile |
| Streaming | Server-Sent Events (SSE) |
| Rate Limiting | express-rate-limit |
| Audio | Web Audio API (typewriter sound) |
| Storage | localStorage (history, theme, ratings) |
| Fonts | Inter, JetBrains Mono |
