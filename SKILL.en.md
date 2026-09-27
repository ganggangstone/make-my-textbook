---
name: source-grounded-textbook
description: Writes a complete textbook, pitched to a specific reader, from a fixed body of source material (a codebase, or papers and official documentation), with every claim traceable to that source through footnotes. Use when asked to "turn this code / these papers into a textbook".
disable-model-invocation: true
---

# Writing a Source-Grounded Textbook

This skill produces a textbook grounded in the source (code or literature), in which a reader can
follow a footnote from any sentence back to its evidence. Do not invent a table of contents first
and fill it in; start from actual lines of code or actual sentences in the source and let the
concepts come out of them.

This skill requires only traceable evidence, the review procedure, and writing quality. It does
not set personal stylistic taste. Rules come in two kinds:

- **Required**: rules not marked "(default)". They always apply, whatever the reader or the
  project. When a rule names a Step 0-N, that answer sets only the value the rule points to (a
  degree, a number, a position, a format); it does not decide whether the rule applies.
- **Default**: items marked "(default)". Show them to the user in Step 0; the user can change or
  drop them.

## Step 0. Ask before you start (never skip)

Write the book in the language the user writes in; if it is unclear whether they want another language, ask. Confirm the 13 items below with the user before doing any work. If the user has already answered
an item, do not ask it again. If an item has no answer, do not fill it with a guess: a guessed
default quietly decides the direction of the whole book. Where an item lists a default, show the
default and ask whether to keep it.

**Quick path and detailed path.** Start by asking "Start quickly, or decide the details?" The quick
path does not ask the 13 items one by one. It asks four things: the kind and scope of the source
(1 and 2), where the reader starts (3), and where the reader should end up (4). Item 5 (purpose)
is set from the kind of source: for code, so the reader can read and modify that code; for
literature, so the reader can read the original papers unaided. Items 6 to 13 take the defaults
below.

- 6: one diagram per concept named in the learning objective; analogies only when the explanation
  does not work without them.
- 7: teach for understanding and only flag what must be memorized.
- 8: evidence marks on.
- 9: quote the source verbatim with a translation caption.
- 10: quick checks right after each concept block, answers at the back of the book, read on screen.
- 11: no length limit.
- 12: keep every style and structure default listed below.
- 13: Markdown manuscript plus PDF.

Show the filled-in values as one numbered list in a single message and ask "Start with these? Tell
me the numbers you want to change." Do not start writing before the user confirms. Defaults that
were shown and confirmed this way are not guesses. Item 6 is an item that must be asked on the
detailed path, but on the quick path it takes this default. After the first chapter is written, ask
once more whether the direction is right. If the user picks the detailed path, ask all 13 items
below.

1. **Kind of source.** A codebase, papers and official documentation, or a mix. (This selects a
   branch under "Rules by source type".)
2. **Scope of the source.** For code: which version of the code to work from (if the user does
   not know, "the latest" is a fine answer; the book is then pinned to the version current when
   work starts). For literature: which papers and documents, and whether unofficial secondary
   sources (blog posts, community write-ups) may be cited as evidence.
3. **Where the reader starts.** What the reader already knows and what they don't, stated
   concretely: "high-school algebra, nothing beyond", "can program, but has never used this
   language". Do not settle for "a beginner". People mean very different things by that word, so
   it cannot set the level of the book.
4. **Where the reader should end up.** The level of understanding the reader should reach by the
   last page: "can modify this code", "can read the original papers unaided", "can hold a
   conversation with a researcher in the field".
5. **Purpose of the book.** Understanding the field as a whole, fully understanding one specific
   target (one codebase, one technique), or both.
6. **Balance of explanation methods.** How many diagrams to use, how much analogy to allow, and
   how deep to go on "why is it this way?" for each concept. People absorb material differently and
   there is no correct default, so always ask.
7. **Memorization versus understanding.** By default, teach for understanding. For items the
   reader has to memorize (for example command names, how to read a symbol, key numbers), ask
   whether to simply flag them or to add separate drill exercises.
8. **Marking the evidence.** Whether to mark each sentence with where its content comes from.
   Example: "This model has 8 attention heads `[confirmed]`" means the source states it as-is (the
   full set of marks is in "Evidence grades" below). A light study guide that does not need
   academic rigor can use plain prose without marks.
9. **How to present source text in another language.** Quote it verbatim with a translation
   caption (default), translate it in full, or summarize it.
10. **Exercises and checks.** Ask three separate questions:
    - (a) Where quick checks go: right after each concept is explained, or only at chapter end.
    - (b) Where answers go: right after the question, at chapter end, or at the back of the book.
      Mention that an answer right after its question reduces the chance to think it through first.
    - (c) Whether the book will be read on paper or on screen. For paper, leave blank space for
      handwritten answers.
11. **Length.** At most how many pages? ("No limit" is an answer.)
12. **Style and structure defaults.** Show the defaults below, each with its example, and ask
    which to keep and which to change.
    - No side trivia: leave out history and anecdotes unrelated to the thing being taught. Example:
      no "where the name comes from" story in the transformer chapter.
    - No teasers that defer the answer. Example: never write "The reason is explained in
      Chapter 3" and move on.
    - No filler signposting. Example: no "In this chapter, we will look at...".
    - No metaphors in headings. Example: "Key-value cache", not "The memory palace".
    - Finish the answer in one sentence. Example: "There is one more state, X, which ..." instead
      of "There is one more state. This is X."
    - One volume: everything in one book, no separate annotations or appendix volume.
    - Concept-density limit: one newly named concept per section (a concept block plus its quick
      check, about half a page). The rule itself is required; only the number can change here.
    - Comparison-list format: "What to check: 1. (criterion) Why?: (reason)".
    - One-line structure summary: before explaining a flow, state it in one line, such as
      "Structure: declaration (A) → hand-off (B) → use (C)".
    - Map at chapter end: if there is an overall structure diagram, repeat it at the end of each
      chapter with only that chapter's part highlighted.
13. **Output format.** What the user wants to receive. The default is a Markdown manuscript plus a
    PDF built with this skill's build pipeline. If the user wants another format (for example a
    web page or a Word file), produce that format.

These answers fill the items marked "(default)" below and the values that rules set through a
Step 0-N.

## Nothing without a purpose (overriding principle, required)

Every definition, comparison, exercise, and figure the reader sees must answer one question: "If
this were missing, what would the reader be unable to do?" If there is no answer, leave it out.
The specific rules below (the concept-density limit, the ban on side trivia, stating the purpose of
each exercise) all follow from this principle; apply it directly to cases they do not cover.

## Rules by source type

### When the source is a codebase

- The default goal is **to make the reader able to read and change this code**. If Step 0-5 also
  includes understanding the field as a whole, add sections that explain the field's concepts, and
  tie each concept to the lines of this code where it is used. Either way, every chapter starts
  from a quotation of a real file at a real line number. Do not explain a concept with made-up
  example code.
- Pin the source to a single commit. If the code changes while you write, the book stays on that
  commit; bringing it up to date is a separate, explicitly scoped task.
- If evidence grades are used (Step 0-8), add three code-specific grades:
  - `[code]`: the code itself is the evidence.
  - `[comment]`: a code comment is the evidence. Mark this separately and treat it as weaker,
    because a comment does not guarantee what the code actually does.
  - `[design]`: a design intent inferred from the code. The code does not settle it.
- Collect evidence by reading and grepping the local repository; do not scrape the web. Only when
  the explanation needs an external document the code depends on (such as a library's official
  docs) do you follow the collection methods for literature below.

### When the source is papers or official documentation

- The goal is **to bring the reader to the point where they can read the original papers and
  documentation on their own**. Read the primary literature (the papers themselves) and the
  official docs directly, and keep three things apart in your notes: what the source says, what
  it does not say, and what secondary sources claim.
- Always cite the source of unofficial information.
- Collection methods differ by site. Pages rendered by JavaScript come back empty from a plain
  fetch and may need a headless browser or an accessibility-tree read. Text behind a paywall
  cannot be retrieved; report that as a fact. Do not create empty placeholder files for material
  you could not get: once obtained and unobtained material are mixed together, nobody can tell
  them apart later. Before starting, check for each site what opens and what is blocked.
- Do not invent numbers. When a figure or example uses a number that is not in the source, label
  it as an illustrative value.

## Evidence grades (required when Step 0-8 says to use them)

Each grade is a tag placed on a sentence:

- `[confirmed]`: stated as-is in the source (the paper, the official document, or the code).
- `[general]`: an established fact in the field.
- `[inferred]`: follows from confirmed or general statements, but has not been directly verified
  for this particular target.
- `[measured]`: observed or measured directly during this work.
- `[community]`: comes from a secondary community source (a blog post, a community write-up). Use
  it only if Step 0-2 allowed such sources as evidence.
- `[not found]`: not found in the material obtained. This means the material you *did not* obtain
  might contain it; it does not mean the thing does not exist. State this definition in the
  book's front matter ("Before You Read"), because readers will otherwise read `[not found]` as "does not exist".

A sentence with no tag reads as a definition or explanation, so every sentence that states a fact
must carry a grade.

Never put `[confirmed]` on something you did not verify. The book's overall conclusion is not
`[confirmed]` either: grades apply to individual sentences, not to a synthesis of many of them.

**When Step 0-8 says not to use grades:** no tags appear, but the rule against asserting what you
did not verify still holds. Where the material lacks something, say so in the prose: "not
confirmed in the material obtained". Mark inferences in the prose too: "this appears to be ...
(the material does not state it directly)".

## Structure of the book

- (default) One volume. Splitting into companion documents (an
  annotations volume, an appendix volume) makes the reader flip between two documents and breaks the
  difficulty ramp. Difficulty rises in steps within that one volume.
- **When the source is literature:** keep author prose (where you re-explain concepts and
  structure in your own words) separate from **source excerpts**. Present excerpts the way the
  user chose in Step 0-9. The default is verbatim, never summarized, with only a translation
  caption added. If translation or summary was chosen, excerpts still stay separate from author
  prose, and a footnote records where in the source each one comes from. Anything restated in
  author prose is later checked against the source, paragraph by paragraph, to confirm that no
  fact, number, or example was lost (see the review procedure).
- **When the source is code:** the author-prose sections are the code-reading sections, and the
  equivalent of a source excerpt is a quotation of the actual code. You may include sections that
  compare the same code with another language, but keep comparison under half of the book: it
  supports understanding and is not what the book is for.
- Cite sources in footnotes. Number them with the original document's footnote numbers if it has
  them, otherwise in order of first citation.
- A deep-dive section that can be skipped (a derivation, a low-level implementation detail) opens
  with "Safe to skip" plus a one-line statement of the conclusion that matters in practice.

## Chapter template (adjust only the "(default)" items and the values set through Step 0-N)

1. **Learning objective.** Do not state the concept's name as the objective; "Know X" is not an
   objective. State what the reader will be able to **do** with the concept: "Understand X and Y
   well enough to Z", where Z is an observable action such as reading, predicting, deciding,
   explaining, or modifying.
2. **Opening excerpt.** Show the real line of code or the quotation from the source first. Do not
   open with a conclusion or definition and attach the evidence afterwards: seeing the evidence
   first is what lets the reader judge for themselves.
3. **Concept block.** Write it as a section, numbered `### N.M Title` (N is the chapter number,
   M the section's order within the chapter). Inside the section: a working example first (the
   output of running the code, an actual number from the source), then the name and definition
   attached to that example, then why it is defined that way. The number of new concepts per
   section follows the limit in "Density of new concepts" (default: one).
4. **Quick check.** If Step 0-10 (a) chose "after each concept", put one or two lines right after
   the concept block, in the same section, separate from the end-of-chapter exercises. If it chose
   "only at chapter end", leave this item out.
5. **Comparison (optional).** When comparing along several criteria, do not write it out as prose.
   Use a numbered list, each criterion followed by its reason. Name each criterion with a noun
   phrase ("Time of check", not "When does it get checked?"). (default) The format is
   "What to check: 1. (criterion) Why?: (reason) 2. (criterion) Why?: (reason)".
6. **Exercises.** Before posing the question, say concretely **why it is worth thinking about**.
   Not an abstract line like "This checks your understanding", but what actually goes wrong if the
   reader misses this condition. Put sub-parts (a, b, c) on separate lines rather than running
   them together in one paragraph, and provide answer space suited to the medium chosen in
   Step 0-10 (c) (print or screen).
7. **Review.** Mostly understanding and prediction questions, not recall. Mix in easy multiple
   choice, true/false, and fill-in-the-blank items.
8. **Answer placement follows Step 0-10 (b).**

## Writing quality (required; items marked "(default)" are adjusted in Step 0-12)

Everything in this section is a symptom of a single defect: **talking around the point instead of
stating it.** Before checking a sentence against the individual items below, run it through one
question:

> **After reading only this sentence, what exactly does the reader now know? If you replace every
> abstract noun, pronoun, and metaphor with the actual value it stands for, does the sentence
> still hold?**

If it does not hold, the sentence is not concrete. In the list of symptoms below (all of the same
problem), items marked "(default)" mix in stylistic preference and can be changed in Step 0-12.
The rest follow directly from the question above and always apply:

- **No split answers (default).** Do not push the answer into the next sentence ("There is one
  more state. This is X."). Finish it in one sentence with a relative clause or apposition
  ("There is one more state, X, which ...").
- **Comparison without the difference.** Do not announce that things differ ("they differ in
  weight", "the strength varies", "it's a matter of degree") without saying how. In the same
  sentence, state the concrete difference: "X does A; Y does B."
- **Describing structure instead of stating it.** Do not write "This flow runs through three files"
  and supply the facts later. State the structure up front. (default) The form is one line:
  "Structure: declaration (A) → hand-off (B) → use (C)."
- **No side trivia (default).** Leave out history or trivia unrelated to the thing being taught. Include it
  only in a deliberate comparison section, and only when the difference from the thing compared
  is what explains a specific design or behavior of the current target.
- **No ambiguous pronouns.** If a heading or sentence says "this", "that", or "it" and the referent
  is not visible right there, repeat the noun.
- **No inanimate things as agents.** Do not make an object the actor ("the data tells us", "this
  result shows"). Say who checked what, or give the result's actual value.
- **One concept per paragraph.** Do not bolt concept B onto the end of an explanation of concept A
  without setup. If B is needed, give it its own block.
- **No teasers or riddles (default).** Do not defer the answer and leave the reader guessing ("The reason
  will become clear later", "This, too, has a name"). Say the term, then give its meaning
  immediately.
  **The test is whether the answer is deferred, not whether a question appears.** Asking "Why is
  it so narrow?" and answering several paragraphs later is banned, because the reader has to guess
  in the meantime. A question answered in the very next sentence ("Why? Because eight of those
  lines live inside the library.") defers nothing and is allowed. Such a question signals "this is
  a spot where people get stuck, and not knowing is normal", and gives the reader a beat to catch
  up. It helps more the lower the reader's starting point, so decide how often to use it from the
  answer to Step 0-3.
- **No undefined coinages.** Before a structural term you coined appears in a section heading,
  define it at least once. Never use the same word in two different senses.
- **Analogies only when necessary.** Use an analogy only when the explanation does not work without
  it (how often is set by Step 0-6). (default) Do not use literary metaphors in chapter or section
  headings; title them with the technical fact itself.
- **No filler (default).** Cut signposting ("In this chapter, we will see..."), significance-asserting
  conclusions ("This is important"), and announcements that you are about to repeat something.
  The test: if deleting the phrase loses no fact, condition, or example, delete it. Transitions
  like "Now, let's take a look at..." and "It's worth noting that..." fail this test too.
- **No vague degree words.** When "appropriately", "enough", "usually", "somewhat", "fairly", or
  "generally" carries a key claim, replace it with a number or a condition. If the material has
  no such number or condition, mark the gap with `[not found]`; in a book without grades
  (Step 0-8), write "not confirmed in the material obtained" in the prose.

Symptoms that look different (inanimate things as agents, stock phrases, teaser sentences) all
come from the same root, so fixing one sentence does not stop it resurfacing in another form a
paragraph later. After editing, read the whole manuscript once more and apply the single question
above to all of it.

## Density of new concepts (required; the limit is adjusted in Steps 0-3 and 0-12)

A page on which several newly named concepts pile up feels hard even when every sentence is
accurate. Introduce one new concept per section (a concept block plus its quick check, about
half a page). If a section would introduce a second one, split the section. "One" is the
default for a low starting point (Step 0-3); for a reader who already knows the field, raise the
limit in Step 0-12. Do not open with the definition. Show a working example first (the output of
running the code, an actual number from the paper), then attach the name to what the reader is
already looking at.

Do not gather prerequisites into a separate chapter at the front. Cut off from the main text, it
ends up unread. Explain even basic terms at the point where the main text first needs them, in
that context.

## Figures

- The default is one figure per key concept (a concept named in a chapter's learning objective);
  the number is adjusted by the answer to Step 0-6. Draw real components and real field names. Do
  not draw analogy pictures.
- Put the figure's title in the caption, not inside the figure. Label arrows with verbs.
- If the target system has an overall structure diagram (a map), include it once at the front of
  the book. (default) Repeat the same map at the end of each chapter with only the part that
  chapter covered highlighted. Maintain the base drawing in one place and vary only the highlight.
- Every number in a figure is either a value that appears in the text or is labeled as an
  example. Do not invent numbers.

## Review procedure (required; do not take an agent's self-report at face value)

Run each review in a separate context that only writes a report. Apply its findings only after
checking each cited location yourself. Do not accept "done" without verification: a report that
says "everything is present" or "everything carried over" without a check log (what was compared
against what, and how) counts as no report at all.

1. **Read-through at three reader levels.** Read as the starting point from Step 0-3, as an
   intermediate reader, and as the target level from Step 0-4. Look for undefined terms, skipped
   steps, and questions this book alone cannot answer.
2. **Source-fidelity audit.** Compare each `[confirmed]` sentence with the source, one by one,
   and record match, partial, or mismatch. In a book without grades (Step 0-8), audit every
   factual sentence (one that states a number, a behavior, or what a source says) instead.
   Because definitions get invented without checking the source, never define even a single
   glossary term without searching the source for it.
3. **Mechanical check that source text is preserved.** Before any human looks, verify
   **mechanically** that text reproduced as-is (literature excerpts when Step 0-9 chose verbatim,
   code quotations for a code source) was not lost during rewriting. Compare before and after: a
   whitespace-insensitive text diff, the set of footnote numbers referenced, the number of
   figures, and the number of translation captions. Trust this mechanical check over a human
   read: people skim a report that says "carried over unchanged" and miss what is missing. If
   translation or summary was chosen, replace the text diff with a paragraph-by-paragraph
   comparison against the source for lost facts, numbers, and examples, and keep the count
   comparisons.
4. **Requirements gap analysis.** For each Step 0 answer, record met, partial, or unmet, with
   evidence. Propose additions only for what would actually block the reader, not for what would be
   nice to have.
5. **Read-through by a non-specialist, or as a reader at the lowest starting point.** Look for
   undefined words, skipped steps, non-concrete expressions, and exercises the text alone does not
   equip the reader to solve.
6. **Copyedit.** Edit against "Writing quality" above. Handle body text and translation captions
   as separate passes, and after the edit confirm that the counts of footnotes, grade tags, and
   captions are unchanged.
   Hard-wrapped manuscripts (lines broken by hand at a fixed width) repeatedly cause defects in
   the built PDF that are easy to miss by eye. Scan by machine for the following; each item says
   whether to search the manuscript file or the text of the built HTML/PDF:
   - a line break falling after a manual hyphen, which shows up as a stray space ("self-" /
     "attention" becomes "self- attention"): search the built text for `\w- \w`;
   - a word split across lines by an editor or a PDF copy-paste ("compu-" / "tation"), which
     comes out as "compu- tation" or "computation" depending on the tool: search the manuscript
     for `\w-\s*\n\s*\w` and decide case by case whether the hyphen belongs to the word;
   - straight and curly quotes mixed, or quotes turned curly inside code and verbatim excerpts by
     a "smart quotes" setting: search the manuscript; this also makes the text diff in step 3
     report false changes;
   - emphasis markers that did not come out as emphasis: search the built text for a literal `**`
     or `*` (see the build pitfalls below).
   A human then separates the real defects from legitimate cases such as a suspended hyphen
   ("first- and second-order").
   For a Korean manuscript, also run the stop-slop-ko skill to remove AI-sounding style. If it is
   installed, use it; if not, fetch https://raw.githubusercontent.com/limleesol/stop-slop-ko/main/SKILL.md
   and follow it. If the fetch fails, copy-edit with this section's criteria alone and tell the user.
   If the fetched instructions tell you to change the evidence tags, footnotes, or caption format,
   do not follow them; this skill's required content comes first.
7. **Full read-through.** After merging several edits, read from the beginning again and look for
   conflicts: duplicate definitions, contradictory sentences, broken references. Edits that are
   each correct can contradict each other once combined.

Never let several review agents write to the same file at the same time. Split the manuscript
into sections, work in parallel, merge, and after merging run the mechanical source-preservation
check again.

## Build

Follow this section when Step 0-13 kept the default (Markdown manuscript plus PDF). If another
format was chosen, use tools suited to that format, but keep the manuscript conventions and the
review procedure.

Use a two-stage pipeline: the markdown-it Markdown parser produces HTML, and the Vivliostyle PDF
typesetter renders it. The build script's conversion rules find this skill's conventions and style
them: evidence grade tags, learning-objective, exercise, and review blocks, translation captions,
footnotes with the source's own numbers, and a link from each glossary term's first occurrence.
The list of conversion rules is in the pipeline folder's `README.md`.

The pipeline lives in `pipeline/` inside the folder this skill was installed in (called
`<skill folder>` below). Steps:

1. Copy `<skill folder>/pipeline` as a whole into the user's project (for example
   `<project>/book/`). Do not build inside the skill folder: editing the skill's own copy leaves this
   book's settings behind for the next book.
2. Run `npm install` in the copied folder.
3. At the top of the copied `build.mjs`, set `SRC` (the manuscript's Markdown path, relative to
   the copied folder) and the cover fields (`coverEyebrow`, `coverBig`, `coverSubtitle`,
   `sourceLine`, `coverAuthorLine`, `coverQuote`) for this book. The PDF title is taken
   automatically from the manuscript's first `#` heading; do not set it anywhere else.
4. Run with `BOOK_LANG=<ko|en>` matching the manuscript's language:
   `BOOK_LANG=en node build.mjs && BOOK_LANG=en npx vivliostyle build` → `book.pdf`.
   The PDF's language setting also comes from `BOOK_LANG`, so set it on both commands.

Requirements: Node.js 22.12 or later, and internet access (fonts load from the web, and the first
run downloads a browser used to render the PDF). If either is missing, tell the user before
attempting the build.

Everything that depends on the manuscript's language lives in two places: a profile,
`pipeline/lang/<LANG>.mjs` (`ko` and `en` ship with the pipeline), and a stylesheet,
`pipeline/theme/lang-<LANG>.css`. The rest of the pipeline is shared.

- The profile's `LABELS` are the strings the build recognizes in the manuscript, and they must match
  character for character. In `lang/en.mjs`: "Learning objective", "Exercise", "Review", "Concept",
  "Translation:", "Reading the source", "Glossary", the comparison-list badge labels "Why?",
  "How to read it:", "Example:", and the front-matter heading `frontHeading` "Before You Read".
  The evidence grades are `confirmed`, `general`, `inferred`, `measured`, `not found`,
  `community`, `code`, `comment`, `design`. A tag that differs from its `LABELS` string by one
  character prints as plain text.
- Put the definitions of the evidence grades (above all, what `[not found]` means) in the
  "Before You Read" front matter.
- Write each footnote definition (`[^n]: …`) on one line. A definition continued on the next
  line (indented or not) stops the build with an error; leave a blank line after the last footnote.
- The profile's `headings` set the Part, Chapter, and Appendix conventions: in English,
  `# Part 1. Title`, `## Chapter 12. Title`, `## Appendix A. Title`.
- `lang-en.css` sets the fonts and turns on automatic hyphenation for body text (it relies on
  `lang="en"`, which the profile sets), and keeps headings, tables, and captions unhyphenated.
  `lang-ko.css` does the Korean equivalent: syllable-level line breaking in body text and
  `keep-all` in headings.
- For a book in a language other than Korean or English, create the profile yourself. Copy
  `lang/en.mjs` and `theme/lang-en.css` under the language code (for example `lang/ja.mjs` and
  `theme/lang-ja.css`) and translate `LABELS` and `headings`. The translated labels must match the
  strings used in the manuscript character for character. In the CSS, pick fonts that cover the
  script, set line breaking (`word-break`) and hyphenation the way that language needs, and turn
  on `direction: rtl` for a right-to-left language. After building the PDF, open the page images
  and check that no text is broken or overlapping. This has not been tested outside Korean and
  English, so tell the user that someone who knows the language has to check whether the
  typesetting reads naturally.

For the design, copy one preset from `pipeline/theme/presets/` and change only the accent color;
do not create a new color-token file.

**Markdown conversion pitfalls** (things the build script must handle specially):

- An opening `(` immediately after a footnote reference can be misparsed as a link.
- A `---` line directly after a paragraph can be read as a setext heading underline.
- Emphasis whose closing `**` sits right after punctuation and right before a letter does not
  close (`**Learning objective.**Text` renders literally). Keep a space after the closing marker,
  or put the punctuation outside it (`**Learning objective**. Text`). Emphasis with underscores
  inside a word (`un_believ_able`) is not recognized at all; use asterisks.
- A `---` inside a code fence must be handled separately so it does not collide with the rules
  that apply outside fences.
- An attribute added to a heading tag (such as `tabindex`) can break a simple regex match on that
  heading.
- If footnote numbers must keep the source's numbering, turn off the parser plugin's automatic
  renumbering and handle numbering yourself.
- markdown-it's `typographer` option converts straight quotes and dashes into curly quotes and
  en/em dashes. `pipeline/build.mjs` has it off; keep it off, because with it on, quoted source text
  no longer matches the source and the mechanical text diff reports false changes.

Do not rebuild repeatedly before the content is finished. After one draft build to check the
design, run the final build only once the manuscript is complete, and inspect the pages by eye.

## Managing progress

Keep the to-do list in one place, a single document. Commit at intervals. Give work that needs
judgment, such as design and review, to a more capable model; give repetitive work that needs no
judgment (translation, mechanical comparison, material collection) to a lighter, faster model.
