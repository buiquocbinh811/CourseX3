import express from 'express';
import authController from '../controllers/authController.js';


const router = express.Router();
// @desc Register a new user
// @route POST /api/auth/register
// @access public
router.post('/register', authController.registerUser);
// @desc Authenticate user and generate access Token
// @ route POST /api/auth/login
// eaccess public
router.post('/login', authController.loginUser);
export default router;