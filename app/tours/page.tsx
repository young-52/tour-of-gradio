import { ToursList } from "@/app/tours/tours-list";
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
  ).sort(([, a], [, b]) => a.id - b.id);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto mt-30 gap-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">LLM & 그라디오 톺아보기</h1>
        <p className="text-lg font-base text-muted-foreground text-center">
          눈으로 보고 키보드로 치며 배우는
          <br />
          인터랙티브 LLM 학습 콘텐츠
        </p>
      </div>
      <Separator />
      <ToursList data={data} />
    </div>
  );
}
