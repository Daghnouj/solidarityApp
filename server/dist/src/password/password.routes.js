"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const password_controller_1 = require("./password.controller");
const router = (0, express_1.Router)();
router.post("/forgot-password", password_controller_1.passwordController.forgotPassword);
router.post("/verify-otp/:id", password_controller_1.passwordController.verifyOTP);
router.post("/change-password/:id", password_controller_1.passwordController.changePassword);
router.get("/health", password_controller_1.passwordController.healthCheck);
exports.default = router;
//# sourceMappingURL=password.routes.js.map