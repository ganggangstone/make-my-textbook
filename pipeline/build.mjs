// Book Markdown → book HTML (input for Vivliostyle)
// Usage: node build.mjs   → dist/book.html
//
// ============================================================
// EDIT THIS BLOCK FOR EVERY NEW BOOK. Everything below it is
// generic and should not need per-book changes.
// ============================================================
// 원고 파일. 한 권이 여러 파일로 나뉘면 배열로 준다(순서대로 이어 붙인다).
// 같은 원고에서 샘플판(일부 장)과 완성판(전 장)을 뽑을 때 이 목록만 바꾸면 된다.
const SRC = "../manuscript.md";
const LANG = process.env.BOOK_LANG || "ko"; // "ko" | "en" — set with BOOK_LANG=en; picks lang/<LANG>.mjs and theme/lang-<LANG>.css
const bookTitleFallback = "Untitled book";
const coverEyebrow = "SUBTITLE OR SERIES NAME";
const coverBig = "AI"; // 1-3 short characters shown large on the cover
const coverSubtitle = ""; // one line under the title, HTML allowed
const sourceLine = ""; // shown in cover meta, e.g. the manuscript filename
// Series branding. Both optional — leave empty for a standalone book.
// A cover that has to survive as a small thumbnail in a store listing needs
// the series band and volume number; a book read only as a PDF does not.
const seriesName = ""; // e.g. "Minimum Basics for Vibe Coders"
const volumeLabel = ""; // e.g. "01"
const coverAuthorLine = ""; // 표지 하단. 저자와 한 줄 이력(무명 저자에게는 이게 신뢰의 근거다)
// 표지에 크게 싣는 인용. 이 책에서 가장 중요한 문장을 본문에서 그대로 가져온다.
// 줄바꿈은 <br>로 직접 잡는다(표지 인용은 자동 줄바꿈에 맡기지 않는다).
const coverQuote = "";
// Optional: English (or romanized) subtitle per chapter number, shown as a
// small eyebrow next to the chapter number. Leave {} to skip it.
const CHAP_EN = {};
// ============================================================

import fs from "node:fs";
import path from "node:path";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
if (!fs.existsSync(new URL(`./lang/${LANG}.mjs`, import.meta.url)) || !fs.existsSync(new URL(`./theme/lang-${LANG}.css`, import.meta.url))) {
  console.error(`ERROR: no language profile for BOOK_LANG=${LANG}.\n` +
    `Copy lang/en.mjs to lang/${LANG}.mjs and theme/lang-en.css to theme/lang-${LANG}.css, translate the labels and\n` +
    `heading formats, pick fonts and line-breaking rules for that language, then run again. (Profiles that exist: ko, en.)`);
  process.exit(1);
}
const { htmlLang, LABELS, headings: H } = (await import(`./lang/${LANG}.mjs`)).default;
const GRADE_KEYS = ["confirmed", "general", "inferred", "measured", "absent", "community", "code", "comment", "design"];
const warnings = []; // printed at the end; nothing here stops the build
const escRe = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const Prism = require("prismjs");
require("prismjs/components/prism-yaml");
require("prismjs/components/prism-json");
require("prismjs/components/prism-bash");

// --- syntax highlighting (build-time, Prism) -------------------------------
// "text" fences (prompt templates, diagrams) are escaped but not colored.
const esc = t => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function highlightBlock(str, info) {
  const code = str.replace(/\n$/, "");
  const lang = (info || "").trim().toLowerCase();
  const g = Prism.languages[lang];
  const inner = g && lang !== "text" ? Prism.highlight(code, g, lang) : esc(code);
  return `<pre class="code lang-${lang || "text"}"><code>${inner}</code></pre>`;
}

const OUT = path.resolve("dist/book.html");

let md = (Array.isArray(SRC) ? SRC : [SRC])
  .map(f => fs.readFileSync(path.resolve(f), "utf8").replace(/\s*$/, ""))
  .join("\n\n");

// --- 1. preprocessing -------------------------------------------------------
// The title line (first h1) moves to the cover
const titleMatch = md.match(/^# (.+)\n/);
const bookTitle = titleMatch ? titleMatch[1] : bookTitleFallback;
md = md.replace(/^# .+\n/, "");

// The page template already wraps the front matter in an
// "<h2>${LABELS.frontHeading}</h2>" — if the manuscript repeats that same
// heading right at the top, drop the manuscript's copy so it isn't shown
// twice.
md = md.replace(new RegExp(`^##\\s*${LABELS.frontHeading}\\s*\\n`, "m"), "");

// Divider lines (---) between chapters are noise once paginated — strip
// them outside code fences only.
{
  const lines = md.split("\n"); let fence = false;
  md = lines.filter(l => { if (/^```/.test(l)) { fence = !fence; return true; } return fence || !/^---\s*$/.test(l); }).join("\n");
}

// A manual "**차례**" (table of contents) list in the front matter is
// redundant once the auto TOC below exists — drop it.
md = md.replace(new RegExp(`\\*\\*${LABELS.toc}\\*\\*\\n(?:- .+\\n|  .+\\n)+`, "m"), "");

// Footnotes: keep the manuscript's own numbering. Pull out definition
// lines ([^n]: …) and turn references ([^n]) into superscript links.
// A footnote definition continued on the next line (indented or not) loses its second line: it
// ends up as body text or a code block. Stop instead of building a book with a cut-off footnote.
{ const bad = md.match(/^\[\^\d+\]: .*\n(?!\[\^\d+\]:)[^\n]+/m);
  if (bad) { console.error(`ERROR: a footnote definition continues on the next line. Write each definition on one line and leave a blank line after the last one:\n  ${bad[0].split("\n")[0].slice(0, 80)}`); process.exit(1); } }
const fnDefs = new Map();
md = md.replace(/^\[\^(\d+)\]: (.+)$/gm, (_, n, t) => { fnDefs.set(n, t); return ""; });
const fnRefCount = new Map();
md = md.replace(/\[\^(\d+)\]/g, (_, n) => {
  const k = (fnRefCount.get(n) || 0) + 1; fnRefCount.set(n, k);
  return `<sup class="footnote-ref"><a href="#fn-${n}" id="fnref-${n}-${k}">${n}</a></sup>`;
});

// --- 2. 렌더 --------------------------------------------------------------
let hid = 0;
const headings = []; // {level, text, id}
const mdit = new MarkdownIt({ html: true, linkify: false, typographer: false, highlight: highlightBlock })
  .use(anchor, {
    level: [1, 2, 3, 4],
    slugify: () => `h-${++hid}`,
    callback: (token, info) => headings.push({ level: token.tag, text: info.title, id: info.slug }),
  });

// 인라인 코드: 경로·파일 이름은 색 없이, 짧은 것은 줄 끝에서 끊지 않는다
mdit.renderer.rules.code_inline = (tokens, idx) => {
  const c = tokens[idx].content;
  const isPath = /[\/]|\.(md|json|ya?ml|py|js|mjs|svg|pdf)$/.test(c) && !/\s/.test(c);
  let inner = esc(c);
  const cls = c.length > 26 ? "long" : "short";
  if (cls === "long") inner = inner.replace(/([.\/_])(?![^<]*>)/g, "$1<wbr>");
  return `<code class="inl ${cls}${isPath ? " path" : ""}">${inner}</code>`;
};

let html = mdit.render(md);

// Append the footnote list at the end of the body
const fnOrder = [...fnDefs.keys()].sort((a, b) => Number(a) - Number(b));
const fnHtml = `<section class="footnotes"><ol class="footnotes-list">` + fnOrder.map(n =>
  `<li id="fn-${n}" class="footnote-item"><span class="fn-no">${n}</span> ${mdit.renderInline(fnDefs.get(n))}` +
  (fnRefCount.get(n) ? ` <a href="#fnref-${n}-1" class="footnote-backref">↩</a>` : "") + `</li>`).join("\n") + `</ol></section>`;
html = html + fnHtml;
console.log(`footnotes defs=${fnDefs.size} refs=${[...fnRefCount.values()].reduce((a,b)=>a+b,0)}`);
for (const n of fnRefCount.keys()) if (!fnDefs.has(n)) warnings.push(`footnote [^${n}] is referenced but has no definition`);
for (const n of fnDefs.keys()) if (!fnRefCount.has(n)) warnings.push(`footnote [^${n}] is defined but never referenced`);

// --- 3. postprocessing ------------------------------------------------------
// Chapter number split: <h2 id>Chapter 12. Title</h2> → big number + title + eyebrow.
// H.chapterPat (from lang/<LANG>.mjs) has one capture group, the number.
// CHAP_EN (from the config block at the top) supplies the optional eyebrow text.
html = html.replace(new RegExp(`<h2 id="([^"]+)"([^>]*)>${H.chapterPat}\\.?\\s*([^<]*)</h2>`, "g"), (m, id, attr, n, t) =>
  `<h2 id="${id}"${attr} data-eyebrow="CHAPTER ${String(n).padStart(2, "0")}${CHAP_EN[n] ? " — " + CHAP_EN[n] : ""}"><span class="chap-no">${String(n).padStart(2, "0")}</span> <span class="chap-t">${t}</span></h2>`);
// Appendix: an English eyebrow instead of a big number
html = html.replace(new RegExp(`<h2 id="([^"]+)"([^>]*)>${escRe(H.appendixWord)} ([A-Z](?:·[A-Z])?)\\.?\\s*([^<]*)</h2>`, "g"), (m, id, attr, a, t) =>
  `<h2 id="${id}"${attr} data-eyebrow="APPENDIX ${a.replace(/·/g, " · ")}"><span class="chap-t">${H.appendixWord} ${a}. ${t}</span></h2>`);
// 용어 사전처럼 번호 없는 장
html = html.replace(new RegExp(`<h2 id="([^"]+)"((?![^>]*data-eyebrow)[^>]*)>((?:(?!</h2>)[\\s\\S])*?${LABELS.glossaryHeading}(?:(?!</h2>)[\\s\\S])*?)</h2>`, "g"),
  '<h2 id="$1"$2 data-eyebrow="GLOSSARY"><span class="chap-t">$3</span></h2>');
// Part: English eyebrow + part number
html = html.replace(new RegExp(`<h1 id="([^"]+)"([^>]*)>${H.partPat}\\.\\s*([^<]*)</h1>`, "g"), (m, id, attr, n, t) =>
  `<h1 id="${id}"${attr} data-eyebrow="PART ${String(n).padStart(2, "0")}"><span class="part-no">${H.partNo(n)}</span> <span class="part-t">${t}</span></h1>`);
html = html.replace(new RegExp(`<h1 id="([^"]+)"((?![^>]*data-eyebrow)[^>]*)>${escRe(H.appendixWord)}</h1>`, "g"),
  `<h1 id="$1"$2 data-eyebrow="APPENDIX"><span class="part-no">${H.appendixWord}</span> <span class="part-t">${H.appendixH1Title}</span></h1>`);
// 절 번호(1.1)를 따로 떼어 작은 모노 글자로
html = html.replace(/(<h3 id="[^"]+"[^>]*>)(\d+\.\d+) /g, '$1<span class="sec-no">$2</span> ');
// 장 첫 쪽에서 왼쪽 머리글을 숨기려고, 부 제목을 장 h2에도 실어 first-except로 읽는다
{ let part = "";
  html = html.replace(/<h1 id="[^"]+"[^>]*>[\s\S]*?<span class="part-t">([^<]*)<\/span><\/h1>|<h2 id=/g, (m, t) => {
    if (t !== undefined) { part = t; return m; }
    return `<h2 data-part="${part}" id=`;
  }); }
// Translation captions: a paragraph starting with the translation prefix
// (e.g. "역: ") is a caption paragraph; the same prefix inside "(...)" is
// an inline caption.
{
  const tr = LABELS.translationPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  html = html.replace(new RegExp(`<p>${tr} `, "g"), '<p class="tr">').replace(new RegExp(`<li>${tr} `, "g"), '<li class="tr">');
  html = html.replace(new RegExp(`\\n${tr} (.*?)(?=\\n|</p>|</li>|</td>)`, "g"), '<span class="tr-line">$1</span>');
  html = html.replace(new RegExp(`\\(${tr} ((?:[^()]|\\([^()]*\\))+)\\)`, "g"), '<span class="tr-inline">$1</span>');
}
// Figures: <figure data-fig="n"> caption numbers are written directly in
// the markdown, so this hook is a no-op placeholder for custom numbering.
html = html.replace(/<figcaption>/g, (m, off) => m);
// Evidence-grade capsules, e.g. [확정] / [일반] / ...
html = html.replace(new RegExp(`\\[(${LABELS.grades.join("|")})\\]`, "g"), (_, g) => `<span class="grade grade-${GRADE_KEYS[LABELS.grades.indexOf(g)]}">${g}</span>`);
// "**<goal label>.**" / "**<exercise label> n.**" paragraphs get a class
html = html.replace(new RegExp(`<p><strong>${LABELS.goal}\\.</strong>`, "g"), `<p class="goal"><strong>${LABELS.goal}.</strong>`);
html = html.replace(new RegExp(`<p><strong>${LABELS.exercisePrefix} ([\\d.]+)\\.</strong>`, "g"), `<p class="exercise"><strong>${LABELS.exercisePrefix} $1.</strong>`);
// "**<concept label>: 이름.**" — the chapter skeleton's concept block. The
// label becomes a small tag and the term is set larger, so a reader can find
// where concepts start by scanning. Inline code inside the term is kept.
if (LABELS.conceptPrefix) {
  const cp = LABELS.conceptPrefix;
  html = html.replace(new RegExp(`<p><strong>${cp}:\\s*((?:(?!</strong>)[\\s\\S])*?)</strong>`, "g"),
    (m, name) => `<p class="concept"><span class="concept-tag">${cp}</span><strong class="concept-name">${name.replace(/\.\s*$/, "")}</strong>`);
}
// "**<review label> N.**" paragraph + the numbered list right after it, boxed
html = html.replace(new RegExp(`<p><strong>${LABELS.reviewPrefix} ([^<]+)\\.</strong>([\\s\\S]*?)</p>\\n<ol>([\\s\\S]*?)</ol>`, "g"), `<div class="review"><p class="review-title"><strong>${LABELS.reviewPrefix} $1.</strong>$2</p><ol>$3</ol></div>`);
// Comparison-list badges: a paragraph that is exactly one of LABELS.badges
// ("왜?" etc.) becomes a small badge instead of ordinary body text.
for (const b of LABELS.badges || []) {
  const esc = b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  html = html.replace(new RegExp(`<p>${esc}</p>`, "g"), `<p class="badge-line"><span class="badge-q">${b}</span></p>`);
}
// "> **<quote-source label>.**" blockquote emphasis
html = html.replace(new RegExp(`<blockquote>\\n<p><strong>${LABELS.quoteSrc}\\.</strong>`, "g"), `<blockquote class="quote-src">\n<p><strong>${LABELS.quoteSrc}.</strong>`);
// Wrap the "source excerpts" part (marked by part4Marker) in its own div,
// from that h1 up to the next h1. Skipped if part4Marker is empty.
if (LABELS.part4Marker) {
  html = html.replace(new RegExp(`(<h1 id="[^"]+"[^>]*>(?:(?!</h1>)[\\s\\S])*?${LABELS.part4Marker}(?:(?!</h1>)[\\s\\S])*?</h1>[\\s\\S]*?)(?=<h1 id=)`), '<div class="part-4">$1</div>');
}


// --- glossary ↔ first-appearance-in-body linking --------------------------
{
  const gh = html.match(new RegExp(`<h2 [^>]*id="(h-\\d+)"[^>]*>(?:(?!</h2>)[\\s\\S])*?${LABELS.glossaryHeading}(?:(?!</h2>)[\\s\\S])*?</h2>`));
  if (gh) {
    const gStart = html.indexOf(gh[0]);
    const after = html.slice(gStart + gh[0].length);
    const nextHead = after.search(/<h[12] id=/);
    const gEnd = gStart + gh[0].length + (nextHead < 0 ? after.length : nextHead);
    let gloss = html.slice(gStart, gEnd);
    const entries = [];
    let gi = 0;
    gloss = gloss.replace(/<p><strong>([^<]+)<\/strong> —/g, (m, head) => {
      gi += 1;
      const id = `gl-${gi}`;
      // 표제어에서 검색어 추출: "/"로 나뉜 것 각각, 괄호 앞 부분, 괄호 안 영어
      const terms = [];
      const sym = (t) => /^[^\p{L}\p{N}\s]$/u.test(t); // √·ᵀ·≈·κ 같은 한 글자 기호
      const parts = []; { let d = 0, cur = ""; for (const ch of head) { if (ch === "(") d++; if (ch === ")") d--; if (ch === "/" && d === 0) { parts.push(cur); cur = ""; } else cur += ch; } parts.push(cur); }
      for (const part of parts) {
        const ko = part.replace(/\(.*?\)/g, "").trim();
        if (ko.length >= 1 || sym(ko)) terms.push(ko);
        const en = (part.match(/\(([^)]+)\)/) || [])[1];
        if (en) for (const e of en.split(/[,،\/]/)) { const t0 = e.trim(); if (sym(t0)) { terms.push(t0); continue; } const t = t0.replace(/^[^A-Za-z]*/, "").trim(); if (t.length >= 3) terms.push(t); }
      }
      entries.push({ id, terms });
      return `<p id="${id}"><strong>${head}</strong> <a class="gl-first" href="#${id}-ref"></a> —`;
    });
    // 본문(용어 사전 제외)에서 첫 등장 찾기: 태그 밖 텍스트만, 제목·코드·캡션·링크 안 제외
    const before = html.slice(0, gStart), rest = html.slice(gEnd);
    // A term must not sit inside a longer word — otherwise a Latin term like
    // "dot product" matches inside "dot products" and splits off a stray "s".
    const isWordChar = c => c !== undefined && /[\p{L}\p{N}]/u.test(c);
    const findWholeTerm = (t, term) => {
      let from = 0;
      while (true) {
        const idx = t.indexOf(term, from);
        if (idx < 0) return -1;
        if (!isWordChar(t[idx - 1]) && !isWordChar(t[idx + term.length])) return idx;
        from = idx + 1;
      }
    };
    const linkFirst = (src, ent) => {
      const re = /(<[^>]+>)|([^<]+)/g;
      let out = "", depthSkip = 0, done = false, m;
      // blockquote.quote-src is a verbatim source excerpt — inserting a
      // glossary link inside it would alter quoted text, so it is skipped.
      const skipOpen = /^<(h[1-6]|code|pre|figcaption|a|nav|blockquote class="quote-src"|section class="cover"|section class="footnotes")\b/;
      const skipClose = /^<\/(h[1-6]|code|pre|figcaption|a|nav|blockquote|section)>/;
      while ((m = re.exec(src)) !== null) {
        if (m[1]) { if (skipOpen.test(m[1])) depthSkip++; else if (skipClose.test(m[1]) && depthSkip > 0) depthSkip--; out += m[1]; continue; }
        let t = m[2];
        if (!done && depthSkip === 0) {
          for (const term of ent.terms) {
            const idx = findWholeTerm(t, term);
            if (idx >= 0) {
              t = t.slice(0, idx) + `<a class="gl" id="${ent.id}-ref" href="#${ent.id}">${term}</a>` + t.slice(idx + term.length);
              done = true; break;
            }
          }
        }
        out += t;
      }
      return { out, done };
    };
    let b1 = before, b2 = rest, hit = 0;
    for (const ent of entries) {
      let r = linkFirst(b1, ent);
      if (r.done) { b1 = r.out; hit++; continue; }
      r = linkFirst(b2, ent);
      if (r.done) { b2 = r.out; hit++; }
      else { gloss = gloss.replace(`<a class="gl-first" href="#${ent.id}-ref"></a> `, ""); console.log("  unlinked:", ent.terms.join("|")); }
    }
    html = b1 + gloss + b2;
    console.log(`glossary entries=${entries.length} linked=${hit}`);
  }
}

// --- 4. 목차 --------------------------------------------------------------
const tocItems = headings
  .filter(h => h.level !== "h4")
  .map(h => {
    const lv = h.level === "h1" ? "lv1" : h.level === "h2" ? "lv2" : "lv3";
    const text = h.text.replace(/<[^>]+>/g, "");
    return `<li class="${lv}"><a href="#${h.id}"><span class="t">${text}</span><span class="dots"></span></a></li>`;
  }).join("\n");

// 머리말(첫 h1 이전 본문)을 front로 분리
const firstPart = html.search(/<h1 id=/);
const front = html.slice(0, firstPart);
const body = html.slice(firstPart);

// SOURCE_DATE_EPOCH (seconds) pins the date printed on the cover, so a rebuild gives the same book.
const today = new Date(process.env.SOURCE_DATE_EPOCH ? Number(process.env.SOURCE_DATE_EPOCH) * 1000 : Date.now()).toISOString().slice(0, 10);
const page = `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
<meta charset="utf-8">
<title>${bookTitle}</title>
<link rel="stylesheet" href="../theme/book.css">
<link rel="stylesheet" href="../theme/lang-${LANG}.css">
</head>
<body>
<section class="cover${seriesName ? " cover-series" : ""}">
  ${seriesName ? `<div class="series-band"><span class="series-name">${seriesName}</span>${volumeLabel ? `<span class="series-vol">${volumeLabel}</span>` : ""}</div>` : ""}
  ${coverEyebrow ? `<div class="eyebrow">${coverEyebrow}</div>` : ""}
  ${coverBig ? `<div class="cover-big">${coverBig}</div>` : ""}
  <h1 class="title">${bookTitle.replace(/^([^—:]+?)(?: — |: )(.+)$/, '<span class="hl">$1</span><br>$2')}</h1>
  <div class="subtitle">${coverSubtitle}</div>
  ${coverQuote ? `<blockquote class="cover-quote">${coverQuote}</blockquote>` : ""}
  ${coverAuthorLine ? `<div class="author-line">${coverAuthorLine}</div>` : ""}
  <div class="meta">${seriesName ? "" : `BUILD ${today}`}${sourceLine ? `${seriesName ? "" : "<br>"}${sourceLine}` : ""}</div>
</section>
<section class="front">
<h2>${LABELS.frontHeading}</h2>
${front}
</section>
<nav class="toc">
<h2>${LABELS.toc}</h2>
<ol>
${tocItems}
</ol>
</nav>
${body}
</body>
</html>`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, page);
// Things the build could not recognise. Each of these produces a book that looks fine but is
// wrong, so say so here.
const count = (re) => (html.match(re) || []).length;
if (count(/data-eyebrow="CHAPTER /g) === 0) warnings.push(`no chapter heading matched "${H.chapterPat}" (BOOK_LANG=${LANG}). Wrong BOOK_LANG for this manuscript, or a different heading style?`);
if (count(/data-eyebrow="PART /g) === 0) warnings.push(`no part heading matched "${H.partPat}" (BOOK_LANG=${LANG})`);
if (!html.includes(LABELS.glossaryHeading)) warnings.push(`no "${LABELS.glossaryHeading}" section found`);
for (const [name, re] of [["goal", /class="goal"/g], ["exercise", /class="exercise"/g], ["review", /class="review"/g]])
  if (count(re) === 0) warnings.push(`0 ${name} blocks recognised (label in lang/${LANG}.mjs must match the manuscript exactly)`);
{ // bracketed words that differ from a grade label only by case
  const seen = new Set();
  for (const m of md.matchAll(/\[([^\]\n]{2,20})\]/g)) {
    const w = m[1];
    if (!LABELS.grades.includes(w) && LABELS.grades.some(g => g.toLowerCase() === w.toLowerCase()) && !seen.has(w)) { seen.add(w); warnings.push(`"[${w}]" is not a grade label (labels are case-sensitive: ${LABELS.grades.map(g => `[${g}]`).join(" ")})`); }
  }
}
for (const w of warnings) console.warn("WARNING:", w);
console.log(`ok ${OUT} headings=${headings.length}${warnings.length ? ` warnings=${warnings.length}` : ""}`);
