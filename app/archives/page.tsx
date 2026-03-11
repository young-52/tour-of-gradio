import { ArrowUpRight } from "lucide-react";
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

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
        {gradioExamples.map((example, index) => (
          <Link
            key={example.slug}
            href={`/archives/${example.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
              <Image
                src={example.imageSrc}
                alt={example.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 300px"
                priority={index < 3}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  {example.category}
                </span>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-hover:text-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h2 className="line-clamp-1 text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                  {example.title}
                </h2>
                <p className="line-clamp-4 text-xs text-muted-foreground leading-relaxed">
                  {example.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
