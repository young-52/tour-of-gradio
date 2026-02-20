import { notFound } from "next/navigation";
import AppearAnimation from "@/components/appear-animation";
import PostNavigation from "@/components/post-navigation";
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
          <PostNavigation
            slug={slug}
            subDir="tours"
            order={data.map(([fileName]) => fileName)}
          />
        </div>
      </AppearAnimation>
    );
  } catch {
    notFound();
  }
}
