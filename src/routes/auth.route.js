import express from "express"
import { login, logout, signup } from "../controllers/auth.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"
import { updateProfile } from "../controllers/auth.controller.js"
import { checkAuth } from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/signup",signup)
router.post("/sigin",login)
router.post("/logout",logout)

router.put("/update-Profile",protectRoute,updateProfile)

router.get('/check',protectRoute,checkAuth)


export default router;