// ─── Cloudinary upload result ─────────────────────────────────────────────────

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  /** File size in bytes */
  size: number;
}

// ─── API responses ────────────────────────────────────────────────────────────

export interface UploadResponse {
  message: string;
  image: UploadResult;
}

export interface UploadManyResponse {
  message: string;
  images: UploadResult[];
}
