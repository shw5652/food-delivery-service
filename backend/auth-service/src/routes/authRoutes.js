import express from 'express';
import {signup, login, currUser, refresh, logout} from '../controllers/authController.js';
import authenticate from '../middleware/authMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

router.post(
    '/signup', 
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Enter a valid email'),
        body('password').isLength({min:8}).withMessage('Password must be at least 8 characters long').matches(/\d/).withMessage('Password must contain a number')
    ],
    signup
);

router.post(
    '/login',
    [
      body('email').isEmail().withMessage('Enter a valid email'),
      body('password').notEmpty().withMessage('Password is required')
    ],
    login
  );

router.get('/currUser', authenticate, currUser);

router.post('/refresh', refresh);

router.post('/logout', logout);

export default router;