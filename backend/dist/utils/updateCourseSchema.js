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
const Course_1 = require("../models/Course");
const Material_1 = require("../models/Material");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function updateCourseSchema() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            yield mongoose_1.default.connect(process.env.MONGODB_URI);
            console.log("Connected to MongoDB");
            // 1. Add courseCode field if missing
            const coursesWithoutCode = yield Course_1.Course.find({
                courseCode: { $exists: false },
            });
            for (const course of coursesWithoutCode) {
                // Generate a default course code if none exists
                const defaultCode = `${course.title
                    .substring(0, 3)
                    .toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
                yield Course_1.Course.findByIdAndUpdate(course._id, {
                    $set: { courseCode: defaultCode },
                });
            }
            console.log(`Updated ${coursesWithoutCode.length} courses with course codes`);
            // 2. Link existing materials to courses
            const materials = yield Material_1.Material.find({});
            for (const material of materials) {
                // Update the course to include this material in its materials array
                yield Course_1.Course.findByIdAndUpdate(material.courseId, {
                    $addToSet: { materials: material._id },
                });
            }
            console.log(`Linked ${materials.length} materials to their respective courses`);
            console.log("Migration completed successfully");
        }
        catch (error) {
            console.error("Migration failed:", error);
        }
        finally {
            yield mongoose_1.default.disconnect();
            console.log("Disconnected from MongoDB");
        }
    });
}
// Run the migration
updateCourseSchema().catch(console.error);
//# sourceMappingURL=updateCourseSchema.js.map