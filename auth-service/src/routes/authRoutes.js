import express from 'express';
import {signup, login, currUser, refresh, logout} from '../controllers/authController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.get('/currUser', authenticate, currUser);

router.post('/refresh', refresh);

router.post('/logout', logout);

export default router;