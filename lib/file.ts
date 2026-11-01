import fs from "fs/promises";

export const saveFileToStorage = async (folderName: string, file: File) => {
  // create folder
  await fs.mkdir(`storage/${folderName}`, { recursive: true });

  //   create file
  const extension = file.name.split(".").pop();

  const safeTitle = file.name?.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();

  const filePath = `storage/${folderName}/${safeTitle}-${Date.now()}.${extension}`;

  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  return { filePath };
};
