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
const _authRouter = Router();

//basically what comes before the auth paths, like `"/api/auth"`
//needed for clean cookie path selection
const _expectedFullPathToRouter = "/api/auth";

//path variables for easy path changing

const _studentAuthPaths = {
  login: "/login/student",
  refresh: "/refresh/student",
  logout: "/logout/student",
};

const _teacherAuthPaths = {
  login: "/login/teacher",
  refresh: "/refresh/teacher",
  logout: "/logout/teacher",
};

const _adminAuthPaths = {
  login: "/login/admin",
  refresh: "/refresh/admin",
  logout: "/logout/admin",
};

//utility functions

async function __loginAccount(req, res, tableName, userType) {
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
      tableName,
      email,
    );
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = tokenUtilities.signAccessToken(user, userType, true);
    if (!accessToken) throw new Error("Failed to sign a new access token!");

    const jti = tokenUtilities.createJti(true);
    if (!jti) throw new Error("Failed to create a new jti!");

    const refreshToken = tokenUtilities.signRefreshToken(
      user,
      userType,
      jti,
      true,
    );
    if (!refreshToken) throw new Error("Failed to sign a new refresh token!");

    const insertionResult = await tokenUtilities.persistRefreshToken({
      user,
      tableName,
      refreshToken,
      jti,
      ip: req.ip,
      userAgent: req.headers["user-agent"] || "",
      areMessagesToBeDisplayed: true,
    });
    if (!insertionResult)
      throw new Error(
        "Failed to insert the new refresh token into the database!",
      );

    const cookieSettingResult = tokenUtilities.setRefreshCookie(
      res,
      refreshToken,
      req.path,
      true,
    );
    if (!cookieSettingResult) throw new Error("Failed to set a new cookie!");

    res.json({ accessToken });
  } catch (error) {
    consoleLoggers.logError(
      `(_authRouter:__loginAccount)General error while processing a login request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function __refreshAccountAccessToken(req, res, tableName, userType) {
  try {
    consoleLoggers.logNeutral(
      `(_authRouter:__refreshAccountAccessToken)Got an access token refresh request, processing...`,
    );
    const token = req.cookies?.refresh_token;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      consoleLoggers.logError(
        `(_authRouter:__refreshAccountAccessToken)General error while processing an access token refresh request, error message: "${error}".`,
      );
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    if (decoded.type !== userType) {
      consoleLoggers.logError(
        `(_authRouter:__refreshAccountAccessToken)Token type error: the token type ("${decoded.type}") is not "${userType}"!`,
      );
      return res.status(401).json({
        message: "Invalid token type, try accessing other refresh endpoints.",
      });
    }

    const tokenHash = tokenUtilities.hashToken(token, true);
    if (!tokenHash) throw new Error("Failed to hash a new token!");

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");
    const foundAccessToken = await accountManagement.findAccountRefreshToken(
      connectionPool,
      true,
      tableName,
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
    if (typeof foundAccessToken.students_student_id !== "undefined") {
      accountId = foundAccessToken.students_student_id;
    } else if (typeof foundAccessToken.teachers_teacher_id !== "undefined") {
      accountId = foundAccessToken.teachers_teacher_id;
    } else if (
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
      tableName,
      accountId,
    );
    if (!foundAccount)
      throw new Error(
        "Failed to find the account which the found token points at!",
      );

    const rotationResult = await tokenUtilities.rotateRefreshToken(
      foundAccessToken,
      foundAccount,
      userType,
      tableName,
      req,
      res,
    );
    if (!rotationResult) throw new Error("Failed to rotate a refresh token!");
    return res.json({ accessToken: rotationResult.accessToken });
  } catch (error) {
    consoleLoggers.logError(
      `(_authRouter:__refreshAccountAccessToken)General error while processing an access token refresh request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function __logoutAccount(req, res, tableName, fullAcountRefreshPath) {
  try {
    consoleLoggers.logNeutral(
      `(_authRouter:__logoutAccount)Got a logout request, processing...`,
    );

    const token = req.cookies?.refresh_token;
    if (token) {
      const tokenHash = tokenUtilities.hashToken(token);
      if (!tokenHash) throw new Error("Failed to hash a token!");

      const connectionPool = await mysqlManagement.getConnectionPool(true);
      if (!connectionPool)
        throw new Error("Failed to access the connection pool!");

      const foundRefreshToken = await accountManagement.findAccountRefreshToken(
        connectionPool,
        true,
        tableName,
        tokenHash,
        token.jti,
      );
      if (!foundRefreshToken)
        throw new Error("Failed to find a matching saved refresh token!");

      if (!foundRefreshToken.revokedAt) {
        foundRefreshToken.revokedAt = new Date();

        const updateResult = await accountManagement.updateAccountRefreshToken(
          connectionPool,
          true,
          foundRefreshToken,
        );
        if (!updateResult)
          throw new Error("Failed to update the stored refresh token!");
      }
    }
    res.clearCookie("refresh_token", { path: fullAcountRefreshPath });
    res.json({ message: "Logged out" });
  } catch (error) {
    consoleLoggers.logError(
      `(_authRouter:__logoutAccount)General error while processing a logout request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

//login routes

_authRouter.post(_studentAuthPaths.login, async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_authRouter:${_studentAuthPaths.login})Got a student login request, processing...`,
    );
    return await __loginAccount(req, res, "students", "student");
  } catch (error) {
    consoleLoggers.logError(
      `(_authRouter:${_studentAuthPaths.login})General error while processing a student login request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_authRouter.post(_teacherAuthPaths.login, async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_authRouter:${_teacherAuthPaths.login})Got a teacher login request, processing...`,
    );
    return await __loginAccount(req, res, "teachers", "teacher");
  } catch (error) {
    consoleLoggers.logError(
      `(_authRouter:${_teacherAuthPaths.login})General error while processing a teacher login request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_authRouter.post(_adminAuthPaths.login, async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_authRouter:${_adminAuthPaths.login})Got an admin login request, processing...`,
    );
    return await __loginAccount(req, res, "administrators", "administrator");
  } catch (error) {
    consoleLoggers.logError(
      `(_authRouter:${_adminAuthPaths.login})General error while processing an admin login request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//refresh routes

_authRouter.post(_studentAuthPaths.refresh, async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_authRouter:${_studentAuthPaths.refresh})Got a student access token refresh request, processing...`,
    );
    return await __refreshAccountAccessToken(req, res, "students", "student");
  } catch (error) {
    consoleLoggers.logError(
      `(_authRouter:${_studentAuthPaths.refresh})General error while processing a student access token refresh request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_authRouter.post(_teacherAuthPaths.refresh, async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_authRouter:${_teacherAuthPaths.refresh})Got a teacher access token refresh request, processing...`,
    );
    return await __refreshAccountAccessToken(req, res, "teachers", "teacher");
  } catch (error) {
    consoleLoggers.logError(
      `(_authRouter:${_teacherAuthPaths.refresh})General error while processing a teacher access token refresh request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_authRouter.post(_adminAuthPaths.refresh, async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_authRouter:${_adminAuthPaths.refresh})Got an admin access token refresh request, processing...`,
    );
    return await __refreshAccountAccessToken(
      req,
      res,
      "administrators",
      "administrator",
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_authRouter:${_adminAuthPaths.refresh})General error while processing an admin access token refresh request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//logout routes

_authRouter.post(_studentAuthPaths.logout, async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_authRouter:${_studentAuthPaths.logout})Got a student logout request, processing...`,
    );
    return __logoutAccount(
      req,
      res,
      "teachers",
      _expectedFullPathToRouter + _studentAuthPaths.refresh,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_authRouter:${_studentAuthPaths.logout})General error while processing a student logout request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_authRouter.post(_teacherAuthPaths.logout, async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_authRouter:${_teacherAuthPaths.logout})Got a teacher logout request, processing...`,
    );
    return __logoutAccount(
      req,
      res,
      "teachers",
      _expectedFullPathToRouter + _teacherAuthPaths.refresh,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_authRouter:${_teacherAuthPaths.logout})General error while processing a teacher logout request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_authRouter.post(_adminAuthPaths.logout, async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_authRouter:${_adminAuthPaths.logout})Got an admin logout request, processing...`,
    );
    return __logoutAccount(
      req,
      res,
      "administrators",
      _expectedFullPathToRouter + _adminAuthPaths.refresh,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_authRouter:${_adminAuthPaths.logout})General error while processing an admin logout request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//exports
export const authRouter = _authRouter;
export const expectedFullPathToRouter = _expectedFullPathToRouter;
export const studentAuthPaths = _studentAuthPaths;
export const teacherAuthPaths = _teacherAuthPaths;
export const adminAuthPaths = _adminAuthPaths;
