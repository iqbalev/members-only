import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
import express from "express";
import methodOverride from "method-override";
import session from "express-session";
import passport from "./config/passportConfig.js";
import feedRouter from "./routes/feedRouter.js";
import authRouter from "./routes/authRouter.js";
import indexRouter from "./routes/indexRouter.js";
import CustomError from "./utils/CustomError.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use("/feed", feedRouter);
app.use("/", authRouter);
app.use("/", indexRouter);

app.use((req, res, next) => {
  next(new CustomError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  const statusCode = err.statusCode || 500;

  res.status(statusCode).render("error", {
    currentPage: "error",
    errorCode: statusCode,
    errorMessage: statusCode === 500 ? "Internal Server Error" : err.message,
  });
});

const PORT = 8080;
const server = app.listen(PORT, () =>
  console.log("Server running on http://localhost:8080")
);
