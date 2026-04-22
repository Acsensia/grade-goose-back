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
        logParameterTypeError('queryInStringFormat', 'string', queryInStringFormat, '_readCreatedDatabaseNameFromQueryString');
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
        if (areMessagesToBeDisplayed) logNeutral(`(0/)Trying to find out the name of the database created in a query...`);
        const creationSentences = [
            "CREATE SCHEMA ",
            "CREATE SCHEMA IF NOT EXISTS ",
            "CREATE DATABASE ",
            "CREATE DATABASE IF NOT EXISTS ",
            "USE "
        ]
        var creationCommandSentenceIndex = -1;
        creationSentences.forEach(sentence => {
            creationCommandSentenceIndex = queryInStringFormat.indexOf(sentence);
            if (creationCommandSentenceIndex !== -1) {
                var databaseName = "";
                for(var curCharIndex = creationCommandSentenceIndex; curCharIndex < queryInStringFormat.length; curCharIndex++) {
                    if (queryInStringFormat[curCharIndex] === '`') {
                        for (var curDatabaseNameIndex = curCharIndex + 1; ; curDatabaseNameIndex++) {
                            if ( curDatabaseNameIndex >= queryInStringFormat.length ||
                                queryInStringFormat[curDatabaseNameIndex] === '`') {
                                    break;
                                }
                            else databaseName += queryInStringFormat[curDatabaseNameIndex];
                        }
                    }
                }
                if (databaseName !== "") {
                    if (areMessagesToBeDisplayed) {
                        logSuccess(`(1/)Successfully found out the name of the database created in the query (${databaseName})!`)
                    }
                    return databaseName;
                } else {
                    if (areMessagesToBeDisplayed) {
                        logWarning(`(?/)Failed to find the start of a database name after the "${sentence}" sentence!`);
                    }
                }
            } else {
                if (areMessagesToBeDisplayed) {
                    logWarning(`(?/)Creation sentence ${sentence} was not found within the query...`);
                }
            }
        });
        //the function fails if doesn't find any "databaseName" fillings
        // inside the forEach cycle or doesn't find any "creationSentences"
        if (areMessagesToBeDisplayed) {
            if (creationCommandSentenceIndex == -1) {
                logError(`(!/)Failed to find out the name of the database created due to neither 
                    creation sentence having been found in the query!`);
            } else {
                logError(`(!/)Failed to find out the name of the database created due to
                     not having found the start of a database name after 
                     neither found creation sentence `);
            }
        }
    } catch (error) {
        if (areMessagesToBeDisplayed) {
            logError(`Failed to find out the name of the database created in the query! Error message: ${error}`);
        }
        return undefined;
    }
}

export const readQuery = _readQuery;
export const readCreatedDatabaseNameFromQueryString = _readCreatedDatabaseNameFromQueryString;