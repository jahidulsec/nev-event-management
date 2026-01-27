import { Loader } from "lucide-react";

const SectionLoader = () => {
  return (
    <div className="flex justify-center items-center w-full min-h-40">
      <Loader className="text-primary animate-spin size-8" />
    </div>
  );
};

export { SectionLoader };
