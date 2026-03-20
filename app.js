/* ============================================================
   VerifyIt — app.js   (v2 — fixed domain detection)
   ============================================================ */

/* ─────────────────────────────────────────────────────────────
   DEMO RESULT OBJECTS
   Each object is the full result payload for one scenario.
───────────────────────────────────────────────────────────── */
const DEMO = {

  /* ── URL: trusted source ── */
  trusted: {
    score: 87, verdict: "Mostly Trustworthy", verdictSub: "high credibility source",
    scoreColor: "#3bffc8",
    sourceName: "BBC News", sourceAge: "Est. 1922 · Public broadcaster",
    sourcePill: ["Verified", "pill-safe"],
    mediaVal: "No manipulation detected", mediaSub: "Images pass reverse-search check",
    mediaPill: ["Authentic", "pill-safe"],
    fcVal: "3 related checks found", fcSub: "All corroborate the reporting",
    fcPill: ["Verified", "pill-safe"],
    bars: [92, 95, 88, 80, 84],
    loaderSteps: [
      "Checking source credibility database…",
      "Scanning article images…",
      "Cross-referencing fact-check archives…",
      "Computing trust score…"
    ],
    factchecks: [
      { type:"true",  claim:"Inflation figures cited are accurate",     note:"Confirmed by ONS data published March 2026.", src:"ons.gov.uk" },
      { type:"true",  claim:"Government response quote is verbatim",   note:"Cross-checked against official Hansard record.", src:"parliament.uk" },
      { type:"mixed", claim:"Forecast described as 'certain'",         note:"Headline overstates confidence — uncertainty remains.", src:"imf.org" }
    ],
    summary: `This article scores highly on source credibility. Core facts are <strong>verified and accurate</strong>. One minor caution: the headline uses stronger language than the data supports. Overall, <strong>reliable reporting</strong>. Safe to share.`
  },

  /* ── URL: misleading/fake source ── */
  misleading: {
    score: 22, verdict: "Likely Fake", verdictSub: "multiple red flags detected",
    scoreColor: "#ff5c5c",
    sourceName: "unknownnews24.net", sourceAge: "Domain registered 3 months ago",
    sourcePill: ["Unverified", "pill-danger"],
    mediaVal: "Image manipulation detected", mediaSub: "Photo traced to 2019 unrelated event",
    mediaPill: ["Manipulated", "pill-danger"],
    fcVal: "7 fact-checks contradict this", fcSub: "Major claims rated FALSE by 3 orgs",
    fcPill: ["Disputed", "pill-danger"],
    bars: [18, 22, 75, 14, 20],
    loaderSteps: [
      "Checking source credibility…",
      "⚠ Suspicious domain detected — scanning deeper…",
      "Cross-referencing fact-check archives…",
      "Computing trust score…"
    ],
    factchecks: [
      { type:"false", claim:"'Government bans all cash transactions'",  note:"No such policy exists. Debunked by Snopes, AFP, and Full Fact.", src:"fullfact.org" },
      { type:"false", claim:"Image shows 'recent protests'",            note:"Reverse search traces photo to 2019 Hong Kong — unrelated.", src:"tineye.com" },
      { type:"mixed", claim:"Cost of living figures",                   note:"Numbers are real but stripped of context to appear extreme.", src:"reuters.com" }
    ],
    summary: `This article raises <strong>serious trust concerns</strong>. The domain is only 3 months old with no editorial history. The lead image is a <strong>recycled 2019 photo</strong>, and the central claim has been <strong>debunked by 3 independent fact-checkers</strong>. <strong>Do not share without verification.</strong>`
  },

  /* ── Claim: appears accurate ── */
  claimTrue: {
    score: 79, verdict: "Likely Accurate", verdictSub: "matches multiple trusted sources",
    scoreColor: "#3bffc8",
    sourceName: "Multiple corroborated sources", sourceAge: "Reuters, BBC, The Guardian",
    sourcePill: ["Corroborated", "pill-safe"],
    mediaVal: "Text-only claim — no media", mediaSub: "No image to verify",
    mediaPill: ["N/A", "pill-neutral"],
    fcVal: "5 sources confirm this claim", fcSub: "No major outlet contradicts it",
    fcPill: ["Verified", "pill-safe"],
    bars: [82, 78, 71, 65, 88],
    loaderSteps: [
      "Parsing claim text…",
      "Searching fact-check databases…",
      "Matching against 40+ news sources…",
      "Generating trust score…"
    ],
    factchecks: [
      { type:"true",  claim:"Claim matches official published data",       note:"ONS published the figures cited on March 15, 2026.", src:"ons.gov.uk" },
      { type:"true",  claim:"Reuters confirms independently",              note:"Reuters economic desk reported identical figures.", src:"reuters.com" },
      { type:"mixed", claim:"'Record high' framing is debatable",         note:"Inflation is elevated but not at historic peak — context matters.", src:"ft.com" }
    ],
    summary: `This claim is <strong>broadly accurate</strong>. The specific figures cited match official data and have been independently confirmed by multiple outlets. One minor overstatement in framing. <strong>Safe to share with that caveat.</strong>`
  },

  /* ── Claim: false/viral ── */
  claimFalse: {
    score: 9, verdict: "FALSE Claim", verdictSub: "contradicted by official sources",
    scoreColor: "#ff5c5c",
    sourceName: "Claim origin: social media viral post", sourceAge: "No credible source attached",
    sourcePill: ["Unverified", "pill-danger"],
    mediaVal: "No supporting evidence found", mediaSub: "Zero credible articles found",
    mediaPill: ["Unsupported", "pill-danger"],
    fcVal: "Debunked by 8 organisations", fcSub: "Rated FALSE by all major fact-checkers",
    fcPill: ["DEBUNKED", "pill-danger"],
    bars: [5, 8, 94, 4, 6],
    loaderSteps: [
      "Parsing claim text…",
      "⚠ No official source matches this claim…",
      "Cross-referencing government records…",
      "Confirming debunk — computing score…"
    ],
    factchecks: [
      { type:"false", claim:"No such government policy exists",         note:"Ministry of Finance has issued an official denial.", src:"pib.gov.in" },
      { type:"false", claim:"RBI confirms no restrictions",             note:"RBI press release from March 2026 explicitly denies this.", src:"rbi.org.in" },
      { type:"false", claim:"Claim originated from satire website",    note:"Original post was from a known satire site, shared without context.", src:"altnews.in" }
    ],
    summary: `This claim is <strong>completely false</strong>. Official bodies have issued denials and the claim originated from a <strong>satire website</strong> that was shared without context. <strong>Do not share this misinformation.</strong>`
  },

  /* ── Image: manipulated ── */
  imageManipulated: {
    score: 18, verdict: "Image Manipulated", verdictSub: "high confidence — multiple signals",
    scoreColor: "#ff5c5c",
    sourceName: "Image origin: unverified upload", sourceAge: "First seen March 2026",
    sourcePill: ["Suspicious", "pill-danger"],
    mediaVal: "AI-generated elements detected", mediaSub: "Face swap + background replacement",
    mediaPill: ["MANIPULATED", "pill-danger"],
    fcVal: "Original photo found from 2019", fcSub: "Used in 3 unrelated fake stories",
    fcPill: ["Recycled", "pill-danger"],
    bars: [12, 8, 95, 18, 10],
    loaderSteps: [
      "Extracting image metadata…",
      "Running reverse image search…",
      "Detecting AI-generated pixels (ELA)…",
      "Cross-matching manipulation database…"
    ],
    factchecks: [
      { type:"false", claim:"Photo shows event from 2026",              note:"Reverse search found this photo originates from a 2019 protest — unrelated.", src:"tineye.com" },
      { type:"false", claim:"Faces match the people claimed",           note:"Face verification shows faces were digitally swapped using AI.", src:"sensity.ai" },
      { type:"mixed", claim:"Background location may be genuine",      note:"Location appears real but captured in a completely different context.", src:"forensically.app" }
    ],
    summary: `This image shows <strong>significant manipulation</strong>. ELA reveals inconsistent compression artefacts. Faces have been <strong>AI-swapped</strong>, and reverse image search confirms the original is from a <strong>2019 protest</strong> — unrelated to the current claim. This image is being deliberately misused.`,
    imageAnalysis: {
      confidence: 94,
      techniques: ["Face replacement (GAN)", "Background compositing", "Metadata wiped"],
      originalSrc: "Unrelated protest photo, 2019",
      elaScore: "High anomaly — 94% manipulated"
    }
  },

  /* ── Image: authentic ── */
  imageAuthentic: {
    score: 93, verdict: "Image Authentic", verdictSub: "no manipulation detected",
    scoreColor: "#3bffc8",
    sourceName: "AFP Newswire", sourceAge: "Published March 2026 · Metadata intact",
    sourcePill: ["Verified", "pill-safe"],
    mediaVal: "No manipulation detected", mediaSub: "Metadata, ELA and reverse search all pass",
    mediaPill: ["Authentic", "pill-safe"],
    fcVal: "Original source confirmed", fcSub: "AFP photographer credit verified",
    fcPill: ["Verified", "pill-safe"],
    bars: [94, 90, 82, 91, 88],
    loaderSteps: [
      "Extracting image metadata…",
      "Running reverse image search…",
      "ELA analysis — checking pixel consistency…",
      "Verifying source chain…"
    ],
    factchecks: [
      { type:"true", claim:"Metadata matches claimed date and location", note:"EXIF data shows March 14, 2026 — consistent with reported event.", src:"metapicz.com" },
      { type:"true", claim:"Photographer credit verified",               note:"AFP photographer confirmed via official press archive.", src:"afp.com" },
      { type:"true", claim:"No AI generation or editing detected",      note:"ELA shows uniform compression across entire image.", src:"forensically.app" }
    ],
    summary: `This image passes all authentication checks. <strong>EXIF metadata is intact</strong>, photographer credit is verified through AFP, and ELA shows no signs of editing or AI generation. <strong>Genuine and accurately represents the event described.</strong> Safe to use.`,
    imageAnalysis: {
      confidence: 4,
      techniques: ["None detected"],
      originalSrc: "AFP Newswire, March 14 2026",
      elaScore: "Low anomaly — 4% (normal range)"
    }
  }
};


/* ─────────────────────────────────────────────────────────────
   DOMAIN DETECTION — clean, unambiguous approach
   We extract the hostname from the URL and check it directly.
───────────────────────────────────────────────────────────── */

/* List of trusted hostnames / hostname suffixes */
const TRUSTED_HOSTS = [
  /* International news */
  "bbc.com","bbc.co.uk","reuters.com","apnews.com","afp.com",
  "theguardian.com","nytimes.com","washingtonpost.com","wsj.com",
  "economist.com","ft.com","bloomberg.com","forbes.com","time.com",
  "npr.org","aljazeera.com","dw.com","france24.com","cnn.com",
  "nbcnews.com","cbsnews.com","abcnews.go.com","independent.co.uk",
  "telegraph.co.uk","thetimes.co.uk","politico.com","axios.com",
  "theatlantic.com","newyorker.com","vox.com","businessinsider.com",
  "cnbc.com","fortune.com","techcrunch.com","wired.com","theverge.com",
  /* Indian news */
  "ndtv.com","thehindu.com","hindustantimes.com","indianexpress.com",
  "timesofindia.com","livemint.com","businessstandard.com","theprint.in",
  "thewire.in","scroll.in","news18.com","indiatoday.in","aninews.in",
  "ddnews.gov.in","zeenews.india.com","firstpost.com","moneycontrol.com",
  "economictimes.indiatimes.com","deccanherald.com","tribuneindia.com",
  "telegraphindia.com","outlookindia.com","thestatesman.com",
  /* Fact-checkers */
  "snopes.com","factcheck.org","politifact.com","fullfact.org",
  "altnews.in","boomlive.in","thequint.com","vishvasnews.com",
  "factchecker.in","newschecker.in","logically.ai","misbar.com","www.flipkart.com","linkedin.com","naukri.com",
  /* Government / official */
  "pib.gov.in","rbi.org.in","mygov.in","india.gov.in","eci.gov.in",
  "who.int","un.org","unicef.org","worldbank.org","imf.org","phonepay.com","paytm.com","google.com","youtube.com","wikipedia.org","chatgpt.com","irctc.co.in",
  "ons.gov.uk","parliament.uk","gov.uk",
  /* Reference / education */
  "wikipedia.org","britannica.com","nature.com","science.org",
  "pubmed.ncbi.nlm.nih.gov","arxiv.org","mit.edu","harvard.edu",
  "stanford.edu","ox.ac.uk","cambridge.org","digilocker.gov.in","bharatpay.com",
];

/* Substrings that only appear in known fake/spam domains */
const FAKE_DOMAIN_FRAGMENTS = [
  "viraltruth","fakenews24","hoaxalert","exposenews","breakingalert24",
  "truthexposed","realinfo247","shockingtruth24","viralpost24",
  "unknownnews","conspiracywatch","secrettruth","alertnow24",
  "clickbait","newshoax","fakedaily",
];

/* Suspicious TLDs that credible news sites never use */
const SPAM_TLDS = [".xyz",".click",".buzz",".top",".icu",".gq",".cf",".tk",".ml"];

/**
 * Given a raw URL string, return "trusted", "fake", or "unknown".
 */
function classifyUrl(raw) {
  const v = raw.toLowerCase().trim();

  /* Try to extract hostname cleanly */
  let host = v;
  try {
    /* Handle URLs that start with http/https */
    const withProtocol = v.startsWith("http") ? v : "https://" + v;
    host = new URL(withProtocol).hostname.replace(/^www\./, "");
  } catch (e) {
    /* URL parsing failed — work with the raw string */
    host = v.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }

  /* 1. Known fake fragment anywhere in hostname */
  if (FAKE_DOMAIN_FRAGMENTS.some(frag => host.includes(frag))) return "fake";

  /* 2. Spam TLD */
  if (SPAM_TLDS.some(tld => host.endsWith(tld))) return "fake";

  /* 3. Exact match or subdomain match against trusted list */
  /*    e.g. host = "news.bbc.com"  → matches "bbc.com" ✓  */
  if (TRUSTED_HOSTS.some(trusted => host === trusted || host.endsWith("." + trusted))) {
    return "trusted";
  }

  /* 4. .gov / .edu / .ac domains — always trusted */
  if (/\.(gov|edu|ac)\.[a-z]{2}$/.test(host) || host.endsWith(".gov") || host.endsWith(".edu")) {
    return "trusted";
  }

  /* 5. Domain contains lots of digits — suspicious */
  if (/\d{3,}/.test(host.split(".")[0])) return "fake";

  /* 6. Unknown — give benefit of the doubt */
  return "unknown";
}


/* ─────────────────────────────────────────────────────────────
   PICK RESULT — decides which demo data to show
───────────────────────────────────────────────────────────── */
function pickResult(tab, value) {
  const v = (value || "").trim();

  /* ── URL TAB ── */
  if (tab === "URL") {
    const verdict = classifyUrl(v);
    if (verdict === "fake")    return DEMO.misleading;
    if (verdict === "trusted") return DEMO.trusted;
    /* unknown domain — benefit of the doubt */
    return DEMO.trusted;
  }

  /* ── CLAIM TAB ── */
  if (tab === "Claim") {
    const vLower = v.toLowerCase();

    /* Word-boundary safe checks using split+includes instead of regex */
    const words = vLower.split(/\W+/);   /* split on non-word chars */

    const falseWords  = ["hoax","conspiracy","fraud","scam","arrested","leaked","exposed"];
    const falsePhrases = ["they dont want","government hiding","secret cure","deep state","banned all","bans all"];
    const trueWords   = ["inflation","gdp","research","study","statistics","report","confirmed","announced","official"];

    const hasFalseWord   = falseWords.some(w => words.includes(w));
    const hasFalsePhrase = falsePhrases.some(p => vLower.includes(p));
    const hasTrueWord    = trueWords.some(w => words.includes(w));

    if ((hasFalseWord || hasFalsePhrase) && !hasTrueWord) return DEMO.claimFalse;
    return DEMO.claimTrue;
  }

  /* ── IMAGE TAB ── */
  if (tab === "Image") {
    const vLower = v.toLowerCase();
    const words  = vLower.split(/\W+/);

    const fakeWords = ["fake","manipulated","deepfake","altered","photoshop","edited","composite","spliced"];
    const realWords = ["authentic","original","verified","official","unedited","genuine"];

    const hasFake = fakeWords.some(w => words.includes(w));
    const hasReal = realWords.some(w => words.includes(w)) || vLower.includes("afp") || vLower.includes("reuters");

    if (hasFake && !hasReal) return DEMO.imageManipulated;
    if (hasReal)             return DEMO.imageAuthentic;
    return DEMO.imageManipulated;  /* default: show the more instructive demo */
  }

  return DEMO.trusted;
}


/* ─────────────────────────────────────────────────────────────
   UI STATE
───────────────────────────────────────────────────────────── */
let currentTab = "URL";

/* ── TAB SWITCHER ── */
function setTab(tab) {
  currentTab = tab;
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
  const tabEl   = document.getElementById("tab-" + tab.toLowerCase());
  const panelEl = document.getElementById("panel-" + tab);
  if (tabEl)   tabEl.classList.add("active");
  if (panelEl) panelEl.classList.add("active");
  /* Hide results when switching tabs */
  const ra = document.getElementById("results-area");
  if (ra) ra.classList.remove("visible");
  const li = document.getElementById("loader-inner");
  if (li) li.classList.remove("active");
}

/* ── DEMO FILL HELPERS (hint links) ── */
function fillDemo(val)  { setTab("URL");   document.getElementById("url-input").value   = val; }
function fillClaim(val) { setTab("Claim"); document.getElementById("claim-input").value = val; }
function fillImage(val) { setTab("Image"); document.getElementById("image-input").value = val; }


/* ─────────────────────────────────────────────────────────────
   LOADER
───────────────────────────────────────────────────────────── */
function setLoaderSteps(data) {
  data.loaderSteps.forEach((text, i) => {
    const el = document.getElementById("ls" + (i+1) + "-text");
    if (el) el.textContent = text;
  });
  const lt = document.getElementById("loader-text");
  if (lt) lt.textContent =
    currentTab === "Image" ? "Analysing image integrity…" :
    currentTab === "Claim" ? "Fact-checking claim…" :
    "Verifying source…";
}

function animateLoaderSteps() {
  return new Promise(resolve => {
    const ids = ["ls1","ls2","ls3","ls4"];
    ids.forEach(id => { document.getElementById(id).className = "loader-step"; });
    let i = 0;
    const iv = setInterval(() => {
      if (i > 0) {
        const prev = document.getElementById(ids[i-1]);
        prev.classList.remove("active");
        prev.classList.add("done");
      }
      if (i < ids.length) {
        document.getElementById(ids[i]).classList.add("active");
        i++;
      } else {
        document.getElementById(ids[ids.length-1]).classList.replace("active","done");
        clearInterval(iv);
        resolve();
      }
    }, 550);
  });
}

function triggerScan() {
  const line = document.getElementById("scan-line");
  if (!line) return;
  line.classList.remove("active");
  void line.offsetWidth;
  line.classList.add("active");
}


/* ─────────────────────────────────────────────────────────────
   RENDER RESULTS
───────────────────────────────────────────────────────────── */
function renderScore(d) {
  const ring = document.getElementById("ring-fill");
  ring.style.stroke = d.scoreColor;
  ring.style.strokeDashoffset = 283 - (d.score / 100) * 283;
  const num = document.getElementById("score-num");
  num.textContent = d.score;
  num.style.color = d.scoreColor;
  const vt = document.getElementById("verdict-text");
  vt.textContent = d.verdict;
  vt.style.color  = d.scoreColor;
  document.getElementById("verdict-sub").textContent = d.verdictSub;
}

function setPanel(valId, subId, pillId, val, sub, pill) {
  document.getElementById(valId).textContent = val;
  document.getElementById(subId).textContent = sub;
  const p = document.getElementById(pillId);
  p.textContent = pill[0];
  p.className   = "status-pill " + pill[1];
}

function renderPanels(d) {
  setPanel("source-name","source-age","source-pill", d.sourceName, d.sourceAge, d.sourcePill);
  setPanel("media-val",  "media-sub", "media-pill",  d.mediaVal,   d.mediaSub,  d.mediaPill);
  setPanel("fc-val",     "fc-sub",    "fc-pill",     d.fcVal,      d.fcSub,     d.fcPill);
}

function renderBars(bars) {
  bars.forEach((v, i) => {
    setTimeout(() => {
      document.getElementById("bar"   + (i+1)).style.width = v + "%";
      document.getElementById("score" + (i+1)).textContent = v + "%";
    }, 200 + i * 120);
  });
}

function renderFactChecks(fcs) {
  const icons = { true:"✅", false:"❌", mixed:"⚠️" };
  const cls   = { true:"fc-icon-true", false:"fc-icon-false", mixed:"fc-icon-mixed" };
  document.getElementById("fc-list").innerHTML =
    `<div class="signals-title">// Related fact-checks</div>` +
    fcs.map(fc => `
      <div class="factcheck-item">
        <div class="fc-icon ${cls[fc.type]}">${icons[fc.type]}</div>
        <div class="fc-text">
          <div class="fc-claim">${fc.claim}</div>
          <div class="fc-note">${fc.note}</div>
          <span class="fc-source">↗ ${fc.src}</span>
        </div>
      </div>`).join("");
}

function renderImagePanel(d) {
  const panel = document.getElementById("image-result-panel");
  if (!panel) return;
  if (currentTab !== "Image" || !d.imageAnalysis) { panel.style.display = "none"; return; }
  panel.style.display = "block";
  const ia = d.imageAnalysis;
  const col = ia.confidence > 50 ? "var(--danger)" : "var(--accent)";
  document.getElementById("image-analysis-content").innerHTML = `
    <div class="img-analysis-grid">
      <div class="img-analysis-box">
        <div class="img-analysis-label">Manipulation Confidence</div>
        <div class="img-analysis-value" style="color:${col}">${ia.confidence}%</div>
        <div class="img-manipulation-bar">
          <div class="img-manipulation-fill" id="manip-bar" style="width:0%;background:${col}"></div>
        </div>
      </div>
      <div class="img-analysis-box">
        <div class="img-analysis-label">ELA Score</div>
        <div class="img-analysis-value" style="color:${col}">${ia.elaScore.split("—")[0]}</div>
        <div class="img-analysis-sub">${ia.elaScore}</div>
      </div>
      <div class="img-analysis-box">
        <div class="img-analysis-label">Original Source</div>
        <div class="img-analysis-value" style="font-size:13px">${ia.originalSrc}</div>
      </div>
      <div class="img-analysis-box">
        <div class="img-analysis-label">Techniques Detected</div>
        <div class="img-analysis-value" style="font-size:13px">${ia.techniques.join(", ")}</div>
      </div>
    </div>
    <a href="photo-verify.html" class="reveal-cta-inline">🖼 See full reveal slider →</a>`;
  setTimeout(() => {
    const bar = document.getElementById("manip-bar");
    if (bar) bar.style.width = ia.confidence + "%";
  }, 300);
}

function showResults(d) {
  const area = document.getElementById("results-area");
  area.classList.add("visible");
  area.scrollIntoView({ behavior:"smooth", block:"start" });
  setTimeout(() => {
    renderScore(d);
    renderPanels(d);
    renderBars(d.bars);
    renderFactChecks(d.factchecks);
    renderImagePanel(d);
    document.getElementById("summary-text").innerHTML = d.summary;
  }, 100);
}


/* ─────────────────────────────────────────────────────────────
   MAIN VERIFY FUNCTION
───────────────────────────────────────────────────────────── */
async function runVerification(tab) {
  /* Read value from the correct input */
  const inputMap = { URL:"url-input", Claim:"claim-input", Image:"image-input" };
  const inputEl  = document.getElementById(inputMap[tab]);
  const value    = inputEl ? inputEl.value.trim() : "";

  /* Empty input — shake the box */
  if (!value) {
    const wrap = inputEl && inputEl.closest(".input-wrapper");
    if (wrap) {
      wrap.style.borderColor = "rgba(255,92,92,0.6)";
      setTimeout(() => { wrap.style.borderColor = ""; }, 1400);
    }
    return;
  }

  const loader  = document.getElementById("loader-inner");
  const results = document.getElementById("results-area");
  results.classList.remove("visible");
  loader.classList.add("active");
  triggerScan();

  const data = pickResult(tab, value);
  setLoaderSteps(data);
  await animateLoaderSteps();
  await new Promise(r => setTimeout(r, 400));
  loader.classList.remove("active");
  showResults(data);
}


/* ─────────────────────────────────────────────────────────────
   MINI REVEAL SLIDER (index page teaser)
───────────────────────────────────────────────────────────── */
function updateMiniSlider(val) {
  const fake    = document.getElementById("mini-fake");
  const divider = document.getElementById("mini-divider");
  if (!fake || !divider) return;
  fake.style.width    = (100 - val) + "%";
  divider.style.left  = val + "%";
}


/* ─────────────────────────────────────────────────────────────
   BOOT
───────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {

  /* Enter key on each input */
  const bindings = [
    { id:"url-input",    tab:"URL" },
    { id:"image-input",  tab:"Image" },
  ];
  bindings.forEach(({ id, tab }) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("keydown", e => {
      if (e.key === "Enter") runVerification(tab);
    });
  });
  /* Claim textarea: Enter submits, Shift+Enter = newline */
  const claimEl = document.getElementById("claim-input");
  if (claimEl) claimEl.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      runVerification("Claim");
    }
  });

  /* Init mini slider at 50% */
  updateMiniSlider(50);
});
