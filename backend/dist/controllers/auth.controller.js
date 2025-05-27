"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.loginUser = exports.registerUser = void 0;
const User_1 = require("../models/User");
const auth_1 = require("../utils/auth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responseHandler_1 = require("../utils/responseHandler");
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        // Check if the user already exists
        const existingUser = yield User_1.User.findOne({ email });
        if (existingUser) {
            (0, responseHandler_1.sendResponse)(res, 400, false, "User already exists", null);
            return;
        }
        // Hash the password and create the user
        const hashedPassword = yield (0, auth_1.hashPassword)(password);
        const newUser = new User_1.User({ name, email, password: hashedPassword, role });
        yield newUser.save();
        (0, responseHandler_1.sendResponse)(res, 201, false, "User registered successfully", null);
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.User.findOne({ email }).select("+password");
        if (!user) {
            (0, responseHandler_1.sendResponse)(res, 404, false, "User not found", null);
            return;
        }
        const isMatch = yield (0, auth_1.comparePassword)(password, user.password);
        if (!isMatch) {
            (0, responseHandler_1.sendResponse)(res, 401, false, "Invalid credentials", null);
            return;
        }
        const userObject = user.toObject();
        delete userObject.password;
        const token = (0, auth_1.generateToken)(userObject);
        (0, responseHandler_1.sendResponse)(res, 200, true, "Login successful", {
            user: userObject,
            token,
        });
        return;
    }
    catch (error) {
        console.error("Login error:", error);
        return (0, responseHandler_1.sendResponse)(res, 500, false, "Login failed", null);
    }
});
exports.loginUser = loginUser;
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        (0, responseHandler_1.sendResponse)(res, 401, false, "No token provided", null);
        return;
    }
    try {
        // Verify the token using your secret key
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Fetch the user from the database using the ID from the decoded token
        const user = yield User_1.User.findById(decoded.userId).select("-password");
        if (!user) {
            (0, responseHandler_1.sendResponse)(res, 404, false, "User not found", null);
            return;
        }
        // Return the user data
        (0, responseHandler_1.sendResponse)(res, 200, true, "User found", user);
        return;
    }
    catch (error) {
        (0, responseHandler_1.sendResponse)(res, 401, false, "Invalid token", null);
        return;
    }
});
exports.verifyToken = verifyToken;
//# sourceMappingURL=auth.controller.js.map