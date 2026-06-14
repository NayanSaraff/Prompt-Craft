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

---

## 📸 Screenshots

### Home (Light Mode)
Two-panel layout with animated mode cards, language + length controls, prompt quality bar, live prompt preview, drag & drop textarea, and auto-detect / improve prompt links.

### Streaming Response (Dark Mode)
Response text streams word-by-word with blinking cursor. Confidence bar appears above the response box after completion.

### Flashcard Mode (Quiz)
After a Quiz response, 5 flip cards appear below with Got it / Again scoring. Cards flip with smooth 3D animation on click.

### Prompt Improver Modal
Side-by-side comparison of original vs AI-improved prompt with a "Use Improved Prompt" button.

### Tone Analyzer Modal
Two cards showing before/after formality score (1-10), tone label, and keyword badges.

### Activity Heatmap
91-day GitHub-style calendar grid with intensity shading and date tooltips on hover.

### Word Cloud
Top 20 studied topics rendered as sized colored chips, sized by frequency.

### Stats Modal
4-metric grid + horizontal bar chart of mode usage.

---

## 🎬 Demo Video Script (2 minutes)

**[0:00–0:12] Intro**
> "This is PromptCraft v3 — a full-stack AI toolkit built with Node.js, Express, and Groq's LLaMA 3.3 70B. Let me show you what makes it unique."

**[0:12–0:30] Input Panel**
> "Instead of a plain dropdown, modes are animated cards. As I type, a Prompt Quality bar rates my input in real-time. I can preview the exact prompt being sent to Groq before I submit. I can also drag and drop a .txt file directly into the text area."

**[0:30–0:45] Auto-Detect + Improve**
> "I'll paste some text and hit Auto-detect — the AI picks the best mode automatically. Then I'll hit Improve Prompt — a modal shows my original vs the AI-improved version side by side. I'll use the improved version."

**[0:45–1:05] Streaming + Confidence + Tone**
> "Hitting Generate streams the response word-by-word in real time. When it finishes, a Confidence Score appears — the AI rated its own answer. Since I used Professional Rewrite, a Tone badge appears — clicking it shows before/after formality scores and keywords."

**[1:05–1:20] Flashcards**
> "I'll switch to Quiz mode. After the response, 5 quiz cards appear below — I can flip them with a click, mark Got it or Again, and track my score. This turns the app into a full study tool."

**[1:20–1:35] Heatmap + Word Cloud + Insights**
> "The Activity button shows a 91-day GitHub-style heatmap of my usage. Below the panels, my most studied topic words appear as a live word cloud. The insights card tells me my top mode, average response time, and topics I study most."

**[1:35–1:50] Export + Chaining**
> "I can copy, export as Markdown or PDF with one click. The Chain selector feeds this response directly into another mode — so I can Summarize → Quiz → Flashcards in a pipeline."

**[1:50–2:00] Closing**
> "Dark mode, 10 languages, full keyboard shortcuts, rate limiting, and response caching — all production ready. Thanks for watching!"

---

## 🔧 Future Improvements

- [ ] Real-time token streaming progress indicator
- [ ] Model picker (Mixtral, Gemma 2, DeepSeek via Groq)
- [ ] Shareable links via URL query params
- [ ] User auth + cloud history with database
- [ ] Voice input via Web Speech API
- [ ] Leitner spaced repetition system for flashcards
- [ ] Custom prompt template builder with `{input}` placeholder
- [ ] Deploy to Railway / Render with one-click

---

## 🐙 GitHub Setup

```bash
git init
git add .
git commit -m "feat: PromptCraft v3 — full feature suite"
git remote add origin https://github.com/YOUR_USERNAME/prompt-craft.git
git branch -M main
git push -u origin main
```

> ⚠️ Never push `.env` — it's in `.gitignore`.

---

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

---

## 📄 License

MIT © 2024
