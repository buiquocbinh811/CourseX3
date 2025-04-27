import express, { application } from 'express';

const app = express();

app.use(express.json());

const PORT = 8080;



// app.get('/posts', (req, res) => {
//   const endpoint = 'http://localhost:8081/posts';
//   fetch(endpoint)
//     .then((jsonObject) => {
//       return jsonObject.json();
//     })
//     .then((data) => {
//       //Logic calculate data before response to Client
//       // ...
//       res.json(data);
//     })
//     .catch((error) => console.log(error));
// });
//get all users
app.get('/users', async (req, res) => {
  const endpoint = 'http://localhost:8081/users';
  const jsonObj = await fetch(endpoint);
  const data = await jsonObj.json();
  res.json(data);
})
// Client --> (Gửi GET /users) --> Server 8080
// Server 8080 --> (fetch dữ liệu) --> Server 8081
// Server 8081 --> (trả về JSON) --> Server 8080
// Server 8080 --> (trả về JSON cho Client)
//create new user
app.post("/users", async (req, res) => {
  const {userName} = req.body;

  try {
    if(!userName){
      throw new Error('Missing user name field')
  }
  //Get user data
  const endpoint = 'http://localhost:8081/users';
  const jsonObj = await fetch(endpoint);
  const usersData = await jsonObj.json();
  const nextUserId = usersData?.length+ 1;
  const newUser = {
    userName,
    id: `US00${nextUserId}`,
  }

  const newUserJson = await fetch(endpoint,{
    method: 'POST',
    body: JSON.stringify(newUser),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const newUserData = await newUserJson.json();

  // console.log('newUser', newUser);
  return res.status(201).json({
    message: 'Create user successfully',
    data: newUserData
  });

  } catch (error) {
    console.log('[ERROR]: ', error);
    res.status(400).json({
      data: null,
      success: false,
      error: error?.message,
    });
  }
});

//Bài 2: Viết API cho phép user tạo bài post (thêm bài post, xử lý id tương tự user).
app.post("/posts", async (req, res)=>{
  const {content, userId, views} = req.body;
  try {
    //B1 validation du lieu
    if(!content || !userId){
      throw new Error('Missing required field: contents, userids')
  }
  //B2 prepare db
  const postJson = await fetch("http://localhost:8081/posts");
  const postData = await postJson.json();
  const newPostId = postData > 9 ? `PS0${postData.length+1}` :`PS00${postData.length+1}`
  const newPost = {
    id: newPostId,
    content,
    userId,
    views: !views ? 1: views
  }
    
  //Buoc 3: insert to db

  const createdPostJson = await fetch('http://localhost:8081/posts',{
    method: 'POST',
    body: JSON.stringify(newPost),
    headers: {
      'Content-Type': 'application/json'
    }

  })

  const createdPostData= await createdPostJson.json();

  return res.status(201).json({
    message: 'Create user successfully',
    data: createdPostData
  });
  } catch (error) {
    console.log('[ERROR]: ', error);
    res.status(400).json({
      data: null,
      success: false,
      error: error?.message,
    });
  }
})

// Bài 3: Viết API cho phép user chỉnh sửa lại bài post 
// (chỉ user tạo bài viết mới được phép chỉnh sửa).
app.put("/posts/:id", async(req, res)=>{
  const postId = req.params?.id;
  const {views, content, userId} = req.body;

  try {
    const existingPostJson = await fetch(`http://localhost:8081/posts/${postId}`);
    const existingPost = await existingPostJson.json();
    if(!existingPost){
      throw new Error('Post not found');
    }
    if(existingPost.userId !== userId){
      throw new Error('You are not authorized to alter the post')//status 403
    }
    const updatingPost = {
      views,
      userId,
      id: postId,
      content
    }
    //update to database
    const updatedPostJson =  await fetch(`http://localhost:8081/posts/${postId}`,{
      method: 'PUT',
      body: JSON.stringify(updatingPost),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const updatedPostData= await updatedPostJson.json();

    return res.status(200).json({
      message: 'Updated post successfully',
      data: updatedPostData
    });
  } catch (error) {
    console.log('[ERROR]: ', error);
    res.status(400).json({
      data: null,
      success: false,
      error: error?.message,
    });
  }

})

// Bài 4: Viết API cho phép user được comment vào bài post
// dùng post
app.post("/comments", async(req, res)=>{
  try {
    const {content, userId, postId} = req.body;
    //B1 validation du lieu
    if(!content || !userId || !postId){
      throw new Error('Missing required field: contents, userid, postids')}
    // B2 chuan bi data
    const commentsJson = await fetch('http://localhost:8081/comments');
    const commentsData = await commentsJson.json();

    const newCommentId = commentsData.length >9? `CMT0${commentsData.length+1}` :`CMT00${commentsData.length+1}`
    const newComment={
      id: newCommentId,
      content,
      userId,
      postId
    };
    //Buoc 3 : inserto db -> return data to client
    const createdCommentJson = await fetch('http://localhost:8081/comments',{
      method: 'POST',
      body: JSON.stringify(newComment),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const createCommentData = await createdCommentJson.json();
    res.status(201).json({
      message: 'Create a new comment successfully',
      data: createCommentData
    })
  } catch (error) {
    console.log('[ERROR]: ', error);
    res.status(400).json({
      data: null,
      success: false,
      error: error?.message,
    });
  }
})

// Bài 5: Viết API cho phép user chỉnh sửa comment 
// (chỉ user tạo comment mới được sửa)
app.put("/comments/:id", async(req, res) =>{
  const commentId = req.params?.id;
  const {content, userId, postId} = req.body;
  try {
    // kiem tra comment ton tai, va user hop le
    const existingCommentJson = await fetch(`http://localhost:8081/comments/${commentId}`);
    const existComment = await existingCommentJson.json();
    if(!existComment){
      throw new Error('Comment not found');
    }
    if (existComment.userId != userId){
      throw new Error('You have not authorized to change the comment');
    }
    const updateComment ={
      userId,
      postId,
      content
    };

    // update du lieu len db
    const updateCommentJson = await fetch(`http://localhost:8081/comments/${commentId}`,{
      method: 'PUT',
      body: JSON.stringify(updateComment),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const updateCommentData = await updateCommentJson.json();
    res.json({
      message: 'Comment is updated successfully',
      data: updateCommentData
    })
  } catch (error) {
    console.log('[ERROR]: ', error);
    res.status(400).json({
      data: null,
      success: false,
      error: error?.message,
    });
  }
})
//B1 validation

// Bài 6: Viết API lấy tất cả comment của một bài post.
//dung get
app.get('/comments/:postId', async(req, res)=>{
  const {postId} = req.params;
  try {
    //ktra postid ko hop le
    if(!postId){
      throw new Error('Post id is not valid')
    }

    const commentsJson = await fetch('http://localhost:8081/comments');
    const commentsData = await commentsJson.json();

    //loc comment cho post id
    const postComments = commentsData.filter(comment => comment.postId ===postId);

    // neu comment  = 0 =>post ko ton tai
    if(postComments.length ===0){
      throw new Error('Post id is not found')
    }
    res.status(200).json({
      message: 'Get comments successfully',
      data: postComments
    });
  } catch (error) {
    console.log('[ERROR]: ', error);
    res.status(400).json({
      data: null,
      success: false,
      error: error?.message,
    });
  }
})
// Bài 7: Viết API lấy tất cả các bài post, 3 comment đầu 
// (dựa theo index) của tất cả user .

// Bài 8: Viết API lấy một bài post và tất cả comment 
// của bài post đó thông qua postId

// Route kiểm tra server sống hay chết
app.get('/health-check', (req, res) => {
  res.json({
    status: 1,
    message: 'Server is running succesfully'
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});