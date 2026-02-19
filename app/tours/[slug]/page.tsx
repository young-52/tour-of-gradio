import { notFound } from "next/navigation";
import AppearAnimation from "@/components/appear-animation";
import { Separator } from "@/components/ui/separator";
import {
  getAllPostFileNames,
  getContentAndFrontmatter,
} from "@/lib/process-post";

export async function generateStaticParams() {
  return getAllPostFileNames().map((fileName) => ({
    slug: fileName,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const { frontmatter, content } = await getContentAndFrontmatter(slug);

    return (
      <AppearAnimation asChild>
        <div className="mdx flex flex-col gap-4">
          <h1 className="text-5xl">{frontmatter.icon}</h1>
          <h1 className="text-3xl font-bold">{frontmatter.title}</h1>
          <h3 className="text-xl font-semibold">{frontmatter.description}</h3>
          <br />
          <Separator />
          <br />
          <article className="prose dark:prose-invert text-justify">
            {content}
          </article>
        </div>
      </AppearAnimation>
    );
  } catch {
    notFound();
  }
}
