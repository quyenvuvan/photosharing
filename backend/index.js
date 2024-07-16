const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const jwt = require("jsonwebtoken");
const Users = require("./db/userModel");
const Photo = require("./db/photoModel");
const multer = require("multer");
const path = require("path");
dbConnect();
const JWT_SECRET = "your_jwt_secret_key";
app.use(cors());
app.use(express.json());
app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);
app.use("/images", express.static(path.join(__dirname, "images")));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
app.post("/admin/login", async (req, res) => {
  const { login_name, password } = req.body;
  try {
    const user = await Users.findOne({ login_name });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid login name or password" });
    }

    const isMatch = password == user.password;
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid login name or password" });
    }

    const token = jwt.sign(
      {
        login_name: user.login_name,
        _id: user._id,
        first_name: user.first_name,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    res.json({
      message: "Login successful",
      token,
      user: {
        login_name: user.login_name,
        first_name: user.first_name,
        _id: user._id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await Users.findById(decoded._id);
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};
app.post("/photos/new", auth, upload.single("photo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded" });
  }
  try {
    const userId = req.user._id;
    const newPhoto = new Photo({
      file_name: req.file.filename,
      date_time: new Date().toISOString(),
      user_id: userId,
    });
    await newPhoto.save();
    res.status(201).send(newPhoto);
  } catch (error) {
    console.error("Error uploading photo:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});
app.post("/admin/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});
app.post("/commentsOfPhoto/:photo_id", auth, async (req, res) => {
  const { photo_id } = req.params;
  const { comment } = req.body;

  if (!comment || comment.trim() === "") {
    return res.status(400).send({ error: "Comment cannot be empty" });
  }
  try {
    const userId = req.user._id;
    const newComment = {
      comment: comment,
      date_time: new Date().toISOString(),
      user_id: userId,
    };
    const photo = await Photo.findById(photo_id);
    if (!photo) {
      return res.status(404).send({ error: "Photo not found" });
    }
    photo.comments.push(newComment);
    await photo.save();
    res.status(200).send(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});
app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});
const validateUser = ({ login_name, password, first_name, last_name }) => {
  if (!login_name || !password || !first_name || !last_name) {
    return "login_name, password, first_name, and last_name are required fields and cannot be empty.";
  }
  return null;
};

app.post("/user", async (req, res) => {
  const {
    login_name,
    password,
    first_name,
    last_name,
    location,
    description,
    occupation,
  } = req.body;
  const errorMessage = validateUser({
    login_name,
    password,
    first_name,
    last_name,
  });
  if (errorMessage) {
    return res.status(400).json({ error: errorMessage });
  }
  try {
    const existingUser = await Users.findOne({ login_name });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "A user with this login name already exists." });
    }

    const newUser = new Users({
      login_name,
      password,
      first_name,
      last_name,
      location,
      description,
      occupation,
    });
    await newUser.save();
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/users", async (req, res) => {
  try {
    const users = await Users.find().select("-password"); // Exclude the password field from the result
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/photosOfUser/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const userPhotos = await Photo.find({ user_id: userId });
    res.json(userPhotos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.listen(8081, () => {
  console.log("server listening on port 8081");
});
