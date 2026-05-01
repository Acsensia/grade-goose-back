//imports
import { Router } from "express";
import * as bcrypt from "bcrypt";

//imports->project
import * as mysqlManagement from "../startup/databases/mysql/mysqlManagement.js";
import * as accountManagement from "../startup/databases/mysql/accounts/accountManagement.js";
import * as consoleLoggers from "../startup/console/consoleLoggers.js";
import * as tokenUtilities from "../startup/databases/mysql/accounts/tokenUtilities.js";

//.setup
const _authRouter = Router();

//utility functions

async function __loginAccount(
  req,
  res,
  accountTableName,
  tokenTableName,
  userType,
) {
  try {
    consoleLoggers.logNeutral(
      `(_authRouter:__loginAccount)Got a login request, processing...`,
    );
    const { email, password } = req.body;

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const user = await accountManagement.findAccount(
      connectionPool,
      true,
      accountTableName,
      email,
    );
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    let userId = null;
    if (typeof user.student_id !== "undefined") {
      userId = user.student_id;
    } else if (typeof user.teacher_id !== "undefined") {
      userId = user.teacher_id;
    } else if (typeof user.administrator_id !== "undefined") {
      userId = user.administrator_id;
    } else
      throw new Error(
        "Couldn't find an id column name that matches the specified user!",
      );

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = tokenUtilities.signAccessToken(
      user,
      userType,
      userId,
      true,
    );
    if (!accessToken) throw new Error("Failed to sign a new access token!");

    res.json({ accessToken });
  } catch (error) {
    consoleLoggers.logError(
      `(_authRouter:__loginAccount)General error while processing a login request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

//login routes

_authRouter.post("/login/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_authRouter:/login/student)Got a student login request, processing...`,
    );
    return await __loginAccount(
      req,
      res,
      "students",
      "student_refresh_tokens",
      "student",
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_authRouter:/login/student)General error while processing a student login request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_authRouter.post("/login/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_authRouter:/login/teacher)Got a teacher login request, processing...`,
    );
    return await __loginAccount(
      req,
      res,
      "teachers",
      "teacher_refresh_tokens",
      "teacher",
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_authRouter:/login/teacher)General error while processing a teacher login request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_authRouter.post("/login/admin", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_authRouter:/login/admin)Got an admin login request, processing...`,
    );
    return await __loginAccount(
      req,
      res,
      "administrators",
      "administrator_refresh_tokens",
      "administrator",
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_authRouter:/login/admin)General error while processing an admin login request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//exports
export const authRouter = _authRouter;
