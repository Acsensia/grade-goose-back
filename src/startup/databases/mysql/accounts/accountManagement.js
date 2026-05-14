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

// EXPORTED FUNCTIONS //

//password hashing
async function _hashPassword(password, areMessagesToBeDisplayed) {
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

//needed for the backend specifically
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

// account functions //

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

async function _getAccount(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  tableName,
  idColumnName,
  _id,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "_getAccount",
      );
      return false;
    }
  }
  if (typeof tableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "tableName",
      "string",
      tableName,
      "_getAccount",
    );
    return false;
  }
  if (typeof _id !== "number") {
    consoleLoggers.logParameterTypeError("_id", "number", _id, "_getAccount");
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(_getAccount)Trying to find an account with the "${_id}" id in the "${tableName}" table...`,
      );
    const sql = `SELECT * FROM \`${tableName}\` WHERE \`${idColumnName}\` = ?; `;
    const params = [_id];
    const [results] = await databaseConnectionPool.execute(sql, params);
    if (results !== undefined && results.length !== 0) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(_getAccount)Successfully found an account with the "${_id}" id in the "${tableName}" table!`,
        );
      return results[0];
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(_getAccount)Failed to find an account with the "${_id}" id in the "${tableName}" table!
          Query: "${sql}"
          Parameters: "${params}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(_getAccount)Generally failed to find an account with the "${_id}" id in the "${tableName}" table!
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
    const _passwordHash = await _hashPassword(_password, true);
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

async function _updateAccount(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  tableName,
  _idColumnName,
  _idColumnValue,
  _updatedAccount,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "_updateAccount",
      );
      return false;
    }
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(_updateAccount)Trying to update an account...`,
      );

    const sql = `UPDATE \`${tableName}\`
        SET email = ?, password_hash = ?,
        first_name = ?, last_name = ?, patronymic_name = ?
        WHERE ${_idColumnName} = ?`;
    const params = [
      _updatedAccount.email,
      _updatedAccount.password_hash,
      _updatedAccount.first_name,
      _updatedAccount.last_name,
      _updatedAccount.patronymic_name,
      _idColumnValue,
    ];
    await databaseConnectionPool.execute(sql, params);

    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(
        `(_updateAccount)Successfully updated an account.`,
      );
    return true;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(_updateAccount)Generally failed to update an account! Error message: ${error}`,
      );
    return false;
  }
}

//exports
export const getAdministratorCount = _getAdministratorCount;
export const getAccount = _getAccount;
export const findAccount = _findAccount;
export const addAccount = _addAccount;
export const updateAccount = _updateAccount;
export const hashPassword = _hashPassword;
