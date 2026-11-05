import type { CmsMediaItem } from "../types";

interface CmsEnvelope<T> {
  success: boolean;
  data: T | null;
  error?: {
    code?: string;
    message?: string;
    details?: { field?: string; message: string }[];
  } | null;
}

interface UploadTicket {
  ticketId: string;
  uploadUrl: string;
  path: string;
  expiresIn: number;
}

export interface MediaUploadResult {
  media: CmsMediaItem;
  isDuplicate: boolean;
}

export interface UploadMediaFileOptions {
  file: File;
  altText?: string;
  onProgress?: (percent: number) => void;
}

export class MediaUploadError extends Error {
  constructor(message: string, readonly code?: string) {
    super(message);
    this.name = "MediaUploadError";
  }
}

function redirectToExpiredSession() {
  if (typeof window !== "undefined") {
    window.location.assign("/?sesi=berakhir");
  }
}

async function readEnvelope<T>(response: Response): Promise<CmsEnvelope<T> | null> {
  try {
    return (await response.json()) as CmsEnvelope<T>;
  } catch {
    return null;
  }
}

function errorMessage(
  payload: CmsEnvelope<unknown> | null,
  fallback: string
): string {
  const detail = payload?.error?.details?.[0]?.message;
  return detail ? `${payload?.error?.message || fallback} (${detail})` : payload?.error?.message || fallback;
}

function toResult(payload: CmsEnvelope<CmsMediaItem> | null): MediaUploadResult {
  if (!payload?.data?.url) {
    throw new MediaUploadError("Berkas selesai diunggah tetapi datanya belum bisa dibaca. Muat ulang halaman ini.");
  }
  return {
    media: payload.data,
    isDuplicate: Boolean(payload.data.isDuplicate),
  };
}

async function readImageDimensions(
  file: File
): Promise<{ width?: number; height?: number }> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return {};
  }

  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      const dimensions =
        bitmap.width > 0 && bitmap.height > 0
          ? { width: bitmap.width, height: bitmap.height }
          : {};
      bitmap.close();
      return dimensions;
    } catch {
      // Fall back to an Image element below.
    }
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const dimensions =
        image.naturalWidth > 0 && image.naturalHeight > 0
          ? { width: image.naturalWidth, height: image.naturalHeight }
          : {};
      URL.revokeObjectURL(objectUrl);
      resolve(dimensions);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({});
    };
    image.src = objectUrl;
  });
}

function putFileToSignedUrl(
  uploadUrl: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", uploadUrl);
    request.setRequestHeader("Content-Type", file.type);
    request.setRequestHeader("x-upsert", "false");

    request.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)));
      }
    };

    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        onProgress?.(100);
        resolve();
        return;
      }

      let detail = "";
      try {
        const parsed = JSON.parse(request.responseText);
        detail = parsed?.message || parsed?.error || "";
      } catch {
        // Keep the generic message when the storage error body is not JSON.
      }
      reject(
        new MediaUploadError(
          detail
            ? `Penyimpanan media menolak berkas ini: ${detail}`
            : "Penyimpanan media menolak berkas ini. Periksa ukuran dan jenis berkas lalu coba lagi.",
          "UPLOAD_REJECTED"
        )
      );
    };

    request.onerror = () => {
      reject(
        new MediaUploadError(
          "Koneksi ke penyimpanan media terputus. Periksa jaringan lalu coba lagi.",
          "UPLOAD_NETWORK_ERROR"
        )
      );
    };

    request.ontimeout = () => {
      reject(
        new MediaUploadError(
          "Unggahan memakan waktu terlalu lama. Coba lagi dengan koneksi yang lebih stabil.",
          "UPLOAD_TIMEOUT"
        )
      );
    };

    request.send(file);
  });
}

async function uploadViaMultipart(
  file: File,
  altText?: string
): Promise<MediaUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  if (altText?.trim()) {
    formData.append("altText", altText.trim());
  }

  const response = await fetch("/api/cms/media", {
    method: "POST",
    body: formData,
  });
  const payload = await readEnvelope<CmsMediaItem>(response);

  if (response.status === 401) {
    redirectToExpiredSession();
    throw new MediaUploadError("Sesi staf sudah berakhir. Silakan masuk kembali.", "AUTHENTICATION_REQUIRED");
  }

  if (!response.ok || !payload?.success) {
    throw new MediaUploadError(
      errorMessage(payload, "Berkas gagal diunggah. Silakan coba lagi."),
      payload?.error?.code
    );
  }

  return toResult(payload);
}

/**
 * Uploads a file straight to Supabase Storage through a short-lived signed URL, then asks
 * the backend to verify object metadata and persist the media row. Falls back to the local
 * multipart endpoint when the backend is still configured with `STORAGE_DRIVER=local`.
 */
export async function uploadMediaFile({
  file,
  altText,
  onProgress,
}: UploadMediaFileOptions): Promise<MediaUploadResult> {
  const dimensions = await readImageDimensions(file);
  const cleanAlt = altText?.trim() || undefined;

  const ticketResponse = await fetch("/api/cms/media/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      originalName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      altText: cleanAlt,
      width: dimensions.width,
      height: dimensions.height,
    }),
  });
  const ticketPayload = await readEnvelope<UploadTicket>(ticketResponse);

  if (ticketResponse.status === 401) {
    redirectToExpiredSession();
    throw new MediaUploadError("Sesi staf sudah berakhir. Silakan masuk kembali.", "AUTHENTICATION_REQUIRED");
  }

  if (!ticketResponse.ok || !ticketPayload?.success) {
    const code = ticketPayload?.error?.code;
    if (code === "DIRECT_UPLOAD_DISABLED" || code === "DIRECT_UPLOAD_REQUIRED") {
      return uploadViaMultipart(file, cleanAlt);
    }
    throw new MediaUploadError(
      errorMessage(ticketPayload, "Tautan unggah belum bisa dibuat. Silakan coba lagi."),
      code
    );
  }

  const ticket = ticketPayload.data;
  if (!ticket?.uploadUrl || !ticket.ticketId) {
    throw new MediaUploadError("Tautan unggah tidak lengkap. Silakan coba lagi.", "INVALID_UPLOAD_TICKET");
  }

  await putFileToSignedUrl(ticket.uploadUrl, file, onProgress);

  const confirmBody = JSON.stringify({
    ticketId: ticket.ticketId,
    altText: cleanAlt,
    width: dimensions.width,
    height: dimensions.height,
  });

  let confirmResponse: Response;
  try {
    confirmResponse = await fetch("/api/cms/media/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: confirmBody,
    });
  } catch {
    // One retry covers a transient network drop after the bytes already reached storage.
    confirmResponse = await fetch("/api/cms/media/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: confirmBody,
    });
  }

  const confirmPayload = await readEnvelope<CmsMediaItem>(confirmResponse);

  if (confirmResponse.status === 401) {
    redirectToExpiredSession();
    throw new MediaUploadError("Sesi staf sudah berakhir. Silakan masuk kembali.", "AUTHENTICATION_REQUIRED");
  }

  if (!confirmResponse.ok || !confirmPayload?.success) {
    throw new MediaUploadError(
      errorMessage(
        confirmPayload,
        "Berkas sudah terkirim tetapi gagal dicatat. Muat ulang Pustaka Media lalu coba lagi."
      ),
      confirmPayload?.error?.code
    );
  }

  return toResult(confirmPayload);
}
