//imports
import path from "path";
import fs from "fs";

//imports->project
import { logParameterTypeError } from "../../../console/mainConsoleLoggers";

//don't forget to type 'multipleStatements: true' when creating connections when intending to use this function
function _readQuery(pathToPackageIn_queries_folder) {//an example: "management/createDB.sql"
    return fs.readFileSync(path.join(__dirname, pathToPackageIn_queries_folder)).toString();
}

export const readQuery = _readQuery;