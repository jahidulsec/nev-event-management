"use client";

import React from "react";
import { Download } from "lucide-react";
import { ActionButton } from "./button";

const DownloadButton = ({
  filePath,
  fileName,
}: {
  fileName?: string;
  filePath: string;
}) => {
  const [pending, startTransition] = React.useTransition();

  const handleDownload = async () => {
    const linkBtn = document.createElement("a");
    const url = "/api/download/?file_path=" + filePath;
    linkBtn.href = url;
    linkBtn.download = filePath.split("/").pop() ?? "";
    document.body.appendChild(linkBtn);
    linkBtn.click();

    document.body.removeChild(linkBtn);
    URL.revokeObjectURL(url);
  };

  return (
    <ActionButton
      variant={'outline'}
      isPending={pending}
      onClick={() => {
        startTransition(async () => {
          await handleDownload();
        });
      }}
    >
      <Download /> Template
    </ActionButton>
  );
};

export { DownloadButton };
