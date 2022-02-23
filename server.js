const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const multer = require("multer");
const path = require("path")
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const router = express.Router();
const cors = require ("cors");

dotenv.config();

mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("Connected to MongoDB");
    }
  );

  app.use("/images", express.static(path.join(__dirname, "public/images")));

//Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());


const storage = multer.diskStorage({
  destination: (req,file, cb) =>{
    cb(null, "public/images");

  },
  filename: (req, file ,cb) =>{
    cb(null, req.body.name);
  }
})

const upload = multer({storage});

app.post("/api/upload", upload.single("file"), (req,res) =>{
  try{
      return res.status(200).json("File uploading success!")
  } catch (err) {
    console.log(err);
  }
})


app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

//const port_number = process.env.PORT || 
app.listen(3000,() =>{
    console.log("Backend Server is running");
})

app.get("/", (req,res) =>{
  try{
       res.status(200).json("Welcome")
  } catch (err) {
    console.log(err);
  }
})
