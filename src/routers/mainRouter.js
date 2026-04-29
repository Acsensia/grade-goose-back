//imports
import { Router } from "express";

//.setup
const mainRouter = Router();

//routes
mainRouter.get("/", (req, res) => {
  res.send("Hello, World!");
});
mainRouter.get("/api/data", (req, res) => {
  res.json({ message: "This is some data" });
});

//exports
export default mainRouter;
