"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSchema = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
exports.authSchema = ({ email = true, password = true, username = true, }) => {
    return joi_1.default.object({
        email: email && joi_1.default.string().email().lowercase().required(),
        password: password && joi_1.default.string().min(3).required(),
        username: username && joi_1.default.string().required(),
    });
};
//# sourceMappingURL=validationSchema.js.map