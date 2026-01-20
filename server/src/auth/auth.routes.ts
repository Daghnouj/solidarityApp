import express from "express";
import { protect } from "../../middlewares/protect";
import { uploadDocument } from "../../config/cloudinary/cloudinary";
import { validate, authValidation } from "../../middlewares/validator"; 
import * as authController from "./auth.controller";

const router = express.Router();

// Routes avec validation
router.post("/signup", uploadDocument.single('documents'),
  validate(authValidation.signup), 
  authController.signup
); 

router.post("/login", 
  validate(authValidation.login),
  authController.login
);
 
// Routes existantes
router.post("/request",uploadDocument.single("document"), authController.submitRequest);
router.post("/logout", protect, authController.logoutUser);
router.get("/me", protect, authController.getMe);

export default router;