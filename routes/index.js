import { Router } from "express";

import auth from "./auth.router.js";
import applications from "./applications.router.js";
import plans from "./plans.router.js";
import templates from "./templates.router.js";
import mail from "./mail.router.js";
import user from "./user.router.js";
import goals from "./goal.router.js";

const app = Router();

app.get("/health", (_, res) => res.send("Job Apply API 🚀"));

app.use("/auth", auth);
app.use("/applications", applications);
app.use("/plans", plans);
app.use("/templates", templates);
app.use("/mail", mail);
app.use("/user", user);
app.use("/goals", goals);

export default app;
