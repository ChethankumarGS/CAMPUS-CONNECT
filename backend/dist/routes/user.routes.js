"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["admin"]), user_controller_1.getAllUsers);
router.get("/:id", auth_middleware_1.authenticate, user_controller_1.getUserById);
router.put("/:id", user_controller_1.updateUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map