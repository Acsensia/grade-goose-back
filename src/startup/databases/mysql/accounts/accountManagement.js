//imports
// import mysql from 'mysql2/promise';
import * as bcrypt from "bcrypt";

//imports->project
import * as consoleLoggers from "../../../console/consoleLoggers.js";
// import * as consoleAskers from '../../console/consoleAskers.js';
// import * as serverManagement from '../../serverManagement.js';
// import * as queryUtilities from './queries/queryUtilities.js';

//functions are supposed to work with mysql2/promise connections

// NON EXPORTED (UTILITY) FUNCTIONS //

async function __hashPassword(password, areMessagesToBeDisplayed) {
  if (typeof password !== "string") {
    consoleLoggers.logParameterTypeError(
      "password",
      "string",
      password,
      "__hashPassword",
    );
    return undefined;
  }
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "_addAdministrator",
      );
      return undefined;
    }
  }

  if (areMessagesToBeDisplayed)
    consoleLoggers.logNeutral(
      `(0/__hashPassword)Trying to hash a password with bcrypt...`,
    );
  try {
    var saltRounds;
    if (process.env.BC_SALTS === undefined || process.env.BC_SALTS === null) {
      saltRounds = 12;
    } else {
      saltRounds = Number(process.env.BC_SALTS);
    }
    const hash = await bcrypt.hash(password, saltRounds);
    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(
        `(0/__hashPassword)Successfully hashed a password with bcrypt.`,
      );
    return hash;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(0/__hashPassword)Failed to hash a password with bcrypt! Error message: ${error}`,
      );
    return undefined;
  }
}

// EXPORTED FUNCTIONS //

async function _getAdministratorCount(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "_getAdministratorCount",
      );
      return undefined;
    }
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        "(0/_getAdministratorCount)Trying to get the count of currently registered DB administrators...",
      );
    const [rows] = await databaseConnectionPool.execute(
      "SELECT COUNT(*) AS `count` FROM `administrators`;",
    );
    const administratorCount = Number(rows[0].count);
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(0/_getAdministratorCount)Successfully got the count of currently registered DB administrators: ${administratorCount}!`,
      );
    return administratorCount;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(0/_getAdministratorCount)Failed to get the count of currently registered DB administrators! Error message: ${error}`,
      );
    return undefined;
  }
}

async function _findAccount(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  tableName,
  _email,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "_findAccount",
      );
      return false;
    }
  }
  if (typeof tableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "tableName",
      "string",
      tableName,
      "_findAccount",
    );
    return false;
  }
  if (typeof _email !== "string") {
    consoleLoggers.logParameterTypeError(
      "_email",
      "string",
      _email,
      "_findAccount",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(0/_findAccount)Trying to find an account with the "${_email}" email in the "${tableName}" table...`,
      );
    const sql = `SELECT * FROM \`${tableName}\` WHERE \`email\` = ?; `;
    const params = [_email];
    const [results] = await databaseConnectionPool.execute(sql, params);
    if (results !== undefined && results.length !== 0) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(0/_findAccount)Successfully found an account with the "${_email}" email in the "${tableName}" table!`,
        );
      return results[0];
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(0/_findAccount)Failed to find an account with the "${_email}" email in the "${tableName}" table!
          Query: "${sql}"
          Parameters: "${params}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(0/_findAccount)Generally failed to find an account with the "${_email}" email in the "${tableName}" table!
        Error message: "${error}".`,
      );
    return false;
  }
}

async function _addAccount(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  tableName,
  _email,
  _password,
  _firstName,
  _lastName,
  _patronymicName,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "__addAccount",
      );
      return false;
    }
  }
  if (typeof tableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "tableName",
      "string",
      tableName,
      "__addAccount",
    );
    return false;
  }
  if (typeof _email !== "string") {
    consoleLoggers.logParameterTypeError(
      "_email",
      "string",
      _email,
      "__addAccount",
    );
    return false;
  }
  if (typeof _password !== "string") {
    consoleLoggers.logParameterTypeError(
      "_password",
      "string",
      _password,
      "__addAccount",
    );
    return false;
  }
  if (typeof _firstName !== "string") {
    consoleLoggers.logParameterTypeError(
      "_firstName",
      "string",
      _firstName,
      "__addAccount",
    );
    return false;
  }
  if (typeof _lastName !== "string") {
    consoleLoggers.logParameterTypeError(
      "_lastName",
      "string",
      _lastName,
      "__addAccount",
    );
    return false;
  }
  if (typeof _patronymicName !== "string") {
    consoleLoggers.logParameterTypeError(
      "_patronymicName",
      "string",
      _patronymicName,
      "__addAccount",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(0/__addAccount)Trying to insert the new account into the "${tableName}" table...`,
      );
    const _passwordHash = await __hashPassword(_password, true);
    if (_passwordHash === undefined) return false;
    const sql = `INSERT INTO \`${tableName}\` (email, password_hash, first_name, last_name, patronymic_name) VALUES (?, ?, ?, ?, ?)`;
    const params = [
      _email,
      _passwordHash,
      _firstName,
      _lastName,
      _patronymicName,
    ];
    await databaseConnectionPool.execute(sql, params);
    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(
        `(0/__addAccount)Successfully inserted the new account into the "${tableName}" table (email: ${_email})!`,
      );
    return true;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(0/__addAccount)Failed to insert the new account into the "${tableName}" table! Error message: ${error}`,
      );
    return false;
  }
}

async function _updateAccountRefreshToken(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  updatedToken,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "__updateAccountRefreshToken",
      );
      return false;
    }
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(__updateAccountRefreshToken)Trying to update a token...`,
      );

    let tableName = "";
    let userIdColumnName = "";
    let userIdColumnValue = null;
    if (typeof updatedToken.students_student_id !== "undefined") {
      tableName = "students";
      userIdColumnName = "students_student_id";
      userIdColumnValue = updatedToken.students_student_id;
    } else if (typeof updatedToken.teachers_teacher_id !== "undefined") {
      tableName = "teachers";
      userIdColumnName = "teachers_teacher_id";
      userIdColumnValue = updatedToken.teachers_teacher_id;
    } else if (
      typeof updatedToken.administrators_administrator_id !== "undefined"
    ) {
      tableName = "administrators";
      userIdColumnName = "administrators_administrator_id";
      userIdColumnValue = updatedToken.administrators_administrator_id;
    } else {
      consoleLoggers.logError(
        `(__updateAccountRefreshToken)Failed to find a matching user_id column in the token object! Look in the code for correct columns.`,
      );
      return false;
    }
    const sql = `UPDATE \`${tableName}\`
        SET ${userIdColumnName} = ?, token_hash = ?, jti = ?, expires_at = ?,
        created_at = ?, revoked_at = ?, replaced_by = ?, ip = ?, user_agent = ?
        WHERE refresh_token_id = ?`;
    const params = [
      userIdColumnValue,
      updatedToken.token_hash,
      updatedToken.jti,
      updatedToken.expires_at,
      updatedToken.created_at,
      updatedToken.revoked_at,
      updatedToken.replaced_by,
      updatedToken.ip,
      updatedToken.user_agent,
      updatedToken.id,
    ];
    await databaseConnectionPool.execute(sql, params);

    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(
        `(__updateAccountRefreshToken)Successfully updated a token.`,
      );
    return true;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(__updateAccountRefreshToken)Generally failed to update a token! Error message: ${error}`,
      );
    return false;
  }
}

async function _addAccountRefreshToken(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  tableName,
  _userId,
  _tokenHash,
  _jti,
  _expiresAt,
  _ip,
  _userAgent,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "__addAccountRefreshToken",
      );
      return false;
    }
  }
  if (typeof tableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "tableName",
      "string",
      tableName,
      "__addAccountRefreshToken",
    );
    return false;
  }
  if (typeof _userId !== "number") {
    consoleLoggers.logParameterTypeError(
      "_userId",
      "number",
      _userId,
      "__addAccountRefreshToken",
    );
    return false;
  }
  if (typeof _tokenHash !== "string") {
    consoleLoggers.logParameterTypeError(
      "_tokenHash",
      "string",
      _tokenHash,
      "__addAccountRefreshToken",
    );
    return false;
  }
  if (typeof _jti !== "string") {
    consoleLoggers.logParameterTypeError(
      "_jti",
      "string",
      _jti,
      "__addAccountRefreshToken",
    );
    return false;
  }
  if (typeof _expiresAt.getMonth !== "function") {
    consoleLoggers.logParameterTypeError(
      "_expiresAt",
      "Date",
      _expiresAt,
      "__addAccountRefreshToken",
    );
    return false;
  }
  if (typeof _ip !== "string") {
    consoleLoggers.logParameterTypeError(
      "_ip",
      "string",
      _ip,
      "__addAccountRefreshToken",
    );
    return false;
  }
  if (typeof _userAgent !== "string") {
    consoleLoggers.logParameterTypeError(
      "_ip",
      "string",
      _userAgent,
      "__addAccountRefreshToken",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(0/__addAccountRefreshToken)Trying to insert the new token of the ${_userId} user into the "${tableName}" table...`,
      );
    let userIdColumnName = "";
    if (tableName === "student_refresh_tokens") {
      userIdColumnName = "students_student_id";
    } else if (tableName === "teacher_refresh_tokens") {
      userIdColumnName = "teachers_teacher_id";
    } else if (tableName === "administrator_refresh_tokens") {
      userIdColumnName = "administrators_administrator_id";
    } else {
      consoleLoggers.logError(
        `(0/__addAccountRefreshToken)Failed to find the user_id column name for the "${tableName}" table! Look in the code to see three possible table names.`,
      );
      return false;
    }
    const sql = `INSERT INTO \`${tableName}\` (${userIdColumnName}, token_hash, jti, expires_at, it, user_agent) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [_userId, _tokenHash, _jti, _expiresAt, _ip, _userAgent];
    await databaseConnectionPool.execute(sql, params);
    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(
        `(0/__addAccountRefreshToken)Successfully inserted the new token of the ${_userId} user into the "${tableName}" table!`,
      );
    return true;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(0/__addAccountRefreshToken)Failed to insert the new token of the ${_userId} user into the "${tableName}" table! Error message: ${error}`,
      );
    return false;
  }
}

async function _findAccountRefreshToken(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  tableName,
  _tokenHash,
  _jti,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "__findAccountRefreshToken",
      );
      return false;
    }
  }
  if (typeof tableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "tableName",
      "string",
      tableName,
      "__findAccountRefreshToken",
    );
    return false;
  }
  if (typeof _tokenHash !== "string") {
    consoleLoggers.logParameterTypeError(
      "_tokenHash",
      "string",
      _tokenHash,
      "__findAccountRefreshToken",
    );
    return false;
  }
  if (typeof _jti !== "string") {
    consoleLoggers.logParameterTypeError(
      "_jti",
      "string",
      _jti,
      "__findAccountRefreshToken",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(__findAccountRefreshToken)Trying to find an account refresh token in the "${tableName}" table...`,
      );
    const sql = `SELECT * FROM \`${tableName}\` WHERE \`token_hash\` = ? AND \`jti\` = ?';`;
    const params = [_tokenHash, _jti];
    const [results] = await databaseConnectionPool.execute(sql, params);
    if (results !== undefined && results.length !== 0) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(__findAccountRefreshToken)Successfully found an account refresh token in the "${tableName}" table!`,
        );
      return results[0];
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(__findAccountRefreshToken)Failed to find an account refresh token in the "${tableName}" table!
          Query: "${sql}"
          Parameters: "${params}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(__findAccountRefreshToken)Generally failed to find an account refresh token in the "${tableName}" table!
        Error message: "${error}".`,
      );
    return false;
  }
}

//exports
export const getAdministratorCount = _getAdministratorCount;
export const findAccount = _findAccount;
export const addAccount = _addAccount;
export const addAccountRefreshToken = _addAccountRefreshToken;
export const updateAccountRefreshToken = _updateAccountRefreshToken;
export const findAccountRefreshToken = _findAccountRefreshToken;
