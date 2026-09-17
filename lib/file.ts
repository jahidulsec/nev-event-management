import fs from "fs/promises";

export const saveFilesToStorage = async (folderName: string, files: File[]) => {
  if (files.length === 0) return [];

  // create folder
  await fs.mkdir(`storage/${folderName}`, { recursive: true });

  const savedFiles: { filePath: string }[] = [];

  //   create files
  for (const i of files) {
    const extension = i.name.split(".").pop();

    const safeTitle = i.name?.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();

    const filePath = `storage/${folderName}/${safeTitle}-${Date.now()}.${extension}`;

    await fs.writeFile(filePath, Buffer.from(await i.arrayBuffer()));

    savedFiles.push({ filePath });
  }

  return savedFiles;
};
