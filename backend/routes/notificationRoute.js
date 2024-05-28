import { Router } from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { getAllNotifications, deleteAllNotifications } from '../controllers/notificationController.js';
const router = Router();


router.get('/', protectRoute, getAllNotifications);

router.delete('/', protectRoute, deleteAllNotifications);

export default router;