import { Router } from "express";

import applications from "./applications.router.js";
import templates from "./templates.router.js";
import mail from "./mail.router.js";
import user from "./user.router.js";

const app = Router();

app.get("/health", (_, res) => res.send("Job Apply API 🚀"));

app.use("/applications", applications);
app.use("/templates", templates);
app.use("/mail", mail);
app.use("/user", user);

export default app;
