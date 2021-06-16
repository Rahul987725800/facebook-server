"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const likeSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Post',
    },
}, {
    timestamps: true,
});
const Like = mongoose_1.model('Like', likeSchema);
exports.default = Like;
//# sourceMappingURL=Like.js.map