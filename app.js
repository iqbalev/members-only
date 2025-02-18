import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "./config/passportConfig.js";
import feedRouter from "./routes/feedRouter.js";
import authRouter from "./routes/authRouter.js";
import indexRouter from "./routes/indexRouter.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());

app.use("/feed", feedRouter);
app.use("/", authRouter);
app.use("/", indexRouter);

const PORT = 8080;
const server = app.listen(PORT, () =>
  console.log("Server running on http://localhost:8080")
);
