"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = exports.deleteCloudinaryFile = exports.cloudinary = exports.uploadLogo = exports.uploadAvatar = exports.uploadProductImage = exports.uploadBanner = exports.uploadDocument = exports.uploadProfile = exports.uploadPartenaireLogo = exports.uploadEventImages = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const env_1 = require("../env");
cloudinary_1.v2.config({
    cloud_name: env_1.env.CLOUD_NAME,
    api_key: env_1.env.CLOUDINARY_API_KEY,
    api_secret: env_1.env.CLOUDINARY_API_SECRET,
});
const partenaireLogoStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
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
    },
});
const profileStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
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
    },
});
const documentStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "professional_documents",
        allowed_formats: ["jpg", "png", "jpeg", "pdf", "doc", "docx"],
        resource_type: "auto",
    },
});
const bannerStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "banners",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        transformation: [{
                width: 1200,
                height: 600,
                crop: "fill",
                quality: "auto:good"
            }],
    },
});
const productImageStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "products",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        transformation: [{
                width: 800,
                height: 800,
                crop: "fill",
                quality: "auto:good"
            }],
    },
});
const avatarStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
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
    },
});
const eventStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "events",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        transformation: [{
                width: 1200,
                height: 800,
                crop: "fill",
                quality: "auto:good"
            }],
    },
});
exports.uploadEventImages = (0, multer_1.default)({
    storage: eventStorage,
    limits: { fileSize: 5 * 1024 * 1024 }
});
exports.uploadPartenaireLogo = (0, multer_1.default)({
    storage: partenaireLogoStorage,
    limits: { fileSize: 5 * 1024 * 1024 }
});
exports.uploadProfile = (0, multer_1.default)({
    storage: profileStorage,
    limits: { fileSize: 5 * 1024 * 1024 }
});
exports.uploadDocument = (0, multer_1.default)({
    storage: documentStorage,
    limits: { fileSize: 10 * 1024 * 1024 }
});
exports.uploadBanner = (0, multer_1.default)({
    storage: bannerStorage,
    limits: { fileSize: 5 * 1024 * 1024 }
});
exports.uploadProductImage = (0, multer_1.default)({
    storage: productImageStorage,
    limits: { fileSize: 5 * 1024 * 1024 }
});
exports.uploadAvatar = (0, multer_1.default)({
    storage: avatarStorage,
    limits: { fileSize: 3 * 1024 * 1024 }
});
exports.uploadLogo = exports.uploadPartenaireLogo;
const deleteCloudinaryFile = async (publicId) => {
    try {
        await cloudinary_1.v2.uploader.destroy(publicId);
        console.log(`Fichier Cloudinary supprimé: ${publicId}`);
    }
    catch (error) {
        console.error(`Erreur lors de la suppression du fichier Cloudinary ${publicId}:`, error);
        throw error;
    }
};
exports.deleteCloudinaryFile = deleteCloudinaryFile;
const uploadToCloudinary = async (filePath, options = {}) => {
    try {
        const result = await cloudinary_1.v2.uploader.upload(filePath, {
            folder: options.folder || "uploads",
            transformation: options.transformation,
            public_id: options.public_id,
        });
        return {
            url: result.secure_url,
            public_id: result.public_id
        };
    }
    catch (error) {
        console.error("Erreur lors de l'upload vers Cloudinary:", error);
        throw error;
    }
};
exports.uploadToCloudinary = uploadToCloudinary;
//# sourceMappingURL=cloudinary.js.map