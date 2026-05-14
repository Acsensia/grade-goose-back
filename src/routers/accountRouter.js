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
      `(_getAccountInfo)Got an account info request, processing...`,
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
      `(_getAccountInfo)General error while processing an account info request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _changeAccountEmail(
  req,
  res,
  accountTableName,
  idColumnName,
  userType,
  _newEmail,
  _oldEmail,
) {
  try {
    consoleLoggers.logNeutral(
      `(_changeAccountEmail)Got an account email change request, processing...`,
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

    if (user.email !== _oldEmail) {
      res.status(400).json({ message: "Wrong old email!" });
      return false;
    }

    user.email = _newEmail;
    const updateResult = await accountManagement.updateAccount(
      connectionPool,
      true,
      accountTableName,
      idColumnName,
      req.user.id,
      user,
    );
    if (!updateResult)
      throw new Error(
        "Failed to update the account with the newly specified information!",
      );

    res.status(200).json({ message: "Successfully changed email" });
  } catch (error) {
    consoleLoggers.logError(
      `(_changeAccountEmail)General error while processing an account email change request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

//account routes

_accountRouter.post("/info/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/info/student)Got a student info request, processing...`,
    );
    return await _getAccountInfo(req, res, "students", "student_id", "student");
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/info/student)General error while processing a student info request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/info/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/info/teacher)Got a teacher info request, processing...`,
    );
    return await _getAccountInfo(req, res, "teachers", "teacher_id", "teacher");
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/info/teacher)General error while processing a teacher info request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

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

_accountRouter.post("/change/email/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/change/email/student)Got a student email change request, processing...`,
    );

    const { newEmail, oldEmail } = req.body;

    if (!newEmail)
      throw new Error("No newEmail parameter in the received JSON.");
    if (!oldEmail)
      throw new Error("No oldEmail parameter in the received JSON.");

    return await _changeAccountEmail(
      req,
      res,
      "students",
      "student_id",
      "student",
      newEmail,
      oldEmail,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/change/email/student)General error while processing a student email change request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/change/email/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/change/email/teacher)Got a teacher email change request, processing...`,
    );

    const { newEmail, oldEmail } = req.body;

    if (!newEmail)
      throw new Error("No newEmail parameter in the received JSON.");
    if (!oldEmail)
      throw new Error("No oldEmail parameter in the received JSON.");

    return await _changeAccountEmail(
      req,
      res,
      "teachers",
      "teacher_id",
      "teacher",
      newEmail,
      oldEmail,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/change/email/teacher)General error while processing a teacher email change request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/change/email/admin", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/change/email/admin)Got an admin email change request, processing...`,
    );

    const { newEmail, oldEmail } = req.body;

    if (!newEmail)
      throw new Error("No newEmail parameter in the received JSON.");
    if (!oldEmail)
      throw new Error("No oldEmail parameter in the received JSON.");

    return await _changeAccountEmail(
      req,
      res,
      "administrators",
      "administrator_id",
      "administrator",
      newEmail,
      oldEmail,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/change/email/admin)General error while processing an admin email change request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//exports
export const accountRouter = _accountRouter;
