import express from 'express';
import mongoose from 'mongoose';
import UserModel from './models/user.model.js';
const app = express();
const PORT = 8080;

// (1) nếu cần đọc JSON body
// thif dufng middleware này
app.use(express.json());

const connectToDB = async () => {
  try {
    const URI = 'mongodb://localhost:27017/facebook-clone';
    await mongoose.connect(URI);
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};
//****CRUD API for User
//POST: Create a User

app.post('/users', async(req, res) => {
  const { username, email, fullname, address} = req.body;
  const user = new UserModel({
    username,
    email,
    fullname,
    address
  });
  try {
    const createdUser = await user.save();//insert to db
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(`[ERROR] - `, error?.message);
    res.status(400).json({
      message: error.message,
    });
  }
})

// GET
// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.error(`[ERROR] - `, error?.message);
    res.status(400).json({
      message: error.message,
    });
  }
});

// GET
// Get single user
app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      });
    }
    res.json(user);
  } catch (error) {
    console.error(`[ERROR] - `, error?.message);
    res.status(400).json({
      message: error.message,
    });
  }
});
//Lesson 4

//Tập luyện
// Áp dụng các kiến thức được học, thay vì xử lý với json-server, file db.json 
// hãy sử dụng mongodb và mongoose để giải quyết các yêu cầu của Lesson 3,
//  tuy nhiên sẽ có một chút khác biệt như: email cần duy nhất, id sẽ sử 
//  dụng _id mặc định của MongoDB.
//tương tự bên lesson 5 e đã làm rồi


//start sever affter connecting
const startServer = async () => {
  await connectToDB();

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
};

startServer();
