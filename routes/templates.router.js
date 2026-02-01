import { Router } from "express";
import auth from "../middleware/auth.js";
import * as controller from "../controller/templates.controller.js";

const router = Router();
router.use(auth);

router.get("/", controller.list);
router.post("/", controller.create);
router.delete("/:id", controller.del);

export default router;
