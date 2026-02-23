import { Router } from "express";
import auth from "../middleware/auth.js";
import * as controller from "../controller/stats.controller.js";

const router = Router();
router.use(auth);

router.get("/counts", controller.getCounts);

export default router;
