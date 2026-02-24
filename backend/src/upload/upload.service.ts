import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { UploadResult } from './interfaces/upload-result.interface';

@Injectable()
export class UploadService {
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];
  private readonly maxFileSize = 10 * 1024 * 1024;

  //single image upload

  async uploadImage(
    file: Express.Multer.File,
    folder = 'autovault/vehicles',
  ): Promise<UploadResult> {
    this.validateFile(file);

    return new Promise((resolve, reject) => {
      // upload_stream is Cloudinary v2's way of uploading from a buffer.
      // We can't use the simple upload() method because multer gives us
      // a buffer in memory, not a file path on disk.
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            {
              width: 1920,
              height: 1080,
              crop: 'limit', // Shrinks if larger, never upscales
              quality: 'auto:good', // Cloudinary picks optimal quality
              fetch_format: 'auto', // Serves WebP to browsers that support it
            },
          ],
        },
        (error, result) => {
          if (error) return reject(new BadRequestException(error.message));
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            size: result.bytes,
          });
        },
      );

      // Convert the multer buffer to a readable stream, then pipe into Cloudinary
      Readable.from(file.buffer).pipe(stream);
    });
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
    folder = 'autovault/vehicles',
  ): Promise<UploadResult[]> {
    if (!files?.length) throw new BadRequestException('No files provided');
    if (files.length > 20)
      throw new BadRequestException('Max 20 images per listing');

    return Promise.all(files.map((file) => this.uploadImage(file, folder)));
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) throw new BadRequestException('No file provided');

    if (!this.allowedMimeTypes.includes(file.mimetype))
      throw new BadRequestException('Only JPEG, PNG, WebP images are allowed');

    if (file.size > this.maxFileSize)
      throw new BadRequestException('File too large. Maximum size is 10MB');
  }
}
