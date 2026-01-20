import { UploadApiResponse } from 'cloudinary';

export interface CloudinaryFile extends Express.Multer.File {
  buffer: Buffer;
}
// Also export CloudinaryUploadResult if needed
export interface CloudinaryUploadResult extends UploadApiResponse {}