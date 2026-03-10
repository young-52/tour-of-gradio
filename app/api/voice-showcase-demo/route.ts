import { NextResponse } from "next/server";

const SUPPORTED_MODELS = new Set([
  "gpt-4o-mini-transcribe",
  "gpt-4o-transcribe",
  "whisper-1",
]);

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
        { error: "지원하지 않는 전사 모델입니다." },
        { status: 400 },
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "오디오 파일(file)은 필수입니다." },
        { status: 400 },
      );
    }

    const upstreamForm = new FormData();
    upstreamForm.append("model", model);
    upstreamForm.append("file", file, file.name || "audio.webm");

    const upstreamResponse = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: upstreamForm,
      },
    );

    const raw = await upstreamResponse.text();
    let payload: unknown = null;
    try {
      payload = JSON.parse(raw);
    } catch {
      payload = { error: raw || "전사 응답을 해석하지 못했습니다." };
    }

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        { error: payload },
        { status: upstreamResponse.status },
      );
    }

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { error: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
