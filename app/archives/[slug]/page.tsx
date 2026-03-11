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
    <section className="flex w-full flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
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
      </div>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{example.category}</p>
        <h1 className="text-2xl font-bold">{example.title}</h1>
        <p className="text-sm text-muted-foreground">{example.description}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <iframe
          src={example.embedSrc}
          title={example.title}
          className="block min-h-[80vh] w-full"
          loading="lazy"
          allow="clipboard-write; web-share"
        />
      </div>
    </section>
  );
}
