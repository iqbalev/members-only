import { body } from "express-validator";
import { getUserUsername, getUserEmail } from "../database/dbQueries.js";

export const registerValidator = [
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
];

export const loginValidator = [
  body("email").trim().notEmpty().withMessage("Email is required."),
  body("password").trim().notEmpty().withMessage("Password is required."),
];
