//imports
import { Router } from "express";
import * as bcrypt from "bcrypt";

//imports->project
import * as mysqlManagement from "../startup/databases/mysql/mysqlManagement.js";
import * as accountManagement from "../startup/databases/mysql/accounts/accountManagement.js";
import * as entityManagement from "../startup/databases/mysql/accounts/entityManagement.js";
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
      return res
        .status(401)
        .json({ message: "Unauthorized: wrong account type" });

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

async function _changeAccountPassword(
  req,
  res,
  accountTableName,
  idColumnName,
  userType,
  _newPassword,
  _oldPassword,
) {
  try {
    consoleLoggers.logNeutral(
      `(_changeAccountPassword)Got an account password change request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if (userType !== req.user.type)
      return res
        .status(401)
        .json({ message: "Unauthorized: wrong account type" });

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

    const isMatch = await bcrypt.compare(_oldPassword, user.password_hash);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    user.password_hash = await accountManagement.hashPassword(
      _newPassword,
      true,
    );
    if (!user.password_hash) throw new Error("Failed to hash the password!");

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

    res.status(200).json({ message: "Successfully changed password" });
  } catch (error) {
    consoleLoggers.logError(
      `(_changeAccountPassword)General error while processing an account password change request, error message: "${error}".`,
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
      return res
        .status(401)
        .json({ message: "Unauthorized: wrong account type" });

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

    if (user.email !== _oldEmail)
      return res.status(400).json({ message: "Wrong old email!" });

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

async function _changeAccountFName(
  req,
  res,
  accountTableName,
  idColumnName,
  userType,
  _newFName,
) {
  try {
    consoleLoggers.logNeutral(
      `(_changeAccountFName)Got an account first name change request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if (userType !== req.user.type)
      return res
        .status(401)
        .json({ message: "Unauthorized: wrong account type" });

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

    user.first_name = _newFName;
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

    res.status(200).json({ message: "Successfully changed first name" });
  } catch (error) {
    consoleLoggers.logError(
      `(_changeAccountFName)General error while processing an account first name change request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _changeAccountLName(
  req,
  res,
  accountTableName,
  idColumnName,
  userType,
  _newLName,
) {
  try {
    consoleLoggers.logNeutral(
      `(_changeAccountLName)Got an account last name change request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if (userType !== req.user.type)
      return res
        .status(401)
        .json({ message: "Unauthorized: wrong account type" });

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

    user.last_name = _newLName;
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

    res.status(200).json({ message: "Successfully changed last name" });
  } catch (error) {
    consoleLoggers.logError(
      `(_changeAccountLName)General error while processing an account last name change request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _changeAccountPName(
  req,
  res,
  accountTableName,
  idColumnName,
  userType,
  _newPName,
) {
  try {
    consoleLoggers.logNeutral(
      `(_changeAccountPName)Got an account patronymic name change request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if (userType !== req.user.type)
      return res
        .status(401)
        .json({ message: "Unauthorized: wrong account type" });

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

    user.patronymic_name = _newPName;
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

    res.status(200).json({ message: "Successfully changed patronymic name" });
  } catch (error) {
    consoleLoggers.logError(
      `(_changeAccountPName)General error while processing an account patronymic name change request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

//utility: admin-only functions

async function _getAllUserAccountInfo(
  req,
  res,
  accountTableName,
  accountIdColumnName,
) {
  try {
    consoleLoggers.logNeutral(
      `(_getAllUserAccountInfo)Got an all account info request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if ("administrator" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not administrator (current user type: ${req.user.type})`,
      });

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const result = await accountManagement.getAllAccounts(
      connectionPool,
      true,
      accountTableName,
      accountIdColumnName,
    );
    if (!result) throw new Error("Failed to get all all accounts!");

    res.json({
      result: result,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_getAllUserAccountInfo)General error while processing an all account info request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _addNewUserAccount(
  req,
  res,
  accountTableName,
  _email,
  _password,
  _firstName,
  _lastName,
  _patronymicName,
) {
  try {
    consoleLoggers.logNeutral(
      `(_addNewUserAccount)Got an account addition request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if ("administrator" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not administrator (current user type: ${req.user.type})`,
      });

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const additionResult = await accountManagement.addAccount(
      connectionPool,
      true,
      accountTableName,
      _email,
      _password,
      _firstName,
      _lastName,
      _patronymicName,
    );
    if (!additionResult)
      throw new Error("Failed to add the almost-new account!");

    res.json({
      result: additionResult,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_addNewUserAccount)General error while processing an account addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _getUserAccountInfo(
  req,
  res,
  accountTableName,
  idColumnName,
  _idColumnValue,
) {
  try {
    consoleLoggers.logNeutral(
      `(_getUserAccountInfo)Got a user account info request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if ("administrator" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not administrator (current user type: ${req.user.type})`,
      });

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const user = await accountManagement.getAccount(
      connectionPool,
      true,
      accountTableName,
      idColumnName,
      _idColumnValue,
    );
    if (!user)
      throw new Error("Could not find user account with specified ID!");

    res.json({
      id: user[`${idColumnName}`],
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      patronymic_name: user.patronymic_name,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_getUserAccountInfo)General error while processing a user account info request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _deleteUserAccountSelection(
  req,
  res,
  accountTableName,
  idColumnName,
  _idSelection,
) {
  try {
    consoleLoggers.logNeutral(
      `(_deleteUserAccountSelection)Got a user account selection deletion request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if ("administrator" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not administrator (current user type: ${req.user.type})`,
      });

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const deletionResult = await accountManagement.deleteAccountSelection(
      connectionPool,
      true,
      accountTableName,
      idColumnName,
      _idSelection,
    );
    if (!deletionResult)
      throw new Error("Failed to delete the specified account selection!");

    res.json({ result: deletionResult });
  } catch (error) {
    consoleLoggers.logError(
      `(_deleteUserAccountSelection)General error while processing a user account selection deletion request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _updateUserAccountPassword(
  req,
  res,
  accountTableName,
  idColumnName,
  _idColumnValue,
  _newPassword,
) {
  try {
    consoleLoggers.logNeutral(
      `(_updateUserAccountPassword)Got a user account password change request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if ("administrator" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not administrator (current user type: ${req.user.type})`,
      });

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const user = await accountManagement.getAccount(
      connectionPool,
      true,
      accountTableName,
      idColumnName,
      _idColumnValue,
    );
    if (!user)
      throw new Error("Could not find user account with specified ID!");

    user.password_hash = await accountManagement.hashPassword(
      _newPassword,
      true,
    );
    if (!user.password_hash) throw new Error("Failed to hash the password!");

    const updateResult = await accountManagement.updateAccount(
      connectionPool,
      true,
      accountTableName,
      idColumnName,
      _idColumnValue,
      user,
    );
    if (!updateResult)
      throw new Error(
        "Failed to update the account with the newly specified information!",
      );

    res
      .status(200)
      .json({ message: "Successfully changed user account password" });
  } catch (error) {
    consoleLoggers.logError(
      `(_updateUserAccountPassword)General error while processing a user account password change request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _updateUserAccountEmail(
  req,
  res,
  accountTableName,
  idColumnName,
  _idColumnValue,
  _newEmail,
) {
  try {
    consoleLoggers.logNeutral(
      `(_changeUserAccountEmail)Got a user account email update request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if ("administrator" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not administrator (current user type: ${req.user.type})`,
      });

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const user = await accountManagement.getAccount(
      connectionPool,
      true,
      accountTableName,
      idColumnName,
      _idColumnValue,
    );
    if (!user)
      throw new Error("Could not find user account with specified ID!");

    user.email = _newEmail;
    const updateResult = await accountManagement.updateAccount(
      connectionPool,
      true,
      accountTableName,
      idColumnName,
      _idColumnValue,
      user,
    );
    if (!updateResult)
      throw new Error(
        "Failed to update the user account with the newly specified information!",
      );

    res
      .status(200)
      .json({ message: "Successfully changed user account email" });
  } catch (error) {
    consoleLoggers.logError(
      `(_changeUserAccountEmail)General error while processing a user account email update request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _updateUserAccountFName(
  req,
  res,
  accountTableName,
  idColumnName,
  _idColumnValue,
  _newFName,
) {
  try {
    consoleLoggers.logNeutral(
      `(_changeAccountFName)Got a user account first name update request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if ("administrator" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not administrator (current user type: ${req.user.type})`,
      });

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const user = await accountManagement.getAccount(
      connectionPool,
      true,
      accountTableName,
      idColumnName,
      _idColumnValue,
    );
    if (!user)
      throw new Error("Could not find user account with specified ID!");

    user.first_name = _newFName;
    const updateResult = await accountManagement.updateAccount(
      connectionPool,
      true,
      accountTableName,
      idColumnName,
      _idColumnValue,
      user,
    );
    if (!updateResult)
      throw new Error(
        "Failed to update the user account with the newly specified information!",
      );

    res
      .status(200)
      .json({ message: "Successfully changed user account first name" });
  } catch (error) {
    consoleLoggers.logError(
      `(_changeAccountFName)General error while processing a user account first name update request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _updateUserAccountLName(
  req,
  res,
  accountTableName,
  idColumnName,
  _idColumnValue,
  _newLName,
) {
  try {
    consoleLoggers.logNeutral(
      `(_changeAccountFName)Got a user account last name update request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if ("administrator" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not administrator (current user type: ${req.user.type})`,
      });

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const user = await accountManagement.getAccount(
      connectionPool,
      true,
      accountTableName,
      idColumnName,
      _idColumnValue,
    );
    if (!user)
      throw new Error("Could not find user account with specified ID!");

    user.last_name = _newLName;
    const updateResult = await accountManagement.updateAccount(
      connectionPool,
      true,
      accountTableName,
      idColumnName,
      _idColumnValue,
      user,
    );
    if (!updateResult)
      throw new Error(
        "Failed to update the user account with the newly specified information!",
      );

    res
      .status(200)
      .json({ message: "Successfully changed user account last name" });
  } catch (error) {
    consoleLoggers.logError(
      `(_changeAccountFName)General error while processing a user account last name update request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _updateUserAccountPName(
  req,
  res,
  accountTableName,
  idColumnName,
  _idColumnValue,
  _newPName,
) {
  try {
    consoleLoggers.logNeutral(
      `(_changeAccountFName)Got a user account patronymic name update request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if ("administrator" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not administrator (current user type: ${req.user.type})`,
      });

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const user = await accountManagement.getAccount(
      connectionPool,
      true,
      accountTableName,
      idColumnName,
      _idColumnValue,
    );
    if (!user)
      throw new Error("Could not find user account with specified ID!");

    user.patronymic_name = _newPName;
    const updateResult = await accountManagement.updateAccount(
      connectionPool,
      true,
      accountTableName,
      idColumnName,
      _idColumnValue,
      user,
    );
    if (!updateResult)
      throw new Error(
        "Failed to update the user account with the newly specified information!",
      );

    res
      .status(200)
      .json({ message: "Successfully changed user account patronymic name" });
  } catch (error) {
    consoleLoggers.logError(
      `(_changeAccountFName)General error while processing a user account patronymic name update request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _getUserAccountAssignedEntities(
  req,
  res,
  entityTableName,
  entityIdColumnName,
  assignedEntityTableName,
  assignedEntityTable_entityIdColumnName,
  assignedEntityTable_accountIdColumnName,
  _accountId,
) {
  try {
    consoleLoggers.logNeutral(
      `(_getUserAccountAssignedEntities)Got a user account assigned entities request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if ("administrator" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not administrator (current user type: ${req.user.type})`,
      });

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const result = await accountManagement.getAccountAssignedEntities(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      assignedEntityTableName,
      assignedEntityTable_entityIdColumnName,
      assignedEntityTable_accountIdColumnName,
      _accountId,
    );
    if (!result)
      throw new Error("Failed to get all entities assigned to a user account!");

    res.json({
      result: result,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_getUserAccountAssignedEntities)General error while processing a user account assigned entities request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _unassignUserAccountAssignedEntities(
  req,
  res,
  assignedEntityTableName,
  assignedEntityTable_entityIdColumnName,
  assignedEntityTable_accountIdColumnName,
  _entityIdSelection,
  _accountId,
) {
  try {
    consoleLoggers.logNeutral(
      `(_unassignUserAccountAssignedEntities)Got a user account assigned entities selection unassignment request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if ("administrator" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not administrator (current user type: ${req.user.type})`,
      });

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const unassignmentResult =
      await accountManagement.unassignAccountAssignedEntities(
        connectionPool,
        true,
        assignedEntityTableName,
        assignedEntityTable_accountIdColumnName,
        assignedEntityTable_accountIdColumnName,
        _entityIdSelection,
        _accountId,
      );
    if (!unassignmentResult)
      throw new Error(
        "Failed to unassign the specified account assigned entities!",
      );

    res.json({ result: unassignmentResult });
  } catch (error) {
    consoleLoggers.logError(
      `(_unassignUserAccountAssignedEntities)General error while processing a user account assigned entities selection unassignment request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _getAllEntityInfo(
  req,
  res,
  entitytTableName,
  entityIdColumnName,
) {
  try {
    consoleLoggers.logNeutral(
      `(_getAllEntityInfo)Got an all entity info request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if ("administrator" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not administrator (current user type: ${req.user.type})`,
      });

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const result = await entityManagement.getAllEntities(
      connectionPool,
      true,
      entitytTableName,
      entityIdColumnName,
    );
    if (!result) throw new Error("Failed to get all entities!");

    res.json({
      result: result,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_getAllEntityInfo)General error while processing an all entity info request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _deleteEntitySelection(
  req,
  res,
  entityTableName,
  entityIdColumnName,
  _entityIdSelection,
) {
  try {
    consoleLoggers.logNeutral(
      `(_deleteEntitySelection)Got an entity selection deletion request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if ("administrator" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not administrator (current user type: ${req.user.type})`,
      });

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const deletionResult = await entityManagement.deleteEntitySelection(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdSelection,
    );
    if (!deletionResult)
      throw new Error("Failed to delete the specified entity selection!");

    res.json({ result: deletionResult });
  } catch (error) {
    consoleLoggers.logError(
      `(_deleteEntitySelection)General error while processing an entity selection deletion request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _addNewStudentGroup(
  req,
  res,
  entityTableName,
  _name,
  _description,
) {
  try {
    consoleLoggers.logNeutral(
      `(_addNewStudentGroup)Got a student group addition request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if ("administrator" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not administrator (current user type: ${req.user.type})`,
      });

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const additionResult = await entityManagement.addStudentGroup(
      connectionPool,
      true,
      entityTableName,
      _name,
      _description,
    );
    if (!additionResult)
      throw new Error("Failed to add the almost-new student group!");

    res.json({
      result: additionResult,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_addNewStudentGroup)General error while processing a student group addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _addNewSpecialty(
  req,
  res,
  entityTableName,
  _name,
  _abbreviation,
  _description,
) {
  try {
    consoleLoggers.logNeutral(
      `(_addNewSpecialty)Got a specialty addition request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if ("administrator" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not administrator (current user type: ${req.user.type})`,
      });

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const additionResult = await entityManagement.addSpecialty(
      connectionPool,
      true,
      entityTableName,
      _name,
      _abbreviation,
      _description,
    );
    if (!additionResult)
      throw new Error("Failed to add the almost-new specialty!");

    res.json({
      result: additionResult,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_addNewSpecialty)General error while processing a specialty addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _addNewSubject(req, res, entityTableName, _name, _description) {
  try {
    consoleLoggers.logNeutral(
      `(_addNewSubject)Got a subject addition request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if ("administrator" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not administrator (current user type: ${req.user.type})`,
      });

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const additionResult = await entityManagement.addSubject(
      connectionPool,
      true,
      entityTableName,
      _name,
      _description,
    );
    if (!additionResult)
      throw new Error("Failed to add the almost-new subject!");

    res.json({
      result: additionResult,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_addNewSubject)General error while processing a subject addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _addNewTask(
  req,
  res,
  entityTableName,
  _name,
  _instructions,
  _timeDue,
  _canBeHandedInPastDue,
) {
  try {
    consoleLoggers.logNeutral(
      `(_addNewTask)Got a task addition request, processing...`,
    );

    if (!req.user)
      throw new Error("No user object in request! Check auth middleware code.");

    if ("administrator" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not administrator (current user type: ${req.user.type})`,
      });

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const additionResult = await entityManagement.addTask(
      connectionPool,
      true,
      entityTableName,
      _name,
      _instructions,
      _timeDue,
      _canBeHandedInPastDue,
    );
    if (!additionResult) throw new Error("Failed to add the almost-new task!");

    res.json({
      result: additionResult,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_addNewTask)General error while processing a task addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

//account routes

//1.info routes

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

//2.change routes

//2.1pass change routes

_accountRouter.post("/change/pass/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/change/pass/student)Got a student password change request, processing...`,
    );

    const { newPassword, oldPassword } = req.body;

    if (!newPassword)
      throw new Error("No newPassword parameter in the received JSON.");
    if (!oldPassword)
      throw new Error("No oldPassword parameter in the received JSON.");

    return await _changeAccountPassword(
      req,
      res,
      "students",
      "student_id",
      "student",
      newPassword,
      oldPassword,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/change/pass/student)General error while processing a student password change request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/change/pass/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/change/pass/teacher)Got a teacher password change request, processing...`,
    );

    const { newPassword, oldPassword } = req.body;

    if (!newPassword)
      throw new Error("No newPassword parameter in the received JSON.");
    if (!oldPassword)
      throw new Error("No oldPassword parameter in the received JSON.");

    return await _changeAccountPassword(
      req,
      res,
      "teachers",
      "teacher_id",
      "teacher",
      newPassword,
      oldPassword,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/change/pass/teacher)General error while processing a teacher password change request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/change/pass/admin", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/change/pass/admin)Got an admin password change request, processing...`,
    );

    const { newPassword, oldPassword } = req.body;

    if (!newPassword)
      throw new Error("No newPassword parameter in the received JSON.");
    if (!oldPassword)
      throw new Error("No oldPassword parameter in the received JSON.");

    return await _changeAccountPassword(
      req,
      res,
      "administrators",
      "administrator_id",
      "administrator",
      newPassword,
      oldPassword,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/change/pass/admin)General error while processing an admin password change request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//2.2email change routes

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

//2.3first name change routes

_accountRouter.post("/change/firstname/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/change/firstname/student)Got a student first name change request, processing...`,
    );

    const { newFirstName } = req.body;

    if (!newFirstName)
      throw new Error("No newFirstName parameter in the received JSON.");

    return await _changeAccountFName(
      req,
      res,
      "students",
      "student_id",
      "student",
      newFirstName,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/change/firstname/student)General error while processing a student first name change request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/change/firstname/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/change/firstname/teacher)Got a teacher first name change request, processing...`,
    );

    const { newFirstName } = req.body;

    if (!newFirstName)
      throw new Error("No newFirstName parameter in the received JSON.");

    return await _changeAccountFName(
      req,
      res,
      "teachers",
      "teacher_id",
      "teacher",
      newFirstName,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/change/firstname/teacher)General error while processing a teacher first name change request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/change/firstname/admin", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/change/firstname/admin)Got an admin first name change request, processing...`,
    );

    const { newFirstName } = req.body;

    if (!newFirstName)
      throw new Error("No newFirstName parameter in the received JSON.");

    return await _changeAccountFName(
      req,
      res,
      "administrators",
      "administrator_id",
      "administrator",
      newFirstName,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/change/firstname/admin)General error while processing an admin first name change request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//2.4last name change routes

_accountRouter.post("/change/lastname/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/change/lastname/student)Got a student last name change request, processing...`,
    );

    const { newLastName } = req.body;

    if (!newLastName)
      throw new Error("No newLastName parameter in the received JSON.");

    return await _changeAccountLName(
      req,
      res,
      "students",
      "student_id",
      "student",
      newLastName,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/change/lastname/student)General error while processing a student last name change request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/change/lastname/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/change/lastname/teacher)Got a teacher last name change request, processing...`,
    );

    const { newLastName } = req.body;

    if (!newLastName)
      throw new Error("No newLastName parameter in the received JSON.");

    return await _changeAccountLName(
      req,
      res,
      "teachers",
      "teacher_id",
      "teacher",
      newLastName,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/change/lastname/teacher)General error while processing a teacher last name change request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/change/lastname/admin", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/change/lastname/admin)Got an admin last name change request, processing...`,
    );

    const { newLastName } = req.body;

    if (!newLastName)
      throw new Error("No newLastName parameter in the received JSON.");

    return await _changeAccountLName(
      req,
      res,
      "administrators",
      "administrator_id",
      "administrator",
      newLastName,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/change/lastname/admin)General error while processing an admin last name change request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//2.5patronymic name change routes

_accountRouter.post("/change/patronymicname/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/change/patronymicname/student)Got a student patronymic name change request, processing...`,
    );

    const { newPatronymicName } = req.body;

    if (!newPatronymicName)
      throw new Error("No newPatronymicName parameter in the received JSON.");

    return await _changeAccountPName(
      req,
      res,
      "students",
      "student_id",
      "student",
      newPatronymicName,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/change/patronymicname/student)General error while processing a student patronymic name change request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/change/patronymicname/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/change/patronymicname/teacher)Got a teacher patronymic name change request, processing...`,
    );

    const { newPatronymicName } = req.body;

    if (!newPatronymicName)
      throw new Error("No newPatronymicName parameter in the received JSON.");

    return await _changeAccountPName(
      req,
      res,
      "teachers",
      "teacher_id",
      "teacher",
      newPatronymicName,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/change/patronymicname/teacher)General error while processing a teacher patronymic name change request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/change/patronymicname/admin", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/change/patronymicname/admin)Got an admin patronymic name change request, processing...`,
    );

    const { newPatronymicName } = req.body;

    if (!newPatronymicName)
      throw new Error("No newPatronymicName parameter in the received JSON.");

    return await _changeAccountPName(
      req,
      res,
      "administrators",
      "administrator_id",
      "administrator",
      newPatronymicName,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/change/patronymicname/admin)General error while processing an admin patronymic name change request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//otherAccount routes

//1getall routes for admin

_accountRouter.post("/admin/getall/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/getall/student)Got a student get all request, processing...`,
    );

    return await _getAllUserAccountInfo(req, res, "students", "student_id");
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/getall/student)General error while processing a student get all request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/admin/getall/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/getall/teacher)Got a teacher get all request, processing...`,
    );

    return await _getAllUserAccountInfo(req, res, "teachers", "teacher_id");
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/getall/teacher)General error while processing a teacher get all request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/admin/getall/studentgroups", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/getall/studentgroups)Got a student group get all request, processing...`,
    );

    return await _getAllEntityInfo(
      req,
      res,
      "student_groups",
      "student_group_id",
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/getall/studentgroups)General error while processing a student group get all request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/admin/getall/specialties", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/getall/specialties)Got a specialty get all request, processing...`,
    );

    return await _getAllEntityInfo(req, res, "specialties", "specialty_id");
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/getall/specialties)General error while processing a specialty get all request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/admin/getall/subjects", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/getall/subjects)Got a subject get all request, processing...`,
    );

    return await _getAllEntityInfo(req, res, "subjects", "subject_id");
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/getall/subjects)General error while processing a subject get all request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//2add routes for admin

_accountRouter.post("/admin/add/account/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/add/account/student)Got a student addition request, processing...`,
    );

    const { email, password, first_name, last_name, patronymic_name } =
      req.body;

    if (!email) throw new Error("No email parameter in the received JSON.");
    if (!password)
      throw new Error("No password parameter in the received JSON.");
    if (!first_name)
      throw new Error("No first_name parameter in the received JSON.");
    if (!last_name)
      throw new Error("No last_name parameter in the received JSON.");
    if (!patronymic_name)
      throw new Error("No patronymic_name parameter in the received JSON.");

    return await _addNewUserAccount(
      req,
      res,
      "students",
      email,
      password,
      first_name,
      last_name,
      patronymic_name,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/add/account/student)General error while processing a student addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/admin/add/account/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/add/account/teacher)Got a teacher addition request, processing...`,
    );

    const { email, password, first_name, last_name, patronymic_name } =
      req.body;

    if (!email) throw new Error("No email parameter in the received JSON.");
    if (!password)
      throw new Error("No password parameter in the received JSON.");
    if (!first_name)
      throw new Error("No first_name parameter in the received JSON.");
    if (!last_name)
      throw new Error("No last_name parameter in the received JSON.");
    if (!patronymic_name)
      throw new Error("No patronymic_name parameter in the received JSON.");

    return await _addNewUserAccount(
      req,
      res,
      "teachers",
      email,
      password,
      first_name,
      last_name,
      patronymic_name,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/add/account/teacher)General error while processing a teacher addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/admin/add/studentgroup", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/add/studentgroup)Got a student group addition request, processing...`,
    );

    const { name, description } = req.body;

    if (!name) throw new Error("No name parameter in the received JSON.");
    if (!description)
      throw new Error("No description parameter in the received JSON.");

    return await _addNewStudentGroup(
      req,
      res,
      "student_groups",
      name,
      description,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/add/studentgroup)General error while processing a student group addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/admin/add/specialty", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/add/specialty)Got a specialty addition request, processing...`,
    );

    const { name, abbreviation, description } = req.body;

    if (!name) throw new Error("No name parameter in the received JSON.");
    if (!abbreviation)
      throw new Error("No abbreviation parameter in the received JSON.");
    if (!description)
      throw new Error("No description parameter in the received JSON.");

    return await _addNewSpecialty(
      req,
      res,
      "specialties",
      name,
      abbreviation,
      description,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/add/specialty)General error while processing a specialty addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/admin/add/subject", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/add/subject)Got a subject addition request, processing...`,
    );

    const { name, description } = req.body;

    if (!name) throw new Error("No name parameter in the received JSON.");
    if (!description)
      throw new Error("No description parameter in the received JSON.");

    return await _addNewSubject(req, res, "subjects", name, description);
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/add/subject)General error while processing a subject addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/admin/add/task", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/add/task)Got a task addition request, processing...`,
    );

    const { name, instructions, time_due, can_be_handed_in_past_due } =
      req.body;

    if (!name) throw new Error("No name parameter in the received JSON.");
    if (!instructions)
      throw new Error("No instructions parameter in the received JSON.");
    if (!time_due)
      throw new Error("No time_due parameter in the received JSON.");
    if (!can_be_handed_in_past_due)
      throw new Error(
        "No can_be_handed_in_past_due parameter in the received JSON.",
      );

    return await _addNewTask(
      req,
      res,
      "tasks",
      name,
      instructions,
      time_due,
      can_be_handed_in_past_due,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/add/task)General error while processing a task addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//3getinfo routes for admin

_accountRouter.post("/admin/getinfo/account/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/getinfo/account/student)Got a student admin_getinfo request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    return await _getUserAccountInfo(
      req,
      res,
      "students",
      "student_id",
      Number(id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/getinfo/account/student)General error while processing a student admin_getinfo request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/admin/getinfo/account/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/getinfo/account/teacher)Got a teacher admin_getinfo request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    return await _getUserAccountInfo(
      req,
      res,
      "teachers",
      "teacher_id",
      Number(id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/getinfo/account/teacher)General error while processing a teacher admin_getinfo request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//4delete routes for admin

_accountRouter.post("/admin/delete/accounts/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/delete/accounts/student)Got a student admin_delete request, processing...`,
    );

    const { id_selection } = req.body;

    if (!id_selection)
      throw new Error("No id_selection parameter in the received JSON.");

    return await _deleteUserAccountSelection(
      req,
      res,
      "students",
      "student_id",
      id_selection,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/delete/accounts/student)General error while processing a student admin_delete request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/admin/delete/accounts/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/delete/accounts/teacher)Got a teacher admin_delete request, processing...`,
    );

    const { id_selection } = req.body;

    if (!id_selection)
      throw new Error("No id_selection parameter in the received JSON.");

    return await _deleteUserAccountSelection(
      req,
      res,
      "teachers",
      "teacher_id",
      id_selection,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/delete/accounts/teacher)General error while processing a teacher admin_delete request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/admin/delete/studentgroups", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/delete/studentgroups)Got a student group admin_delete request, processing...`,
    );

    const { id_selection } = req.body;

    if (!id_selection)
      throw new Error("No id_selection parameter in the received JSON.");

    return await _deleteEntitySelection(
      req,
      res,
      "student_groups",
      "student_group_id",
      id_selection,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/delete/studentgroups)General error while processing a student group admin_delete request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/admin/delete/specialties", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/delete/specialties)Got a specialty admin_delete request, processing...`,
    );

    const { id_selection } = req.body;

    if (!id_selection)
      throw new Error("No id_selection parameter in the received JSON.");

    return await _deleteEntitySelection(
      req,
      res,
      "specialties",
      "specialty_id",
      id_selection,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/delete/specialties)General error while processing a specialty admin_delete request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/admin/delete/subjects", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/delete/subjects)Got a subjects admin_delete request, processing...`,
    );

    const { id_selection } = req.body;

    if (!id_selection)
      throw new Error("No id_selection parameter in the received JSON.");

    return await _deleteEntitySelection(
      req,
      res,
      "subjects",
      "subject_id",
      id_selection,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/delete/subjects)General error while processing a subjects admin_delete request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5update routes for admin

//5.1pass update routes for admin

_accountRouter.post("/admin/update/pass/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/update/pass/student)Got a student admin_update pass request, processing...`,
    );

    const { id, newPassword } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");
    if (!newPassword)
      throw new Error("No newPassword parameter in the received JSON.");

    return await _updateUserAccountPassword(
      req,
      res,
      "students",
      "student_id",
      Number(id),
      newPassword,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/update/pass/student)General error while processing a student admin_update pass request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/admin/update/pass/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/update/pass/teacher)Got a teacher admin_update pass request, processing...`,
    );

    const { id, newPassword } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");
    if (!newPassword)
      throw new Error("No newPassword parameter in the received JSON.");

    return await _updateUserAccountPassword(
      req,
      res,
      "teachers",
      "teacher_id",
      Number(id),
      newPassword,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/update/pass/teacher)General error while processing a teacher admin_update pass request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.2email update routes for admin

_accountRouter.post("/admin/update/email/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/update/email/student)Got a student admin_update email request, processing...`,
    );

    const { id, newEmail } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");
    if (!newEmail)
      throw new Error("No newEmail parameter in the received JSON.");

    return await _updateUserAccountEmail(
      req,
      res,
      "students",
      "student_id",
      Number(id),
      newEmail,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/update/email/student)General error while processing a student admin_update email request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/admin/update/email/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/update/email/teacher)Got a teacher admin_update email request, processing...`,
    );

    const { id, newEmail } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");
    if (!newEmail)
      throw new Error("No newEmail parameter in the received JSON.");

    return await _updateUserAccountEmail(
      req,
      res,
      "teachers",
      "teacher_id",
      Number(id),
      newEmail,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/update/email/teacher)General error while processing a teacher admin_update email request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.3first name update routes for admin

_accountRouter.post("/admin/update/firstname/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/update/firstname/student)Got a student admin_update first name request, processing...`,
    );

    const { id, newFirstName } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");
    if (!newFirstName)
      throw new Error("No newFirstName parameter in the received JSON.");

    return await _updateUserAccountFName(
      req,
      res,
      "students",
      "student_id",
      Number(id),
      newFirstName,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/update/firstname/student)General error while processing a student admin_update first name request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/admin/update/firstname/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/update/firstname/teacher)Got a teacher admin_update first name request, processing...`,
    );

    const { id, newFirstName } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");
    if (!newFirstName)
      throw new Error("No newFirstName parameter in the received JSON.");

    return await _updateUserAccountFName(
      req,
      res,
      "teachers",
      "teacher_id",
      Number(id),
      newFirstName,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/update/firstname/teacher)General error while processing a teacher admin_update first name request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.4last name update routes for admin

_accountRouter.post("/admin/update/lastname/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/update/lastname/student)Got a student admin_update last name request, processing...`,
    );

    const { id, newLastName } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");
    if (!newLastName)
      throw new Error("No newLastName parameter in the received JSON.");

    return await _updateUserAccountLName(
      req,
      res,
      "students",
      "student_id",
      Number(id),
      newLastName,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/update/lastname/student)General error while processing a student admin_update last name request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_accountRouter.post("/admin/update/lastname/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_accountRouter:/admin/update/lastname/teacher)Got a teacher admin_update last name request, processing...`,
    );

    const { id, newLastName } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");
    if (!newLastName)
      throw new Error("No newLastName parameter in the received JSON.");

    return await _updateUserAccountLName(
      req,
      res,
      "teachers",
      "teacher_id",
      Number(id),
      newLastName,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_accountRouter:/admin/update/lastname/teacher)General error while processing a teacher admin_update last name request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.5patronymic name update routes for admin

_accountRouter.post(
  "/admin/update/patronymicname/student",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_accountRouter:/admin/update/patronymicname/student)Got a student admin_update patronymic name request, processing...`,
      );

      const { id, newPatronymicName } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");
      if (!newPatronymicName)
        throw new Error("No newPatronymicName parameter in the received JSON.");

      return await _updateUserAccountPName(
        req,
        res,
        "students",
        "student_id",
        Number(id),
        newPatronymicName,
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_accountRouter:/admin/update/patronymicname/student)General error while processing a student admin_update patronymic name request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

_accountRouter.post(
  "/admin/update/patronymicname/teacher",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_accountRouter:/admin/update/patronymicname/teacher)Got a teacher admin_update patronymic name request, processing...`,
      );

      const { id, newPatronymicName } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");
      if (!newPatronymicName)
        throw new Error("No newPatronymicName parameter in the received JSON.");

      return await _updateUserAccountPName(
        req,
        res,
        "teachers",
        "teacher_id",
        Number(id),
        newPatronymicName,
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_accountRouter:/admin/update/patronymicname/teacher)General error while processing a teacher admin_update patronymic name request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//6assigned routes for admin

//6.1assigned student groups routes for admin

_accountRouter.post(
  "/admin/getinfo/account/assigned/studentgroups/student",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_accountRouter:admin/getinfo/account/assigned/studentgroups/student)Got a student admin_getinfo assigned student groups request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getUserAccountAssignedEntities(
        req,
        res,
        "student_groups",
        "student_group_id",
        "students_assigned_to_a_student_group",
        "student_groups_student_group_id",
        "students_student_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_accountRouter:admin/getinfo/account/assigned/studentgroups/student)General error while processing a student admin_getinfo assigned student groups request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

_accountRouter.post(
  "/admin/getinfo/account/assigned/studentgroups/teacher",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_accountRouter:admin/getinfo/account/assigned/studentgroups/teacher)Got a teacher admin_getinfo assigned student groups request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getUserAccountAssignedEntities(
        req,
        res,
        "student_groups",
        "student_group_id",
        "student_groups_assigned_to_a_teacher_for_supervision",
        "student_groups_student_group_id",
        "teachers_teacher_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_accountRouter:admin/getinfo/account/assigned/studentgroups/teacher)General error while processing a teacher admin_getinfo assigned student groups request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//7unassignment routes for admin

//7.1student group unassignment routes for admin

_accountRouter.post(
  "/admin/unassign/studentgroups/student",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_accountRouter:admin/unassign/studentgroups/student)Got a student admin_unassign student groups request, processing...`,
      );

      const { student_group_id_selection, account_id } = req.body;

      if (!student_group_id_selection)
        throw new Error(
          "No student_group_id_selection parameter in the received JSON.",
        );
      if (!account_id)
        throw new Error("No account_id parameter in the received JSON.");

      return await _unassignUserAccountAssignedEntities(
        req,
        res,
        "students_assigned_to_a_student_group",
        "student_groups_student_group_id",
        "students_student_id",
        student_group_id_selection,
        Number(account_id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_accountRouter:admin/unassign/studentgroups/student)General error while processing a student admin_unassign student groups request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

_accountRouter.post(
  "/admin/unassign/studentgroups/teacher",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_accountRouter:admin/unassign/studentgroups/teacher)Got a teacher admin_unassign student groups request, processing...`,
      );

      const { student_group_id_selection, account_id } = req.body;

      if (!student_group_id_selection)
        throw new Error(
          "No student_group_id_selection parameter in the received JSON.",
        );
      if (!account_id)
        throw new Error("No account_id parameter in the received JSON.");

      return await _unassignUserAccountAssignedEntities(
        req,
        res,
        "student_groups_assigned_to_a_teacher_for_supervision",
        "student_groups_student_group_id",
        "teachers_teacher_id",
        student_group_id_selection,
        Number(account_id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_accountRouter:admin/unassign/studentgroups/teacher)General error while processing a teacher admin_unassign student groups request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//exports
export const accountRouter = _accountRouter;
