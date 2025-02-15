import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";
import {
  createUser,
  getUserByEmail,
  getUserById,
} from "./database/dbQueries.js";

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

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: "Incorrect email!" });
        }

        const match = await bcryptjs.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password!" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// GET Routes
app.get("/login", (req, res) => res.render("auth", { formType: "login" }));
app.get("/register", (req, res) =>
  res.render("auth", { formType: "register" })
);

app.get("/", (req, res) =>
  res.render("index", { title: "Home", user: req.user })
);

// POST Routes
app.post("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }

    return res.redirect("/");
  });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.post("/register", async (req, res, next) => {
  try {
    const { firstName, lastName, username, email, password, confirmPassword } =
      req.body;

    if (confirmPassword !== password) {
      console.log("Password confirmation does not match!");
      return res.status(400).render("auth", { formType: "register" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    await createUser(firstName, lastName, username, email, hashedPassword);
    return res.redirect("/login");
  } catch (err) {
    return next(err);
  }
});

const PORT = 8080;
const server = app.listen(PORT, () =>
  console.log("Server running on http://localhost:8080")
);
