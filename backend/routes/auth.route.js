import express from "express"
import { loginUser } from "../controllers/user.controller";
const Router=express.Router();
Router.post('/login',loginUser)
export default Router;