"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    body: String,
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    comments: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
    likes: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Like',
        },
    ],
}, {
    timestamps: true,
});
const Post = mongoose_1.model('Post', postSchema);
exports.default = Post;
//# sourceMappingURL=Post.js.map