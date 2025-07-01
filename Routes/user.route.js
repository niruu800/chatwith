import express from "express";
import { allUser, login, register } from "../controller/user.controller.js";
import { Router } from "express";
import { upload } from "../middleware/multer.js";
const Userrouter = express.Router();

Userrouter.route("/getall").post(allUser);
Userrouter.route("/register").post(upload.single("avatar"), register);
Userrouter.route("/login").post(login);

export default Userrouter;
