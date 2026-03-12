import { ArrowUpLeft, Maximize } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { gradioExamples } from "@/lib/gradio-examples";

export function generateStaticParams() {
  return gradioExamples.map((example) => ({
    slug: example.slug,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const example = gradioExamples.find((item) => item.slug === slug);

  if (!example) {
    notFound();
  }

  return (
    <section className="flex flex-col items-center w-full mx-auto mt-24 gap-6">
      <div className="flex flex-col w-full max-w-3xl items-start gap-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-2 items-start">
            <Link
              href="/archives"
              className="flex justify-center gap-1 text-muted-foreground hover:text-foreground transition-all"
            >
              <ArrowUpLeft size={18} className="inline mt-0.5" />
              <span className="font-medium">그라디오 아카이브</span>
            </Link>
            <h1 className="text-3xl font-bold">{example.title}</h1>
          </div>
          <Link
            href={example.href}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-foreground hover:text-primary transition-all"
          >
            <Maximize size={30} />
          </Link>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {example.description}
        </p>
      </div>
      {/* <div className="flex items-start justify-between gap-4">
        <Link
          href="/archives"
          className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-accent"
        >
          ← 뒤로가기
        </Link>
        <a
          href={example.href}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-muted-foreground underline underline-offset-4"
        >
          원본 Spaces 열기
        </a>
      </div> */}

      <div className="flex w-full max-w-6xl overflow-hidden rounded-sm border border-border bg-card">
        <iframe
          src={example.embedSrc}
          title={example.title}
          className="block min-h-[70vh] w-full"
          loading="lazy"
          allow="clipboard-write; web-share"
        />
      </div>
    </section>
  );
}
