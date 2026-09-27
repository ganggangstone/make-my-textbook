# 예제: Scaled Dot-Product Attention 한 장

`SKILL.md`의 절차를 따라가 본 최소 예제다. Vaswani 외(2017), "Attention Is All You
Need"(arXiv:1706.03762)의 초록과 3.2.1절(각주 4 포함)만 자료로 써서 1장짜리 미니 교재를 만들었다.

- `calibration.md`: 시작할 때 받는 질문에 이 예제를 위해 답한 값.
- `manuscript.md`: 한국어 원고. SKILL.md가 한 장에 넣으라고 한 요소(학습 목표, 원문 인용과 번역 캡션,
  개념 블록, 즉석 확인, 연습, 복습, 용어 사전, 해답, 각주)를 전부 담았다.
- `manuscript.en.md`: 같은 내용의 영어 원고. 원문이 영어 논문이라 번역 캡션은 없다.
- `self-attention.ko.pdf`, `self-attention.en.pdf`: 위 두 원고로 만든 PDF(표지는 아래 "빌드해보기"의 값으로 만들었다).

## 빌드해보기

```
cp -R pipeline pipeline-example
cd pipeline-example && npm install
```

`build.mjs` 맨 위 설정 구간에서 `SRC`를 `../examples/self-attention/manuscript.md`로 바꾸고
`node build.mjs && npx vivliostyle build`를 실행하면 이 예제의 PDF(`book.pdf`)가 나온다. 영어 원고는
`SRC`를 `manuscript.en.md`로 바꾸고 두 명령 모두에 `BOOK_LANG=en`을 붙인다. 이 저장소의 PDF는
표지를 다음 값으로 두고 만들었다: `coverEyebrow = "MINI EXAMPLE"`, `coverBig = "QKV"`,
`sourceLine = "Vaswani et al. (2017)"`, `coverSubtitle`은 한국어판 "논문 한 편의 한 절로 만든 1장짜리
교재", 영어판 "A one-chapter textbook built from one section of one paper".

## 이 예제를 만들며 찾은 버그 (참고용)

이 예제를 처음 빌드했을 때 `pipeline/`에서 두 가지 결함이 나왔고, 둘 다 고쳐서 지금의
`pipeline/build.mjs`에 반영돼 있다:

1. **용어 사전 첫 등장 링크가 단어 경계를 안 봄.** 표제어 "내적 (dot product)"의 영어 항이
   원문의 "dot **product**s"(복수형) 안에서 부분 일치해, "dot product"만 링크로 잘리고 "s"가
   링크 밖으로 삐져나왔다. 이 도구를 처음 만든 책은 한국어 표제어 위주라 이 충돌이 없어서 그동안 드러나지 않았다.
2. **머리말 제목 중복.** 원고에 `## 이 책을 읽기 전에`(=`LABELS.frontHeading`)를 직접 쓰면,
   빌드 스크립트가 같은 제목을 자동으로 한 번 더 씌워서 두 번 찍혔다.
