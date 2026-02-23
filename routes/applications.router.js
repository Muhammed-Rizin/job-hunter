import { Router } from "express";
import auth from "../middleware/auth.js";
import * as controller from "../controller/applications.controller.js";

const router = Router();

router.use(auth);

router.get("/", controller.list);
router.get("/bounced", controller.listBounced);
router.post("/", controller.create);
router.post("/manual", controller.manual);
router.put("/", controller.updateStatus);
router.delete("/:id", controller.del);

export default router;
