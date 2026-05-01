//imports
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";

//imports->project
import * as consoleLoggers from "../../../console/consoleLoggers.js";
import * as mysqlManagement from "../mysqlManagement.js";
import * as accountManagement from "./accountManagement.js";

//default access token duration
const ACCESS_TTL = "15m";

//default refresh token duration
//60 seconds * 60 minutes * 24 hours * n days
const REFRESH_TTL_SEC = 60 * 60 * 24 * 7; // 7 days

function _hashToken(token, areMessagesToBeDisplayed) {
  if (areMessagesToBeDisplayed)
    consoleLoggers.logNeutral(`(_hashToken)Attempting to hash a token...`);

  try {
    let hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(`(_hashToken)Successfully hashed a token.`);

    return hashedToken;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(_hashToken)Generally failed to hash a token! Error message: "${error}".`,
      );

    return false;
  }
}

function _createJti(areMessagesToBeDisplayed) {
  if (areMessagesToBeDisplayed)
    consoleLoggers.logNeutral(`(_createJti)Attempting to create a jti...`);

  try {
    let createdJti = crypto.randomBytes(16).toString("hex");

    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(`(_createJti)Successfully created a jti.`);

    return createdJti;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(_createJti)Generally failed to create a jti! Error message: "${error}".`,
      );

    return false;
  }
}

function _signAccessToken(user, userType, areMessagesToBeDisplayed) {
  if (areMessagesToBeDisplayed)
    consoleLoggers.logNeutral(
      `(_signAccessToken)Attempting to sign an access token...`,
    );

  try {
    const payload = {
      id: user.id.toString(),
      email: user.email,
      type: userType,
    };
    let signedToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: ACCESS_TTL,
    });

    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(
        `(_signAccessToken)Successfully signed an access token.`,
      );

    return signedToken;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(_signAccessToken)Generally failed to sign an access token! Error message: "${error}".`,
      );

    return false;
  }
}

function _signRefreshToken(user, userType, jti, areMessagesToBeDisplayed) {
  if (areMessagesToBeDisplayed)
    consoleLoggers.logNeutral(
      `(_signRefreshToken)Attempting to sign a refresh token...`,
    );

  try {
    //TODO check if "jti: jti" generates an error, it used to be just 'jti'
    const payload = { id: user.id.toString(), type: userType, jti: jti };
    const signedToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TTL_SEC,
    });

    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(
        `(_signRefreshToken)Successfully signed a refresh token.`,
      );

    return signedToken;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(_signRefreshToken)Generally failed to sign a refresh token! Error message: "${error}".`,
      );

    return false;
  }
}

async function _persistRefreshToken(
  { user, userType, refreshToken, jti, ip, userAgent },
  areMessagesToBeDisplayed,
) {
  if (areMessagesToBeDisplayed)
    consoleLoggers.logNeutral(
      `(_persistRefreshToken)Attempting to insert a refresh token...`,
    );

  try {
    const tokenHash = _hashToken(refreshToken);
    if (!tokenHash) throw new Error("Failed to hash a token!");

    const expiresAt = new Date(Date.now() + REFRESH_TTL_SEC * 1000);

    const connectionPool = await mysqlManagement.getConnectionPool();
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    let insertionResult = undefined;
    if (userType === "student") {
      //TODO add student handling
    } else if (userType === "teacher") {
      //TODO add teacher handling
    } else if (userType === "administrator") {
      insertionResult = accountManagement.addAccountRefreshToken(
        connectionPool,
        true,
        "administrators",
        user.id,
        tokenHash,
        jti,
        expiresAt,
        ip,
        userAgent,
      );
    } else
      throw new Error(
        "Provided userType parameter does not have a handler! Look closer in the code...",
      );

    if (insertionResult) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(_persistRefreshToken)Successfully inserted a refresh token.`,
        );
    } else throw new Error("Failed to insert a refresh token!");
    return insertionResult;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(_persistRefreshToken)Generally failed to insert a refresh token! Error message: "${error}".`,
      );

    return false;
  }
}

function _setRefreshCookie(
  res,
  refreshToken,
  requestPath,
  areMessagesToBeDisplayed,
) {
  if (areMessagesToBeDisplayed)
    consoleLoggers.logNeutral(
      `(_setRefreshCookie)Attempting to set a refresh cookie...`,
    );

  try {
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProd, //TODO ensure HTTPS communication at some point, this thing enables it
      sameSite: "strict",
      path: requestPath,
      maxAge: REFRESH_TTL_SEC * 1000,
    });

    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(
        `(_setRefreshCookie)Successfully set a refresh cookie.`,
      );

    return true;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(_signRefreshToken)Generally failed to set a refresh cookie! Error message: "${error}".`,
      );

    return false;
  }
}

async function _rotateRefreshToken(
  oldRefreshToken,
  user,
  userType,
  req,
  res,
  areMessagesToBeDisplayed,
) {
  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(_rotateRefreshToken)Attempting to rotate a refresh token...`,
      );

    //revoking the old token

    oldRefreshToken.revokedAt = new Date();
    const newJti = _createJti(areMessagesToBeDisplayed);
    if (!newJti) throw new Error("Failed to create a new JTI!");

    oldRefreshToken.replacedBy = newJti;
    const connectionPool = await mysqlManagement.getConnectionPool();
    if (!connectionPool)
      throw new Error("Failed to get a mysql connection pool!");

    const updateResult = await accountManagement.updateAccountRefreshToken(
      connectionPool,
      areMessagesToBeDisplayed,
      oldRefreshToken,
    );
    if (!updateResult) throw new Error("Failed to update the refresh token!");

    //issuing a new token

    const newAccessToken = _signAccessToken(
      user,
      userType,
      areMessagesToBeDisplayed,
    );
    if (!newAccessToken) throw new Error("Failed to sign a new access token!");

    const newRefreshToken = _signRefreshToken(
      user,
      userType,
      newJti,
      areMessagesToBeDisplayed,
    );
    if (!newRefreshToken)
      throw new Error("Failed to sign a new refresh token!");

    const persistResult = await _persistRefreshToken(
      {
        user,
        userType,
        refreshToken: newRefreshToken,
        jti: newJti,
        ip: req.ip,
        userAgent: req.headers["user-agent"] || "",
      },
      areMessagesToBeDisplayed,
    );
    if (!persistResult)
      throw new Error("Failed to persist the new refresh token!");

    const cookieSettingResult = _setRefreshCookie(
      res,
      newRefreshToken,
      req.path,
      areMessagesToBeDisplayed,
    );
    if (!cookieSettingResult) throw new Error("Failed to set a new cookie!");

    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(
        `(_rotateRefreshToken)Successfully rotated a refresh token.`,
      );

    return { accessToken: newAccessToken };
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(_rotateRefreshToken)Generally failed to rotate a refresh token! Error message: "${error}".`,
      );

    return false;
  }
}

//exports
export const hashToken = _hashToken;
export const createJti = _createJti;
export const signAccessToken = _signAccessToken;
export const signRefreshToken = _signRefreshToken;
export const persistRefreshToken = _persistRefreshToken;
export const setRefreshCookie = _setRefreshCookie;
export const rotateRefreshToken = _rotateRefreshToken;
