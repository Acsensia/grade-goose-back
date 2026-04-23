//imports
import path from "path";
import fs from "fs";

//imports and constants for the __dirname definition
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//imports->project
import { logNeutral, logError, logParameterTypeError, logSuccess, logWarning } from "../../../console/mainConsoleLoggers.js";

//don't forget to type 'multipleStatements: true' when creating connections when intending to use this function
function _readQuery(pathToPackageIn_queries_folder, areMessagesToBeDisplayed) {//an example: "management/createDB.sql"
    if (typeof pathToPackageIn_queries_folder !== 'string'){
        logParameterTypeError('pathToPackageIn_queries_folder', 'string', pathToPackageIn_queries_folder, 'readQuery');
        return undefined;
    }
    if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
    else {
        if (typeof areMessagesToBeDisplayed !== "boolean") {
            logParameterTypeError('areMessagesToBeDisplayed', 'boolean', areMessagesToBeDisplayed, 'readQuery');
            return undefined;
        }
    }

    try{
        if (areMessagesToBeDisplayed) logNeutral(`(0/1)Trying to read a query from a .sql file (path to the file: ${pathToPackageIn_queries_folder})...`)
        const queryReadingResult = fs.readFileSync(path.join(__dirname, pathToPackageIn_queries_folder)).toString();
        if (areMessagesToBeDisplayed) logSuccess(`(1/1)Successfully read a query from a .sql file (path to the file: ${pathToPackageIn_queries_folder})!`)
        return queryReadingResult;
    } catch (error) {
        logError(`(!/1)Failed to read a query from the .sql file (path to the file: ${pathToPackageIn_queries_folder}, error message: ${error})!`)
        return undefined;
    }
    
}

function _readCreatedDatabaseNameFromQueryString(queryInStringFormat, areMessagesToBeDisplayed) {
    if (typeof queryInStringFormat !== 'string'){
        logParameterTypeError('queryInStringFormat', 'string', queryInStringFormat, 'readCreatedDatabaseNameFromQueryString');
        return undefined;
    }
    if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
    else {
        if (typeof areMessagesToBeDisplayed !== "boolean") {
            logParameterTypeError('areMessagesToBeDisplayed', 'boolean', areMessagesToBeDisplayed, 'readQuery');
            return undefined;
        }
    }

    try {
        if (areMessagesToBeDisplayed) logNeutral(`(0/1)Trying to find out the name of the database created in a query...`);
        const creationSentences = [
            "CREATE SCHEMA ",
            "CREATE SCHEMA IF NOT EXISTS ",
            "CREATE DATABASE ",
            "CREATE DATABASE IF NOT EXISTS ",
            "USE "
        ]
        var creationCommandSentenceIndex = -1;
        for (var sentenceIndex = 0; sentenceIndex < creationSentences.length; sentenceIndex++) {
            const curSentence = creationSentences[sentenceIndex];
            creationCommandSentenceIndex = queryInStringFormat.indexOf(curSentence);
            if (creationCommandSentenceIndex !== -1) {
                var databaseName = "";
                for(var curCharIndex = creationCommandSentenceIndex; curCharIndex < queryInStringFormat.length; curCharIndex++) {
                    if (queryInStringFormat[curCharIndex] === '`') {
                        databaseName = "";
                        for (var curDatabaseNameIndex = curCharIndex + 1; curDatabaseNameIndex < queryInStringFormat.length && queryInStringFormat[curDatabaseNameIndex] !== '`' && queryInStringFormat[curDatabaseNameIndex] !== '.'; curDatabaseNameIndex++) {
                            databaseName += queryInStringFormat[curDatabaseNameIndex];
                        }
                        break;
                    }
                }
                if (databaseName !== "") {
                    if (areMessagesToBeDisplayed) {
                        logSuccess(`(1/1)Successfully found out the name of the database created in the query (${databaseName})!`)
                    }
                    return databaseName;
                } else {
                    if (areMessagesToBeDisplayed) {
                        logWarning(`(?/1)Failed to find the start of a database name after the "${curSentence}" sentence!`);
                    }
                }
            } else {
                if (areMessagesToBeDisplayed) {
                    logWarning(`(?/1)Creation sentence ${curSentence} was not found within the query...`);
                }
            }
        }
        //the function fails if doesn't find any "databaseName" fillings
        // inside the main 'for' cycle or doesn't find any "creationSentences"
        if (areMessagesToBeDisplayed) {
            if (creationCommandSentenceIndex == -1) {
                logError(`(!/1)Failed to find out the name of the database created due to neither creation sentence having been found in the query!`);
            } else {
                logError(`(!/1)Failed to find out the name of the database created due to not having found the start of a database name after neither found creation sentence `);
            }
        }
        return undefined;
    } catch (error) {
        if (areMessagesToBeDisplayed) {
            logError(`(!/1)Failed to find out the name of the database created in the query! Error message: ${error}`);
        }
        return undefined;
    }
}

function _changeDatabaseNameInQueryString(queryInStringFormat, newDatabaseName, areMessagesToBeDisplayed) {
    if (typeof queryInStringFormat !== 'string'){
        logParameterTypeError('queryInStringFormat', 'string', queryInStringFormat, 'changeDatabaseNameInQueryString');
        return undefined;
    }
    if (typeof newDatabaseName !== 'string'){
        logParameterTypeError('newDatabaseName', 'string', newDatabaseName, 'changeDatabaseNameInQueryString');
        return undefined;
    }
    if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
    else {
        if (typeof areMessagesToBeDisplayed !== "boolean") {
            logParameterTypeError('areMessagesToBeDisplayed', 'boolean', areMessagesToBeDisplayed, 'readQuery');
            return undefined;
        }
    }

    try {
        if (areMessagesToBeDisplayed) {
            logNeutral(`(0/changeDatabaseNameInQueryString)Trying to rename the name of the database in the query to the new name ("${newDatabaseName}")...`);
            logNeutral(`(1/changeDatabaseNameInQueryString)Trying to find the name of the database used inside the query...`);
        }
        const oldDatabaseName = _readCreatedDatabaseNameFromQueryString(queryInStringFormat, areMessagesToBeDisplayed);
        if (oldDatabaseName === undefined) {
            if (areMessagesToBeDisplayed) logError(`(!/changeDatabaseNameInQueryString)Failed to find the name of the database used inside the query!`);
            return undefined;
        }
        else {
            if (areMessagesToBeDisplayed) logSuccess(`(1/changeDatabaseNameInQueryString)Successfully found the name of the database used inside the query: "${oldDatabaseName}".`);
        }

        if (areMessagesToBeDisplayed) logNeutral(`(2/changeDatabaseNameInQueryString)Trying to replace all instances of "${oldDatabaseName}" with "${newDatabaseName}" inside the query string...`);
        const result = queryInStringFormat.replaceAll(oldDatabaseName, newDatabaseName);
        if (areMessagesToBeDisplayed) logSuccess(`(2/changeDatabaseNameInQueryString)Successfully replaced all instances of "${oldDatabaseName}" with "${newDatabaseName}" inside the query string!`);
        return result;
    } catch (error) {
        logError(`(!/changeDatabaseNameInQueryString)Failed generally to rename the name of the database in the query to the new name ("${newDatabaseName}")! Error message: ${error}`);
        return undefined;
    }
}

export const readQuery = _readQuery;
export const readCreatedDatabaseNameFromQueryString = _readCreatedDatabaseNameFromQueryString;
export const changeDatabaseNameInQueryString = _changeDatabaseNameInQueryString;