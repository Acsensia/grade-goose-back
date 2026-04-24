//imports->project
import * as consoleLoggers from "./console/consoleLoggers.js";

function _shutdown(message){
    if (message === undefined){
        message = 'Server shutting down...';
    }
    consoleLoggers.logError(message);
    process.exit(1);
}

//exports
export const shutdown = _shutdown;