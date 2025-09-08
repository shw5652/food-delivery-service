import express from 'express';
import {signup, login, currUser} from '../controllers/authController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.get('/currUser', authenticate, currUser);

export default router;