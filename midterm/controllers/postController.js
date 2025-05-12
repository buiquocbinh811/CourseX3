import Post from '../models/Post.js';
//http://localhost:8080/api/posts?apiKey=...
const createPost = async (req, res) => {
    try {
        //ktra dau vao
        const { content } = req.body;
        const userId = req.user._id;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Content is required'
            });
        }

        //tao moi post
        const newPost = await Post.create({
            userId,
            content
        });

        res.status(201).json({
            success: true,
            message: 'Create post successfully',
            data: newPost
        });

    } catch (error) {
        console.error('Error create post', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export default {createPost};