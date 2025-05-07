import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          message: "Missing email or password"
        });
      }

      // Check if user exists
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }

      // Generate random string for apiKey
      const randomString = crypto.randomBytes(32).toString('hex');
      
      // Create apiKey format: web-{userId}$-${email}-${randomString}
      const apiKey = `web-${user._id}$-${email}-${randomString}`;

      res.status(200).json({
        message: "Login successful",
        apiKey
      });

    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  },

  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Validate input
      if (!email || !password || !name) {
        return res.status(400).json({
          message: "Missing required fields"
        });
      }

      // Check if user exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "Email already registered"
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = await UserModel.create({
        name,
        email,
        password: hashPassword,
        role: "user",
        salt
      });

      res.status(201).json({
        message: "Registration successful",
        user: {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  }
};

export default authController;