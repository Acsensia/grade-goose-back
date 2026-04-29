//imports
// import mysql from 'mysql2/promise';
import * as bcrypt from "bcrypt";

//imports->project
import * as consoleLoggers from "../../console/consoleLoggers.js";
// import * as consoleAskers from '../../console/consoleAskers.js';
// import * as serverManagement from '../../serverManagement.js';
// import * as queryUtilities from './queries/queryUtilities.js';

//INFO functions are supposed to work with mysql2/promise connections

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

async function __findAccount(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  _email,
  tableName,
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
  if (typeof _email !== "string") {
    consoleLoggers.logParameterTypeError(
      "_email",
      "string",
      _email,
      "_findAccount",
    );
    return false;
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

async function _findAdministrator(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  _email,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "_findAdministrator",
      );
      return false;
    }
  }
  if (typeof _email !== "string") {
    consoleLoggers.logParameterTypeError(
      "_email",
      "string",
      _email,
      "_findAdministrator",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(0/_findAdministrator)Trying to find an administrator with the following email: "${_email}"...`,
      );

    const searchResult = await __findAccount(
      databaseConnectionPool,
      areMessagesToBeDisplayed,
      _email,
      "administrators",
    );
    if (searchResult) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(0/_findAdministrator)Successfully found an administrator account with the "${_email}" email!`,
        );
      return searchResult;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(0/_findAdministrator)Failed to find an administrator with the "${_email}" email!`,
        );
      return searchResult;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(0/_findAdministrator)Generally failed to find an administrator with the "${_email}" email! Error message: "${error}".`,
      );
    return false;
  }
}

async function __addAccount(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  _email,
  _password,
  _firstName,
  _lastName,
  _patronymicName,
  tableName,
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
  if (typeof tableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "tableName",
      "string",
      tableName,
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

async function _addAdministrator(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
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
        "_addAdministrator",
      );
      return false;
    }
  }
  if (typeof _email !== "string") {
    consoleLoggers.logParameterTypeError(
      "_email",
      "string",
      _email,
      "_addAdministrator",
    );
    return false;
  }
  if (typeof _password !== "string") {
    consoleLoggers.logParameterTypeError(
      "_password",
      "string",
      _password,
      "_addAdministrator",
    );
    return false;
  }
  if (typeof _firstName !== "string") {
    consoleLoggers.logParameterTypeError(
      "_firstName",
      "string",
      _firstName,
      "_addAdministrator",
    );
    return false;
  }
  if (typeof _lastName !== "string") {
    consoleLoggers.logParameterTypeError(
      "_lastName",
      "string",
      _lastName,
      "_addAdministrator",
    );
    return false;
  }
  if (typeof _patronymicName !== "string") {
    consoleLoggers.logParameterTypeError(
      "_patronymicName",
      "string",
      _patronymicName,
      "_addAdministrator",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(0/_addAdministrator)Trying to insert the new administrator account into the table...`,
      );
    const insertionResult = __addAccount(
      databaseConnectionPool,
      areMessagesToBeDisplayed,
      _email,
      _password,
      _firstName,
      _lastName,
      _patronymicName,
      "administrators",
    );
    if (insertionResult) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(0/_addAdministrator)Successfully inserted the new administrator account into the table (email: ${_email})!`,
        );
      return insertionResult;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(0/_addAdministrator)Failed to insert the new administrator account into the table (email: ${_email})!`,
        );
      return insertionResult;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(0/_addAdministrator)Failed to insert the new administrator account into the table! Error message: ${error}`,
      );
    return false;
  }
}

//exports
export const getAdministratorCount = _getAdministratorCount;
export const findAdministrator = _findAdministrator;
export const addAdministrator = _addAdministrator;
