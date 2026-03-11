import ExampleBox from "@/components/example-box";
import { gradioExampleSections } from "@/lib/gradio-examples";

export default function GradioExamplesByCategory({
  category,
}: {
  category: string;
}) {
  const section = gradioExampleSections.find(
    (item) => item.category === category,
  );

  if (!section) {
    return null;
  }

  return section.examples.map((example) => (
    <ExampleBox
      key={example.slug}
      src={example.imageSrc}
      alt={example.title}
      href={example.href}
      desc={example.description}
    />
  ));
}
