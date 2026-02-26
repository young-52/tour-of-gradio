import { type NextRequest, NextResponse } from "next/server";

type InputMessage = {
  role: "user" | "assistant";
  content: string;
};

function pushSSEDelta(
  line: string,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
) {
  if (!line.startsWith("data:")) return;
  const payload = line.replace(/^data:\s*/, "");
  if (!payload || payload === "[DONE]") return;

  try {
    const json = JSON.parse(payload) as {
      choices?: Array<{ delta?: { content?: string } }>;
    };
    const chunk = json.choices?.[0]?.delta?.content;
    if (chunk) controller.enqueue(encoder.encode(chunk));
  } catch {
    // ignore malformed SSE lines
  }
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  // api key 출력
  // console.log("API Key:", apiKey);
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OPENAI_API_KEY가 설정되지 않았습니다. .env.local에 키를 추가해 주세요.",
      },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as {
      systemPrompt?: string;
      userMessage?: string;
      history?: InputMessage[];
    };

    const userMessage = body.userMessage?.trim();
    if (!userMessage) {
      return NextResponse.json(
        { error: "userMessage는 필수입니다." },
        { status: 400 },
      );
    }

    const safeHistory = (body.history ?? [])
      .filter(
        (message) => message.role === "user" || message.role === "assistant",
      )
      .map((message) => ({
        role: message.role,
        content: message.content.trim(),
      }))
      .filter((message) => message.content.length > 0);

    const messages = [
      {
        role: "system",
        content:
          body.systemPrompt?.trim() ||
          "당신은 친절한 한국어 조교입니다. 설명은 명확하고 간결하게 작성하세요.",
      },
      ...safeHistory,
      { role: "user", content: userMessage },
    ];

    const upstreamResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-5",
          messages,
          stream: true,
          temperature: 1.0,
        }),
      },
    );

    if (!upstreamResponse.ok) {
      const detail = await upstreamResponse.text();
      return NextResponse.json(
        { error: detail },
        { status: upstreamResponse.status },
      );
    }

    if (!upstreamResponse.body) {
      return NextResponse.json(
        { error: "모델 스트림을 읽을 수 없습니다." },
        { status: 500 },
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = upstreamResponse.body?.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let buffer = "";

        try {
          while (reader) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              pushSSEDelta(line.trim(), controller, encoder);
            }
          }

          if (buffer) {
            pushSSEDelta(buffer.trim(), controller, encoder);
          }
        } catch {
          controller.error("응답 스트림을 처리하지 못했습니다.");
          return;
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
