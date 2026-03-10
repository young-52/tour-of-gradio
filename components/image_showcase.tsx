"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type ModelName = "gpt-4o-mini" | "gpt-4o";

const DEFAULT_VISION_MODEL: ModelName = "gpt-4o-mini";
const MODELS: ModelName[] = ["gpt-4o-mini", "gpt-4o"];

const GUIDE_STEPS = [
  "'Upload Image'에서 이미지 파일을 업로드하거나 드래그합니다. 필요하면 카메라 촬영 이미지를 업로드할 수도 있습니다.",
  "'Vision Model'에서 분석에 사용할 Vision 모델을 선택합니다.",
  "'Analyze Image' 버튼을 클릭합니다.",
] as const;

export default function ImageShowcase() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [model, setModel] = useState<ModelName>(DEFAULT_VISION_MODEL);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const canAnalyze = useMemo(
    () => !!imageFile && !isLoading,
    [imageFile, isLoading],
  );

  async function handleAnalyze() {
    setError("");

    if (!imageFile) {
      setResult("(이미지가 업로드되지 않았습니다.)");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("model", model);
      formData.append("file", imageFile);

      const response = await fetch("/api/image-showcase-analyze", {
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
        throw new Error(detail || "Image analysis request failed.");
      }

      setResult((payload.text || "").trim() || "(Empty response.)");
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
              <h4 className="text-sm font-semibold">Instructions</h4>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {GUIDE_STEPS.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="rounded-2xl border border-border/70 bg-background/90 p-4 md:p-5 lg:col-span-6">
            <h3 className="text-base font-semibold">Image Analysis (Vision)</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              AI는 이미지를 보고 이해할 수 있습니다. 사진을 업로드하면 이미지 속
              사물, 글자, 상황을 분석해 설명합니다.
            </p>

            <div className="mt-3 rounded-xl border border-border/70 bg-muted/35 p-3">
              <p className="text-xs font-semibold text-muted-foreground">
                Upload Image
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setImageFile(file);
                  if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl("");
                  }
                  if (file) {
                    setPreviewUrl(URL.createObjectURL(file));
                  }
                }}
                className="mt-2 block w-full text-sm file:mr-3 file:rounded-lg file:border file:border-border file:bg-background file:px-3 file:py-1.5 file:text-xs file:font-medium"
              />

              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Uploaded preview"
                  width={800}
                  height={800}
                  className="mt-3 max-h-72 w-full h-auto rounded-xl border border-border/70 object-contain bg-background"
                />
              ) : null}
            </div>

            <div className="mt-3">
              <label
                htmlFor="vision-model"
                className="text-sm font-semibold text-foreground"
              >
                Vision Model
              </label>
              <select
                id="vision-model"
                value={model}
                onChange={(event) => setModel(event.target.value as ModelName)}
                className="block text-left text-sm font-semibold text-foreground tracking-normal"
              >
                {MODELS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                disabled={!canAnalyze}
                onClick={() => void handleAnalyze()}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Analyzing..." : "Analyze Image"}
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-border/70 bg-muted/35 p-3">
              <label
                htmlFor="analysis-result"
                className="text-xs font-semibold text-muted-foreground"
              >
                Analysis Result
              </label>
              <textarea
                id="analysis-result"
                value={result}
                onChange={(event) => setResult(event.target.value)}
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
