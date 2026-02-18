"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRoutes = exports.passwordService = exports.passwordController = void 0;
var password_controller_1 = require("./password.controller");
Object.defineProperty(exports, "passwordController", { enumerable: true, get: function () { return password_controller_1.passwordController; } });
var password_service_1 = require("./password.service");
Object.defineProperty(exports, "passwordService", { enumerable: true, get: function () { return password_service_1.passwordService; } });
__exportStar(require("./password.types"), exports);
var password_routes_1 = require("./password.routes");
Object.defineProperty(exports, "passwordRoutes", { enumerable: true, get: function () { return __importDefault(password_routes_1).default; } });
//# sourceMappingURL=index.js.map