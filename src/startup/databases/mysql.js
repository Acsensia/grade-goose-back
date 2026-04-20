//imports
import mysql from 'mysql2/promise';
//imports->project
import { logParameterTypeError, logError, logSuccess } from '../console/mainConsoleLoggers.js';
import { consoleAskTwoOptions } from '../console/mainConsoleAskers.js';
import { serverShutdown } from '../serverManagement.js';

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

        //asking to see if the database exists
        const shouldCheckDBExistence = consoleAskTwoOptions("Should the program look if the database in question exists?", "Y", "N");
        if (shouldCheckDBExistence){
            const databaseExists = __checkForDatabaseExistence(host, user, password, database);
        }
        else serverShutdown();
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
    if (typeof host !== 'string'){
        logParameterTypeError('host', 'string', host, '__suggestDatabaseCreation');
        return undefined;
    }
    if (typeof user !== 'string'){
        logParameterTypeError('user', 'string', user, '__suggestDatabaseCreation');
        return undefined;
    }
    if (typeof password !== 'string'){
        logParameterTypeError('password', 'string', password, '__suggestDatabaseCreation');
        return undefined;
    }
    if (typeof database !== 'string'){
        logParameterTypeError('database', 'string', database, '__suggestDatabaseCreation');
        return undefined;
    }

    ////TODO
}

async function __checkForDatabaseExistence(host, user, password, database) {
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
    if (typeof host !== 'string'){
        logParameterTypeError('host', 'string', host, '__suggestDatabaseCreation');
        return undefined;
    }
    if (typeof user !== 'string'){
        logParameterTypeError('user', 'string', user, '__suggestDatabaseCreation');
        return undefined;
    }
    if (typeof password !== 'string'){
        logParameterTypeError('password', 'string', password, '__suggestDatabaseCreation');
        return undefined;
    }
    if (typeof database !== 'string'){
        logParameterTypeError('database', 'string', database, '__suggestDatabaseCreation');
        return undefined;
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
                if (result !== "") logSuccess("Database existence check successful, query result:\n" + result);
            });
        });
    } catch (error) {
        logError('MYSQL general connection failed, database existence check failed:\n' + error.message);
        return false;
    }
}

//exports
export const connectMySQL = _connectMySQL;