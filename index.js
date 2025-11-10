const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/User");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect("mongodb+srv://dattapadre:dattapadre@cluster0.1cpqqak.mongodb.net/?appName=Cluster0");


app.get("/", function (req, res) {
  res.send("Work");
});

app.post("/api/signup", async (req, res) => {
  console.log("Incoming Data:", req.body);

  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = new UserModel({ username, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(" Server Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

app.post("/api/login", async function (req, res) {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email, password });

    if (user) {
      res
        .status(200)
        .json({ success: true, message: "Login successful", user });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Login Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("image"), async (req, res) => {
  const userId = req.body.user_id;

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { profile: req.file.filename },
    { new: true }
  );

  res.json({
    success: true,
    message: "Image uploaded successfully!",
    filePath: `uploads/${req.file.filename}`,
  });
});

app.post("/api/user_info", async function (req, res) {

  console.log(req.body)
  try {
    var user_id = req.body.user_id;
    var user_data = await UserModel.findById(user_id);
    
    console.log(user_data)

    res.status(200).json({ success: true, message: "Login successful", user_data });

  } catch (err) {
    res
      .status(500).json({ success: false, message: "Server Error", error: err.message });
  }
});

app.listen(1000);
