import fs from "node:fs";
import path from "node:path";
import { type CompileMDXResult, compileMDX } from "next-mdx-remote/rsc";
import HelloWorld from "@/components/hello-world";
import LlmNextTokenDemo from "@/components/llm-next-token-demo";
import PromptingMethodDemo from "@/components/prompting-method-demo";
import SystemPromptDemo from "@/components/system-prompt-demo";

const postsDirectory = path.join(process.cwd(), "tours");

export type Frontmatter = {
  id: number;
  icon: string;
  title: string;
  description: string;
};

export function getAllPostFileNames() {
  const allFiles = fs.readdirSync(postsDirectory);
  const mdxFiles = allFiles.filter((file) => file.endsWith(".mdx"));
  return mdxFiles.map((file) => file.replace(".mdx", ""));
}

export async function getContentAndFrontmatter(
  fileName: string,
): Promise<CompileMDXResult<Frontmatter>> {
  const postFilePath = path.join(postsDirectory, `${fileName}.mdx`);
  const post = fs.readFileSync(postFilePath, "utf8");

  return await compileMDX({
    source: post,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        format: "mdx",
      },
    },
    components: {
      HelloWorld,
      LlmNextTokenDemo,
      PromptingMethodDemo,
      SystemPromptDemo,
    },
  });
}
