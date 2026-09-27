# book-pipeline: Markdown 원고를 PDF 책으로

0. 준비물: Node.js 22.12 이상(설치: https://nodejs.org), 인터넷 연결(폰트를 받고, 처음 한 번은 Vivliostyle이 브라우저도 받는다). `npm install` 끝에 나오는 보안 경고는 무시해도 된다(내 컴퓨터에서 PDF만 만드니까).
1. 이 폴더를 프로젝트의 `book/`으로 복사하고 `npm install`을 실행한다(markdown-it, markdown-it-anchor, prismjs, @vivliostyle/cli).
   라이선스 안내는 루트 README의 "만들 때 쓴 오픈소스"에 있다.
2. `build.mjs` 맨 위 "EDIT THIS BLOCK FOR EVERY NEW BOOK" 구간을 고친다. `SRC`(교재 마크다운
   경로), 표지 문구. 원고 언어별로 달라지는 것(라벨, 장·부·부록 제목 표기, 폰트, 줄바꿈 규칙)은
   `lang/<LANG>.mjs`와 `theme/lang-<LANG>.css`에 있다(`ko`, `en` 제공). 언어는 환경변수로
   고른다: `BOOK_LANG=en node build.mjs && BOOK_LANG=en npx vivliostyle build`(안 붙이면 `ko`). 원고에 쓰는 라벨과 프로필의 `LABELS` 값이 정확히 같은
   문자열이어야 인식한다. 다른 언어는 `lang/en.mjs`와 `theme/lang-en.css`를 복사해 값만 바꾼다.
   PDF 제목은 원고의 첫 제목에서, `language`는 `BOOK_LANG`에서 자동으로 정해진다.
3. `node build.mjs && npx vivliostyle build` → PDF. 그림은 `fig/` 폴더에 SVG를 두고 본문에 `<figure><img src="../fig/…">`로 넣는다.
4. 마크다운 관습(라벨 이름은 `lang/<LANG>.mjs`의 `LABELS`): `**학습 목표.**` / `**연습 n.**` / `**복습
   n장.**` 문단, `[확정]` 등 등급 태그, `역:` 번역 캡션, `## 용어 사전 …` 절의 `**표제어** —` 항목
   (본문에서 처음 나온 곳에 § 링크가 자동으로 붙는다),
   각주 `[^n]:` 정의(원문 번호 유지). **장·부·부록 제목 표기는 `lang/<LANG>.mjs`의 `headings`가 정한다.** 한국어는 `1부.`/`12장.`/`부록 A.`, 영어는 `Part 1.`/`Chapter 12.`/`Appendix A.`. 원고 맨 앞에 `## <frontHeading과 같은 제목>`을 써도 한 번만 찍힌다(빌드가 지운다).
   **각주 정의(`[^n]: …`)는 반드시 한 줄로 쓴다.** 다음 줄로 이어 쓰면(들여쓰기가 없어도) 빌드가
   오류로 멈춘다. 마지막 각주 뒤에는 빈 줄을 둔다. 비교 목록의 반복 라벨(`왜?` 등, `LABELS.badges`)은
   문단 하나를 통째로 차지하게 쓰면 배지로 표시된다.
   이 관습이 왜 이 모양인지는 이 저장소 루트의 `SKILL.md`를 본다. 실제로 작동하는 예시는
   `examples/self-attention/`에 있다.
5. 디자인 토큰·위계는 `DESIGN.md`. 포인트 색을 바꾸려면 `theme/presets/`(violet·blue·pink) 중 하나를
   `theme/tokens.css`에 덮어쓴다. 덮어써도 변수 이름은 그대로이고 값만 바뀐다.
6. 대상 시스템의 전체 구조도(지도)는 SVG로 직접 그려 `<figure class="map">`으로 머리말·부 표지(제목 바로 아래)·각 장 복습 뒤에 넣는다. 캡션 앞 라벨은 "지도"로 쓴다.
7. 빌드가 끝나면 인식하지 못한 것을 `WARNING:`으로 알려 준다(장 제목이 하나도 안 잡힘, 라벨 블록이 0개, 정의 없는 각주 참조, 대소문자가 다른 등급 태그 등). 경고가 나오면 원고나 `BOOK_LANG`을 확인한다.
8. 대괄호 안의 낱말이 등급 이름과 같으면(예: 영어 원고의 `[code]`, `[general]`) 등급 태그로 바뀐다. 일반 글에 그런 대괄호를 쓰지 않는다.
