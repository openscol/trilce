// Preparación de archivos en el navegador antes de subirlos al bucket exam-sheets.

const MAX_SIDE = 2000;
export const MAX_PDF_BYTES = 20 * 1024 * 1024; // límite del bucket

// Reduce la imagen para que pese poco (y endereza la orientación de la cámara).
export async function toJpeg(file: File): Promise<Blob | null> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return null;
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
}

// El PDF se sube tal cual; las imágenes, reducidas a JPEG.
export async function prepareUpload(file: File): Promise<{ blob: Blob; ext: "pdf" | "jpg"; contentType: string } | { error: string }> {
  if (file.type === "application/pdf") {
    if (file.size > MAX_PDF_BYTES) return { error: `${file.name} pesa más de 20 MB.` };
    return { blob: file, ext: "pdf", contentType: "application/pdf" };
  }
  const blob = await toJpeg(file);
  if (!blob) return { error: `No se pudo abrir ${file.name}: debe ser una imagen o un PDF.` };
  return { blob, ext: "jpg", contentType: "image/jpeg" };
}
