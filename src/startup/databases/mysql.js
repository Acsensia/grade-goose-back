//imports
import mysql from 'mysql2/promise';
//imports->project
import { logParameterTypeError, logError, logSuccess } from '../messengers/mainMessengers.js';
import { serverShutdown } from '../serverManagement.js';

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

//exports
export const connectMySQL = _connectMySQL;