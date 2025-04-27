import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 8080;

app.use(express.json());

let users = [
  {
    id: "1",
    name: "Alice Smith",
    email: "alice.smith@example.com",
    gpa: 3.85,
    dob: "2004-03-15",
    address: "123 Maple Street, Springfield, IL 62704",
  },
  {
    id: "2",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    gpa: 3.21,
    dob: "2003-07-22",
    address: "456 Oak Avenue, Shelbyville, IL 62565",
  },
  {
    id: "3",
    name: "Charlie Williams",
    email: "charlie.williams@example.com",
    gpa: 2.95,
    dob: "2004-11-01",
    address: "789 Pine Lane, Capital City, IL 62701",
  },
  {
    id: "4",
    name: "Diana Brown",
    email: "diana.brown@example.com",
    gpa: 4.0,
    dob: "2003-01-30",
    address: "101 Cherry Blvd, Ogdenville, IL 60512",
  },
  {
    id: "5",
    name: "Ethan Jones",
    email: "ethan.jones@example.com",
    gpa: 3.55,
    dob: "2004-05-18",
    address: "222 Elm Drive, North Haverbrook, IL 61350",
  },
];

let posts = [
  {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-ef1234567890",
    userId: "1",
    content: "Hello, this is Alice's public post.",
    isPublic: true,
  },
  {
    id: "b2c3d4e5-f6a7-8b9c-0d1e-f234567890ab",
    userId: "2",
    content: "This is Bob's post, not public.",
    isPublic: false,
  },
  {
    id: "c3d4e5f6-a7b8-9c0d-1e2f-34567890abcd",
    userId: "1",
    content: "Alice's second post content.",
    isPublic: true,
  },
  {
    id: "d4e5f6a7-b8c9-0d1e-2f3g-4567890abcdef",
    userId: "3",
    content: "Charlie's post content.",
    isPublic: true,
  },
  {
    id: "e5f6a7b8-c9d0-1e2f-3g4h-567890abcdef",
    userId: "4",
    content: "Diana's post content.",
    isPublic: false,
  },
];

// dev
// testing: QA/QC (Tester)
// staging: PM/PO/CIient
// (Product Manager/Project
// Manager/Product Owner)
// production: end users

// http://localhost:8080/
app.get("/", (req, res) => {
  res.send("Welcome to our Server");
});

app.get("/users", (req, res) => {
  res.json(users);
});

//1 API lấy thông tin của user với id được truyền qua params
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === id);
  if (!user) {
    return res.status(404).json({ message: "User not found 404" });
  }

  res.json(user);
});

//2 Viết API tạo user với các thông tin như trên users, với id là random (uuid),
//  email là duy nhất, phải kiểm tra được trùng email khi tạo user.
app.post("/users", (req, res) => {
  const { name, email, gpa, dob, address } = req.body;

  if (!name || !email || !gpa || !dob || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Email already exists, pls try another user" });
  }

  const newUser = {
    //   id: uuidv4(), id mẫu random từ library uuid
    id: uuidv4(),
    name,
    email,
    gpa,
    dob,
    address,
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});

// HTTP status code.
// Mã	Ý nghĩa
// 200	OK – xử lý thành công
// 201	Created – Tạo mới thành công
// 400	Bad Request – Lỗi từ client
// 404	Not Found – Không tìm thấy
// 500	Internal Server Error – Lỗi phía server

// 3. Lấy ra các bài post của user theo userId được truyền qua params.
// GET
app.get("/users/:userId/posts", (req, res) => {
  const { userId } = req.params;
  const userPosts = posts.filter((post) => post.userId === userId);
  res.json(userPosts);
});




//   4. Tạo bài post mới cho user có id được truyền qua params.
//   POST
app.post("/users/:userId/posts", (req, res) => {
  const { userId } = req.params;
  const { content, isPublic } = req.body;

  // validate user exist
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // validate content is required
  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  const newPost = {
    id: uuidv4(),
    userId,
    content,
    isPublic,
  };

  posts.push(newPost);
  return res.status(201).json({
    message: 'Post is created successfully',
    data: newPost,
  });
});

//   5. Cập nhật bài post với postId được truyền qua params,
//      chỉ có user tạo bài post mới được phép cập nhật.
  // PUT  
  app.put("/posts/:postId", (req, res) => {
    const { postId } = req.params;
    const { userId, content, isPublic } = req.body;

    const post = posts.find((p) => p.id === postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // only the user who created the post can update it
    if (post.userId !== userId) {
      return res.status(403).json({ message: "You are not authorized to update this post" });
    }

    // Cập nhật thông tin nếu có
    if (content !== undefined) post.content = content;
    if (isPublic !== undefined) post.isPublic = isPublic;

    res.json(post);
  });

  // 6. Xoá bài post với postId được truyền qua params,
  //    chỉ có user tạo bài post mới được phép xoá.
  // DELETE 
  app.delete("/posts/:postId", (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;
    console.log("Delete request for postId:", postId, "by userId:", userId);
  
    const postIndex = posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) {
      return res.status(404).json({ message: "Post not found" });
    }
  
    console.log("Found post with userId:", posts[postIndex].userId);
    if (posts[postIndex].userId !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this post" });
    }
  
    posts.splice(postIndex, 1);
    res.json({ message: "Post deleted successfully" });
  });


//7 Viết API tìm kiếm các bài post với content tương ứng được gửi lên từ query params.
// GET
app.get("/posts/search", (req, res) => {
  const {content}= req.query;
  const filteredPosts = posts.filter((post) => post.content.includes(content));
  res.json(filteredPosts);
  
  if (filteredPosts.length === 0 || !content) {
    return res.status(404).json({ message: "No posts found" });
  }
  res.json(filteredPosts);
  return res.status(200).json({
    message: "Posts found successfully",
    data: filteredPosts,
  });
});
//8 Viết API lấy tất cả các bài post với isPublic là true, false thì sẽ không trả về.
// GET

// http://localhost:8080/posts?isPublic=false
// http://localhost:8080/posts?isPublic=false


// Lấy tất cả các posts tồn tại trong hệ thống
// GET /posts
app.get("/posts", (req, res) => {
  // Nếu có query parameter isPublic thì lọc, nếu không trả về tất cả bài post
  const { isPublic } = req.query;

  // Nếu query parameter isPublic được cung cấp, lọc theo nó
  if (isPublic !== undefined) {
    // Chuyển isPublic từ chuỗi sang boolean
    const filteredPosts = posts.filter(
      (post) => post.isPublic === (isPublic === 'true')
    );

    if (filteredPosts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    return res.status(200).json({
      message: "Posts found successfully",
      data: filteredPosts,
    });
  }

  // Nếu không có query parameter, trả về tất cả các bài post
  res.status(200).json({
    message: "All posts retrieved successfully",
    data: posts,
  });
});
