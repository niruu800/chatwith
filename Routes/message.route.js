import express from "express";
import { Route } from "express";
import { getMessage, sendMessage } from "../controller/message.controller.js";
const messageRouter = express.Router();

messageRouter.route("/send_message").post(sendMessage);
messageRouter.route("/get_message").get(getMessage);

export default messageRouter;
