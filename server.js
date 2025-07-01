import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./DB/db.js";
import Userrouter from "./Routes/user.route.js";
import { Server } from "socket.io";
import http from "http";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
import cors from "cors";
import { socketConnection } from "./SoketIO/soket.js";
import messageRouter from "./Routes/message.route.js";
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1/user", Userrouter);
app.use("/api/v1/message", messageRouter);
socketConnection(io);
server.listen(process.env.PORT, (req, res) => {
  console.log(`server is running on port ${process.env.PORT}`);
});
