import { Router } from "express";
import auth from "../middleware/auth.js";
import * as controller from "../controller/goal.controller.js";

const router = Router();

router.use(auth);

router.get("/active", controller.getActive);
router.put("/active", controller.upsertActive);

export default router;
