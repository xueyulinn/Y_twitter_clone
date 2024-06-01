import User from '../models/userModel.js';
import Notification from '../models/notificationModel.js';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

export const getUserProfile = async (req, res) => {

    const { userName } =  req.params;

    try {
        const currentUser = await User.findOne({ userName }).select("-password");
        res.status(200).json(currentUser);
    } catch (error) {
        console.log('error in getUserProfile', error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const followUnfollow = async (req, res) => {
    const { targetId } = req.params;
    const currentUserId = req.user._id;


    if (targetId === currentUserId) {
        return res.status(400).json({ message: "You cannot follow yourself" });
    }

    try {
        const currentUser = req.user;

        const isFollowing = currentUser.following.includes(targetId);

        if (isFollowing) {
            // unfollow
            await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetId } });
            await User.findByIdAndUpdate(targetId, { $pull: { followers: currentUserId } });

            res.status(200).json({ message: "Unfollow successfully" });
        } else {
            // follow
            await User.findByIdAndUpdate(currentUserId, { $push: { following: targetId } });
            await User.findByIdAndUpdate(targetId, { $push: { followers: currentUserId } });


            const notification = new Notification({
                from: currentUserId,
                to: targetId,
                type: "follow",
            });

            notification.save();

            res.status(200).json({ message: "Follow successfully" });

        }


    } catch (error) {
        console.log('error in followUnfollow', error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getSuggestedUsers = async (req, res) => {
    /**query random 10 users excprt currentuser
     * then filter out the users that current user is following
     */
    const currentUserId = req.user._id;

    try {
        // returns user with following property
        const usersFollowed = await User.findById(currentUserId).select("following");

        // console.log('usersFollowed', usersFollowed);

        const aggregate = await User.aggregate([
            // mongoDB aggregation pipelines
            {
                $match: { _id: { $ne: currentUserId } }
            },

            {
                $sample: { size: 10 },

            }
        ])

        const suggestedUsers = aggregate.filter(user => !usersFollowed.following.includes(user._id));

        suggestedUsers.forEach(user => {
            user.password = undefined;
        });

        res.status(200).json(suggestedUsers);

    } catch (error) {
        console.log('error in getSuggestedUsers', error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    const { userName, fullName, email, bio, newPassword, oldPassword, link } = req.body;
    let { profileImg, coverImg } = req.body;

    try {
        const currentUser = await User.findById(req.user._id);

        // validate password
        if ((!newPassword && oldPassword) || (!oldPassword && newPassword)) {
            return res.status(400).json({ message: "Please enter both old and new password" });
        }

        if (newPassword && oldPassword) {
            if (newPassword.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters" });
            }

            const isCorrect = await bcrypt.compare(oldPassword, currentUser.password);

            if (!isCorrect) {
                return res.status(400).json({ message: "Incorrect old password" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            currentUser.password = hashedPassword;
        }

        // validate username
        if (userName) {
            const existingUser = await User.findOne({ userName });

            if (existingUser && existingUser._id !== req.user._id) {
                return res.status(400).json({ message: "Username is already taken" });
            }


        }

        // validate email
        if (email) {
            const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!emailReg.test(email)) {
                return res.status(400).json({ message: "Invalid email" });
            }
        }

        // modify imgs
        if (profileImg) {
            // "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg"
            if (currentUser.profileImg) {
                await cloudinary.uploader.destroy(currentUser.profileImg.split("/").pop().split(".")[0]);
            }
            await cloudinary.uploader.upload(profileImg);

        }

        if (coverImg) {
            if(currentUser.coverImg){
                await cloudinary.uploader.destroy(currentUser.coverImg.split("/").pop().split(".")[0]);
            }
            await cloudinary.uploader.upload(coverImg);
        }

        currentUser.userName = userName || currentUser.userName;
        currentUser.fullName = fullName || currentUser.fullName;
        currentUser.email = email || currentUser.email;
        currentUser.bio = bio || currentUser.bio;
        currentUser.link = link || currentUser.link;
        currentUser.profileImg = profileImg || currentUser.profileImg;
        currentUser.coverImg = coverImg || currentUser.coverImg;


        await currentUser.save();

        currentUser.password = undefined;

        res.status(200).json(currentUser);

    } catch (error) {
        console.log('error in updateProfile', error.message);
        res.status(500).json({ message: "Internal server error" });
    }







};