import express from 'express';
import postController from '../controllers/postController.js';
import { checkApiKey } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', checkApiKey, postController.createPost);

export default router;