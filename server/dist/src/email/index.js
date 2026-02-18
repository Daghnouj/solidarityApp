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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplates = exports.emailService = void 0;
var email_service_1 = require("./email.service");
Object.defineProperty(exports, "emailService", { enumerable: true, get: function () { return email_service_1.emailService; } });
var email_templates_1 = require("./email.templates");
Object.defineProperty(exports, "EmailTemplates", { enumerable: true, get: function () { return email_templates_1.EmailTemplates; } });
__exportStar(require("./email.types"), exports);
//# sourceMappingURL=index.js.map