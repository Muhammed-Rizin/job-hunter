import { Router } from "express";

import * as controller from "../controller/auth.controller.js";
import auth from "../middleware/auth.js";

const router = Router();

router.post("/register", controller.register);
router.post("/login", controller.login);

router.get("/google", controller.googleAuth);
router.get("/google/callback", controller.googleCallback);
router.get("/github", controller.githubAuth);
router.get("/github/callback", controller.githubCallback);

router.put("/refreshToken", controller.refreshToken);

router.delete("/logout", controller.logout);

export default router;
