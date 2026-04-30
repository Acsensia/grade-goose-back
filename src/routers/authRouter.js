//imports
import { Router } from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

//imports->project
import * as mysqlManagement from "../startup/databases/mysql/mysqlManagement.js";
import * as accountManagement from "../startup/databases/mysql/accounts/accountManagement.js";
import * as consoleLoggers from "../startup/console/consoleLoggers.js";

//.setup
const authRouter = Router();

//routes
authRouter.post("/login/admin", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(authRouter:/login/admin)Got an admin login request, processing...`,
    );
    const { email, password } = req.body;

    const user = await accountManagement.findAdministrator(
      await mysqlManagement.getConnectionPool(true),
      true,
      email,
    );
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const payload = { id: user.id, email: user.email, type: "admin" };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.json({ token });
  } catch (error) {
    consoleLoggers.logError(
      `(authRouter:/login/admin)General error while processing admin login request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//exports
export default authRouter;
