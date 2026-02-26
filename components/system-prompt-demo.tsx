"use client";

import { useMemo, useState } from "react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

const PRESET_PROMPTS = [
  {
    label: "맞춤법 검사기",
    value:
      "당신은 엄격한 한국어 맞춤법 검사기입니다. 항상 맞춤법과 띄어쓰기를 고치고, 수정 이유를 항목별로 설명하세요.",
  },
  {
    label: "감성 시인",
    value: "당신은 감성적인 시인입니다. 모든 답변을 시 형식으로 작성하세요.",
  },
  {
    label: "JSON 추출기",
    value:
      "당신은 정보 추출기입니다. 사용자 입력을 JSON 형식으로만 출력하세요.",
  },
];

const GUIDE_SECTIONS = [
  {
    title: "실습 1 · 시스템 프롬프트",
    steps: [
      "맞춤법 검사기 버튼을 눌러 프롬프트를 적용해요.",
      "예시 문장: 오늘 날씨가 너무 좋다 나는 공원에 갔다",
      "출력 형식과 설명 방식이 어떻게 바뀌는지 확인해요.",
    ],
  },
  {
    title: "실습 2 · 역할 변경",
    steps: [
      "감성 시인 버튼으로 역할을 바꿔요.",
      "같은 문장을 다시 입력해요.",
      "말투, 형식, 구조가 얼마나 달라지는지 비교해요.",
    ],
  },
  {
    title: "실습 3 · 출력 형식 강제",
    steps: [
      "JSON 추출기 버튼을 눌러요.",
      "자유로운 질문을 입력해요.",
      "모델이 지정된 출력 형식을 얼마나 지키는지 봐요.",
    ],
  },
];

export default function SystemPromptDemo() {
  const [systemPrompt, setSystemPrompt] = useState(PRESET_PROMPTS[0].value);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");

  const canSend = useMemo(
    () => input.trim().length > 0 && !isStreaming,
    [input, isStreaming],
  );

  async function handleSend() {
    const userText = input.trim();
    if (!userText || isStreaming) return;

    setInput("");
    setError("");

    const baseHistory = [...messages, { role: "user" as const, content: userText }];
    const assistantIndex = baseHistory.length;
    setMessages([...baseHistory, { role: "assistant", content: "" }]);
    setIsStreaming(true);

    try {
      const response = await fetch("/api/system-prompt-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt,
          userMessage: userText,
          history: messages,
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

  function handleReset() {
    setMessages([]);
    setInput("");
    setError("");
  }

  return (
    <section className="not-prose my-10">
      <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-orange-50 via-amber-50 to-white p-5 shadow-sm dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 md:p-7">
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.25fr]">
          <aside className="space-y-3">
            {GUIDE_SECTIONS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border/70 bg-background/70 p-4"
              >
                <h4 className="text-sm font-semibold">{item.title}</h4>
                <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  {item.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          <div className="rounded-2xl border border-border/70 bg-background/90 p-4 md:p-5">
            <h3 className="text-base font-semibold">System Prompt</h3>
            <textarea
              value={systemPrompt}
              onChange={(event) => setSystemPrompt(event.target.value)}
              className="mt-2 h-32 w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-0 focus:border-primary/60"
              placeholder="시스템 프롬프트를 입력해 보세요."
            />

            <div className="mt-3 flex flex-wrap gap-2">
              {PRESET_PROMPTS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition hover:border-primary/70 hover:text-primary"
                  onClick={() => setSystemPrompt(preset.value)}
                >
                  {preset.label}
                </button>
              ))}
              <button
                type="button"
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition hover:border-primary/70 hover:text-primary"
                onClick={() => setSystemPrompt("")}
              >
                비우기
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-border/70 bg-muted/35 p-3">
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    메시지를 입력하면 여기서 답변이 스트리밍됩니다.
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

            <div className="mt-3 flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void handleSend();
                  }
                }}
                placeholder="질문을 입력해 주세요."
                className="min-w-0 flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary/60"
              />
              <button
                type="button"
                disabled={!canSend}
                onClick={() => void handleSend()}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isStreaming ? "생성 중..." : "전송"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-border px-3 py-2 text-sm"
              >
                초기화
              </button>
            </div>

            {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
