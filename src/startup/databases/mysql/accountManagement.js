//imports
// import mysql from 'mysql2/promise';

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
        const administratorCount = await databaseConnection.query('SELECT COUNT(*) FROM `administrators`;')
        if (areMessagesToBeDisplayed) consoleLoggers.logNeutral(`(0/_getAdministratorCount)Successfully got the count of currently registered DB administrators: ${administratorCount}!`);
        return administratorCount;
    } catch (error) {
        if (areMessagesToBeDisplayed) consoleLoggers.logError(`(0/_getAdministratorCount)Failed to get the count of currently registered DB administrators! Error message: ${error}`);
        return undefined;
    }
}

//exports
export const getAdministratorCount = _getAdministratorCount;