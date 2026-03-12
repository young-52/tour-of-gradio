import Workspace from "@/components/ground/workspace";

export default function Page() {
  return (
    <div className="flex mt-24 justify-center items-center w-full h-[80dvh]">
      <Workspace isFull={true} />
    </div>
  );
}
