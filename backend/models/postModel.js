import e from "express";
import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    text: {
        type: String,
        max: 500
    },

    img: {
        type: String,
    },

    comments: [
        // this is as subdocument and mongoose
        // will create a _id for each subdocument
        {
            text: {
                type: String,
                max: 100,
                required: true
            },

            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        }
    ],

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ]


}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;