// cloudinary.types.ts - MIS À JOUR
export interface CloudinaryFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  path: string;
  size: number;
  filename: string;
  // Propriétés spécifiques à Cloudinary
  url?: string;
  public_id?: string;
  secure_url?: string;
  format?: string;
  width?: number;
  height?: number;
  // Propriétés de multer qui pourraient manquer
  stream?: any;
  destination?: string;
  buffer?: Buffer;
}

export interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

// No need to extend anything - just define what you need
export interface ProfileParams {
  folder: string;
  allowed_formats: string[];
  transformation: Array<{
    width: number;
    height: number;
    crop: string;
    quality: string;
  }>;
}

export interface DocumentParams {
  folder: string;
  allowed_formats: string[];
  resource_type: string;
}