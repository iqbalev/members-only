import dotenv from "dotenv";
import { body } from "express-validator";

dotenv.config();

const secretCodeValidator = [
  body("secretCode")
    .trim()
    .notEmpty()
    .withMessage("Please enter the code.")
    .custom(async (value) => {
      const validSecretCode = process.env.SECRET_CODE;
      if (value.toUpperCase() !== validSecretCode.toUpperCase()) {
        throw new Error("Invalid code. Please try again.");
      }
    }),
];

export default secretCodeValidator;
