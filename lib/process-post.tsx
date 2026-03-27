import fs from "node:fs";
import path from "node:path";
import { type CompileMDXResult, compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import ExampleBox from "@/components/example-box";
import GradioExamplesByCategory from "@/components/gradio-examples-by-category";
import HelloWorld from "@/components/hello-world";
import HotspotAudio from "@/components/hotspot-audio";
import HotspotImage from "@/components/hotspot-image";
import ImageShowcase from "@/components/image-showcase";
import LlmNextTokenDemo from "@/components/llm-next-token-demo";
import PromptingMethodDemo from "@/components/prompting-method-demo";
import SystemPromptDemo from "@/components/system-prompt-demo";
import VoiceShowcase from "@/components/voice-showcase";

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
        rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]],
      },
    },
    components: {
      HelloWorld,
      ExampleBox,
      GradioExamplesByCategory,
      LlmNextTokenDemo,
      PromptingMethodDemo,
      SystemPromptDemo,
      HotspotAudio,
      HotspotImage,
      VoiceShowcase,
      ImageShowcase,
    },
  });
}
