require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");

const UserRoute = require("./routes/user.js");
const PersonalRoute = require("./routes/Personal-Chat.js");
const PostRoute = require("./routes/Post.js");
const ReelRoute = require("./routes/Reel.js");

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports: ['websocket'],
    credentials: true


  },
});

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true

}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

app.use('/socket.io', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});



io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  socket.on("seen-chat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("new-chat", (message) => {
    io.to(message.chatId).emit("chat-receive", {
      chat: message.chat,
      username: message.username,
      chatId: message.chatId,
    });
  });
});

app.use("/accounts", UserRoute);
app.use("/Personal-chat", PersonalRoute);
app.use("/uploadPost", PostRoute);
app.use("/uploadReel", ReelRoute);


server.listen(PORT, async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/TalksGram");
    console.log("MongoDB Connected and Server running at PORT", PORT);
  } catch (error) {
    console.error("Database connection error:", error);
  }
});
