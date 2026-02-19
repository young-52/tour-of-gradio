import Link from "next/link";

export default function Home() {
  return (
    <div className="flex w-full items-center justify-center dark:bg-black">
      <main className="flex flex-col gap-8 items-center justify-center bg-white dark:bg-black sm:items-start mb-20">
        <div className="flex flex-col items-center justify-center gap-2">
          <h3 className="text-xl font-bold">LLM? 프롬프팅? 그라디오?</h3>
          <div className="flex flex-col items-center justify-center gap-1">
            <h1 className="text-3xl font-bold">복잡한 현대 세상,</h1>
            <h1 className="text-3xl font-bold">쉽게 배워보자!</h1>
          </div>
        </div>
        <Link
          href="/tours/what-is-llm"
          className="relative mx-auto block h-15 w-40 overflow-hidden border border-primary text-primary transition-all duration-200 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:m-auto before:h-0 before:w-0 before:rounded-sm before:bg-primary before:duration-300 before:ease-out hover:text-primary-foreground hover:before:h-40 hover:before:w-[100%] hover:before:opacity-80"
        >
          <span className="relative w-full h-full flex items-center justify-center text-xl font-semibold">
            알아보기 →
          </span>
        </Link>
      </main>
    </div>
  );
}
