import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  getAllPostFileNames,
  getContentAndFrontmatter,
} from "@/lib/process-post";

export default async function Page() {
  const postFileNames = getAllPostFileNames();

  const data = (
    await Promise.all(
      postFileNames.map(async (fileName) => {
        const { frontmatter } = await getContentAndFrontmatter(fileName);
        return [fileName, frontmatter] as const;
      }),
    )
  ).sort(([, a], [, b]) => b.id - a.id);

  return (
    <div className="flex flex-col w-full mt-20 gap-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-semibold">LLM & 그라디오 톺아보기</h1>
        <p className="text-lg font-base text-center">
          눈으로 보고 키보드로 치며 배우는
          <br />
          인터랙티브 LLM 학습 콘텐츠
        </p>
      </div>
      <Separator />
      <div className="flex flex-col gap-7">
        {data.map(([fileName, frontmatter]) => (
          <div key={frontmatter.title} className="flex items-center gap-6">
            <span className="text-xl font-base text-muted-foreground">
              #{frontmatter.id}
            </span>
            <div className="flex flex-col gap-1.5">
              <Link
                href={`/tours/${fileName}`}
                className="text-lg font-semibold"
              >
                {frontmatter.icon} {frontmatter.title}
              </Link>
              <div className="text-sm">{frontmatter.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
