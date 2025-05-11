import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, 'Name is required'],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        require: [true, 'Email is required'],
         unique: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address',
        ],
    },
    password: {
        type: String,
        require: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false, // tránh đề xuất password khi tìm kiếm
    },
 
}, { timestamps: true });// Add createdAt and updatedAt fields

// hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
const User = mongoose.model('User', userSchema);
export default User;