import express from 'express';
import protectRoute from '../middleware/protectRoute.js';

import { comment, createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getPostsByUserName, likeUnlike } from '../controllers/postController.js';

const router = express.Router();

router.post('/create', protectRoute, createPost);

router.delete('/delete/:id', protectRoute, deletePost);

router.post('/like/:id', protectRoute, likeUnlike);

router.post('/comment/:id', protectRoute, comment);

router.get('/all', protectRoute, getAllPosts);

router.get('/like/:id', protectRoute, getLikedPosts);

router.get('/following', protectRoute, getFollowingPosts);

router.get('/:userName', protectRoute, getPostsByUserName);

export default router;