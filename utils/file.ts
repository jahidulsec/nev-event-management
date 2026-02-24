"use server";

import fs from "fs/promises";
import fs2 from "fs";

export const deleteFile = async (filePath: string) => {
  if (fs2.existsSync(filePath)) {
    await fs.unlink(filePath);
  }
};
