// user.routes.ts - AVEC VOS ROUTES EXACTES
import express from "express";
import {
  getProfile,
  updateProfile,
  updatePassword,
  updateProfilePhoto,
  deleteProfile,
  deactivateAccount,
  activateAccount,
  getUserById,
  getCurrentUser,
  getAllUsers
} from "./user.controller";
import { protect } from "../../middlewares/protect";
import { uploadProfile } from "../../config/cloudinary/cloudinary";
import { protectAdmin } from "../../middlewares/protectAdmin";

const router = express.Router();

router.get("/profile/me", protect, getProfile);
router.get("/profile/:userId", protect, getProfile);
router.put("/profile/:userId", protect, updateProfile);
router.put("/profile/:userId/password", protect, updatePassword);
router.put("/profile/:userId/photo", protect, uploadProfile.single("photo"), updateProfilePhoto);
router.delete("/profile/:userId", protect, deleteProfile);
router.put("/profile/:userId/deactivate", protect, deactivateAccount);
router.put("/profile/:userId/activate", protect, activateAccount);
router.get('/me', protect, getCurrentUser);
router.get('/:id', protect, getUserById);
router.get('/', protect, getAllUsers);


export default router;