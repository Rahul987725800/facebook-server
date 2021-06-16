"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: String,
    password: String,
    email: String,
    posts: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
}, {
    timestamps: true,
});
const User = mongoose_1.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map