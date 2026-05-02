//imports
import { Router } from "express";

//imports->project
import * as mysqlManagement from "../startup/databases/mysql/mysqlManagement.js";
import * as accountManagement from "../startup/databases/mysql/accounts/accountManagement.js";
import * as consoleLoggers from "../startup/console/consoleLoggers.js";

//.setup
const _accountRouter = Router();

//utility functions

async function _getAccountInfo(
  req,
  res,
  accountTableName,
  idColumnName,
  userType,
) {
  try {
    consoleLoggers.logNeutral(
      `(_getAccountInfo:_getAccountInfo)Got an account info request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if (userType !== req.user.type)
      res.status(401).json({ message: "Unauthorized: wrong account type" });

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const user = await accountManagement.getAccount(
      connectionPool,
      true,
      accountTableName,
      idColumnName,
      req.user.id,
    );
    if (!user) throw new Error("Could not find user with specified ID!");

    res.json({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      patronymic_name: user.patronymic_name,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_getAccountInfo:_getAccountInfo)General error while processing an account info request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

//login routes

_accountRouter.post("/info/admin", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/info/admin)Got an admin info request, processing...`,
    );
    return await _getAccountInfo(
      req,
      res,
      "administrators",
      "administrator_id",
      "administrator",
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/info/admin)General error while processing an admin info request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//exports
export const accountRouter = _accountRouter;
