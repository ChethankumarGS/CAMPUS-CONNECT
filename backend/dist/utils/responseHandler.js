"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, statusCode, success, message, data = null) => {
    const response = {
        success,
        message,
        data,
    };
    return res.status(statusCode).json(response);
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=responseHandler.js.map