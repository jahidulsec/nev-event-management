"use client";

import * as pdfjsLib from "pdfjs-dist";

// Set worker (IMPORTANT for Next.js)
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

export async function convertPdfToImage(pdfData: string, pageNumber: number) {
  const loadTask = pdfjsLib.getDocument(pdfData);
  const pdf = await loadTask.promise;
  const page = await pdf.getPage(pageNumber);
  const scale = 1.5;
  const viewport = page.getViewport({ scale });

  // convert to canvas
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  if (!context) {
    throw new Error("Canvas context not available");
  }

  // render the page into canvus
  await page.render({
    canvasContext: context,
    viewport,
    canvas,
  }).promise;

  //   get image url
  const imageDataUrl = canvas.toDataURL("image/png");
  return imageDataUrl;
}
