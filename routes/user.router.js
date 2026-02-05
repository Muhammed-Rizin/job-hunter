import { Router } from "express";
import auth from "../middleware/auth.js";
import * as controller from "../controller/user.controller.js";

const router = Router();

router.use(auth);

router.get("/me", controller.me);
router.put("/profile", controller.updateProfile);

export default router;
