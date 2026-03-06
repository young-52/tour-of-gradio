import Image from "next/image";
import Link from "next/link";

interface ImageBoxProps {
  src: string; // 선택적으로 변경하여 undefined 대응
  alt: string;
  href: string;
  desc: string;
}

export default function ExampleBox({ src, alt, href, desc }: ImageBoxProps) {
  return (
    <div className="flex flex-col mb-16">
      <div className="flex flex-col border border-border px-4 pt-3 gap-0 bg-card">
        <div className="flex gap-2">
          <div className="flex rounded-lg px-2 items-center justify-center border border-ring">
            <span className="font-semibold text-foreground text-sm">예시</span>
          </div>
          <Link href={href} className="font-semibold text-card-foreground">
            {alt}
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">👉 {desc}</p>
      </div>
      <div className="relative aspect-video w-full">
        <Image src={src} alt={alt} fill className="object-contain" />
      </div>
    </div>
  );
}
