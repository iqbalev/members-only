import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { body, validationResult } from "express-validator";
import bcryptjs from "bcryptjs";
import {
  createUser,
  getUserByEmail,
  getUserById,
  getUserUsername,
  getUserEmail,
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
          return done(null, false, { message: "Incorrect email." });
        }

        const match = await bcryptjs.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password." });
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
app.get("/login", (req, res) =>
  res.render("auth", { errors: [], formType: "login" })
);

app.get("/register", (req, res) =>
  res.render("auth", { errors: [], formType: "register" })
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

  [
    body("email").trim().notEmpty().withMessage("Email is required."),
    body("password").trim().notEmpty().withMessage("Password is required."),
  ],

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("auth", { errors: errors.array(), formType: "login" });
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.render("auth", {
          errors: [{ msg: info.message }],
          formType: "login",
        });
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        return res.redirect("/");
      });
    })(req, res, next);
  }
);

app.post(
  "/register",

  [
    body("firstName")
      .trim()
      .notEmpty()
      .withMessage("First name is required.")
      .isAlpha()
      .withMessage("First name can only contain letters."),
    body("lastName")
      .trim()
      .notEmpty()
      .withMessage("Last name is required.")
      .isAlpha()
      .withMessage("Last name can only contain letters."),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required.")
      .isAlphanumeric()
      .withMessage("Username can only contain numbers and letters.")
      .isLength({ min: 3, max: 26 })
      .withMessage("Username must be between 3 and 26 characters long.")
      .custom(async (value) => {
        const existingUsername = await getUserUsername();
        const match = existingUsername.some((user) => user.username === value);
        if (match) throw new Error("Username is already taken.");
      }),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Email is invalid.")
      .custom(async (value) => {
        const existingEmail = await getUserEmail();
        const match = existingEmail.some((user) => user.email === value);
        if (match) throw new Error("Email is already taken.");
      }),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
    body("confirmPassword")
      .trim()
      .notEmpty()
      .withMessage("Password confirmation is required.")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Password confirmation does not match."),
  ],

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .render("auth", { errors: errors.array(), formType: "register" });
      }

      const { firstName, lastName, username, email, password } = req.body;

      const hashedPassword = await bcryptjs.hash(password, 10);
      await createUser(firstName, lastName, username, email, hashedPassword);
      return res.redirect("/login");
    } catch (err) {
      return next(err);
    }
  }
);

const PORT = 8080;
const server = app.listen(PORT, () =>
  console.log("Server running on http://localhost:8080")
);
