// cloudinary.ts - MIS À JOUR
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { env } from "../env";

// Configuration Cloudinary
cloudinary.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// Storage pour les logos de partenaires
const partenaireLogoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "partenaires/logos",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "svg", "gif"],
    transformation: [{
      width: 300,
      height: 300,
      crop: "fill",
      gravity: "auto",
      quality: "auto:good"
    }],
  } as any,
});

// Storage pour les photos de profil
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profiles",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{
      width: 500,
      height: 500,
      crop: "fill",
      gravity: "face",
      quality: "auto:good"
    }],
  } as any,
});

// Storage pour les documents
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "professional_documents",
    allowed_formats: ["jpg", "png", "jpeg", "pdf", "doc", "docx"],
    resource_type: "auto",
  } as any,
});

// Storage pour les bannières ou images générales
const bannerStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "banners",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{
      width: 1200,
      height: 600,
      crop: "fill",
      quality: "auto:good"
    }],
  } as any,
});

// Storage pour les images de produits/services
const productImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{
      width: 800,
      height: 800,
      crop: "fill",
      quality: "auto:good"
    }],
  } as any,
});

// Storage pour les avatars/utilisateurs
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatars",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{
      width: 200,
      height: 200,
      crop: "fill",
      gravity: "face",
      quality: "auto:good"
    }],
  } as any,
});
const blogStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blog",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{
      width: 1200,
      height: 800,
      crop: "fill",
      quality: "auto:good"
    }],
  } as any,
});

export const uploadBlogImage = multer({
  storage: blogStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const eventStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "events",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{
      width: 1200,
      height: 800,
      crop: "fill",
      quality: "auto:good"
    }],
  } as any,
});

export const uploadEventImages = multer({
  storage: eventStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
// Export des différents uploaders
export const uploadPartenaireLogo = multer({
  storage: partenaireLogoStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadProfile = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadDocument = multer({
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export const uploadBanner = multer({
  storage: bannerStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadProductImage = multer({
  storage: productImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 3 * 1024 * 1024 } // 3MB limit
});

// Alias pour compatibilité (si vous avez déjà du code qui utilise uploadProfile pour les logos)
// Vous pouvez utiliser uploadProfile pour les profils et uploadPartenaireLogo pour les logos de partenaires
export const uploadLogo = uploadPartenaireLogo;

// Export de cloudinary pour les opérations manuelles
export { cloudinary };

// Fonctions utilitaires
export const deleteCloudinaryFile = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Fichier Cloudinary supprimé: ${publicId}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression du fichier Cloudinary ${publicId}:`, error);
    throw error;
  }
};

export const uploadToCloudinary = async (
  filePath: string,
  options: {
    folder?: string;
    transformation?: any[];
    public_id?: string;
  } = {}
): Promise<{ url: string; public_id: string }> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: options.folder || "uploads",
      transformation: options.transformation,
      public_id: options.public_id,
    });

    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error("Erreur lors de l'upload vers Cloudinary:", error);
    throw error;
  }
};