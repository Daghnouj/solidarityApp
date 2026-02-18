"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const protect_1 = require("../../middlewares/protect");
const router = (0, express_1.Router)();
router.post('/', protect_1.protect, review_controller_1.ReviewController.createReview);
router.get('/professional/:professionalId', review_controller_1.ReviewController.getReviewsByProfessional);
router.get('/professional/:professionalId/my-review', protect_1.protect, review_controller_1.ReviewController.getUserReview);
router.delete('/:reviewId', protect_1.protect, review_controller_1.ReviewController.deleteReview);
exports.default = router;
//# sourceMappingURL=review.routes.js.map