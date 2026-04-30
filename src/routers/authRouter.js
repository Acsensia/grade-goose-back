//imports
import { Router } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jwt";

//imports->project
import * as mysqlManagement from "../startup/databases/mysql/mysqlManagement.js";
import * as accountManagement from "../startup/databases/mysql/accounts/accountManagement.js";
import * as consoleLoggers from "../startup/console/consoleLoggers.js";
import * as tokenUtilities from "../startup/databases/mysql/accounts/tokenUtilities.js";

//.setup
const authRouter = Router();

//routes
//TODO add student routes
//TODO add teacher routes
authRouter.post("/login/admin", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(authRouter:/login/admin)Got an admin login request, processing...`,
    );
    const { email, password } = req.body;

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const user = await accountManagement.findAccount(
      connectionPool,
      true,
      "administrators",
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

authRouter.post("login/admin/refresh", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(authRouter:/login/admin)Got an admin access token refresh request, processing...`,
    );
    const token = req.cookies?.refresh_token;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      consoleLoggers.logError(
        `(authRouter:/login/admin/refresh)General error while processing admin access token refresh request, error message: "${error}".`,
      );
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    const tokenHash = tokenUtilities.hashToken(token);
    if (!tokenHash) throw new Error("Failed to hash a new token!");

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");
    const foundAccessToken = await accountManagement.findAccountRefreshToken(
      connectionPool,
      true,
      "administrators",
      tokenHash,
      decoded.jti,
    );

    if (!foundAccessToken) {
      return res.status(401).json({ message: "Refresh token not recognized" });
    }
    if (foundAccessToken.revokedAt) {
      return res.status(401).json({ message: "Refresh token revoked" });
    }
    if (foundAccessToken.expiresAt < new Date()) {
      return res.status(401).json({ message: "Refresh token expired" });
    }

    let accountId = null;
    if (
      typeof foundAccessToken.administrators_administrator_id !== "undefined"
    ) {
      accountId = foundAccessToken.administrators_administrator_id;
    } else
      throw new Error(
        "The found access token does not have a column for account id! Look closer in the code...",
      );

    const foundAccount = await accountManagement.getAccount(
      connectionPool,
      true,
      "administrators",
      accountId,
    );
    if (!foundAccount)
      throw new Error(
        "Failed to find the account which the found token points at!",
      );

    const rotationResult = await tokenUtilities.rotateRefreshToken(
      foundAccessToken,
      foundAccount,
      req,
      res,
    );
    if (!rotationResult) throw new Error("Failed to rotate a refresh token!");
    return res.json({ accessToken: rotationResult.accessToken });
  } catch (error) {
    consoleLoggers.logError(
      `(authRouter:/login/admin/refresh)General error while processing admin access token refresh request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//exports
export default authRouter;
