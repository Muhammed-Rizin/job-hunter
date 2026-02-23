import { Router } from "express";
import auth from "../middleware/auth.js";
import * as controller from "../controller/plans.controller.js";

const router = Router();

router.use(auth);

router.get("/", controller.list);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.del);

export default router;
