//imports
import mysql from 'mysql2/promise';
//imports->project
import { logParameterTypeError, logError, logSuccess } from '../../console/mainConsoleLoggers.js';
import { consoleAskTwoOptions } from '../../console/mainConsoleAskers.js';
import { serverShutdown } from '../../serverManagement.js';

//function for the initial connection to the database
async function _connectMySQL(host, user, password, database) {
    if (
        host     === undefined ||
        user     === undefined ||
        password === undefined ||
        database   === undefined
    ){
        host = process.env.DB_HOST;
        user = process.env.DB_USER;
        password = process.env.DB_PASS;
        database = process.env.DB_NAME;
    }
    else {
        if (typeof host !== 'string'){
            logParameterTypeError('host', 'string', host, 'connectMySQL');
            return undefined;
        }
        if (typeof user !== 'string'){
            logParameterTypeError('user', 'string', user, 'connectMySQL');
            return undefined;
        }
        if (typeof password !== 'string'){
            logParameterTypeError('password', 'string', password, 'connectMySQL');
            return undefined;
        }
        if (typeof database !== 'string'){
            logParameterTypeError('database', 'string', database, 'connectMySQL');
            return undefined;
        }
    }

    try {
        //connecting
        const connection = await mysql.createConnection({
            host:host,
            user:user,
            password:password,
            database:database
        });
        logSuccess('Database connection successful');
        return connection;
    } catch (error) {
        logError('Database connection failed:\n' + error.message);

        if (__checkForDatabaseExistence(host, user, password, database, true)) {
            if (consoleAskTwoOptions("Generate a target database?", "Y", "N")){
                __createDatabase(host, user, password, database);
                //TODO
            }
        }
    }
}

async function __createDatabase(host, user, password, database) {
    if (
        host     === undefined ||
        user     === undefined ||
        password === undefined ||
        database   === undefined
    ){
        host = process.env.DB_HOST;
        user = process.env.DB_USER;
        password = process.env.DB_PASS;
        database = process.env.DB_NAME;
    }
    else{
        if (typeof host !== 'string'){
            logParameterTypeError('host', 'string', host, '__createDatabase');
            return undefined;
        }
        if (typeof user !== 'string'){
            logParameterTypeError('user', 'string', user, '__createDatabase');
            return undefined;
        }
        if (typeof password !== 'string'){
            logParameterTypeError('password', 'string', password, '__createDatabase');
            return undefined;
        }
        if (typeof database !== 'string'){
            logParameterTypeError('database', 'string', database, '__createDatabase');
            return undefined;
        }
    }

    ////TODO
}

async function __checkForDatabaseExistence(host, user, password, database, areMessagesToBeDisplayed) {
    if (
        host     === undefined ||
        user     === undefined ||
        password === undefined ||
        database   === undefined
    ){
        host = process.env.DB_HOST;
        user = process.env.DB_USER;
        password = process.env.DB_PASS;
        database = process.env.DB_NAME;
    }
    else {
        if (typeof host !== 'string'){
            logParameterTypeError('host', 'string', host, '__checkForDatabaseExistence');
            return undefined;
        }
        if (typeof user !== 'string'){
            logParameterTypeError('user', 'string', user, '__checkForDatabaseExistence');
            return undefined;
        }
        if (typeof password !== 'string'){
            logParameterTypeError('password', 'string', password, '__checkForDatabaseExistence');
            return undefined;
        }
        if (typeof database !== 'string'){
            logParameterTypeError('database', 'string', database, '__checkForDatabaseExistence');
            return undefined;
        }
    }
    if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
    else {
        if (typeof areMessagesToBeDisplayed !== 'boolean'){
            logParameterTypeError('areMessagesToBeDisplayed', 'boolean', areMessagesToBeDisplayed, '__checkForDatabaseExistence');
            return undefined;
        }
    }

    try {
        //connecting without specifying the database
        const connection = await mysql.createConnection({
            host:host,
            user:user,
            password:password
        });
        logSuccess('MYSQL general connection successful');
        connection.connect(function(err) {
            if (err) throw err;
            connection.query("SHOW DATABASES LIKE '" + database + "'", function (err, result) {
                if (err) throw err;
                if (result !== ""){
                    if (areMessagesToBeDisplayed) logSuccess("Database existence check successful, query result:\n" + result);
                    return true;
                }
                else{
                    if (areMessagesToBeDisplayed) logError('Existence check finished: database does not exist:\n' + result);
                    return false;
                }
            });
        });
    } catch (error) {
        if (areMessagesToBeDisplayed) logError('MYSQL general connection failed, database existence check failed:\n' + error.message);
        return false;
    }
}

//exports
export const connectMySQL = _connectMySQL;