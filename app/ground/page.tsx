import Workspace from "@/components/ground/workspace";

export default function Page() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Workspace isFull={true} />
    </div>
  );
}
