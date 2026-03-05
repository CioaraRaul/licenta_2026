import { axiosInstance, HttpError } from "./http.api";
import axios from "axios";
import type {
  UploadResponse,
  UploadManyResponse,
} from "~/interface/upload.interface";

/** POST /upload/image — încarcă o singură imagine în Cloudinary */
export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const { data } = await axiosInstance.post<UploadResponse>(
      "/upload/image",
      formData,
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new HttpError(
        error.response.status,
        error.response.statusText ?? "",
        error.response.data,
      );
    }
    throw new Error("Upload failed. Please try again.");
  }
}

/** POST /upload/images — încarcă mai multe imagini (max 20) */
export async function uploadImages(files: File[]): Promise<UploadManyResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  try {
    const { data } = await axiosInstance.post<UploadManyResponse>(
      "/upload/images",
      formData,
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new HttpError(
        error.response.status,
        error.response.statusText ?? "",
        error.response.data,
      );
    }
    throw new Error("Upload failed. Please try again.");
  }
}

/** DELETE /upload/:publicId — șterge o imagine din Cloudinary după publicId */
export async function deleteImage(publicId: string): Promise<void> {
  // publicId poate conține slash-uri (ex: "autovault/abc123") — le encodăm
  const encodedId = encodeURIComponent(publicId);

  try {
    await axiosInstance.delete(`/upload/${encodedId}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new HttpError(
        error.response.status,
        error.response.statusText ?? "",
        error.response.data,
      );
    }
    throw new Error("Delete failed. Please try again.");
  }
}
