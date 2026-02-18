"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("./comment.controller");
const protect_1 = require("../../../middlewares/protect");
const router = express_1.default.Router();
router.post('/:postId/comment', protect_1.protect, comment_controller_1.addComment);
router.post('/:postId/comments/:commentId/reply', protect_1.protect, comment_controller_1.addReply);
router.put('/:postId/comments/:commentId', protect_1.protect, comment_controller_1.updateComment);
router.delete('/:postId/comments/:commentId', protect_1.protect, comment_controller_1.deleteComment);
router.put('/:postId/comments/:commentId/replies/:replyId', protect_1.protect, comment_controller_1.updateReply);
router.delete('/:postId/comments/:commentId/replies/:replyId', protect_1.protect, comment_controller_1.deleteReply);
exports.default = router;
//# sourceMappingURL=comment.routes.js.map