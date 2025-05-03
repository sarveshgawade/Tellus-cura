import { Router } from "express";
import { getProfile, login, logout, register } from "../controllers/userController.js";
import {isLoggedIn} from '../middlewares/authMiddleware.js'

const router = Router()

router.post('/register',register)
router.post('/login',login)
router.get('/profile',isLoggedIn,getProfile)
router.get('/logout',isLoggedIn,logout)

export default router