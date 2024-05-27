import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { followUnfollow, getSuggestedUsers, getUserProfile, updateProfile } from '../controllers/userController.js';

const router = express.Router();

router.get("/profile/:userName", protectRoute, getUserProfile);

router.post("/follow/:targetId", protectRoute, followUnfollow);

router.get("/getSuggestedUsers", protectRoute, getSuggestedUsers);

router.put("/updateProfile", protectRoute, updateProfile);


export default router;