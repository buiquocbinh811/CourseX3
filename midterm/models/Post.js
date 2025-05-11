import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        content: {
            type: String,
            required: [true, "Content is required"],
        },},
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;