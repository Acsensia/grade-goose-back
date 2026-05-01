//imports
import jwt from "jsonwebtoken";

//imports->project
import * as consoleLoggers from "../../../console/consoleLoggers.js";

//default access token duration
const ACCESS_TTL = "15m";

function _signAccessToken(user, userType, userId, areMessagesToBeDisplayed) {
  if (areMessagesToBeDisplayed)
    consoleLoggers.logNeutral(
      `(_signAccessToken)Attempting to sign an access token...`,
    );

  try {
    const payload = {
      id: userId,
      email: user.email,
      type: userType,
    };
    let signedToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
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

//exports
export const signAccessToken = _signAccessToken;
