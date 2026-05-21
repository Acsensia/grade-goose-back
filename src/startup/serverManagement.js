//imports->project
import * as consoleLoggers from "./console/consoleLoggers.js";
import * as mysqlManagement from "./databases/mysql/mysqlManagement.js";

async function _shutdown(message) {
  if (message === undefined) {
    message = "Server shutting down...";
  }
  consoleLoggers.logError(message);

  const connectionPool = await mysqlManagement.getConnectionPool(true, true);
  if (connectionPool) await connectionPool.end();

  process.exit(1);
}

//exports
export const shutdown = _shutdown;
