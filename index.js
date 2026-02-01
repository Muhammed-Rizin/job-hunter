import express from "express";
import logger from "morgan";
import chalk from "chalk";
import cors from "cors";

import cookieParser from "cookie-parser";

import "dotenv/config";
import "./helper/global.js";

import { PORT, ORIGINS } from "./config/index.js";
import connectDB from "./database/index.js";
import notFound from "./middleware/notFound.js";
import error from "./middleware/error.js";

import routes from "./routes/index.js";

const app = express();

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ORIGINS, credentials: true }));

app.use("/", routes);

app.use(error);
app.use(notFound);

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(chalk.blueBright(`Server listening on http://localhost:${PORT}`));
    });
  } catch (error) {}
})();
