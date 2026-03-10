import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SUPPORTED_MODELS = new Set(["gpt-4o-mini", "gpt-4o"]);

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
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
    const incoming = await request.formData();
    const model = String(incoming.get("model") || "").trim();
    const file = incoming.get("file");

    if (!SUPPORTED_MODELS.has(model)) {
      return NextResponse.json(
        { error: "지원하지 않는 Vision 모델입니다." },
        { status: 400 },
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "이미지 파일(file)은 필수입니다." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");
    const mimeType = file.type || "image/jpeg";

    const upstreamResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "이 이미지에 무엇이 있는지 자세히 설명해줘.",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 500,
        }),
      },
    );

    const raw = await upstreamResponse.text();
    let payload: unknown = null;
    try {
      payload = JSON.parse(raw);
    } catch {
      payload = { error: raw || "응답을 해석하지 못했습니다." };
    }

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        { error: payload },
        { status: upstreamResponse.status },
      );
    }

    const data = payload as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content?.trim() || "";

    return NextResponse.json({ text });
  } catch {
    return NextResponse.json(
      { error: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
