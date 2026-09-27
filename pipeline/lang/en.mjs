// English profile. Manuscript conventions: "# Part 1. Title", "## Chapter 12. Title",
// "## Appendix A. Title". The label strings must match the manuscript exactly.
export default {
  htmlLang: "en",
  LABELS: {
    toc: "Contents",
    frontHeading: "Before You Read",
    goal: "Learning objective",
    exercisePrefix: "Exercise",
    reviewPrefix: "Review",
    quoteSrc: "Reading the source",
    conceptPrefix: "Concept",
    glossaryHeading: "Glossary",
    translationPrefix: "Translation:",
    // Same order as GRADE_KEYS in build.mjs: confirmed, general, inferred, measured, absent, community, code, comment, design
    grades: ["confirmed", "general", "inferred", "measured", "not found", "community", "code", "comment", "design"],
    part4Marker: "", // set to a Part heading (e.g. "Part 4") to wrap that part in div.part-4
    badges: ["Why?", "How to read it:", "Example:"],
  },
  headings: {
    chapterPat: "Chapter (\\d+)",
    partPat: "Part (\\d+)",
    partNo: (n) => `Part ${n}`,
    appendixWord: "Appendix",
    appendixH1Title: "Reference material",
  },
};
