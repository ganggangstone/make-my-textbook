// Korean profile: labels the build matches in the manuscript, and the heading
// conventions ("1부.", "12장.", "부록 A.") it turns into part/chapter/appendix titles.
export default {
  htmlLang: "ko",
  LABELS: {
    toc: "차례",
    frontHeading: "이 책을 읽기 전에",
    goal: "학습 목표",
    exercisePrefix: "연습",
    reviewPrefix: "복습",
    quoteSrc: "원문 읽기",
    conceptPrefix: "개념",
    glossaryHeading: "용어 사전",
    translationPrefix: "역:",
    // Same order as GRADE_KEYS in build.mjs: confirmed, general, inferred, measured, absent, community, code, comment, design
    grades: ["확정", "일반", "추론", "실측", "부재", "2차", "코드", "주석", "설계"],
    part4Marker: "", // set to a Part heading (e.g. "4부") to wrap that part in div.part-4
    // Small repeated labels inside comparison lists; each renders as a badge.
    badges: ["왜?", "읽는 법:", "예:"],
  },
  headings: {
    chapterPat: "(\\d+)장",          // one capture group: the number
    partPat: "(\\d+)부",             // one capture group: the number
    partNo: (n) => `${n}부`,
    appendixWord: "부록",
    appendixH1Title: "참고 자료",
  },
};
