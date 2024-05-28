import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";


import { v2 as cloudinary } from 'cloudinary';

export const createPost = (async (req, res) => {
    try {
        const { text, img } = req.body;
        const { _id } = req.user._id;
        const post = new Post({
            user: req.user._id,
            text,
            img
        });



        const currentUser = await User.findById(_id);


        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }


        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            post.img = uploadedResponse.secure_url;
        }


        const createdPost = await post.save();

        res.status(201).json(createdPost);

    } catch (error) {
        console.log('error in createPost', error.message);
        res.status(500).json({ message: "Internal server error" });
    }

});

export const deletePost = (async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "You are not authorized to delete this post" });
        }

        if (post.img) {
            await cloudinary.uploader.destroy(post.img.split('/').pop().split('.')[0]);
        }

        await Post.deleteOne({
            _id: id
        });

        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log('error in deletePost', error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

export const likeUnlike = (async (req, res) => {
    try {
        const { id: postId } = req.params;

        const { _id: userId } = req.user._id;

        const targetPost = await Post.findById(postId);

        const currentUser = await User.findById(userId);

        if (!targetPost) {
            return res.status(404).json({ message: "Post not found" });
        }


        if (targetPost.likes.includes(userId)) {
            // unlike
            targetPost.likes = targetPost.likes.filter(like => like._id.toString() !== userId.toString());
            // Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            currentUser.likedPosts = currentUser.likedPosts.filter(post => post._id.toString() !== postId.toString());
        } else {
            // like
            targetPost.likes.push(userId);
            currentUser.likedPosts.push(postId);
            const notification = new Notification({
                from: userId,
                to: targetPost.user,
                type: "like",
                read: false
            });

            // because notification is an exising document
            // save() will update instead of creating a new one
            await notification.save();
        }

        await targetPost.save();
        await currentUser.save();
        res.status(200).json(targetPost);

    } catch (error) {
        console.log('error in likeUnlike', error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

export const comment = (async (req, res) => {
    try {
        const { id: postId } = req.params;
        const { text } = req.body;
        const { _id: userId } = req.user._id;

        const targetPost = await Post.findById(postId);

        if (!targetPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        console.log('userId', userId);

        const comment = {
            text,
            user: userId
        };

        const notification = new Notification({
            from: userId,
            to: targetPost.user,
            type: "comment",
            read: false
        });

        targetPost.comments.push(comment);

        await targetPost.save();

        res.status(200).json(targetPost);

    } catch (error) {
        console.log('error in comment', error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

export const getAllPosts = (async (req, res) => {
    try {
        const { _id: userId } = req.user._id;
        const allPosts = await Post.find({ user: userId }).sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: " _id userName profileImg"
            }).populate({
                path: "comments.user",
                select: " _id userName profileImg"
            });

        if (!allPosts) {
            return res.status(404).json({ message: "Posts not found" });
        }

        res.status(200).json(allPosts);

    } catch (error) {
        console.log('error in getAllPosts', error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

export const getLikedPosts = (async (req, res) => {
    try {
        const { _id: userId } = req.user._id;

        const currentUser = await User.findById(userId);

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!currentUser.likedPosts || currentUser.likedPosts.length === 0) {
            return res.status(404).json({ message: "No liked posts found" });
        }

        console.log('currentUser.likedPosts', currentUser.likedPosts);

        const likedPosts = await Post.find({ _id: { $in: currentUser.likedPosts } })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: " _id userName profileImg"
            }).populate({
                path: "comments.user",
                select: " _id userName profileImg"

            });

        res.status(200).json(likedPosts);


    } catch (error) {
        console.log('error in getLikedPosts', error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

export const getFollowingPosts = (async (req, res) => {
    try {
        const { _id: userId } = req.user._id;

        const currentUser = await User.findById(userId).select("following");

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!currentUser.following || currentUser.following.length === 0) {
            return res.status(404).json({ message: "No followings" });
        }

        const followingPosts = await Post.find({ user: { $in: currentUser.following } })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: " _id userName profileImg"
            }).populate({
                path: "comments.user",
                select: " _id userName profileImg"
            });

        res.status(200).json(followingPosts);


    } catch (error) {
        console.log('error in getFollowingPosts', error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

export const getPostsByUserName = (async (req, res) => {
    try {
        const { userName } = req.params;

        // used findOne instead of find 
        // find will return an array of objects only used
        // when we want to return multiple objects
        const currentUser = await User.findOne({ userName });

        console.log('userName', userName);

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }


        const posts = await Post.find({ user: currentUser._id })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: " _id userName profileImg"
            }).populate({
                path: "comments.user",
                select: " _id userName profileImg"
            });

        res.status(200).json(posts);


    } catch (error) {
        console.log('error in getPostsByUserName', error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});