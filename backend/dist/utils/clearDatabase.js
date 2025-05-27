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
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User");
const Course_1 = require("../models/Course");
const Material_1 = require("../models/Material");
dotenv_1.default.config();
const clearDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Connecting to MongoDB...");
        yield mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
        console.log("Clearing Users...");
        yield User_1.User.deleteMany({});
        console.log("All users cleared.");
        console.log("Clearing Courses...");
        yield Course_1.Course.deleteMany({});
        console.log("All courses cleared.");
        console.log("Clearing Materials...");
        yield Material_1.Material.deleteMany({});
        console.log("All materials cleared.");
        console.log("Database cleared successfully.");
    }
    catch (error) {
        console.error("Error clearing database:", error);
    }
    finally {
        yield mongoose_1.default.disconnect();
        console.log("Disconnected from MongoDB");
    }
});
clearDatabase();
//# sourceMappingURL=clearDatabase.js.map