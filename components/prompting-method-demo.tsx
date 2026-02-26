"use client";

import { useMemo, useState } from "react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type ModeKey = "zero-shot" | "few-shot" | "cot";

const MODES: Array<{
  key: ModeKey;
  title: string;
  subtitle: string;
  placeholder: string;
  examplePrompt: string;
}> = [
  {
    key: "zero-shot",
    title: "Zero-shot",
    subtitle: "예시 없이 바로 요청하기",
    placeholder: "예시를 보고 프롬프트를 직접 작성해 보세요.",
    examplePrompt: [
      "다음 문장의 감정을 긍정/부정/중립 중 하나로 분류해줘.",
      "문장: 오늘 너무 신난다!",
      "출력은 한 단어만 써줘.",
    ].join("\n"),
  },
  {
    key: "few-shot",
    title: "Few-shot",
    subtitle: "예시 패턴을 먼저 보여주기",
    placeholder: "아래 예시 패턴을 참고해 직접 프롬프트를 써보세요.",
    examplePrompt: [
      "아래 예시를 참고해서 감정 분류를 수행하세요.",
      "출력은 반드시 한 단어(긍정/부정/중립)만 작성하세요.",
      "",
      "입력: 오늘 너무 신난다!",
      "출력: 긍정",
      "",
      "입력: 진짜 최악이다.",
      "출력: 부정",
      "",
      "입력: 세상에서 제일 행복해!",
      "출력:",
    ].join("\n"),
  },
  {
    key: "cot",
    title: "Chain of Thought",
    subtitle: "단계적으로 생각하게 하기",
    placeholder: "문제와 단계적 지시를 포함해 직접 프롬프트를 작성하세요.",
    examplePrompt: [
      "아래 문제를 단계별로 생각해서 풀어주세요.",
      "각 단계에서 무엇을 했는지 짧게 설명하고,",
      "마지막 줄에 '최종 답:' 형식으로 답만 적어주세요.",
      "",
      "문제: 지니는 사과 3개가 있고 우현이에게 2개를 더 받았습니다. 지금 몇 개일까요?",
    ].join("\n"),
  },
];

export default function PromptingMethodDemo() {
  const [mode, setMode] = useState<ModeKey>("zero-shot");
  const [promptDraft, setPromptDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");

  const activeMode = MODES.find((item) => item.key === mode) ?? MODES[0];
  const canSend = useMemo(
    () => promptDraft.trim().length > 0 && !isStreaming,
    [promptDraft, isStreaming],
  );

  async function handleSend() {
    const prompt = promptDraft.trim();
    if (!prompt || isStreaming) return;
    setError("");

    const userLabel = `${activeMode.title} 프롬프트\n${prompt}`;
    const baseHistory = [
      ...messages,
      { role: "user" as const, content: userLabel },
    ];
    const assistantIndex = baseHistory.length;
    setMessages([...baseHistory, { role: "assistant", content: "" }]);
    setIsStreaming(true);

    try {
      const response = await fetch("/api/system-prompt-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt:
            "당신은 정확한 한국어 학습 도우미입니다. 사용자의 요청 형식을 최대한 지키세요.",
          userMessage: prompt,
          history: [],
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || "모델 호출에 실패했습니다.");
      }

      if (!response.body) {
        throw new Error("응답 스트림을 사용할 수 없습니다.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        fullText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[assistantIndex] = { role: "assistant", content: fullText };
          return copy;
        });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(message);
      setMessages((prev) => prev.slice(0, assistantIndex));
    } finally {
      setIsStreaming(false);
    }
  }

  function clearAll() {
    setMessages([]);
    setError("");
    setPromptDraft("");
  }

  return (
    <section className="not-prose my-10">
      <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-cyan-50 via-sky-50 to-white p-5 shadow-sm dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 md:p-7">
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-3">
            {MODES.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setMode(item.key)}
                className={`rounded-2xl border px-3 py-3 text-left transition ${
                  mode === item.key
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background/80 hover:border-primary/50"
                }`}
              >
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.subtitle}
                </p>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/90 p-4 md:p-5">
            <div className="rounded-xl border border-border/70 bg-muted/35 p-3">
              <p className="text-xs font-semibold text-muted-foreground">
                모드별 예시 프롬프트
              </p>
              <pre className="mt-2 whitespace-pre-wrap text-xs leading-relaxed">
                {activeMode.examplePrompt}
              </pre>
            </div>

            <p className="mt-3 text-sm font-semibold">직접 프롬프트 작성</p>
            <p className="mt-1 text-xs text-muted-foreground">
              위 예시를 참고해 프롬프트를 직접 타이핑해 보세요.
            </p>
            <textarea
              value={promptDraft}
              onChange={(event) => setPromptDraft(event.target.value)}
              placeholder={activeMode.placeholder}
              className="mt-2 h-28 w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary/60"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition hover:border-primary/70 hover:text-primary"
                onClick={clearAll}
              >
                대화 지우기
              </button>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                disabled={!canSend}
                onClick={() => void handleSend()}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isStreaming ? "생성 중..." : "실행"}
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-border/70 bg-muted/35 p-3">
              <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    모드를 선택하고 입력을 실행하면 결과를 비교할 수 있습니다.
                  </p>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`rounded-lg px-3 py-2 text-sm leading-relaxed ${
                        message.role === "user"
                          ? "ml-7 bg-primary/10 text-foreground"
                          : "mr-7 bg-background"
                      }`}
                    >
                      <p className="mb-1 text-[11px] font-semibold uppercase text-muted-foreground">
                        {message.role === "user" ? "User" : "Assistant"}
                      </p>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {error ? (
              <p className="mt-2 text-sm text-destructive">{error}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
