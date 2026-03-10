"use client";

import { useMemo, useRef, useState } from "react";

type GuideTabKey = "upload" | "record";
type ModelName = "gpt-4o-mini-transcribe" | "gpt-4o-transcribe" | "whisper-1";

const DEFAULT_TRANSCRIBE_MODEL: ModelName = "gpt-4o-mini-transcribe";
const MODELS: ModelName[] = [
  "gpt-4o-mini-transcribe",
  "gpt-4o-transcribe",
  "whisper-1",
];

const GUIDE_SECTIONS = [
  {
    title: "오디오 파일 전사하기",
    steps: [
      "오른쪽에서 오디오 파일을 업로드합니다.",
      "전사 모델을 선택합니다.",
      "Transcribe 버튼을 클릭합니다.",
    ],
  },
  {
    title: "직접 녹음한 음성 전사하기",
    steps: [
      "마이크 권한을 허용하고 녹음을 시작합니다.",
      "녹음 종료 후 전사 모델을 선택합니다.",
      "Transcribe 버튼을 클릭합니다.",
    ],
  },
] as const;

export default function VoiceShowcase() {
  const [guideTab, setGuideTab] = useState<GuideTabKey>("upload");
  const [model, setModel] = useState<ModelName>(DEFAULT_TRANSCRIBE_MODEL);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const canTranscribe = useMemo(
    () => !!audioFile && !isLoading,
    [audioFile, isLoading],
  );

  function cleanupRecordingResources() {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }

  async function startRecording() {
    setError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      streamRef.current = stream;
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const ext = blob.type.includes("wav") ? "wav" : "webm";
        const file = new File([blob], `recording.${ext}`, {
          type: blob.type || "audio/webm",
        });

        if (recordedUrl) {
          URL.revokeObjectURL(recordedUrl);
        }

        setRecordedUrl(URL.createObjectURL(blob));
        setAudioFile(file);
        cleanupRecordingResources();
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      setError("마이크에 접근할 수 없습니다. 브라우저 권한을 확인해 주세요.");
      cleanupRecordingResources();
    }
  }

  function stopRecording() {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);
  }

  async function transcribe() {
    setError("");

    if (!audioFile) {
      setTranscript("(전사할 음성 파일이 없습니다.)");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("model", model);
      formData.append("file", audioFile);

      const response = await fetch("/api/voice-showcase-transcribe", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as {
        text?: string;
        error?: string | { message?: string };
      };

      if (!response.ok) {
        const detail =
          typeof payload?.error === "string"
            ? payload.error
            : payload?.error?.message;
        throw new Error(detail || "전사 결과가 비어있습니다.");
      }

      const text = (payload?.text || "").trim();
      setTranscript(text || "(전사 결과가 비어있습니다.)");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="not-prose my-10">
      <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-orange-50 via-amber-50 to-white p-5 shadow-sm dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 md:p-7">
        <div className="grid gap-5 lg:grid-cols-10">
          <aside className="space-y-3 lg:col-span-4">
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <h4 className="text-sm font-semibold">가이드</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    guideTab === "upload"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/70 hover:text-primary"
                  }`}
                  onClick={() => setGuideTab("upload")}
                >
                  오디오 파일 전사하기
                </button>
                <button
                  type="button"
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    guideTab === "record"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/70 hover:text-primary"
                  }`}
                  onClick={() => setGuideTab("record")}
                >
                  직접 녹음한 음성 전사하기
                </button>
              </div>

              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {GUIDE_SECTIONS.find((item) =>
                  item.title.includes(guideTab === "upload" ? "파일" : "녹음"),
                )?.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="rounded-2xl border border-border/70 bg-background/90 p-4 md:p-5 lg:col-span-6">
            <h3 className="text-base font-semibold">🎙️ 음성 파일 전사</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              업로드한 음성 파일에 대한 전사본을 받을 수 있습니다.
            </p>

            <div className="mt-3 rounded-xl border border-border/70 bg-muted/35 p-3">
              <div className="space-y-3">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">
                    음성 파일 업로드
                  </p>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setAudioFile(file);
                      if (recordedUrl) {
                        URL.revokeObjectURL(recordedUrl);
                        setRecordedUrl("");
                      }
                    }}
                    className="block w-full text-sm file:mr-3 file:rounded-lg file:border file:border-border file:bg-background file:px-3 file:py-1.5 file:text-xs file:font-medium"
                  />
                </div>

                <div className="border-t border-border/70 pt-3">
                  <p className="text-xs font-semibold text-muted-foreground">
                    음성 녹음하기
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void startRecording()}
                      disabled={isRecording}
                      className="rounded-xl border border-border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      녹음 시작
                    </button>
                    <button
                      type="button"
                      onClick={stopRecording}
                      disabled={!isRecording}
                      className="rounded-xl border border-border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      멈추기
                    </button>
                  </div>
                  {recordedUrl && (
                    <audio controls src={recordedUrl} className="mt-2 w-full">
                      <track kind="captions" />
                    </audio>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <label
                htmlFor="model-select"
                className="block text-left text-sm font-semibold text-foreground tracking-normal"
              >
                전사에 사용할 모델
              </label>
              <select
                id="model-select"
                value={model}
                onChange={(event) => setModel(event.target.value as ModelName)}
                className="mt-2 min-w-0 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary/60"
              >
                {MODELS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => void transcribe()}
                disabled={!canTranscribe}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                전사 시작하기
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-border/70 bg-muted/35 p-3">
              <label
                htmlFor="transcript-box"
                className="block text-left text-sm font-semibold text-foreground tracking-normal"
              >
                전사 결과
              </label>
              <textarea
                id="transcript-box"
                value={transcript}
                onChange={(event) => setTranscript(event.target.value)}
                rows={14}
                className="mt-2 h-64 w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-0 focus:border-primary/60"
              />
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
