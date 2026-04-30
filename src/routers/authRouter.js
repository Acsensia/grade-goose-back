//imports
import { Router } from "express";
import * as bcrypt from "bcrypt";

//imports->project
import * as mysqlManagement from "../startup/databases/mysql/mysqlManagement.js";
import * as accountManagement from "../startup/databases/mysql/accounts/accountManagement.js";
import * as consoleLoggers from "../startup/console/consoleLoggers.js";
import * as tokenUtilities from "../startup/databases/mysql/accounts/tokenUtilities.js";

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

    const accessToken = tokenUtilities.signAccessToken(user);
    if (!accessToken) throw new Error("Failed to sign a new access token!");

    const jti = tokenUtilities.createJti();
    if (!jti) throw new Error("Failed to create a new jti!");

    const refreshToken = tokenUtilities.signRefreshToken(user, jti);
    if (!refreshToken) throw new Error("Failed to sign a new refresh token!");

    const insertionResult = await tokenUtilities.persistRefreshToken({
      user,
      refreshToken,
      jti,
      ip: req.ip,
      userAgent: req.headers["user-agent"] || "",
    });
    if (!insertionResult)
      throw new Error(
        "Failed to insert the new refresh token into the database!",
      );

    const cookieSettingResult = tokenUtilities.setRefreshCookie(
      res,
      refreshToken,
    );
    if (!cookieSettingResult) throw new Error("Failed to set a new cookie!");

    res.json({ accessToken });
  } catch (error) {
    consoleLoggers.logError(
      `(authRouter:/login/admin)General error while processing admin login request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//exports
export default authRouter;
