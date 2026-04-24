//imports
// import mysql from 'mysql2/promise';
import * as bcrypt from 'bcrypt';

//imports->project
import * as consoleLoggers from '../../console/consoleLoggers.js';
// import * as consoleAskers from '../../console/consoleAskers.js';
// import * as serverManagement from '../../serverManagement.js';
// import * as queryUtilities from './queries/queryUtilities.js';

//supposed to work with mysql2/promise connections
async function _getAdministratorCount(databaseConnection, areMessagesToBeDisplayed) {
    if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
    else {
        if (typeof areMessagesToBeDisplayed !== 'boolean'){
            consoleLoggers.logParameterTypeError('areMessagesToBeDisplayed', 'boolean', areMessagesToBeDisplayed, '_getAdministratorCount');
            return undefined;
        }
    }

    try {
        if (areMessagesToBeDisplayed) consoleLoggers.logNeutral("(0/_getAdministratorCount)Trying to get the count of currently registered DB administrators...");
        const [rows] = await databaseConnection.execute('SELECT COUNT(*) AS `count` FROM `administrators`;')
        const administratorCount = Number(rows[0].count);
        if (areMessagesToBeDisplayed) consoleLoggers.logNeutral(`(0/_getAdministratorCount)Successfully got the count of currently registered DB administrators: ${administratorCount}!`);
        return administratorCount;
    } catch (error) {
        if (areMessagesToBeDisplayed) consoleLoggers.logError(`(0/_getAdministratorCount)Failed to get the count of currently registered DB administrators! Error message: ${error}`);
        return undefined;
    }
}

async function __hashPassword(password, areMessagesToBeDisplayed) {
    if (typeof password !== 'string') {
        consoleLoggers.logParameterTypeError('password', 'string', password, '__hashPassword');
        return undefined;
    }
    if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
    else {
        if (typeof areMessagesToBeDisplayed !== 'boolean'){
            consoleLoggers.logParameterTypeError('areMessagesToBeDisplayed', 'boolean', areMessagesToBeDisplayed, '_addAdministrator');
            return undefined;
        }
    }

    if (areMessagesToBeDisplayed) consoleLoggers.logNeutral(`(0/__hashPassword)Trying to hash a password with bcrypt...`);
    try {
        var saltRounds;
        if (process.env.BC_SALTS === undefined || process.env.BC_SALTS === null) {
            saltRounds = 12;
        } else {
            saltRounds = Number(process.env.BC_SALTS);
        }
        const hash = await bcrypt.hash(password, saltRounds);
        if (areMessagesToBeDisplayed) consoleLoggers.logSuccess(`(0/__hashPassword)Successfully hashed a password with bcrypt.`);
        return hash;
    } catch (error) {
        if (areMessagesToBeDisplayed) consoleLoggers.logError(`(0/__hashPassword)Failed to hash a password with bcrypt! Error message: ${error}`);
        return undefined;
    }
}

async function _addAdministrator(databaseConnection, areMessagesToBeDisplayed, _email, _password, _firstName, _lastName, _patronymicName) {
    if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
    else {
        if (typeof areMessagesToBeDisplayed !== 'boolean'){
            consoleLoggers.logParameterTypeError('areMessagesToBeDisplayed', 'boolean', areMessagesToBeDisplayed, '_addAdministrator');
            return false;
        }
    }
    if (typeof _email !== 'string') {
        consoleLoggers.logParameterTypeError('_email', 'string', _email, '_addAdministrator');
        return false;
    }
    if (typeof _password !== 'string') {
        consoleLoggers.logParameterTypeError('_password', 'string', _password, '_addAdministrator');
        return false;
    }
    if (typeof _firstName !== 'string') {
        consoleLoggers.logParameterTypeError('_firstName', 'string', _firstName, '_addAdministrator');
        return false;
    }
    if (typeof _lastName !== 'string') {
        consoleLoggers.logParameterTypeError('_lastName', 'string', _lastName, '_addAdministrator');
        return false;
    }
    if (typeof _patronymicName !== 'string') {
        consoleLoggers.logParameterTypeError('_patronymicName', 'string', _patronymicName, '_addAdministrator');
        return false;
    }

    try {
        if (areMessagesToBeDisplayed) consoleLoggers.logNeutral(`(0/_addAdministrator)Trying to insert the new administrator account into the table...`);
        const _passwordHash = await __hashPassword(_password, true);
        if (_passwordHash === undefined) return false;
        const sql = "INSERT INTO `administrators`(email, password_hash, first_name, last_name, patronymic_name) VALUES (?, ?, ?, ?, ?)";
        const params = [_email, _passwordHash, _firstName, _lastName, _patronymicName];
        await databaseConnection.execute(sql, params);
        if (areMessagesToBeDisplayed) consoleLoggers.logSuccess(`(0/_addAdministrator)Successfully inserted the new administrator account into the table (email: ${_email})!`);
        return true;
    } catch (error) {
        if (areMessagesToBeDisplayed) consoleLoggers.logError(`(0/_addAdministrator)Failed to insert the new administrator account into the table! Error message: ${error}`);
        return false;
    }
}

//exports
export const getAdministratorCount = _getAdministratorCount;
export const addAdministrator = _addAdministrator;