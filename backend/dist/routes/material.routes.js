"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const material_controller_1 = require("../controllers/material.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const uploadMiddleware_1 = __importDefault(require("../middlewares/uploadMiddleware"));
const router = express_1.default.Router();
router.post("/:courseId", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["lecturer"]), uploadMiddleware_1.default.single("file"), material_controller_1.uploadMaterial);
router.get("/:courseId", auth_middleware_1.authenticate, material_controller_1.getMaterialsByCourse);
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["lecturer", "admin"]), material_controller_1.deleteMaterial);
exports.default = router;
//# sourceMappingURL=material.routes.js.map