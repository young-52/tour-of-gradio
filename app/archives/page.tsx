import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { gradioExamples } from "@/lib/gradio-examples";

export default function Page() {
  return (
    <section className="flex w-full flex-col mt-20 gap-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-semibold">그라디오 아카이브</h1>
        <p className="text-lg font-base text-center">
          Hugging Face Spaces에 공유된 다양한 그라디오 앱을 모아둔 공간입니다.
        </p>
      </div>
      <Separator />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {gradioExamples.map((example, index) => (
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
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 200px"
                priority={index < 4}
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
