// =============================================
//   PromptCraft — app.js v4
//   Premium redesign with sidebar views,
//   scroll-locked modals, and all features
// =============================================

const $ = id => document.getElementById(id);

// ── DOM ────────────────────────────────────────
const sidebar          = $("sidebar");
const sidebarToggle    = $("sidebarToggle");
const modeCards        = document.querySelectorAll(".mode-card");
const modeHint         = $("modeHint");
const langSelect       = $("langSelect");
const chainSelect      = $("chainSelect");
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
const submitBtn        = $("submitBtn");
const btnSpinner       = $("btnSpinner");
const submitText       = $("submitText");
const submitIcon       = $("submitIcon");
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
const historyList      = $("historyList");
const historySearch    = $("historySearch");
const clearHistoryBtn  = $("clearHistoryBtn");
const topStatTotal     = $("topStatTotal");
const topStatToday     = $("topStatToday");
const insightsText     = $("insightsText");
const wordcloudWrap    = $("wordcloudWrap");
const heatmapSection   = $("heatmapSection");
const heatmapGrid      = $("heatmapGrid");
const closeHeatmap     = $("closeHeatmap");
// Modals
const shortcutsModal   = $("shortcutsModal");
const closeShortcuts   = $("closeShortcuts");
const statsModal       = $("statsModal");
const closeStats       = $("closeStats");
const statsBody        = $("statsBody");
const improveModal     = $("improveModal");
const closeImprove     = $("closeImprove");
const improveOriginal  = $("improveOriginal");
const improveNew       = $("improveNew");
const useImprovedBtn   = $("useImprovedBtn");
const toneModal        = $("toneModal");
const closeTone        = $("closeTone");
const toneBody         = $("toneBody");
const toast            = $("toast");
// Flashcard
const flashcardSection = $("view-flashcards");
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
  eli5:         { label:"ELI5",         desc:"Simplifies any concept into child-friendly language." },
  professional: { label:"Professional", desc:"Rewrites text with polished, business-ready tone." },
  summarize:    { label:"Summarize",    desc:"Extracts the most important points from your text." },
  quiz:         { label:"Quiz",         desc:"5 Q&A pairs — auto-converts to interactive flashcards!" },
  interview:    { label:"Interview",    desc:"7 questions with ideal answer guidelines." },
  studyplan:    { label:"Study Plan",   desc:"Structured weekly plan with resources & milestones." },
  teacher:      { label:"Teacher",      desc:"Step-by-step with examples and key takeaways." },
  mentor:       { label:"Mentor",       desc:"Honest, actionable advice with real-world perspective." },
};

const PROMPT_PREVIEWS = {
  eli5:         i => `Explain like I'm 5:\n\n${i||"[your text]"}`,
  professional: i => `Professional rewrite:\n\n${i||"[your text]"}`,
  summarize:    i => `Summarize the key points:\n\n${i||"[your text]"}`,
  quiz:         i => `Generate 5 quiz questions with answers on:\n\n${i||"[your text]"}`,
  interview:    i => `7 interview questions with guidelines for:\n\n${i||"[your text]"}`,
  studyplan:    i => `Structured study plan for:\n\n${i||"[your text]"}`,
  teacher:      i => `Step-by-step teacher explanation of:\n\n${i||"[your text]"}`,
  mentor:       i => `Mentor advice on:\n\n${i||"[your text]"}`,
};

// ── State ──────────────────────────────────────
let chatHistory      = JSON.parse(localStorage.getItem("pc_history") || "[]");
let currentResponse  = "";
let currentMode      = "eli5";
let currentInput     = "";
let activeLength     = "short";
let ratingGiven      = false;
let isStreaming      = false;
let flashcards       = [];
let fcIndex          = 0;
let fcRightCnt       = 0;
let fcWrongCnt       = 0;
let improvedText     = "";

// ── All modal refs for scroll-lock ────────────
const ALL_MODALS = [shortcutsModal, statsModal, improveModal, toneModal];

// ══════════════════════════════════════════════
//   MODAL SCROLL LOCK
// ══════════════════════════════════════════════
function openModal(modal) {
  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");
}
function closeModal(modal) {
  modal.classList.add("hidden");
  // Only remove lock if all modals are closed
  if (ALL_MODALS.every(m => m.classList.contains("hidden"))) {
    document.body.classList.remove("modal-open");
  }
}
function closeAllModals() {
  ALL_MODALS.forEach(m => m.classList.add("hidden"));
  document.body.classList.remove("modal-open");
}

// Close on overlay click
ALL_MODALS.forEach(modal => {
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(modal); });
});

closeShortcuts.addEventListener("click", () => closeModal(shortcutsModal));
closeStats.addEventListener("click",     () => closeModal(statsModal));
closeImprove.addEventListener("click",   () => closeModal(improveModal));
closeTone.addEventListener("click",      () => closeModal(toneModal));

// ══════════════════════════════════════════════
//   SIDEBAR & VIEWS
// ══════════════════════════════════════════════
sidebarToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
document.addEventListener("click", e => {
  if (window.innerWidth <= 900 && !sidebar.contains(e.target) && e.target !== sidebarToggle) {
    sidebar.classList.remove("open");
  }
});

document.querySelectorAll("[data-view]").forEach(btn => {
  btn.addEventListener("click", () => {
    const view = btn.dataset.view;
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
    const target = $(`view-${view}`);
    if (target) { target.classList.remove("hidden"); target.classList.add("active"); }
    document.querySelectorAll(".sidebar-nav-item").forEach(i => i.classList.remove("active"));
    btn.classList.add("active");
    $("breadcrumbPage").textContent = btn.textContent.trim().replace(/^[^\w]+/, "").trim();
    $("widgetsRow").style.display = view === "main" ? "" : "none";
    if (window.innerWidth <= 900) sidebar.classList.remove("open");
  });
});

// Sidebar utility buttons
$("sidebarStatsBtn").addEventListener("click", () => { renderStats(); openModal(statsModal); });
$("sidebarHeatmapBtn").addEventListener("click", () => {
  renderHeatmap();
  heatmapSection.classList.toggle("hidden");
  if (!heatmapSection.classList.contains("hidden")) heatmapSection.scrollIntoView({behavior:"smooth"});
});
$("sidebarShortcutsBtn").addEventListener("click", () => openModal(shortcutsModal));
closeHeatmap.addEventListener("click", () => heatmapSection.classList.add("hidden"));

// ══════════════════════════════════════════════
//   THEME
// ══════════════════════════════════════════════
const savedTheme = localStorage.getItem("pc_theme") || "light";
applyTheme(savedTheme);
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem("pc_theme", t);
  const icon = themeToggle.querySelector(".theme-icon");
  const txt  = themeToggle.querySelector("span:last-child");
  if (icon) icon.textContent = t === "dark" ? "☀️" : "🌙";
  if (txt)  txt.textContent  = t === "dark" ? "Light mode" : "Dark mode";
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
    modeHint.textContent = MODE_INFO[currentMode]?.desc || "";
    updatePromptPreview();
  });
});
modeHint.textContent = MODE_INFO[currentMode]?.desc || "";

// ══════════════════════════════════════════════
//   LENGTH PILLS
// ══════════════════════════════════════════════
document.querySelectorAll(".length-pill").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".length-pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeLength = btn.dataset.length;
  });
});

// ══════════════════════════════════════════════
//   PROMPT QUALITY SCORE
// ══════════════════════════════════════════════
function calcScore(text) {
  if (!text || text.trim().length < 3) return 0;
  let s = 0; const t = text.trim();
  s += Math.min(30, Math.floor(t.length / 5));
  if (t.includes("?")) s += 10;
  if (/explain|describe|what|how|why|create|generate|write|list|summarize|analyze|compare/i.test(t)) s += 20;
  if (t.split(/[.!?]/).length > 2) s += 15;
  if (t.length > 20 && t.length < 500) s += 25;
  return Math.min(100, s);
}
function updatePromptScore() {
  const s = calcScore(userInput.value);
  promptScoreFill.style.width = s + "%";
  promptScoreValue.textContent = s > 0 ? s + "%" : "—";
  promptScoreValue.style.color = s >= 70 ? "var(--success)" : s >= 40 ? "var(--warning)" : "var(--error)";
}

// ══════════════════════════════════════════════
//   PROMPT PREVIEW
// ══════════════════════════════════════════════
function updatePromptPreview() {
  if (promptPreviewText) {
    promptPreviewText.textContent = (PROMPT_PREVIEWS[currentMode] || (() => ""))(userInput.value.trim().slice(0, 200));
  }
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
//   DRAG & DROP
// ══════════════════════════════════════════════
["dragenter","dragover"].forEach(evt => {
  dropZone.addEventListener(evt, e => {
    e.preventDefault();
    dropZone.classList.add("drag-active");
    dropOverlay.classList.add("visible");
  });
});
["dragleave","drop"].forEach(evt => {
  dropZone.addEventListener(evt, e => {
    e.preventDefault();
    dropZone.classList.remove("drag-active");
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
      showToast("📂 File loaded!");
    };
    reader.readAsText(file);
  } else {
    showToast("⚠ Only .txt files supported.");
  }
});

// ══════════════════════════════════════════════
//   AUTO DETECT MODE
// ══════════════════════════════════════════════
autoDetectBtn.addEventListener("click", async () => {
  if (!userInput.value.trim()) { showError("Enter some text first."); return; }
  const orig = autoDetectBtn.textContent;
  autoDetectBtn.textContent = "🤖 Detecting…";
  autoDetectBtn.disabled = true;
  try {
    const res = await fetch("/api/detect-mode", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ userInput: userInput.value.trim() }),
    });
    const data = await res.json();
    if (data.mode && MODE_INFO[data.mode]) {
      setActiveMode(data.mode);
      showToast(`🤖 ${MODE_INFO[data.mode].label} — ${data.reason}`);
    }
  } catch { showToast("Could not auto-detect. Select a mode manually."); }
  finally { autoDetectBtn.textContent = orig; autoDetectBtn.disabled = false; }
});

function setActiveMode(mode) {
  modeCards.forEach(c => c.classList.toggle("active", c.dataset.mode === mode));
  currentMode = mode;
  modeHint.textContent = MODE_INFO[mode]?.desc || "";
  updatePromptPreview();
}

// ══════════════════════════════════════════════
//   IMPROVE PROMPT
// ══════════════════════════════════════════════
improvePromptBtn.addEventListener("click", async () => {
  if (!userInput.value.trim()) { showError("Enter some text first."); return; }
  const orig = improvePromptBtn.textContent;
  improvePromptBtn.textContent = "✨ Improving…";
  improvePromptBtn.disabled = true;
  try {
    const res = await fetch("/api/improve-prompt", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ userInput: userInput.value.trim(), mode: currentMode }),
    });
    const data = await res.json();
    improvedText = data.improved;
    improveOriginal.textContent = data.original;
    improveNew.textContent = data.improved;
    openModal(improveModal);
  } catch { showToast("Could not improve prompt."); }
  finally { improvePromptBtn.textContent = orig; improvePromptBtn.disabled = false; }
});

useImprovedBtn.addEventListener("click", () => {
  userInput.value = improvedText;
  userInput.dispatchEvent(new Event("input"));
  closeModal(improveModal);
  showToast("✨ Improved prompt loaded!");
});

// ══════════════════════════════════════════════
//   SUBMIT — SSE STREAMING
// ══════════════════════════════════════════════
submitBtn.addEventListener("click", handleSubmit);
userInput.addEventListener("keydown", e => { if ((e.ctrlKey||e.metaKey) && e.key==="Enter") handleSubmit(); });

async function handleSubmit() {
  if (isStreaming || !validateInput()) return;
  const input  = userInput.value.trim();
  const mode   = currentMode;
  const lang   = langSelect.value;
  const length = activeLength;
  const start  = Date.now();

  isStreaming = true; currentInput = input; currentResponse = ""; ratingGiven = false;
  setLoadingUI(true);

  const params = new URLSearchParams({ userInput: input, mode, language: lang, length });

  try {
    const es = new EventSource(`/api/stream?${params}`);
    es.onmessage = async e => {
      const data = JSON.parse(e.data);

      if (data.type === "delta") {
        currentResponse += data.text;
        responseContent.innerHTML = formatHTML(currentResponse, mode) + '<span class="cursor-blink"></span>';
        responseBox.scrollTop = responseBox.scrollHeight;
      }
      if (data.type === "followups") showFollowUps(data.followUps);
      if (data.type === "done") {
        es.close(); isStreaming = false;
        responseContent.innerHTML = formatHTML(currentResponse, mode);
        responseBox.scrollTop = responseBox.scrollHeight;
        const elapsed = ((Date.now() - start) / 1000).toFixed(1);
        const wc = currentResponse.trim().split(/\s+/).length;
        showMeta(mode, wc, elapsed, false);
        showRespActions(); setLoadingUI(false);
        resetRating(); ratingRow.classList.remove("hidden");
        addToHistory({ input, mode, lang, response: currentResponse, timestamp: Date.now(), elapsed });
        if (mode === "quiz") {
          const cards = parseFlashcards(currentResponse);
          if (cards.length) { initFlashcards(cards); showToast("🃏 Flashcards ready! Click 'Flashcards' in sidebar."); }
        }
        fetchConfidence(currentResponse, mode);
        if (mode === "professional") fetchTone(input, currentResponse);
        else { aiMetaRow.classList.remove("hidden"); toneBadge.classList.add("hidden"); }
        updateWordCloud(); updateInsights(); updateTopStats();
        const chain = chainSelect.value;
        if (chain) {
          setTimeout(() => {
            userInput.value = currentResponse.slice(0, 1000);
            userInput.dispatchEvent(new Event("input"));
            setActiveMode(chain); chainSelect.value = "";
            showToast(`⛓ Chained to ${MODE_INFO[chain]?.label}! Hit Generate.`);
          }, 600);
        }
      }
      if (data.type === "error") {
        es.close(); isStreaming = false; setLoadingUI(false);
        showError(data.message);
        responsePlaceholder.classList.remove("hidden");
        responseContent.classList.add("hidden");
      }
    };
    es.onerror = () => {
      es.close(); isStreaming = false; setLoadingUI(false);
      showError("Connection error. Is the server running?");
      responsePlaceholder.classList.remove("hidden");
      responseContent.classList.add("hidden");
    };
  } catch(err) {
    isStreaming = false; setLoadingUI(false);
    showError(err.message || "Something went wrong.");
  }
}

// ── Loading UI ─────────────────────────────────
function setLoadingUI(on) {
  if (on) {
    loadingState.classList.remove("hidden");
    responseBox.classList.add("hidden");
    [responseMeta, ratingRow, followupsSection, aiMetaRow].forEach(el => el.classList.add("hidden"));
    [copyBtn, exportMdBtn, exportPdfBtn, cacheBadge].forEach(el => el.classList.add("hidden"));
    submitBtn.disabled = true;
    btnSpinner.classList.remove("hidden");
    submitText.textContent = "Generating…";
    submitIcon.textContent = "";
    // Show response box immediately for streaming
    setTimeout(() => {
      loadingState.classList.add("hidden");
      responseBox.classList.remove("hidden");
      responsePlaceholder.classList.add("hidden");
      responseContent.innerHTML = '<span class="cursor-blink"></span>';
      responseContent.classList.remove("hidden");
    }, 600);
  } else {
    loadingState.classList.add("hidden");
    responseBox.classList.remove("hidden");
    submitBtn.disabled = false;
    btnSpinner.classList.add("hidden");
    submitText.textContent = "Generate Response";
    submitIcon.textContent = "⚡";
  }
}

function showMeta(mode, wc, elapsed, fromCache) {
  metaMode.textContent  = MODE_INFO[mode]?.label || mode;
  metaStats.textContent = `${wc} words · ${elapsed}s`;
  metaTime.textContent  = new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  responseMeta.classList.remove("hidden");
  fromCache ? cacheBadge.classList.remove("hidden") : cacheBadge.classList.add("hidden");
}
function showRespActions() {
  [copyBtn, exportMdBtn, exportPdfBtn].forEach(el => el.classList.remove("hidden"));
}
function resetRating() {
  ratingGiven = false;
  [rateUp, rateDown].forEach(b => b.classList.remove("selected"));
  ratingFeedback.classList.add("hidden");
}
function showFollowUps(qs) {
  if (!qs?.length) return;
  followupsList.innerHTML = "";
  qs.forEach(q => {
    const btn = document.createElement("button");
    btn.className = "followup-chip";
    btn.textContent = "→ " + q;
    btn.addEventListener("click", () => {
      userInput.value = q; userInput.dispatchEvent(new Event("input"));
      clearError(); window.scrollTo({top:0,behavior:"smooth"});
      showToast("Follow-up loaded — hit Generate!");
    });
    followupsList.appendChild(btn);
  });
  followupsSection.classList.remove("hidden");
}

// ── HTML formatters ────────────────────────────
function esc(t) {
  return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
function formatHTML(text, mode) {
  if (mode === "quiz")      return formatQuiz(text);
  if (mode === "interview") return formatInterview(text);
  return `<span>${esc(text)}</span>`;
}
function formatQuiz(text) {
  const lines = text.split("\n").filter(l=>l.trim());
  let html="", cQ="", cA="";
  lines.forEach(line => {
    if (/^Q\d+:/i.test(line.trim())) {
      if (cQ) html += `<div class="quiz-item"><strong>${esc(cQ)}</strong><span class="quiz-answer">✅ ${esc(cA)}</span></div>`;
      cQ=line.trim(); cA="";
    } else if (/^A\d+:/i.test(line.trim())) { cA=line.trim(); }
    else if (cA) cA+=" "+line.trim();
    else if (cQ) cQ+=" "+line.trim();
  });
  if (cQ) html+=`<div class="quiz-item"><strong>${esc(cQ)}</strong><span class="quiz-answer">✅ ${esc(cA)}</span></div>`;
  return html || `<span>${esc(text)}</span>`;
}
function formatInterview(text) {
  const lines = text.split("\n").filter(l=>l.trim());
  let html="", cQ="", cT="";
  lines.forEach(line => {
    if (/^Q:/i.test(line.trim())) {
      if (cQ) html+=`<div class="interview-item"><strong>${esc(cQ)}</strong><span class="interview-tips">💡 ${esc(cT)}</span></div>`;
      cQ=line.trim(); cT="";
    } else if (/^Tips?:/i.test(line.trim())) { cT=line.replace(/^Tips?:\s*/i,"").trim(); }
    else if (cT) cT+=" "+line.trim();
    else if (cQ) cQ+=" "+line.trim();
  });
  if (cQ) html+=`<div class="interview-item"><strong>${esc(cQ)}</strong><span class="interview-tips">💡 ${esc(cT)}</span></div>`;
  return html || `<span>${esc(text)}</span>`;
}

// ══════════════════════════════════════════════
//   CONFIDENCE + TONE
// ══════════════════════════════════════════════
async function fetchConfidence(response, mode) {
  try {
    const res = await fetch("/api/confidence", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({response:response.slice(0,800), mode}),
    });
    const data = await res.json();
    const score = Math.min(99, Math.max(50, data.score||82));
    confBarFill.style.width = score + "%";
    confValue.textContent   = score + "%";
    confValue.style.color   = score>=80?"var(--success)":score>=60?"var(--warning)":"var(--error)";
    aiMetaRow.classList.remove("hidden");
  } catch {}
}

async function fetchTone(before, after) {
  try {
    const res = await fetch("/api/analyze-tone", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({before, after}),
    });
    const data = await res.json();
    toneBefore.textContent = data.before?.tone || "Informal";
    toneAfter.textContent  = data.after?.tone  || "Professional";
    toneBadge.classList.remove("hidden");
    toneBadge.onclick = () => showToneModal(data);
  } catch {}
}

function showToneModal(data) {
  const kws = arr => (arr||[]).map(k=>`<span class="tone-keyword">${k}</span>`).join("");
  toneBody.innerHTML = `
    <div class="tone-grid">
      <div class="tone-card">
        <p class="tone-card-label">Before</p>
        <p class="tone-card-tone">${data.before?.tone||"—"}</p>
        <p class="tone-formality">Formality: ${data.before?.score||"—"}/10</p>
        <div class="tone-keywords">${kws(data.before?.keywords)}</div>
      </div>
      <div class="tone-card improved">
        <p class="tone-card-label">After (Rewritten)</p>
        <p class="tone-card-tone" style="color:var(--success)">${data.after?.tone||"—"}</p>
        <p class="tone-formality">Formality: ${data.after?.score||"—"}/10</p>
        <div class="tone-keywords">${kws(data.after?.keywords)}</div>
      </div>
    </div>`;
  openModal(toneModal);
}

// ══════════════════════════════════════════════
//   CLEAR
// ══════════════════════════════════════════════
clearBtn.addEventListener("click", () => {
  userInput.value=""; charCounter.textContent="0 / 2000"; charCounter.style.color="";
  wordCount.textContent="0 words"; clearError();
  responsePlaceholder.classList.remove("hidden");
  responseContent.classList.add("hidden");
  [responseMeta, ratingRow, followupsSection, aiMetaRow].forEach(el=>el.classList.add("hidden"));
  [copyBtn, exportMdBtn, exportPdfBtn, cacheBadge].forEach(el=>el.classList.add("hidden"));
  currentResponse=""; updatePromptScore(); updatePromptPreview(); userInput.focus();
});

// ══════════════════════════════════════════════
//   COPY / EXPORT
// ══════════════════════════════════════════════
copyBtn.addEventListener("click", async () => {
  if (!currentResponse) return;
  try { await navigator.clipboard.writeText(currentResponse); showToast("✓ Copied!"); }
  catch { const ta=document.createElement("textarea"); ta.value=currentResponse; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); showToast("✓ Copied!"); }
});

exportMdBtn.addEventListener("click", () => {
  if (!currentResponse) return;
  const md = `# PromptCraft Export\n\n**Mode:** ${MODE_INFO[currentMode]?.label}\n**Date:** ${new Date().toLocaleString()}\n\n---\n\n## Input\n\n${currentInput}\n\n## Response\n\n${currentResponse}\n`;
  const url=URL.createObjectURL(new Blob([md],{type:"text/markdown"}));
  const a=Object.assign(document.createElement("a"),{href:url,download:`promptcraft-${currentMode}-${Date.now()}.md`});
  a.click(); URL.revokeObjectURL(url); showToast("📄 Markdown downloaded!");
});

exportPdfBtn.addEventListener("click", () => {
  if (!currentResponse) return;
  const t=document.documentElement.getAttribute("data-theme");
  const bg=t==="dark"?"#17172a":"#fff", fg=t==="dark"?"#ececf5":"#0f0f1a", muted=t==="dark"?"#a0a3b8":"#4b5060";
  const w=window.open("","_blank");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>PromptCraft</title>
    <style>body{font-family:Inter,system-ui,sans-serif;background:${bg};color:${fg};padding:40px;max-width:800px;margin:0 auto;line-height:1.7}
    h1{font-size:22px;margin-bottom:4px}.meta{color:${muted};font-size:13px;margin-bottom:24px}
    .lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${muted};margin-bottom:8px}
    .box{background:${t==="dark"?"#0f0f1d":"#f8f9fc"};padding:16px;border-radius:8px;font-size:14px;margin-bottom:24px;white-space:pre-wrap}
    @media print{body{padding:20px}}</style></head><body>
    <h1>✦ PromptCraft Export</h1>
    <p class="meta">Mode: <strong>${MODE_INFO[currentMode]?.label}</strong> · ${new Date().toLocaleString()}</p>
    <p class="lbl">Input</p><div class="box">${esc(currentInput)}</div>
    <p class="lbl">Response</p><div class="box">${esc(currentResponse)}</div>
    <script>window.onload=()=>window.print()<\/script></body></html>`);
  w.document.close(); showToast("📑 Print dialog opened!");
});

// ══════════════════════════════════════════════
//   RATING
// ══════════════════════════════════════════════
[rateUp, rateDown].forEach(btn => {
  btn.addEventListener("click", () => {
    if (ratingGiven) return;
    ratingGiven=true; btn.classList.add("selected");
    const isUp = btn.id==="rateUp";
    ratingFeedback.textContent = isUp ? "Thanks! 🎉" : "Got it, we'll improve.";
    ratingFeedback.classList.remove("hidden");
    if (chatHistory[0]) { chatHistory[0].rating=isUp?"up":"down"; saveHistory(); renderHistory(); }
  });
});

// ══════════════════════════════════════════════
//   FLASHCARDS
// ══════════════════════════════════════════════
function parseFlashcards(text) {
  const lines=text.split("\n").filter(l=>l.trim());
  const cards=[]; let cQ="", cA="";
  lines.forEach(line => {
    if (/^Q\d+:/i.test(line.trim())) {
      if (cQ&&cA) cards.push({q:cQ.replace(/^Q\d+:\s*/i,""),a:cA.replace(/^A\d+:\s*/i,"")});
      cQ=line.trim(); cA="";
    } else if (/^A\d+:/i.test(line.trim())) { cA=line.trim(); }
    else if (cA) cA+=" "+line.trim();
    else if (cQ) cQ+=" "+line.trim();
  });
  if (cQ&&cA) cards.push({q:cQ.replace(/^Q\d+:\s*/i,""),a:cA.replace(/^A\d+:\s*/i,"")});
  return cards;
}
function initFlashcards(cards) {
  flashcards=cards; fcIndex=0; fcRightCnt=0; fcWrongCnt=0;
  renderFlashcard();
}
function renderFlashcard() {
  if (!flashcards.length) return;
  const c=flashcards[fcIndex];
  flashcardFront.textContent=c.q; flashcardBack.textContent=c.a;
  flashcardInner.classList.remove("flipped");
  flashcardProgress.textContent=`${fcIndex+1} / ${flashcards.length}`;
  fcRightCount.textContent=fcRightCnt; fcWrongCount.textContent=fcWrongCnt;
}
fcFlip.addEventListener("click", ()=>flashcardInner.classList.toggle("flipped"));
$("flashcard").addEventListener("click", ()=>flashcardInner.classList.toggle("flipped"));
prevCard.addEventListener("click", ()=>{ fcIndex=(fcIndex-1+flashcards.length)%flashcards.length; renderFlashcard(); });
nextCard.addEventListener("click", ()=>{ fcIndex=(fcIndex+1)%flashcards.length; renderFlashcard(); });
resetCards.addEventListener("click", ()=>{ fcIndex=0; fcRightCnt=0; fcWrongCnt=0; renderFlashcard(); });
fcRight.addEventListener("click", ()=>{ fcRightCnt++; fcIndex=(fcIndex+1)%flashcards.length; renderFlashcard(); showToast("✓ Got it!"); });
fcWrong.addEventListener("click", ()=>{ fcWrongCnt++; fcIndex=(fcIndex+1)%flashcards.length; renderFlashcard(); });

// ══════════════════════════════════════════════
//   HEATMAP
// ══════════════════════════════════════════════
function renderHeatmap() {
  const today=new Date(); const days=91;
  const counts={};
  chatHistory.forEach(e=>{ const d=new Date(e.timestamp).toDateString(); counts[d]=(counts[d]||0)+1; });
  heatmapGrid.innerHTML="";
  for (let i=days-1;i>=0;i--) {
    const d=new Date(today); d.setDate(d.getDate()-i);
    const key=d.toDateString(); const count=counts[key]||0;
    const intensity=count===0?0:count===1?1:count===2?2:count<=4?3:4;
    const cell=document.createElement("div");
    cell.className="hm-cell";
    cell.setAttribute("data-intensity",intensity);
    cell.title=`${d.toLocaleDateString()} — ${count} response${count!==1?"s":""}`;
    heatmapGrid.appendChild(cell);
  }
}

// ══════════════════════════════════════════════
//   WORD CLOUD
// ══════════════════════════════════════════════
function updateWordCloud() {
  const stop=new Set(["the","a","an","is","are","was","were","be","been","have","has","had","do","does","did","will","would","could","should","may","might","shall","can","i","you","he","she","it","we","they","them","this","that","these","those","what","which","who","when","where","why","how","and","or","but","if","for","of","to","in","on","at","by","with","from","about","as","into","my","your","his","her","its","our","their","explain","describe","create","generate","write","list","summarize","analyze"]);
  const freq={};
  chatHistory.forEach(e=>e.input.toLowerCase().replace(/[^a-z\s]/g,"").split(/\s+/).forEach(w=>{ if(w.length>3&&!stop.has(w)) freq[w]=(freq[w]||0)+1; }));
  const sorted=Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,20);
  if (!sorted.length) { wordcloudWrap.innerHTML='<span class="wc-empty">Topics appear here after you generate responses.</span>'; return; }
  const max=sorted[0][1];
  wordcloudWrap.innerHTML=sorted.map(([w,c])=>{
    const size=11+Math.round((c/max)*12);
    return `<span class="wc-word" style="font-size:${size}px">${w}</span>`;
  }).join("");
}

// ══════════════════════════════════════════════
//   INSIGHTS
// ══════════════════════════════════════════════
function updateInsights() {
  if (!chatHistory.length) { insightsText.textContent="Generate responses to see your personal insights."; return; }
  const total=chatHistory.length;
  const modeC={};
  chatHistory.forEach(e=>modeC[e.mode]=(modeC[e.mode]||0)+1);
  const top=Object.entries(modeC).sort((a,b)=>b[1]-a[1])[0];
  const avg=chatHistory.filter(e=>e.elapsed).reduce((a,e)=>a+parseFloat(e.elapsed),0)/(chatHistory.filter(e=>e.elapsed).length||1);
  const helpful=chatHistory.filter(e=>e.rating==="up").length;
  const freq={}; const stop2=new Set(["the","a","an","is","are","in","of","to","and","for","with","what","how","why","explain","describe"]);
  chatHistory.forEach(e=>e.input.toLowerCase().replace(/[^a-z\s]/g,"").split(/\s+/).filter(w=>w.length>3&&!stop2.has(w)).forEach(w=>freq[w]=(freq[w]||0)+1));
  const topW=Object.entries(freq).sort((a,b)=>b[1]-a[1])[0];
  insightsText.innerHTML=`You've generated <strong>${total} response${total!==1?"s":""}</strong>. Favourite mode: <strong>${MODE_INFO[top[0]]?.label||top[0]}</strong> (${top[1]}×). ${topW?`Most studied: <strong>"${topW[0]}"</strong>.`:""} Avg time: <strong>${avg.toFixed(1)}s</strong>. ${helpful?`<strong>${helpful}</strong> marked helpful 👍.`:""}`;
}

function updateTopStats() {
  topStatTotal.textContent = chatHistory.length;
  const today = new Date().toDateString();
  topStatToday.textContent = chatHistory.filter(e => new Date(e.timestamp).toDateString() === today).length;
}

// ══════════════════════════════════════════════
//   HISTORY
// ══════════════════════════════════════════════
renderHistory(); updateWordCloud(); updateInsights(); updateTopStats();

function addToHistory(entry) {
  chatHistory.unshift(entry);
  if (chatHistory.length>20) chatHistory.pop();
  saveHistory(); renderHistory();
}
function saveHistory() { localStorage.setItem("pc_history", JSON.stringify(chatHistory)); }

historySearch.addEventListener("input", renderHistory);

function renderHistory() {
  const q=historySearch.value.trim().toLowerCase();
  const filtered=q?chatHistory.filter(e=>e.input.toLowerCase().includes(q)||e.mode.includes(q)):chatHistory;
  if (!filtered.length) {
    historyList.innerHTML=`<p class="empty-state-text">${q?"No results found.":"No history yet. Generate a response to get started!"}</p>`;
    return;
  }
  historyList.innerHTML=filtered.map(entry=>{
    const info=MODE_INFO[entry.mode]||{label:entry.mode};
    const time=new Date(entry.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    const preview=entry.input.length>80?entry.input.slice(0,80)+"…":entry.input;
    const rIcon=entry.rating==="up"?"👍":entry.rating==="down"?"👎":"";
    const rIdx=chatHistory.indexOf(entry);
    return `<div class="history-item" data-index="${rIdx}" role="button" tabindex="0">
      <span class="history-mode">${info.label}</span>
      <span class="history-text">${esc(preview)}</span>
      <span class="history-rating">${rIcon}</span>
      <span class="history-time">${time}</span>
    </div>`;
  }).join("");
  historyList.querySelectorAll(".history-item").forEach(el=>{
    const click=()=>restoreEntry(chatHistory[Number(el.dataset.index)]);
    el.addEventListener("click",click);
    el.addEventListener("keydown",e=>{ if(e.key==="Enter") click(); });
  });
}

function restoreEntry(entry) {
  // Navigate to generate view
  document.querySelectorAll("[data-view]").forEach(b=>{ if(b.dataset.view==="main") b.click(); });
  setActiveMode(entry.mode);
  userInput.value=entry.input; userInput.dispatchEvent(new Event("input"));
  currentResponse=entry.response; currentInput=entry.input; currentMode=entry.mode;
  responsePlaceholder.classList.add("hidden");
  responseContent.innerHTML=formatHTML(entry.response,entry.mode);
  responseContent.classList.remove("hidden");
  showMeta(entry.mode,entry.response.trim().split(/\s+/).length,entry.elapsed||"—",false);
  showRespActions(); resetRating(); ratingRow.classList.remove("hidden");
  window.scrollTo({top:0,behavior:"smooth"});
  showToast("Entry restored.");
}

clearHistoryBtn.addEventListener("click", ()=>{
  if(!chatHistory.length) return;
  if(confirm("Clear all history?")) {
    chatHistory=[]; saveHistory(); renderHistory();
    updateWordCloud(); updateInsights(); updateTopStats(); showToast("History cleared.");
  }
});

// ══════════════════════════════════════════════
//   STATS
// ══════════════════════════════════════════════
function renderStats() {
  if(!chatHistory.length) { statsBody.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:24px">No data yet!</p>'; return; }
  const total=chatHistory.length;
  const helpful=chatHistory.filter(e=>e.rating==="up").length;
  const avg=chatHistory.filter(e=>e.elapsed).reduce((a,e)=>a+parseFloat(e.elapsed),0)/(chatHistory.filter(e=>e.elapsed).length||1);
  const today=new Date().toDateString();
  const todayC=chatHistory.filter(e=>new Date(e.timestamp).toDateString()===today).length;
  const modeC={}; chatHistory.forEach(e=>modeC[e.mode]=(modeC[e.mode]||0)+1);
  const maxC=Math.max(...Object.values(modeC));
  const rows=Object.entries(modeC).sort((a,b)=>b[1]-a[1]).map(([m,c])=>`
    <div class="mode-bar-row">
      <span class="mode-bar-label">${MODE_INFO[m]?.label||m}</span>
      <div class="mode-bar-track"><div class="mode-bar-fill" style="width:${Math.round((c/maxC)*100)}%"></div></div>
      <span class="mode-bar-count">${c}</span>
    </div>`).join("");
  statsBody.innerHTML=`
    <div class="stats-grid">
      <div class="stat-card"><span class="stat-value">${total}</span><span class="stat-label">Total Responses</span></div>
      <div class="stat-card"><span class="stat-value">${todayC}</span><span class="stat-label">Today</span></div>
      <div class="stat-card"><span class="stat-value">${helpful}</span><span class="stat-label">👍 Helpful</span></div>
      <div class="stat-card"><span class="stat-value">${avg.toFixed(1)}s</span><span class="stat-label">Avg Time</span></div>
    </div>
    <div class="stats-modes"><h4>Mode Breakdown</h4>${rows}</div>`;
}

// ══════════════════════════════════════════════
//   KEYBOARD SHORTCUTS
// ══════════════════════════════════════════════
document.addEventListener("keydown", e => {
  if (e.key==="Escape") closeAllModals();
  if (e.key==="?"&&!["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)) openModal(shortcutsModal);
  if (e.ctrlKey&&e.key==="k") { e.preventDefault(); clearBtn.click(); }
  if (e.ctrlKey&&e.key==="d") { e.preventDefault(); themeToggle.click(); }
  if (e.ctrlKey&&e.shiftKey&&e.key==="C") { e.preventDefault(); copyBtn.click(); }
  if (e.ctrlKey&&e.key==="i") { e.preventDefault(); improvePromptBtn.click(); }
  if (e.ctrlKey&&e.key==="m") { e.preventDefault(); autoDetectBtn.click(); }
});

// ══════════════════════════════════════════════
//   TOAST
// ══════════════════════════════════════════════
let toastTimer;
function showToast(msg) {
  toast.textContent=msg; toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove("show"), 3000);
}

// ── Init ───────────────────────────────────────
updatePromptScore(); updatePromptPreview();
userInput.focus();
