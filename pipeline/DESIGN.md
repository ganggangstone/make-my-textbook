# 책 디자인: 토큰·위계·고유 기능

대상: `theme/book.css`, `build.mjs`, `fig/*.svg`.
기조: 흰 바탕, 포인트 컬러 1개(보라), 본문 명조 + 제목·라벨 Pretendard + 캡션·쪽번호·eyebrow(제목 위 작은 머리글) 모노.
배경 카드·색 채움 배지를 쓰지 않고 위계는 크기·굵기·여백·hairline(가는 선)으로만 만든다.

## 1. 색 토큰

| 토큰 | 값 | 쓰이는 곳 |
|---|---|---|
| `--ink` | `#1A1A1F` | 제목, 강한 강조(strong), 코드 본문 |
| `--text` | `#2B2B33` | 명조 본문 |
| `--ink-2` | `#4E4E5A` | 부 설명문, 번역 캡션, 각주, 표 본문 |
| `--ink-3` | `#8C8C99` | 쪽 번호, 장 eyebrow, 목차 쪽수, 낮은 등급 캡슐 |
| `--line` | `#E6E4EC` | hairline(표·연습·번역 캡션·코드 상하 선) |
| `--card` | `#F4F3F8` | 인라인 코드 바탕 |
| `--code-bg` | `#F8F8FB` | 코드 블록 바탕 |
| `--violet` | `#6E56CF` | **포인트** — 절 번호, 장 숫자, 그림 번호, 부 eyebrow, 목록 마커, 각주 번호, `§` 표식 |
| `--violet-deep` | `#5842B0` | 링크, 연습·복습 라벨, 등급 캡슐(확정 계열) |
| `--violet-soft` | `#F1EEFC` | 예비(면 채움이 꼭 필요할 때) |
| `--mark` | `#E3D8FF` | 형광 강조(`em`, 표지 제목 하이라이트) |

코드 색은 포인트 보라와 겹치지 않게 키워드를 청록 쪽으로 옮겼다.

| 토큰 | 값 |
|---|---|
| `--syn-keyword` | `#0B6E99` |
| `--syn-type` | `#0F8A7E` |
| `--syn-func` | `#A15C00` |
| `--syn-var` | `#35566F` |
| `--syn-string` | `#C2255C` |
| `--syn-number` | `#D9480F` |
| `--syn-comment` | `#3E9A5B` |
| `--syn-punct` | `#4E4E5A` |
| `--syn-ln` | `#B6B4C2` |

## 2. 타이포·위계 규칙

- 본문 `Noto Serif KR` 9.6pt / 행간 1.82. 제목·라벨·표·번역 캡션 `Pretendard`. 쪽 번호·eyebrow·그림 번호·절 번호·등급 캡슐·각주 번호 `JetBrains Mono`.
  폰트와 줄바꿈 규칙은 언어마다 다르므로 `theme/lang-<LANG>.css`에 있다(`ko`, `en` 제공). 다른 언어는 그 파일을 복사해 폰트와 `word-break`·`hyphens`를 바꾼다.
- 부(h1): 모노 eyebrow `PART 0N`(자간 .28em) + 얇은 윗선, `N부` 11pt, 제목 24pt.
- 장(h2): 모노 eyebrow `CHAPTER 0N — ENGLISH`(자간 .24em) + 아래 hairline, 숫자 `01` 34pt weight 200 보라, 제목 17pt. 들여쓰기 없이 전부 같은 왼쪽 정렬선.
- 절(h3): 12pt, 번호는 모노 8pt 보라(`.sec-no`).
- 넓은 자간은 **영문 모노 eyebrow에만**. 한글 라벨에는 쓰지 않는다.
- 상자·카드 금지. 학습 목표·연습·복습·인용은 라벨 + hairline으로만 구분한다.
- 등급 캡슐은 색 채움 없이 모노 6.4pt `[확정]` 형태. 확정·실측만 색을 달리하고 나머지는 회색.
- 한국어 조판(`lang-ko.css`): 본문 `word-break: normal`(음절 단위), 제목·표·캡션·목차는 `keep-all`. 영어(`lang-en.css`): 본문 `hyphens: auto`, 제목·표·캡션은 `manual`.

## 3. 이 책 고유 기능 (build.mjs, 디자인을 바꿔도 유지할 것)

1. **원문 번호 각주** — 마크다운 `[^n]` 정의를 뽑아 본문 끝 `section.footnotes`로 모은다. 번호는 원문 그대로.
2. **목차 자동 생성** — h1~h3, `target-counter`로 쪽 번호, 점선 리더.
3. **장 번호 캡션 분리** — `<span class="chap-no">01</span>` + `<span class="chap-t">제목</span>` + `data-eyebrow`.
4. **부록·용어 사전 헤딩** — `APPENDIX X` / `GLOSSARY` eyebrow(큰 숫자 없음).
5. **절 번호 분리** — `<span class="sec-no">1.1</span>`.
6. **쪽 머리글** — 왼쪽 면 부 제목(h2의 `data-part` → `part-run`), 오른쪽 면 장 제목, 둘 다 `first-except`.
7. **등급 캡슐** — `[확정|일반|추론|실측|부재|2차|코드|주석|설계]` → `span.grade`.
8. **학습 목표·연습·복습 블록** — `**학습 목표.**` → `p.goal`, `**연습 n.**` → `p.exercise`, `**복습 N장.**` + 번호 목록 → `div.review`.
9. **번역 캡션 3종** — `역:` 문단(`p.tr`/`li.tr`), 문단 내 `역:` 줄(`.tr-line`), 문장 속 `(역: …)`(`.tr-inline`).
10. **원문 읽기 인용** — `> **원문 읽기.**` → `blockquote.quote-src`.
11. **특정 부 구역(선택)** — `part4Marker`(언어 프로필의 `LABELS`)를 채우면 그 제목의 h1부터 다음 h1까지 `div.part-4`. 기본은 꺼져 있다.
12. **용어 사전 ↔ 첫 등장 링크** — 본문 첫 등장에 `a.gl`(점선 밑줄 + `§`), 사전 항목에 "첫 등장 p.N"(`a.gl-first`).
13. **그림** — `<figure>` + `figcaption .fig-no`(모노 보라).
14. **부 표지** — h1은 `page: part`, 머리글·쪽번호 없음.
15. **표지** — 모노 eyebrow, 큰 보라 글자(`coverBig`), 제목 하이라이트(`.hl`), 모노 meta.
16. **코드 색 입히기(Prism, 빌드할 때)** — 코드 펜스 `yaml`·`json`·`bash`는 색을 입히고, `text`(프롬프트 템플릿·도식)는 이스케이프만 한다. 인라인 코드는 `code.inl`(긴 것은 `<wbr>` 삽입).
