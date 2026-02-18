"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protect_1 = require("../../../middlewares/protect");
const favorites_controller_1 = require("./favorites.controller");
const router = express_1.default.Router();
router.post('/toggle/:postId', protect_1.protect, favorites_controller_1.toggleFavorite);
exports.default = router;
//# sourceMappingURL=favorites.routes.js.map