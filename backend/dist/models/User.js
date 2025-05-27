"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["student", "lecturer", "admin"],
        required: true,
    },
});
const User = (0, mongoose_1.model)("User", UserSchema);
exports.User = User;
//# sourceMappingURL=User.js.map