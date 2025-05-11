import User from '../models/User.js';
import bcrypt from 'bcrypt';    


const registerUser = async (req, res) => {
    try {
        // lấy thông tin từ request body
        const { username, email, password } = req.body;
        // check input rỗng
        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'Please fill required fields',
            });
        }
        // check exist email

        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return res.status(400).json({
                message: 'Email already exists',
            });
        }
        // Hash password with JWT_SECRET, secret soalt
        const salt = await bcrypt.genSalt(10);
        const combinedPassword = password + process.env.JWT_SECRET; 
        const hashedPassword = await bcrypt.hash(combinedPassword, salt);

        // creat new user
        const newUser = await User.create({
            username,
            email,
            password:hashedPassword,
            salt
        });

        res.status(201).json({
            message: 'User created successfully',
            username: newUser.username,
            email: newUser.email
        });
        
    } catch (error) {
    console.log('Register erorr ', error);
    res.status(400).json({
      data: null,
      success: false,
      error: error?.message,
    });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user with password
        const user = await User.findOne({ email }).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

     // Compare password with JWT_SECRET
        const combinedPassword = password + process.env.JWT_SECRET;
        const isMatch = await bcrypt.compare(combinedPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        //apikey format: mern-userId$-email$-timestamp
        const timestamp = Date.now();
        const apiKey = `mern-${user._id}$-${email}$-${timestamp}`;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            apiKey
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const authController = {
    registerUser,
    loginUser,
};
export default authController;