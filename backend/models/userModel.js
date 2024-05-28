import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },

    fullName: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],

    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],

    profileImg: {
        type: String,
        default: ""
    },

    link: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        default: ""
    },

    coverImg: {
        type: String,
        default: ""
    },

    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }],

}, {
    timestamps: true
});


const userModel = mongoose.model("User", userSchema);

export default userModel;