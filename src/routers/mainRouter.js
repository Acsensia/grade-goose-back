//imports
import { Router } from "express";

//.setup
const _mainRouter = Router();

//routes
_mainRouter.post("/test1", (req, res) => {
  res.json({ message: "This is some data" });
});

//exports
export const mainRouter = _mainRouter;
