// =============================================
//   PromptCraft — app.js v3
//   All features: streaming, auto-detect,
//   prompt improver, confidence, tone analyzer,
//   flashcards, heatmap, word cloud, insights,
//   drag-drop, prompt preview, chain mode,
//   prompt quality score, typewriter sound,
//   multi-language, export MD/PDF, stats, etc.
// =============================================

// ── DOM ────────────────────────────────────────
const $ = id => document.getElementById(id);
const modeCards        = document.querySelectorAll(".mode-card");
const modeDescription  = $("modeDescription");
const langSelect       = $("langSelect");
const userInput        = $("userInput");
const charCounter      = $("charCounter");
const wordCount        = $("wordCount");
const promptScoreFill  = $("promptScoreFill");
const promptScoreValue = $("promptScoreValue");
const promptPreviewText= $("promptPreviewText");
const dropZone         = $("dropZone");
const dropOverlay      = $("dropOverlay");
const errorMsg         = $("errorMsg");
const autoDetectBtn    = $("autoDetectBtn");
const improvePromptBtn = $("improvePromptBtn");
const chainSelect      = $("chainSelect");
const submitBtn        = $("submitBtn");
const btnSpinner       = $("btnSpinner");
const clearBtn         = $("clearBtn");
const loadingState     = $("loadingState");
const responseBox      = $("responseBox");
const responsePlaceholder = $("responsePlaceholder");
const responseContent  = $("responseContent");
const responseMeta     = $("responseMeta");
const metaMode         = $("metaMode");
const metaStats        = $("metaStats");
const metaTime         = $("metaTime");
const cacheBadge       = $("cacheBadge");
const aiMetaRow        = $("aiMetaRow");
const confBarFill      = $("confBarFill");
const confValue        = $("confValue");
const toneBadge        = $("toneBadge");
const toneBefore       = $("toneBefore");
const toneAfter        = $("toneAfter");
const copyBtn          = $("copyBtn");
const exportMdBtn      = $("exportMdBtn");
const exportPdfBtn     = $("exportPdfBtn");
const ratingRow        = $("ratingRow");
const rateUp           = $("rateUp");
const rateDown         = $("rateDown");
const ratingFeedback   = $("ratingFeedback");
const followupsSection = $("followupsSection");
const followupsList    = $("followupsList");
const themeToggle      = $("themeToggle");
const heatmapBtn       = $("heatmapBtn");
const heatmapSection   = $("heatmapSection");
const heatmapGrid      = $("heatmapGrid");
const closeHeatmap     = $("closeHeatmap");
const wordcloudWrap    = $("wordcloudWrap");
const insightsText     = $("insightsText");
const historyList      = $("historyList");
const historySearch    = $("historySearch");
const clearHistoryBtn  = $("clearHistoryBtn");
const statsBtn         = $("statsBtn");
const statsModal       = $("statsModal");
const closeStats       = $("closeStats");
const statsBody        = $("statsBody");
const shortcutsBtn     = $("shortcutsBtn");
const shortcutsModal   = $("shortcutsModal");
const closeShortcuts   = $("closeShortcuts");
const improveModal     = $("improveModal");
const closeImprove     = $("closeImprove");
const improveOriginal  = $("improveOriginal");
const improveNew       = $("improveNew");
const useImprovedBtn   = $("useImprovedBtn");
const toneModal        = $("toneModal");
const closeTone        = $("closeTone");
const toneBody         = $("toneBody");
const toast            = $("toast");
// Flashcard elements
const flashcardSection = $("flashcardSection");
const flashcardInner   = $("flashcardInner");
const flashcardFront   = $("flashcardFront");
const flashcardBack    = $("flashcardBack");
const flashcardProgress= $("flashcardProgress");
const prevCard         = $("prevCard");
const nextCard         = $("nextCard");
const resetCards       = $("resetCards");
const fcFlip           = $("fcFlip");
const fcRight          = $("fcRight");
const fcWrong          = $("fcWrong");
const fcRightCount     = $("fcRight_count");
const fcWrongCount     = $("fcWrong_count");

// ── Mode Metadata ──────────────────────────────
const MODE_INFO = {
  eli5:         { label:"ELI5",         desc:"Simplifies any concept into child-friendly language with fun examples." },
  professional: { label:"Professional", desc:"Rewrites your text with a polished, business-ready tone." },
  summarize:    { label:"Summarize",    desc:"Extracts only the most important points from your text." },
  quiz:         { label:"Quiz",         desc:"Generates 5 quiz Q&A pairs — then converts them into flashcards!" },
  interview:    { label:"Interview",    desc:"Creates 7 interview questions with ideal answer guidelines." },
  studyplan:    { label:"Study Plan",   desc:"Builds a structured weekly study plan with resources & milestones." },
  teacher:      { label:"Teacher",      desc:"Step-by-step explanation with examples and key takeaways." },
  mentor:       { label:"Mentor",       desc:"Honest, actionable advice with real-world perspective." },
};

const PROMPT_PREVIEWS = {
  eli5:         (i) => `Explain the following concept as if you are teaching a 5-year-old child. Use simple words, relatable examples, and short sentences:\n\n${i || "[your text]"}`,
  professional: (i) => `Rewrite the following text in a professional, polished, and business-friendly tone while preserving the original meaning:\n\n${i || "[your text]"}`,
  summarize:    (i) => `Provide a concise summary of the following text. Highlight only the most important points:\n\n${i || "[your text]"}`,
  quiz:         (i) => `Generate exactly 5 quiz questions with clear answers based on the following topic:\n\n${i || "[your text]"}`,
  interview:    (i) => `Generate 7 insightful interview questions with ideal answer guidelines for:\n\n${i || "[your text]"}`,
  studyplan:    (i) => `Create a detailed structured study plan for:\n\n${i || "[your text]"}`,
  teacher:      (i) => `Act as an experienced teacher. Explain the following topic step-by-step with examples and key takeaways:\n\n${i || "[your text]"}`,
  mentor:       (i) => `Act as a senior mentor giving honest, actionable advice about:\n\n${i || "[your text]"}`,
};

// ── State ──────────────────────────────────────
let chatHistory     = JSON.parse(localStorage.getItem("pc_history") || "[]");
let currentResponse = "";
let currentMode     = "eli5";
let currentInput    = "";
let activeLength    = "short";
let ratingGiven     = false;
let isStreaming     = false;
let soundEnabled    = localStorage.getItem("pc_sound") === "true";
// Flashcard state
let flashcards      = [];
let fcIndex         = 0;
let fcRightCnt      = 0;
let fcWrongCnt      = 0;
// Improved prompt state
let improvedPromptText = "";

// ══════════════════════════════════════════════
//   THEME
// ══════════════════════════════════════════════
const savedTheme = localStorage.getItem("pc_theme") || "light";
applyTheme(savedTheme);
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem("pc_theme", t);
  themeToggle.querySelector(".theme-icon").textContent = t === "dark" ? "☀️" : "🌙";
}
themeToggle.addEventListener("click", () => {
  applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

// ══════════════════════════════════════════════
//   MODE CARDS
// ══════════════════════════════════════════════
modeCards.forEach(card => {
  card.addEventListener("click", () => {
    modeCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    currentMode = card.dataset.mode;
    modeDescription.textContent = MODE_INFO[currentMode]?.desc || "";
    updatePromptPreview();
  });
});
modeDescription.textContent = MODE_INFO[currentMode]?.desc || "";

// ══════════════════════════════════════════════
//   LENGTH TOGGLE
// ══════════════════════════════════════════════
document.querySelectorAll(".length-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".length-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeLength = btn.dataset.length;
  });
});

// ══════════════════════════════════════════════
//   PROMPT QUALITY SCORE (frontend only)
// ══════════════════════════════════════════════
function calcPromptScore(text) {
  if (!text || text.trim().length < 3) return 0;
  let score = 0;
  const t = text.trim();
  // Length score (0-30)
  score += Math.min(30, Math.floor(t.length / 5));
  // Has question mark (10)
  if (t.includes("?")) score += 10;
  // Has specific keywords (20)
  const keywords = ["explain","describe","what","how","why","create","generate","write","list","summarize","analyze","compare"];
  if (keywords.some(k => t.toLowerCase().includes(k))) score += 20;
  // Multiple sentences (15)
  if (t.split(/[.!?]/).length > 2) score += 15;
  // Good length range (25)
  if (t.length > 20 && t.length < 500) score += 25;
  return Math.min(100, score);
}

function updatePromptScore() {
  const score = calcPromptScore(userInput.value);
  promptScoreFill.style.width = score + "%";
  promptScoreValue.textContent = score > 0 ? score + "%" : "—";
  promptScoreValue.style.color = score >= 70 ? "var(--success)" : score >= 40 ? "var(--warning)" : "var(--error)";
}

// ══════════════════════════════════════════════
//   PROMPT PREVIEW
// ══════════════════════════════════════════════
function updatePromptPreview() {
  const preview = PROMPT_PREVIEWS[currentMode];
  if (preview) promptPreviewText.textContent = preview(userInput.value.trim().slice(0, 200));
}

// ══════════════════════════════════════════════
//   INPUT EVENTS
// ══════════════════════════════════════════════
userInput.addEventListener("input", () => {
  const v = userInput.value;
  charCounter.textContent = `${v.length} / 2000`;
  charCounter.style.color = v.length > 1800 ? "var(--warning)" : v.length > 1950 ? "var(--error)" : "";
  const words = v.trim() === "" ? 0 : v.trim().split(/\s+/).length;
  wordCount.textContent = `${words} word${words !== 1 ? "s" : ""}`;
  if (v.length > 0) clearError();
  updatePromptScore();
  updatePromptPreview();
  if (soundEnabled && v.length % 5 === 0) playTick();
});

function showError(msg) {
  errorMsg.textContent = `⚠ ${msg}`;
  errorMsg.classList.remove("hidden");
  userInput.classList.add("input-error");
  userInput.focus();
}
function clearError() {
  errorMsg.classList.add("hidden");
  userInput.classList.remove("input-error");
}
function validateInput() {
  const v = userInput.value.trim();
  if (!v) { showError("Please enter some text before submitting."); return false; }
  if (v.length < 3) { showError("Input is too short. Please provide more context."); return false; }
  clearError(); return true;
}

// ══════════════════════════════════════════════
//   DRAG & DROP FILE INPUT
// ══════════════════════════════════════════════
["dragenter","dragover"].forEach(evt => {
  dropZone.addEventListener(evt, e => {
    e.preventDefault();
    userInput.classList.add("drag-over");
    dropOverlay.classList.add("visible");
  });
});
["dragleave","drop"].forEach(evt => {
  dropZone.addEventListener(evt, e => {
    e.preventDefault();
    userInput.classList.remove("drag-over");
    dropOverlay.classList.remove("visible");
  });
});
dropZone.addEventListener("drop", e => {
  const file = e.dataTransfer.files[0];
  if (!file) return;
  if (file.type === "text/plain" || file.name.endsWith(".txt")) {
    const reader = new FileReader();
    reader.onload = ev => {
      userInput.value = ev.target.result.slice(0, 2000);
      userInput.dispatchEvent(new Event("input"));
      showToast("📂 File loaded successfully!");
    };
    reader.readAsText(file);
  } else {
    showToast("⚠ Only .txt files are supported for drag & drop.");
  }
});

// ══════════════════════════════════════════════
//   AUTO DETECT MODE
// ══════════════════════════════════════════════
autoDetectBtn.addEventListener("click", async () => {
  if (!userInput.value.trim()) { showError("Enter some text first to auto-detect the mode."); return; }
  autoDetectBtn.textContent = "🤖 Detecting…";
  autoDetectBtn.disabled = true;
  try {
    const res = await fetch("/api/detect-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput: userInput.value.trim() }),
    });
    const data = await res.json();
    if (data.mode && MODE_INFO[data.mode]) {
      setActiveMode(data.mode);
      showToast(`🤖 Auto-detected: ${MODE_INFO[data.mode].label} — ${data.reason}`);
    }
  } catch { showToast("Could not auto-detect. Please select a mode manually."); }
  finally { autoDetectBtn.textContent = "🤖 Auto-detect mode"; autoDetectBtn.disabled = false; }
});

function setActiveMode(mode) {
  modeCards.forEach(c => {
    c.classList.toggle("active", c.dataset.mode === mode);
  });
  currentMode = mode;
  modeDescription.textContent = MODE_INFO[mode]?.desc || "";
  updatePromptPreview();
}

// ══════════════════════════════════════════════
//   IMPROVE PROMPT
// ══════════════════════════════════════════════
improvePromptBtn.addEventListener("click", async () => {
  if (!userInput.value.trim()) { showError("Enter some text first to improve."); return; }
  improvePromptBtn.textContent = "✨ Improving…";
  improvePromptBtn.disabled = true;
  try {
    const res = await fetch("/api/improve-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput: userInput.value.trim(), mode: currentMode }),
    });
    const data = await res.json();
    improvedPromptText = data.improved;
    improveOriginal.textContent = data.original;
    improveNew.textContent = data.improved;
    improveModal.classList.remove("hidden");
  } catch { showToast("Could not improve prompt. Try again."); }
  finally { improvePromptBtn.textContent = "✨ Improve prompt"; improvePromptBtn.disabled = false; }
});

useImprovedBtn.addEventListener("click", () => {
  userInput.value = improvedPromptText;
  userInput.dispatchEvent(new Event("input"));
  improveModal.classList.add("hidden");
  showToast("✨ Improved prompt loaded!");
});
closeImprove.addEventListener("click", () => improveModal.classList.add("hidden"));
improveModal.addEventListener("click", e => { if (e.target === improveModal) improveModal.classList.add("hidden"); });

// ══════════════════════════════════════════════
//   SUBMIT — SSE STREAMING
// ══════════════════════════════════════════════
submitBtn.addEventListener("click", handleSubmit);
userInput.addEventListener("keydown", e => { if ((e.ctrlKey||e.metaKey) && e.key==="Enter") handleSubmit(); });

async function handleSubmit() {
  if (isStreaming || !validateInput()) return;

  const input    = userInput.value.trim();
  const mode     = currentMode;
  const language = langSelect.value;
  const length   = activeLength;
  const startTime= Date.now();

  isStreaming     = true;
  currentMode     = mode;
  currentInput    = input;
  currentResponse = "";
  ratingGiven     = false;

  setLoading(true);

  // Show box immediately for streaming
  loadingState.classList.add("hidden");
  responseBox.classList.remove("hidden");
  responsePlaceholder.classList.add("hidden");
  responseContent.innerHTML = '<span class="cursor-blink"></span>';
  responseContent.classList.remove("hidden");

  const params = new URLSearchParams({ userInput: input, mode, language, length });

  try {
    const evtSource = new EventSource(`/api/stream?${params}`);

    evtSource.onmessage = async (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "delta") {
        currentResponse += data.text;
        responseContent.innerHTML = formatResponseHTML(currentResponse, mode) + '<span class="cursor-blink"></span>';
        responseBox.scrollTop = responseBox.scrollHeight;
        if (soundEnabled) playTick();
      }

      if (data.type === "followups") showFollowUps(data.followUps);

      if (data.type === "done") {
        evtSource.close();
        isStreaming = false;

        responseContent.innerHTML = formatResponseHTML(currentResponse, mode);
        responseBox.scrollTop = responseBox.scrollHeight;

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        const wCount  = currentResponse.trim().split(/\s+/).length;
        showResponseMeta(mode, wCount, elapsed, false);
        showResponseActions();
        setLoading(false);
        resetRating(); ratingRow.classList.remove("hidden");

        // Save to history
        addToHistory({ input, mode, language, response: currentResponse, timestamp: Date.now(), elapsed });

        // If quiz mode → parse flashcards
        if (mode === "quiz") {
          const cards = parseFlashcards(currentResponse);
          if (cards.length > 0) initFlashcards(cards);
        } else {
          flashcardSection.classList.add("hidden");
        }

        // Post-response AI features (non-blocking)
        fetchConfidence(currentResponse, mode);
        if (mode === "professional") fetchToneAnalysis(input, currentResponse);
        else { aiMetaRow.classList.remove("hidden"); toneBadge.classList.add("hidden"); }

        // Update word cloud & insights
        updateWordCloud();
        updateInsights();

        // Chain mode
        const chain = chainSelect.value;
        if (chain) {
          setTimeout(() => {
            userInput.value = currentResponse.slice(0, 1000);
            userInput.dispatchEvent(new Event("input"));
            setActiveMode(chain);
            chainSelect.value = "";
            showToast(`⛓ Chained to ${MODE_INFO[chain]?.label}! Hit Generate.`);
          }, 800);
        }
      }

      if (data.type === "error") {
        evtSource.close(); isStreaming = false; setLoading(false);
        showError(data.message);
        responsePlaceholder.classList.remove("hidden");
        responseContent.classList.add("hidden");
      }
    };

    evtSource.onerror = () => {
      evtSource.close(); isStreaming = false; setLoading(false);
      showError("Connection error. Is the server running?");
      responsePlaceholder.classList.remove("hidden");
      responseContent.classList.add("hidden");
    };
  } catch (err) {
    isStreaming = false; setLoading(false);
    showError(err.message || "Something went wrong.");
  }
}

// ══════════════════════════════════════════════
//   CONFIDENCE SCORE
// ══════════════════════════════════════════════
async function fetchConfidence(response, mode) {
  try {
    const res = await fetch("/api/confidence", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ response: response.slice(0, 800), mode }),
    });
    const data = await res.json();
    const score = Math.min(99, Math.max(50, data.score || 82));
    confBarFill.style.width = score + "%";
    confValue.textContent   = score + "%";
    confValue.style.color   = score >= 80 ? "var(--success)" : score >= 60 ? "var(--warning)" : "var(--error)";
    aiMetaRow.classList.remove("hidden");
  } catch { /* silent */ }
}

// ══════════════════════════════════════════════
//   TONE ANALYZER
// ══════════════════════════════════════════════
async function fetchToneAnalysis(before, after) {
  try {
    const res = await fetch("/api/analyze-tone", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ before, after }),
    });
    const data = await res.json();
    toneBefore.textContent = data.before?.tone || "Informal";
    toneAfter.textContent  = data.after?.tone  || "Professional";
    toneBadge.classList.remove("hidden");
    toneBadge.onclick = () => showToneModal(data);
  } catch { /* silent */ }
}

function showToneModal(data) {
  const makeKeywords = (kws) => (kws || []).map(k => `<span class="tone-keyword">${k}</span>`).join("");
  toneBody.innerHTML = `
    <div class="tone-grid">
      <div class="tone-card">
        <p class="tone-card-label">Before</p>
        <p class="tone-card-tone">${data.before?.tone || "—"}</p>
        <p class="tone-formality">Formality: ${data.before?.score || "—"}/10</p>
        <div class="tone-keywords">${makeKeywords(data.before?.keywords)}</div>
      </div>
      <div class="tone-card" style="border-color:var(--success)">
        <p class="tone-card-label">After (Rewritten)</p>
        <p class="tone-card-tone" style="color:var(--success)">${data.after?.tone || "—"}</p>
        <p class="tone-formality">Formality: ${data.after?.score || "—"}/10</p>
        <div class="tone-keywords">${makeKeywords(data.after?.keywords)}</div>
      </div>
    </div>`;
  toneModal.classList.remove("hidden");
}
closeTone.addEventListener("click", () => toneModal.classList.add("hidden"));
toneModal.addEventListener("click", e => { if (e.target === toneModal) toneModal.classList.add("hidden"); });

// ══════════════════════════════════════════════
//   UI HELPERS
// ══════════════════════════════════════════════
function setLoading(on) {
  if (on) {
    loadingState.classList.remove("hidden");
    responseBox.classList.add("hidden");
    [responseMeta, ratingRow, followupsSection, aiMetaRow].forEach(el => el.classList.add("hidden"));
    [copyBtn, exportMdBtn, exportPdfBtn, cacheBadge].forEach(el => el.classList.add("hidden"));
    submitBtn.disabled = true;
    btnSpinner.classList.remove("hidden");
    submitBtn.querySelector(".btn-text").textContent = "Generating…";
    submitBtn.querySelector(".btn-icon").textContent = "";
  } else {
    loadingState.classList.add("hidden");
    responseBox.classList.remove("hidden");
    submitBtn.disabled = false;
    btnSpinner.classList.add("hidden");
    submitBtn.querySelector(".btn-text").textContent = "Generate Response";
    submitBtn.querySelector(".btn-icon").textContent = "→";
  }
}
function showResponseMeta(mode, wordCnt, elapsed, fromCache) {
  metaMode.textContent = MODE_INFO[mode]?.label || mode;
  metaStats.textContent = `${wordCnt} words · ${elapsed}s`;
  metaTime.textContent = new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  responseMeta.classList.remove("hidden");
  fromCache ? cacheBadge.classList.remove("hidden") : cacheBadge.classList.add("hidden");
}
function showResponseActions() {
  [copyBtn, exportMdBtn, exportPdfBtn].forEach(el => el.classList.remove("hidden"));
}
function resetRating() {
  ratingGiven = false;
  [rateUp, rateDown].forEach(b => b.classList.remove("selected"));
  ratingFeedback.classList.add("hidden");
}
function showFollowUps(questions) {
  if (!questions?.length) return;
  followupsList.innerHTML = "";
  questions.forEach(q => {
    const btn = document.createElement("button");
    btn.className = "followup-chip";
    btn.textContent = "→ " + q;
    btn.addEventListener("click", () => {
      userInput.value = q;
      userInput.dispatchEvent(new Event("input"));
      clearError();
      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast("Follow-up loaded — hit Generate!");
    });
    followupsList.appendChild(btn);
  });
  followupsSection.classList.remove("hidden");
}

// ── HTML Formatters ────────────────────────────
function escapeHtml(t) {
  return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
function formatResponseHTML(text, mode) {
  if (mode === "quiz") return formatQuiz(text);
  if (mode === "interview") return formatInterview(text);
  return `<span>${escapeHtml(text)}</span>`;
}
function formatQuiz(text) {
  const lines = text.split("\n").filter(l => l.trim());
  let html = "", cQ = "", cA = "";
  lines.forEach(line => {
    if (/^Q\d+:/i.test(line.trim())) {
      if (cQ) html += `<div class="quiz-item"><strong>${escapeHtml(cQ)}</strong><span class="quiz-answer">✅ ${escapeHtml(cA)}</span></div>`;
      cQ = line.trim(); cA = "";
    } else if (/^A\d+:/i.test(line.trim())) { cA = line.trim(); }
    else if (cA) cA += " " + line.trim();
    else if (cQ) cQ += " " + line.trim();
  });
  if (cQ) html += `<div class="quiz-item"><strong>${escapeHtml(cQ)}</strong><span class="quiz-answer">✅ ${escapeHtml(cA)}</span></div>`;
  return html || `<span>${escapeHtml(text)}</span>`;
}
function formatInterview(text) {
  const lines = text.split("\n").filter(l => l.trim());
  let html = "", cQ = "", cT = "";
  lines.forEach(line => {
    if (/^Q:/i.test(line.trim())) {
      if (cQ) html += `<div class="interview-item"><strong>${escapeHtml(cQ)}</strong><span class="interview-tips">💡 ${escapeHtml(cT)}</span></div>`;
      cQ = line.trim(); cT = "";
    } else if (/^Tips?:/i.test(line.trim())) { cT = line.replace(/^Tips?:\s*/i,"").trim(); }
    else if (cT) cT += " " + line.trim();
    else if (cQ) cQ += " " + line.trim();
  });
  if (cQ) html += `<div class="interview-item"><strong>${escapeHtml(cQ)}</strong><span class="interview-tips">💡 ${escapeHtml(cT)}</span></div>`;
  return html || `<span>${escapeHtml(text)}</span>`;
}

// ══════════════════════════════════════════════
//   FLASHCARD MODE
// ══════════════════════════════════════════════
function parseFlashcards(text) {
  const lines = text.split("\n").filter(l => l.trim());
  const cards = [];
  let cQ = "", cA = "";
  lines.forEach(line => {
    if (/^Q\d+:/i.test(line.trim())) {
      if (cQ && cA) cards.push({ q: cQ.replace(/^Q\d+:\s*/i,""), a: cA.replace(/^A\d+:\s*/i,"") });
      cQ = line.trim(); cA = "";
    } else if (/^A\d+:/i.test(line.trim())) { cA = line.trim(); }
    else if (cA) cA += " " + line.trim();
    else if (cQ) cQ += " " + line.trim();
  });
  if (cQ && cA) cards.push({ q: cQ.replace(/^Q\d+:\s*/i,""), a: cA.replace(/^A\d+:\s*/i,"") });
  return cards;
}
function initFlashcards(cards) {
  flashcards = cards;
  fcIndex = 0; fcRightCnt = 0; fcWrongCnt = 0;
  flashcardSection.classList.remove("hidden");
  renderFlashcard();
  flashcardSection.scrollIntoView({ behavior: "smooth", block: "start" });
}
function renderFlashcard() {
  if (!flashcards.length) return;
  const card = flashcards[fcIndex];
  flashcardFront.textContent = card.q;
  flashcardBack.textContent  = card.a;
  flashcardInner.classList.remove("flipped");
  flashcardProgress.textContent = `${fcIndex + 1} / ${flashcards.length}`;
  fcRightCount.textContent = fcRightCnt;
  fcWrongCount.textContent = fcWrongCnt;
}
fcFlip.addEventListener("click",  () => flashcardInner.classList.toggle("flipped"));
document.getElementById("flashcard").addEventListener("click", () => flashcardInner.classList.toggle("flipped"));
prevCard.addEventListener("click", () => { fcIndex = (fcIndex - 1 + flashcards.length) % flashcards.length; renderFlashcard(); });
nextCard.addEventListener("click", () => { fcIndex = (fcIndex + 1) % flashcards.length; renderFlashcard(); });
resetCards.addEventListener("click", () => { fcIndex = 0; fcRightCnt = 0; fcWrongCnt = 0; renderFlashcard(); });
fcRight.addEventListener("click", () => { fcRightCnt++; fcIndex = (fcIndex + 1) % flashcards.length; renderFlashcard(); showToast("✓ Marked as got it!"); });
fcWrong.addEventListener("click", () => { fcWrongCnt++; fcIndex = (fcIndex + 1) % flashcards.length; renderFlashcard(); });

// ══════════════════════════════════════════════
//   HEATMAP CALENDAR
// ══════════════════════════════════════════════
heatmapBtn.addEventListener("click", () => {
  renderHeatmap();
  heatmapSection.classList.toggle("hidden");
  if (!heatmapSection.classList.contains("hidden")) heatmapSection.scrollIntoView({ behavior:"smooth" });
});
closeHeatmap.addEventListener("click", () => heatmapSection.classList.add("hidden"));

function renderHeatmap() {
  const today = new Date();
  const days  = 91; // 13 weeks
  const counts = {};
  chatHistory.forEach(e => {
    const d = new Date(e.timestamp).toDateString();
    counts[d] = (counts[d] || 0) + 1;
  });

  heatmapGrid.innerHTML = "";
  // Month labels row
  const labelRow = document.createElement("div");
  labelRow.style.cssText = "display:flex;gap:3px;margin-bottom:4px;font-size:10px;color:var(--text-muted)";

  for (let i = days - 1; i >= 0; i--) {
    const d     = new Date(today);
    d.setDate(d.getDate() - i);
    const key   = d.toDateString();
    const count = counts[key] || 0;
    const intensity = count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count <= 4 ? 3 : 4;
    const cell  = document.createElement("div");
    cell.className = "hm-cell";
    cell.setAttribute("data-intensity", intensity);
    cell.title = `${d.toLocaleDateString()} — ${count} response${count !== 1 ? "s" : ""}`;
    heatmapGrid.appendChild(cell);
  }
}

// ══════════════════════════════════════════════
//   WORD CLOUD (from history inputs)
// ══════════════════════════════════════════════
function updateWordCloud() {
  const stopwords = new Set(["the","a","an","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might","shall","can","need","dare","ought","used","i","you","he","she","it","we","they","them","their","this","that","these","those","what","which","who","whom","whose","when","where","why","how","and","or","but","if","then","else","for","of","to","in","on","at","by","with","from","about","as","into","through","during","before","after","above","below","up","down","out","off","over","under","again","further","once","my","your","his","her","its","our","their"]);
  const freq = {};
  chatHistory.forEach(e => {
    e.input.toLowerCase().replace(/[^a-z\s]/g,"").split(/\s+/).forEach(w => {
      if (w.length > 3 && !stopwords.has(w)) freq[w] = (freq[w] || 0) + 1;
    });
  });
  const sorted = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,20);
  if (!sorted.length) {
    wordcloudWrap.innerHTML = '<span class="wc-empty">Generate some responses to see your most studied topics here.</span>';
    return;
  }
  const max = sorted[0][1];
  wordcloudWrap.innerHTML = sorted.map(([word, count]) => {
    const size = 11 + Math.round((count / max) * 14);
    return `<span class="wc-word" style="font-size:${size}px;opacity:${0.5 + (count/max)*0.5}">${word}</span>`;
  }).join("");
}

// ══════════════════════════════════════════════
//   PERSONAL INSIGHTS CARD
// ══════════════════════════════════════════════
function updateInsights() {
  if (chatHistory.length === 0) {
    insightsText.textContent = "Generate some responses to see your personal insights here.";
    return;
  }
  const total    = chatHistory.length;
  const modeCounts = {};
  chatHistory.forEach(e => modeCounts[e.mode] = (modeCounts[e.mode] || 0) + 1);
  const topMode  = Object.entries(modeCounts).sort((a,b)=>b[1]-a[1])[0];
  const avgTime  = chatHistory.filter(e=>e.elapsed).reduce((a,e)=>a+parseFloat(e.elapsed),0) / (chatHistory.filter(e=>e.elapsed).length || 1);
  const helpful  = chatHistory.filter(e=>e.rating==="up").length;

  // Most studied topic (most common word in inputs)
  const freq = {};
  const stop = new Set(["the","a","an","is","are","in","of","to","and","for","with","what","how","why","explain","describe","create","generate","write"]);
  chatHistory.forEach(e => e.input.toLowerCase().replace(/[^a-z\s]/g,"").split(/\s+/).filter(w=>w.length>3&&!stop.has(w)).forEach(w=>freq[w]=(freq[w]||0)+1));
  const topWord = Object.entries(freq).sort((a,b)=>b[1]-a[1])[0];

  insightsText.innerHTML = `You've generated <strong>${total} response${total!==1?"s":""}</strong>. 
    Your most used mode is <strong>${MODE_INFO[topMode[0]]?.label || topMode[0]}</strong> (${topMode[1]}×).
    ${topWord ? `You frequently study topics around <strong>"${topWord[0]}"</strong>.` : ""}
    Average response time: <strong>${avgTime.toFixed(1)}s</strong>.
    ${helpful > 0 ? `You found <strong>${helpful} response${helpful!==1?"s":""}</strong> helpful. 👍` : ""}`;
}

// ══════════════════════════════════════════════
//   CLEAR
// ══════════════════════════════════════════════
clearBtn.addEventListener("click", () => {
  userInput.value = ""; charCounter.textContent = "0 / 2000"; charCounter.style.color = "";
  wordCount.textContent = "0 words"; clearError();
  responsePlaceholder.classList.remove("hidden");
  responseContent.classList.add("hidden");
  [responseMeta, ratingRow, followupsSection, aiMetaRow].forEach(el=>el.classList.add("hidden"));
  [copyBtn, exportMdBtn, exportPdfBtn, cacheBadge].forEach(el=>el.classList.add("hidden"));
  currentResponse = ""; updatePromptScore(); updatePromptPreview(); userInput.focus();
});

// ══════════════════════════════════════════════
//   COPY
// ══════════════════════════════════════════════
copyBtn.addEventListener("click", async () => {
  if (!currentResponse) return;
  try { await navigator.clipboard.writeText(currentResponse); showToast("✓ Copied!"); }
  catch { const ta=document.createElement("textarea"); ta.value=currentResponse; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); showToast("✓ Copied!"); }
});

// ══════════════════════════════════════════════
//   EXPORT MARKDOWN
// ══════════════════════════════════════════════
exportMdBtn.addEventListener("click", () => {
  if (!currentResponse) return;
  const md = `# PromptCraft Export\n\n**Mode:** ${MODE_INFO[currentMode]?.label}\n**Language:** ${langSelect.options[langSelect.selectedIndex].text}\n**Date:** ${new Date().toLocaleString()}\n\n---\n\n## Input\n\n${currentInput}\n\n## Response\n\n${currentResponse}\n`;
  const url = URL.createObjectURL(new Blob([md],{type:"text/markdown"}));
  const a = Object.assign(document.createElement("a"),{href:url,download:`promptcraft-${currentMode}-${Date.now()}.md`});
  a.click(); URL.revokeObjectURL(url);
  showToast("📄 Markdown downloaded!");
});

// ══════════════════════════════════════════════
//   EXPORT PDF
// ══════════════════════════════════════════════
exportPdfBtn.addEventListener("click", () => {
  if (!currentResponse) return;
  const theme = document.documentElement.getAttribute("data-theme");
  const bg=theme==="dark"?"#1a1a2e":"#fff", fg=theme==="dark"?"#e8e8f5":"#1a1a2e", muted=theme==="dark"?"#9999cc":"#5a5a7a";
  const w = window.open("","_blank");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>PromptCraft</title>
    <style>body{font-family:Inter,system-ui,sans-serif;background:${bg};color:${fg};padding:40px;max-width:800px;margin:0 auto;line-height:1.7}
    h1{font-size:22px;margin-bottom:4px}.meta{color:${muted};font-size:13px;margin-bottom:24px}
    .lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${muted};margin-bottom:8px}
    .box{background:${theme==="dark"?"#13131f":"#f4f4f8"};padding:16px;border-radius:8px;font-size:14px;margin-bottom:24px;white-space:pre-wrap}
    @media print{body{padding:20px}}</style></head><body>
    <h1>✦ PromptCraft Export</h1>
    <p class="meta">Mode: <strong>${MODE_INFO[currentMode]?.label}</strong> · ${new Date().toLocaleString()}</p>
    <p class="lbl">Input</p><div class="box">${escapeHtml(currentInput)}</div>
    <p class="lbl">Response</p><div class="box">${escapeHtml(currentResponse)}</div>
    <script>window.onload=()=>window.print()<\/script></body></html>`);
  w.document.close();
  showToast("📑 Print dialog opened!");
});

// ══════════════════════════════════════════════
//   RATING
// ══════════════════════════════════════════════
[rateUp, rateDown].forEach(btn => {
  btn.addEventListener("click", () => {
    if (ratingGiven) return;
    ratingGiven = true;
    btn.classList.add("selected");
    const isUp = btn.id === "rateUp";
    ratingFeedback.textContent = isUp ? "Thanks! Glad it helped 🎉" : "Got it, we'll keep improving.";
    ratingFeedback.classList.remove("hidden");
    if (chatHistory[0]) { chatHistory[0].rating = isUp ? "up" : "down"; saveHistory(); renderHistory(); }
  });
});

// ══════════════════════════════════════════════
//   HISTORY
// ══════════════════════════════════════════════
renderHistory(); updateWordCloud(); updateInsights();

function addToHistory(entry) {
  chatHistory.unshift(entry);
  if (chatHistory.length > 20) chatHistory.pop();
  saveHistory(); renderHistory();
}
function saveHistory() { localStorage.setItem("pc_history", JSON.stringify(chatHistory)); }

historySearch.addEventListener("input", renderHistory);

function renderHistory() {
  const q = historySearch.value.trim().toLowerCase();
  const filtered = q ? chatHistory.filter(e=>e.input.toLowerCase().includes(q)||e.mode.includes(q)) : chatHistory;
  if (!filtered.length) {
    historyList.innerHTML = `<p class="history-empty">${q?"No results found.":"No history yet. Generate a response to get started!"}</p>`;
    return;
  }
  historyList.innerHTML = filtered.map(entry => {
    const info    = MODE_INFO[entry.mode] || {label:entry.mode};
    const time    = new Date(entry.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    const preview = entry.input.length>80?entry.input.slice(0,80)+"…":entry.input;
    const rIcon   = entry.rating==="up"?"👍":entry.rating==="down"?"👎":"";
    const rIdx    = chatHistory.indexOf(entry);
    return `<div class="history-item" data-index="${rIdx}" role="button" tabindex="0">
      <span class="history-mode">${info.label}</span>
      <span class="history-text">${escapeHtml(preview)}</span>
      <span class="history-rating">${rIcon}</span>
      <span class="history-time">${time}</span>
    </div>`;
  }).join("");
  historyList.querySelectorAll(".history-item").forEach(el => {
    const click = () => restoreEntry(chatHistory[Number(el.dataset.index)]);
    el.addEventListener("click", click);
    el.addEventListener("keydown", e => { if(e.key==="Enter") click(); });
  });
}

function restoreEntry(entry) {
  setActiveMode(entry.mode);
  userInput.value = entry.input;
  userInput.dispatchEvent(new Event("input"));
  currentResponse = entry.response; currentInput = entry.input; currentMode = entry.mode;
  responsePlaceholder.classList.add("hidden");
  responseContent.innerHTML = formatResponseHTML(entry.response, entry.mode);
  responseContent.classList.remove("hidden");
  showResponseMeta(entry.mode, entry.response.trim().split(/\s+/).length, entry.elapsed||"—", false);
  showResponseActions(); resetRating(); ratingRow.classList.remove("hidden");
  window.scrollTo({top:0,behavior:"smooth"});
  showToast("History entry restored.");
}

clearHistoryBtn.addEventListener("click", () => {
  if (!chatHistory.length) return;
  if (confirm("Clear all chat history?")) {
    chatHistory = []; saveHistory(); renderHistory();
    updateWordCloud(); updateInsights(); showToast("History cleared.");
  }
});

// ══════════════════════════════════════════════
//   STATS MODAL
// ══════════════════════════════════════════════
statsBtn.addEventListener("click", () => { renderStats(); statsModal.classList.remove("hidden"); });
closeStats.addEventListener("click", () => statsModal.classList.add("hidden"));
statsModal.addEventListener("click", e => { if(e.target===statsModal) statsModal.classList.add("hidden"); });

function renderStats() {
  if (!chatHistory.length) {
    statsBody.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:20px">No data yet!</p>'; return;
  }
  const total   = chatHistory.length;
  const helpful = chatHistory.filter(e=>e.rating==="up").length;
  const avgTime = chatHistory.filter(e=>e.elapsed).reduce((a,e)=>a+parseFloat(e.elapsed),0)/(chatHistory.filter(e=>e.elapsed).length||1);
  const modeCounts = {};
  chatHistory.forEach(e => modeCounts[e.mode]=(modeCounts[e.mode]||0)+1);
  const maxC = Math.max(...Object.values(modeCounts));
  const modeRows = Object.entries(modeCounts).sort((a,b)=>b[1]-a[1]).map(([mode,count])=>`
    <div class="mode-bar-row">
      <span class="mode-bar-label">${MODE_INFO[mode]?.label||mode}</span>
      <div class="mode-bar-track"><div class="mode-bar-fill" style="width:${Math.round((count/maxC)*100)}%"></div></div>
      <span class="mode-bar-count">${count}</span>
    </div>`).join("");
  statsBody.innerHTML=`
    <div class="stats-grid">
      <div class="stat-card"><span class="stat-value">${total}</span><span class="stat-label">Total Responses</span></div>
      <div class="stat-card"><span class="stat-value">${helpful}</span><span class="stat-label">👍 Helpful</span></div>
      <div class="stat-card"><span class="stat-value">${avgTime.toFixed(1)}s</span><span class="stat-label">Avg Response Time</span></div>
      <div class="stat-card"><span class="stat-value">${Object.keys(modeCounts).length}</span><span class="stat-label">Modes Used</span></div>
    </div>
    <div class="stats-modes"><h4>Mode Breakdown</h4>${modeRows}</div>`;
}

// ══════════════════════════════════════════════
//   SHORTCUTS MODAL
// ══════════════════════════════════════════════
shortcutsBtn.addEventListener("click", () => shortcutsModal.classList.remove("hidden"));
closeShortcuts.addEventListener("click", () => shortcutsModal.classList.add("hidden"));
shortcutsModal.addEventListener("click", e => { if(e.target===shortcutsModal) shortcutsModal.classList.add("hidden"); });

// ══════════════════════════════════════════════
//   KEYBOARD SHORTCUTS
// ══════════════════════════════════════════════
document.addEventListener("keydown", e => {
  if (e.key==="Escape") [shortcutsModal,statsModal,improveModal,toneModal].forEach(m=>m.classList.add("hidden"));
  if (e.key==="?" && !["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)) shortcutsModal.classList.remove("hidden");
  if (e.ctrlKey && e.key==="k") { e.preventDefault(); clearBtn.click(); }
  if (e.ctrlKey && e.key==="d") { e.preventDefault(); themeToggle.click(); }
  if (e.ctrlKey && e.shiftKey && e.key==="C") { e.preventDefault(); copyBtn.click(); }
  if (e.ctrlKey && e.key==="i") { e.preventDefault(); improvePromptBtn.click(); }
  if (e.ctrlKey && e.key==="m") { e.preventDefault(); autoDetectBtn.click(); }
});

// ══════════════════════════════════════════════
//   TYPEWRITER SOUND (subtle tick)
// ══════════════════════════════════════════════
function playTick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = 800 + Math.random() * 400;
    osc.type = "square";
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.04);
  } catch { /* silent fallback */ }
}

// ══════════════════════════════════════════════
//   TOAST
// ══════════════════════════════════════════════
let toastTimer;
function showToast(msg) {
  toast.textContent = msg; toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

// ── Init ───────────────────────────────────────
updatePromptScore(); updatePromptPreview(); userInput.focus();
