import express from "express";
import { login, register } from "../controller/user.controller.js";
import { Router } from "express";
import { upload } from "../middleware/multer.js";
const Userrouter = express.Router();

Userrouter.route("/register").post(upload.single("avatar"), register);
Userrouter.route("/login").post(login);

export default Userrouter;
