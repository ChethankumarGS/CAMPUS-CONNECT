"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const responseHandler_1 = require("../utils/responseHandler");
const router = (0, express_1.Router)();
router.post("/signup", auth_controller_1.registerUser);
router.post("/login", auth_controller_1.loginUser);
router.post("/logout", auth_middleware_1.authenticate, (_req, res) => {
    (0, responseHandler_1.sendResponse)(res, 200, true, "Logged out successfully", null);
    return;
});
router.get("/verify", auth_controller_1.verifyToken);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map