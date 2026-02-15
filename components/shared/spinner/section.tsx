import { Spinner } from "@/components/ui/spinner";
import React from "react";

const SectionSpinner = () => {
  return (
    <div className="flex flex-col gap-3 justify-center items-center min-h-50">
      <Spinner />
      <p>Loading...</p>
    </div>
  );
};

export { SectionSpinner };
