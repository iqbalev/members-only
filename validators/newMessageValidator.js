import { body } from "express-validator";

const newMessageValidator = [
  body("newMessage").trim().notEmpty().withMessage("Please enter some text."),
];

export default newMessageValidator;
