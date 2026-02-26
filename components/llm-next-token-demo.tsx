"use client";

import { useMemo, useState } from "react";

type Candidate = { word: string; p: number };

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function normalize(cands: Candidate[]): Candidate[] {
  const sum = cands.reduce((acc, c) => acc + c.p, 0);
  if (sum <= 0) return cands.map((c) => ({ ...c, p: 1 / cands.length }));
  return cands.map((c) => ({ ...c, p: c.p / sum }));
}

function sampleFrom(cands: Candidate[]): string {
  const norm = normalize(cands.map((c) => ({ ...c, p: clamp01(c.p) })));
  const r = Math.random();
  let acc = 0;
  for (const c of norm) {
    acc += c.p;
    if (r <= acc) return c.word;
  }
  return norm[norm.length - 1]?.word ?? "";
}

function tokenize(input: string): string[] {
  const spaced = input
    .replaceAll("\n", " ")
    .replace(/([.?!,])/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim();
  return spaced ? spaced.split(" ") : [];
}

function detokenize(tokens: string[]): string {
  return tokens
    .join(" ")
    .replace(/\s+([.?!,])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

const TRANSITIONS: Record<string, Candidate[]> = {
  "김치찌개를": [
    { word: "먹었다", p: 0.55 },
    { word: "주문했다", p: 0.25 },
    { word: "끓였다", p: 0.15 },
    { word: "싫어했다", p: 0.05 },
  ],
  "그래서 지금 너무": [
    { word: "졸리다", p: 0.48 },
    { word: "피곤하다", p: 0.28 },
    { word: "행복하다", p: 0.12 },
    { word: "배고프다", p: 0.08 },
    { word: "자동차", p: 0.04 },
  ],
  "지금 너무": [
    { word: "졸리다", p: 0.45 },
    { word: "피곤하다", p: 0.3 },
    { word: "행복하다", p: 0.1 },
    { word: "배고프다", p: 0.1 },
    { word: "자동차", p: 0.05 },
  ],
  "나는 오늘": [
    { word: "커피를", p: 0.45 },
    { word: "점심을", p: 0.2 },
    { word: "산책을", p: 0.15 },
    { word: "회의를", p: 0.2 },
  ],
  "오늘 점심으로": [
    { word: "나는", p: 0.55 },
    { word: "우리는", p: 0.25 },
    { word: "저는", p: 0.2 },
  ],
  "점심으로 나는": [
    { word: "김치찌개를", p: 0.5 },
    { word: "비빔밥을", p: 0.25 },
    { word: "국수를", p: 0.25 },
  ],
  "오늘 커피를": [
    { word: "마셨다", p: 0.55 },
    { word: "샀다", p: 0.2 },
    { word: "내렸다", p: 0.15 },
    { word: "안", p: 0.1 },
  ],
  "커피를 마셨다": [
    { word: ".", p: 0.35 },
    { word: "그래서", p: 0.5 },
    { word: "근데", p: 0.15 },
  ],
  ".": [
    { word: "그래서", p: 0.45 },
    { word: "그리고", p: 0.35 },
    { word: "하지만", p: 0.2 },
  ],
  __default__: [
    { word: "그리고", p: 0.3 },
    { word: "그래서", p: 0.3 },
    { word: "하지만", p: 0.2 },
    { word: "또", p: 0.2 },
  ],
};

function getCandidates(tokens: string[]): Candidate[] {
  const last3 = tokens.slice(-3).join(" ").trim();
  const last2 = tokens.slice(-2).join(" ").trim();
  const last1 = tokens.slice(-1).join(" ").trim();

  return normalize(
    TRANSITIONS[last3] ??
      TRANSITIONS[last2] ??
      TRANSITIONS[last1] ??
      TRANSITIONS.__default__,
  );
}

const GUIDE_SECTIONS = [
  {
    title: "실습 1 · 시작 문장 설정",
    steps: [
      "오른쪽 프롬프트 칸에서 시작 문장을 입력해요.",
      "또는 예시 버튼으로 바로 문장을 불러와요.",
      "문장의 마지막 단어가 다음 예측에 큰 영향을 줍니다.",
    ],
  },
  {
    title: "실습 2 · 한 단어 생성",
    steps: [
      "다음 단어 생성 버튼을 한 번 눌러요.",
      "후보 확률 막대에서 어떤 단어가 유력한지 확인해요.",
      "생성된 단어가 문장 뒤에 붙는 과정을 관찰해요.",
    ],
  },
  {
    title: "실습 3 · 문맥 효과 비교",
    steps: [
      "같은 버튼을 여러 번 눌러 문장을 이어가요.",
      "중간에 어색한 단어가 나오면 이후 흐름이 흔들리는지 봐요.",
      "LLM의 자기회귀 생성 감각을 체험해요.",
    ],
  },
];

export default function LlmNextTokenDemo() {
  const [prompt, setPrompt] = useState("나는 오늘 커피를 마셨다 . 그래서 지금 너무");
  const [tokens, setTokens] = useState<string[]>(() => tokenize(prompt));

  const candidates = useMemo(() => getCandidates(tokens), [tokens]);
  const generated = useMemo(() => detokenize(tokens), [tokens]);
  const context = tokens.slice(-3).join(" ") || "(없음)";

  function syncPrompt(value: string) {
    setPrompt(value);
    setTokens(tokenize(value));
  }

  function step() {
    const next = sampleFrom(candidates);
    if (!next) return;
    setTokens((prev) => [...prev, next]);
  }

  function setExample(kind: "coffee" | "kimchi") {
    const sample =
      kind === "coffee"
        ? "나는 오늘 커피를 마셨다 . 그래서 지금 너무"
        : "오늘 점심으로 나는 김치찌개를";
    syncPrompt(sample);
  }

  function resetAll() {
    syncPrompt("나는 오늘 커피를 마셨다 . 그래서 지금 너무");
  }

  return (
    <section className="not-prose my-10">
      <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-lime-50 via-emerald-50 to-white p-5 shadow-sm dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 md:p-7">
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.25fr]">
          <aside className="space-y-3">
            {GUIDE_SECTIONS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border/70 bg-background/70 p-4"
              >
                <h4 className="text-sm font-semibold">{item.title}</h4>
                <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  {item.steps.map((stepText) => (
                    <li key={stepText}>{stepText}</li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          <div className="rounded-2xl border border-border/70 bg-background/90 p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold">다음 단어 예측 실습</h3>
              <span className="text-xs text-muted-foreground">
                현재 문맥(마지막 3개): <span className="font-semibold">{context}</span>
              </span>
            </div>

            <label className="mt-3 block text-sm font-medium">시작 문장</label>
            <textarea
              value={prompt}
              onChange={(event) => syncPrompt(event.target.value)}
              rows={3}
              className="mt-2 w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary/60"
              placeholder="시작 문장을 입력해 보세요."
            />

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition hover:border-primary/70 hover:text-primary"
                onClick={() => setExample("coffee")}
              >
                예시: 커피
              </button>
              <button
                type="button"
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition hover:border-primary/70 hover:text-primary"
                onClick={() => setExample("kimchi")}
              >
                예시: 김치찌개
              </button>
              <button
                type="button"
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition hover:border-primary/70 hover:text-primary"
                onClick={resetAll}
              >
                초기화
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-border/70 bg-muted/35 p-3">
              <p className="text-xs font-semibold text-muted-foreground">현재 생성 문장</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                {generated || "..."}
              </p>
            </div>

            <button
              type="button"
              onClick={step}
              className="mt-3 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              다음 단어 생성
            </button>

            <div className="mt-4 rounded-xl border border-border/70 bg-muted/35 p-3">
              <p className="text-xs font-semibold text-muted-foreground">
                다음 단어 후보 확률
              </p>
              <div className="mt-2 space-y-2">
                {[...candidates]
                  .sort((a, b) => b.p - a.p)
                  .slice(0, 6)
                  .map((candidate) => (
                    <div key={candidate.word} className="flex items-center gap-3">
                      <div className="w-24 shrink-0 text-sm font-medium">
                        {candidate.word}
                      </div>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-background">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${Math.round(candidate.p * 100)}%` }}
                        />
                      </div>
                      <div className="w-12 text-right text-xs text-muted-foreground">
                        {(candidate.p * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              참고: 이 실습은 교육용 단순 확률표를 사용합니다. 실제 LLM은 훨씬 큰
              신경망으로 확률을 계산하지만, 한 단어씩 이어 생성하는 원리는 동일합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
