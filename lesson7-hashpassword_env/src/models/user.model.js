import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {type: String},
    email : {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, default: "user"},          
    salt: {type: String}
})
const UserModel = mongoose.model('users', userSchema);
export default UserModel;