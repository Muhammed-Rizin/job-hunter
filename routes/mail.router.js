import { Router } from "express";
import auth from "../middleware/auth.js";
import * as controller from "../controller/mail.controller.js";

const router = Router();
router.use(auth);

router.post("/send", controller.sendMail);

export default router;
