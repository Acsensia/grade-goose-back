//imports
import mysql from 'mysql2/promise';

//imports->project
import { logParameterTypeError, logError, logSuccess, logNeutral } from '../../console/mainConsoleLoggers.js';
import { consoleAskTwoOptions } from '../../console/mainConsoleAskers.js';
import { serverShutdown } from '../../serverManagement.js';
import { changeDatabaseNameInQueryString, readQuery } from './queries/queryUtilities.js';

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

    if (!(await __checkForDatabaseExistence(host, user, password, database, true))) {
        await __suggestCreatingDatabase(host, user, password, database, true);
    } else {
        if (consoleAskTwoOptions("Remove current database?", "Y", "N")) {
            const databaseRemovalResult = await __removeDatabase(host, user, password, database, true);
            if (databaseRemovalResult) {
                await __suggestCreatingDatabase(host, user, password, database, true);
            } else serverShutdown();
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
        serverShutdown();
    }
}
//incapsulates __createDatabase
async function __suggestCreatingDatabase(host, user, password, database, areMessagesToBeDisplayed) {
    //intentionally no checks cause the inner function should work fine
    if (consoleAskTwoOptions("Generate the target database?", "Y", "N")) {
        if (!(await __createDatabase(host, user, password, database, areMessagesToBeDisplayed))) serverShutdown();
    } else serverShutdown();
}

async function __createDatabase(host, user, password, database, areMessagesToBeDisplayed) {
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
    if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
    else {
        if (typeof areMessagesToBeDisplayed !== 'boolean'){
            logParameterTypeError('areMessagesToBeDisplayed', 'boolean', areMessagesToBeDisplayed, '__checkForDatabaseExistence');
            return undefined;
        }
    }

    if (areMessagesToBeDisplayed) logNeutral('(0/__createDatabase)Trying to create the target database...');
    try {
        //connecting without specifying the database
        if (areMessagesToBeDisplayed) logNeutral(`(1/__createDatabase)Trying to create a general MYSQL connection...`);
        const connection = await mysql.createConnection({
            host:host,
            user:user,
            password:password,
            multipleStatements: true
        });
        try {
            if (areMessagesToBeDisplayed) logSuccess('(1/__createDatabase)MYSQL general connection successful');

            if (areMessagesToBeDisplayed) logNeutral(`(1/__createDatabase)Trying to load the database creation query from an sql file...`);
            //
            var queryString = await readQuery("management/createDB.sql", true);
            if (queryString === undefined) {
                if (areMessagesToBeDisplayed) logError(`(!/__createDatabase)Failed to load the database creation query from an sql file!`);
                return false;
            } else {
                if (areMessagesToBeDisplayed) (`(1/__createDatabase)Successfully loaded the database creation query from an sql file.`);
            }

            if (areMessagesToBeDisplayed) logNeutral(`(2/__createDatabase)Trying to change the name of the database inside the loaded query...`);
            queryString = changeDatabaseNameInQueryString(queryString, database, true);
            if (queryString === undefined) {
                if (areMessagesToBeDisplayed) logError(`(2/__createDatabase)Failed to change the name of the database inside the loaded query!`);
                return false;
            } else {
                if (areMessagesToBeDisplayed) logSuccess('(2/__createDatabase)Successfully changed the name of the database inside the loaded query.');
            }
            
            if (areMessagesToBeDisplayed) logNeutral(`(3/__createDatabase)Trying to run the modified query...`);
            await connection.query(queryString);
            if (areMessagesToBeDisplayed) logSuccess('(3/__createDatabase)Successfully changed ran the query, database created successfully.');
            return true;
        } finally{
            connection.end();
        }
    } catch (error) {
        if (areMessagesToBeDisplayed) logError('Database creation failed in general:\n' + error.message);
        return false;
    }
}

// async function __renameDatabase(host, user, password, databaseToBeRenamed, newDatabaseName, areMessagesToBeDisplayed) {
//     if (
//         host     === undefined ||
//         user     === undefined ||
//         password === undefined
//     ){
//         host = process.env.DB_HOST;
//         user = process.env.DB_USER;
//         password = process.env.DB_PASS;
//     }
//     else{
//         if (typeof host !== 'string'){
//             logParameterTypeError('host', 'string', host, '__renameDatabase');
//             return undefined;
//         }
//         if (typeof user !== 'string'){
//             logParameterTypeError('user', 'string', user, '__renameDatabase');
//             return undefined;
//         }
//         if (typeof password !== 'string'){
//             logParameterTypeError('password', 'string', password, '__renameDatabase');
//             return undefined;
//         }
//     }
//     if (typeof databaseToBeRenamed !== 'string'){
//         logParameterTypeError('databaseToBeRenamed', 'string', databaseToBeRenamed, '__renameDatabase');
//         return undefined;
//     }
//     if (typeof newDatabaseName !== 'string'){
//         logParameterTypeError('newDatabaseName', 'string', newDatabaseName, '__renameDatabase');
//         return undefined;
//     }
//     if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
//     else {
//         if (typeof areMessagesToBeDisplayed !== 'boolean'){
//             logParameterTypeError('areMessagesToBeDisplayed', 'boolean', areMessagesToBeDisplayed, '__renameDatabase');
//             return undefined;
//         }
//     }

//     try{
//         if (areMessagesToBeDisplayed) {
//             logNeutral(`(0/)Trying to change the name of the "${databaseToBeRenamed}" database...`);
//         }
        
//         //checking if the desired database exists
//         logNeutral(`(1/)Checking if the "${databaseToBeRenamed}" database exists...`);
//         if (__checkForDatabaseExistence(host, user, password, databaseToBeRenamed, false)) {
//             if (areMessagesToBeDisplayed) logSuccess(`(1/)"Database named "${databaseToBeRenamed}" really exists.`);
//         } else {
//             if (areMessagesToBeDisplayed) logError(`(!/)Database named "${databaseToBeRenamed}" doesn't exist!`);
//             return undefined;
//         }

//         //checking if the new name isn't already taken by another database
//         logNeutral(`(2/)Checking if the "${newDatabaseName}" database name is not already used...`);
//         if (!__checkForDatabaseExistence(host, user, password, newDatabaseName, false)) {
//             if (areMessagesToBeDisplayed) logSuccess(`(2/)"Database name "${newDatabaseName}" is not used by any other database.`);
//         } else {
//             if (areMessagesToBeDisplayed) logError(`(!/)Database name "${newDatabaseName}" is already being used by another database!`);
//             return undefined;
//         }

//         //creating a new database with the new name
//     } catch (error) {
//         if (areMessagesToBeDisplayed) {
//             logError(`(!/)Failed while trying to change the name of the "${databaseToBeRenamed}" database! Error message: ${error}`);
//         }
//     }
    
// }

async function __removeDatabase(host, user, password, database, areMessagesToBeDisplayed){
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
    if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
    else {
        if (typeof areMessagesToBeDisplayed !== 'boolean'){
            logParameterTypeError('areMessagesToBeDisplayed', 'boolean', areMessagesToBeDisplayed, '__checkForDatabaseExistence');
            return undefined;
        }
    }

    if (areMessagesToBeDisplayed) logNeutral('(0/2)Trying to remove the target database...');
    try {
        //connecting without specifying the database
        const connection = await mysql.createConnection({
            host:host,
            user:user,
            password:password
        });
        if (areMessagesToBeDisplayed) logSuccess('(1/2)MYSQL general connection successful');
        try {
            await connection.query(`DROP DATABASE IF EXISTS \`${database}\``);
            logSuccess('(2/2)Target database removal successful');
        } finally {
            connection.end();
        }
        return true;
    } catch (error) {
        if (areMessagesToBeDisplayed) logError('(!/2)Target database removal failed:\n' + error.message);
        return false;
    }
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
        if (areMessagesToBeDisplayed) logNeutral('(0/2)Trying to check if target database exists...');

        //connecting without specifying the database
        const connection = await mysql.createConnection({
            host:host,
            user:user,
            password:password
        });
        if (areMessagesToBeDisplayed) logSuccess('(1/2)MYSQL general connection successful');
        try{
            const [resultingRows] = await connection.query(`SHOW DATABASES LIKE '${database}'`);
            if (resultingRows.length > 0) {
                if (areMessagesToBeDisplayed) logSuccess("(2/2)Database existence check successful, query result:\n" + resultingRows);
                return true;
            } else {
                if (areMessagesToBeDisplayed) logError('(2/2)Existence check finished: database does not exist:\n' + resultingRows);
                return false;
            }
        } finally {
            connection.end();
        }
    } catch (error) {
        if (areMessagesToBeDisplayed) logError('(!/2)Database existence check failed:\n' + error.message);
        return false;
    }
}

//exports
export const connectMySQL = _connectMySQL;