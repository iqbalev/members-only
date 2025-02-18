import { Router } from "express";

const indexRouter = Router();

indexRouter.get("/", (req, res) =>
  res.render("index", { currentPage: "index", title: "Home" })
);

export default indexRouter;
