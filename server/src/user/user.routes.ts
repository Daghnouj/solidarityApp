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
  getCurrentUser
} from "./user.controller";
import { protect } from "../../middlewares/protect";
import { uploadProfile } from "../../config/cloudinary/cloudinary";

const router = express.Router();

router.get("/profile/me", protect, getProfile);
router.get("/profile/:userId", protect, getProfile);
router.put("/profile/:userId", updateProfile);
router.put("/profile/:userId/password", updatePassword);
router.put("/profile/:userId/photo", uploadProfile.single("photo"), updateProfilePhoto);
router.delete("/profile/:userId", deleteProfile);
router.put("/profile/:userId/deactivate", deactivateAccount);
router.put("/profile/:userId/activate", activateAccount);
router.get('/me', protect, getCurrentUser);
router.get('/:id', protect, getUserById);  
 
export default router;