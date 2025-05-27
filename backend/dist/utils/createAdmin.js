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
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../models/User");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./auth");
dotenv_1.default.config();
const createAdminUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGODB_URI);
        auth_1.hashPassword;
        const hashedPassword = yield (0, auth_1.hashPassword)("password");
        const adminUser = new User_1.User({
            name: "Admin",
            email: "admin@campusconnect.com",
            password: hashedPassword,
            role: "admin",
        });
        yield adminUser.save();
        console.log("Admin user created successfully");
    }
    catch (error) {
        console.error("Error creating admin user:", error);
    }
    finally {
        yield mongoose_1.default.disconnect();
    }
});
createAdminUser();
//# sourceMappingURL=createAdmin.js.map