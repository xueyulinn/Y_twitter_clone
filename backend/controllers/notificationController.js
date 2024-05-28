import Notification from "../models/notificationModel.js";



export const getAllNotifications = async (req, res) => {
    try {
        const { _id } = req.user._id;
        const notifications = await Notification.find({ to: _id })
            .sort({ createdAt: -1 })
            .populate("from", "profileImg userName");

        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ message: "No Notifications Found" });
        }

        res.status(200).json(notifications);


    } catch (error) {
        console.log("Error in getAllNotifications: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const deleteAllNotifications = async (req, res) => {
    try {
        const { _id } = req.user._id;
        await Notification.deleteMany({ to: _id });

        res.status(200).json({ message: "All Notifications Deleted" });
    } catch (error) {
        console.log("Error in deleteAllNotifications: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};