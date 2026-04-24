//imports->project
import { logError } from "./console/consoleLoggers.js";

function _serverShutdown(message){
    if (message === undefined){
        message = 'Server shutting down...';
    }
    logError(message);
    process.exit(1);
}

//exports
export const serverShutdown = _serverShutdown;