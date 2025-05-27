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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const User_1 = require("../models/User");
const responseHandler_1 = require("../utils/responseHandler");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find().select("-password");
        (0, responseHandler_1.sendResponse)(res, 200, true, "Users fetched successfully", users);
        return;
    }
    catch (error) {
        (0, responseHandler_1.sendResponse)(res, 500, false, "Failed to fetch users", null);
        return;
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findById(req.params.id).select("-password");
        if (!user) {
            (0, responseHandler_1.sendResponse)(res, 404, false, "User not found", null);
            return;
        }
        (0, responseHandler_1.sendResponse)(res, 200, true, "User fetched successfully", user);
        return;
    }
    catch (error) {
        (0, responseHandler_1.sendResponse)(res, 500, false, "Failed to fetch user", null);
        return;
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email, role } = req.body;
    try {
        const updatedUser = yield User_1.User.findByIdAndUpdate(id, { name, email, role }, { new: true });
        if (!updatedUser) {
            (0, responseHandler_1.sendResponse)(res, 404, false, "User not found", null);
            return;
        }
        (0, responseHandler_1.sendResponse)(res, 200, true, "User successfully updated", updatedUser);
        return;
    }
    catch (error) {
        (0, responseHandler_1.sendResponse)(res, 500, false, "Server error", null);
        return;
    }
});
exports.updateUser = updateUser;
//# sourceMappingURL=user.controller.js.map