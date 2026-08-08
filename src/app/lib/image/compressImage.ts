/** Kompresuje obraz do JPEG data URL (max bok, jakość) pod Vision API. */
export async function compressImageToDataUrl(
  file: File,
  options?: { maxSide?: number; quality?: number }
): Promise<string> {
  const maxSide = options?.maxSide ?? 1280;
  const quality = options?.quality ?? 0.72;

  if (!file.type.startsWith("image/")) {
    throw new Error("Wybierz plik graficzny (JPG, PNG lub WebP)");
  }

  const maxBytes = 8 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error("Zdjęcie jest za duże (max 8 MB)");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Nie udało się przetworzyć zdjęcia");
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  if (dataUrl.length > 1_200_000) {
    const tighter = canvas.toDataURL("image/jpeg", 0.55);
    if (tighter.length > 1_350_000) {
      throw new Error("Zdjęcie nadal za duże po kompresji — wybierz inne");
    }
    return tighter;
  }

  return dataUrl;
}
