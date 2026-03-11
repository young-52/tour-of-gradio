import Image from "next/image";
import Link from "next/link";
import { gradioExamples } from "@/lib/gradio-examples";

export default function Page() {
  return (
    <section className="flex w-full flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Gradio Archives</h1>
        <p className="text-sm text-muted-foreground">
          Hugging Face Spaces에 공유된 예시들을 모아둔 공간입니다.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {gradioExamples.map((example) => (
          <Link
            key={example.slug}
            href={`/archives/${example.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:border-foreground/30"
          >
            <div className="relative aspect-video w-full bg-muted">
              <Image
                src={example.imageSrc}
                alt={example.title}
                fill
                className="object-cover transition duration-300 group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-3">
              <span className="text-xs text-muted-foreground">
                {example.category}
              </span>
              <h2 className="line-clamp-2 text-sm font-semibold">
                {example.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
