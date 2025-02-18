import passport from "../config/passportConfig.js";
import bcryptjs from "bcryptjs";
import { validationResult } from "express-validator";
import { createUser } from "../database/dbQueries.js";

// Register Controllers
export const registerGet = (req, res) => {
  res.render("auth", { errors: [], currentPage: "register" });
};

export const registerPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("auth", { errors: errors.array(), currentPage: "register" });
    }

    const { firstName, lastName, username, email, password } = req.body;

    const hashedPassword = await bcryptjs.hash(password, 10);
    await createUser(firstName, lastName, username, email, hashedPassword);
    return res.redirect("/login");
  } catch (error) {
    return next(error);
  }
};

// Login Controllers
export const loginGet = (req, res) => {
  res.render("auth", { errors: [], currentPage: "login" });
};

export const loginPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .render("auth", { errors: errors.array(), currentPage: "login" });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.render("auth", {
        errors: [{ msg: info.message }],
        currentPage: "login",
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.redirect("/feed");
    });
  })(req, res, next);
};

// Logout Controllers
export const logoutPost = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }

    return res.redirect("/");
  });
};
