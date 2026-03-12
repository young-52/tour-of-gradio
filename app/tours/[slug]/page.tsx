import { ArrowUpLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import AppearAnimation from "@/components/appear-animation";
import PostNavigation from "@/components/post-navigation";
import { Button } from "@/components/ui/button";
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
  const data = (
    await Promise.all(
      getAllPostFileNames().map(async (fileName) => {
        const { frontmatter } = await getContentAndFrontmatter(fileName);
        return [fileName, frontmatter] as const;
      }),
    )
  ).sort(([, a], [, b]) => a.id - b.id);

  try {
    const { frontmatter, content } = await getContentAndFrontmatter(slug);

    return (
      <AppearAnimation asChild>
        <div className="mdx flex flex-col max-w-3xl mx-auto mt-24 gap-10">
          <Link href="/tours">
            <Button
              variant="ghost"
              className="w-full gap-1 text-muted-foreground hover:text-foreground hover:bg-transparent"
            >
              <ArrowUpLeft className="size-4" />
              <span>LLM & 그라디오 톺아보기</span>
            </Button>
          </Link>
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl">{frontmatter.icon}</h1>
            <h1 className="text-3xl font-bold">{frontmatter.title}</h1>
            <h3 className="text-xl font-semibold">{frontmatter.description}</h3>
            <br />
            <Separator />
            <br />
            <article className="prose dark:prose-invert text-justify">
              {content}
            </article>
            <PostNavigation
              slug={slug}
              subDir="tours"
              order={data.map(([fileName]) => fileName)}
            />
          </div>
        </div>
      </AppearAnimation>
    );
  } catch {
    notFound();
  }
}
