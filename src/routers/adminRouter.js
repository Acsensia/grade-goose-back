//imports
import { Router } from "express";

//imports->project
import * as mysqlManagement from "../startup/databases/mysql/mysqlManagement.js";
import * as accountManagement from "../startup/databases/mysql/accounts/accountManagement.js";
import * as entityManagement from "../startup/databases/mysql/accounts/entityManagement.js";
import * as consoleLoggers from "../startup/console/consoleLoggers.js";

//.setup
const _adminRouter = Router();

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
        assignedEntityTable_entityIdColumnName,
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

async function _getEntityInfo(
  req,
  res,
  entityTableName,
  entityIdColumnName,
  _entityId,
) {
  try {
    consoleLoggers.logNeutral(
      `(_getEntityInfo)Got an entity info request, processing...`,
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

    const entity = await entityManagement.getEntity(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityId,
    );
    if (!entity) throw new Error("Could not find an entity with specified ID!");

    res.json({
      entity: entity,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_getEntityInfo)General error while processing an entity info request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _getUserAccountUnassignedEntities(
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
      `(_getUserAccountUnassignedEntities)Got a user account unassigned entities request, processing...`,
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

    const result = await accountManagement.getAccountUnassignedEntities(
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
      throw new Error(
        "Failed to get all entities not assigned to a user account!",
      );

    res.json({
      result: result,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_getUserAccountUnassignedEntities)General error while processing a user account unassigned entities request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _assignEntitiesToUserAccount(
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
      `(_assignEntitiesToUserAccount)Got a user account assign entity selection request, processing...`,
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

    const assignmentResult = await accountManagement.assignEntitiesToAccount(
      connectionPool,
      true,
      assignedEntityTableName,
      assignedEntityTable_entityIdColumnName,
      assignedEntityTable_accountIdColumnName,
      _entityIdSelection,
      _accountId,
    );
    if (!assignmentResult)
      throw new Error("Failed to assign the specified entities to an account!");

    res.json({ result: assignmentResult });
  } catch (error) {
    consoleLoggers.logError(
      `(_assignEntitiesToUserAccount)General error while processing a user account entity selection assignment request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _updateStudentGroupName(
  req,
  res,
  entityTableName,
  entityIdColumnName,
  _entityIdColumnValue,
  _newValue,
) {
  try {
    consoleLoggers.logNeutral(
      `(_updateStudentGroupName)Got a student group name update request, processing...`,
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

    const entity = await entityManagement.getEntity(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
    );
    if (!entity)
      throw new Error("Could not find user account with specified ID!");

    entity.name = _newValue;
    const updateResult = await entityManagement.updateStudentGroup(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
      entity,
    );
    if (!updateResult)
      throw new Error(
        "Failed to update the student group with the newly specified information!",
      );

    res
      .status(200)
      .json({ message: "Successfully changed student group name" });
  } catch (error) {
    consoleLoggers.logError(
      `(_updateStudentGroupName)General error while processing a student group name update request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _updateStudentGroupDesc(
  req,
  res,
  entityTableName,
  entityIdColumnName,
  _entityIdColumnValue,
  _newValue,
) {
  try {
    consoleLoggers.logNeutral(
      `(_updateStudentGroupDesc)Got a student group description update request, processing...`,
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

    const entity = await entityManagement.getEntity(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
    );
    if (!entity)
      throw new Error("Could not find user account with specified ID!");

    entity.description = _newValue;
    const updateResult = await entityManagement.updateStudentGroup(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
      entity,
    );
    if (!updateResult)
      throw new Error(
        "Failed to update the student group with the newly specified information!",
      );

    res
      .status(200)
      .json({ message: "Successfully changed student group description" });
  } catch (error) {
    consoleLoggers.logError(
      `(_updateStudentGroupDesc)General error while processing a student group description update request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _updateSpecialtyName(
  req,
  res,
  entityTableName,
  entityIdColumnName,
  _entityIdColumnValue,
  _newValue,
) {
  try {
    consoleLoggers.logNeutral(
      `(_updateSpecialtyName)Got a specialty name update request, processing...`,
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

    const entity = await entityManagement.getEntity(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
    );
    if (!entity)
      throw new Error("Could not find user account with specified ID!");

    entity.name = _newValue;
    const updateResult = await entityManagement.updateSpecialty(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
      entity,
    );
    if (!updateResult)
      throw new Error(
        "Failed to update the specialty with the newly specified information!",
      );

    res.status(200).json({ message: "Successfully changed specialty name" });
  } catch (error) {
    consoleLoggers.logError(
      `(_updateSpecialtyName)General error while processing a specialty name update request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _updateSpecialtyAbbr(
  req,
  res,
  entityTableName,
  entityIdColumnName,
  _entityIdColumnValue,
  _newValue,
) {
  try {
    consoleLoggers.logNeutral(
      `(_updateSpecialtyAbbr)Got a specialty abbreviation update request, processing...`,
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

    const entity = await entityManagement.getEntity(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
    );
    if (!entity)
      throw new Error("Could not find user account with specified ID!");

    entity.abbreviation = _newValue;
    const updateResult = await entityManagement.updateSpecialty(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
      entity,
    );
    if (!updateResult)
      throw new Error(
        "Failed to update the specialty with the newly specified information!",
      );

    res
      .status(200)
      .json({ message: "Successfully changed specialty abbreviation" });
  } catch (error) {
    consoleLoggers.logError(
      `(_updateSpecialtyAbbr)General error while processing a specialty abbreviation update request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _updateSpecialtyDesc(
  req,
  res,
  entityTableName,
  entityIdColumnName,
  _entityIdColumnValue,
  _newValue,
) {
  try {
    consoleLoggers.logNeutral(
      `(_updateSpecialtyDesc)Got a specialty description update request, processing...`,
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

    const entity = await entityManagement.getEntity(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
    );
    if (!entity)
      throw new Error("Could not find user account with specified ID!");

    entity.description = _newValue;
    const updateResult = await entityManagement.updateSpecialty(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
      entity,
    );
    if (!updateResult)
      throw new Error(
        "Failed to update the specialty with the newly specified information!",
      );

    res
      .status(200)
      .json({ message: "Successfully changed specialty description" });
  } catch (error) {
    consoleLoggers.logError(
      `(_updateSpecialtyDesc)General error while processing a specialty description update request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _updateSubjectName(
  req,
  res,
  entityTableName,
  entityIdColumnName,
  _entityIdColumnValue,
  _newValue,
) {
  try {
    consoleLoggers.logNeutral(
      `(_updateSubjectName)Got a subject name update request, processing...`,
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

    const entity = await entityManagement.getEntity(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
    );
    if (!entity)
      throw new Error("Could not find user account with specified ID!");

    entity.name = _newValue;
    const updateResult = await entityManagement.updateSubject(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
      entity,
    );
    if (!updateResult)
      throw new Error(
        "Failed to update the subject with the newly specified information!",
      );

    res.status(200).json({ message: "Successfully changed subject name" });
  } catch (error) {
    consoleLoggers.logError(
      `(_updateSubjectName)General error while processing a subject name update request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _updateSubjectDesc(
  req,
  res,
  entityTableName,
  entityIdColumnName,
  _entityIdColumnValue,
  _newValue,
) {
  try {
    consoleLoggers.logNeutral(
      `(_updateSubjectName)Got a subject description update request, processing...`,
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

    const entity = await entityManagement.getEntity(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
    );
    if (!entity)
      throw new Error("Could not find user account with specified ID!");

    entity.description = _newValue;
    const updateResult = await entityManagement.updateSubject(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
      entity,
    );
    if (!updateResult)
      throw new Error(
        "Failed to update the subject with the newly specified information!",
      );

    res
      .status(200)
      .json({ message: "Successfully changed subject description" });
  } catch (error) {
    consoleLoggers.logError(
      `(_updateSubjectName)General error while processing a subject description update request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _updateTaskName(
  req,
  res,
  entityTableName,
  entityIdColumnName,
  _entityIdColumnValue,
  _newValue,
) {
  try {
    consoleLoggers.logNeutral(
      `(_updateTaskName)Got a task name update request, processing...`,
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

    const entity = await entityManagement.getEntity(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
    );
    if (!entity)
      throw new Error("Could not find user account with specified ID!");

    entity.name = _newValue;
    const updateResult = await entityManagement.updateTask(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
      entity,
    );
    if (!updateResult)
      throw new Error(
        "Failed to update the task with the newly specified information!",
      );

    res.status(200).json({ message: "Successfully changed task name" });
  } catch (error) {
    consoleLoggers.logError(
      `(_updateTaskName)General error while processing a task name update request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _updateTaskInstr(
  req,
  res,
  entityTableName,
  entityIdColumnName,
  _entityIdColumnValue,
  _newValue,
) {
  try {
    consoleLoggers.logNeutral(
      `(_updateTaskInstr)Got a task instructions update request, processing...`,
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

    const entity = await entityManagement.getEntity(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
    );
    if (!entity)
      throw new Error("Could not find user account with specified ID!");

    entity.instructions = _newValue;
    const updateResult = await entityManagement.updateTask(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
      entity,
    );
    if (!updateResult)
      throw new Error(
        "Failed to update the task with the newly specified information!",
      );

    res.status(200).json({ message: "Successfully changed task instructions" });
  } catch (error) {
    consoleLoggers.logError(
      `(_updateTaskInstr)General error while processing a task instructions update request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _updateTaskDue(
  req,
  res,
  entityTableName,
  entityIdColumnName,
  _entityIdColumnValue,
  _newValue,
) {
  try {
    consoleLoggers.logNeutral(
      `(_updateTaskDue)Got a task due date update request, processing...`,
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

    const entity = await entityManagement.getEntity(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
    );
    if (!entity)
      throw new Error("Could not find user account with specified ID!");

    entity.time_due = _newValue;
    const updateResult = await entityManagement.updateTask(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
      entity,
    );
    if (!updateResult)
      throw new Error(
        "Failed to update the task with the newly specified information!",
      );

    res.status(200).json({ message: "Successfully changed task due date" });
  } catch (error) {
    consoleLoggers.logError(
      `(_updateTaskDue)General error while processing a task due date update request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _updateTaskEnforceDue(
  req,
  res,
  entityTableName,
  entityIdColumnName,
  _entityIdColumnValue,
  _newValue,
) {
  try {
    consoleLoggers.logNeutral(
      `(_updateTaskEnforceDue)Got a task due date enforcement update request, processing...`,
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

    const entity = await entityManagement.getEntity(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
    );
    if (!entity)
      throw new Error("Could not find user account with specified ID!");

    entity.can_be_handed_in_past_due = _newValue;
    const updateResult = await entityManagement.updateTask(
      connectionPool,
      true,
      entityTableName,
      entityIdColumnName,
      _entityIdColumnValue,
      entity,
    );
    if (!updateResult)
      throw new Error(
        "Failed to update the task with the newly specified information!",
      );

    res
      .status(200)
      .json({ message: "Successfully changed task due date enforcement" });
  } catch (error) {
    consoleLoggers.logError(
      `(_updateTaskEnforceDue)General error while processing a task due date enforcement update request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _getEntityAssignedEntities(
  req,
  res,
  childEntityTable_Name,
  childEntityTable_IdColumnName,
  assignationTable_Name,
  assignationTable_childEntity_IdColumnName,
  assignationTable_parentEntity_IdColumnName,
  _parentEntityId,
) {
  try {
    consoleLoggers.logNeutral(
      `(_getEntityAssignedEntities)Got an entity assigned entities request, processing...`,
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

    const result = await entityManagement.getEntityAssignedEntities(
      connectionPool,
      true,
      childEntityTable_Name,
      childEntityTable_IdColumnName,
      assignationTable_Name,
      assignationTable_childEntity_IdColumnName,
      assignationTable_parentEntity_IdColumnName,
      _parentEntityId,
    );
    if (!result)
      throw new Error(
        "Failed to get all entities assigned to a certain entity!",
      );

    res.json({
      result: result,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_getEntityAssignedEntities)General error while processing an entity assigned entities request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _getEntityAssignedAccounts(
  req,
  res,
  accountTable_Name,
  accountTable_IdColumnName,
  assignationTable_Name,
  assignationTable_account_IdColumnName,
  assignationTable_parentEntity_IdColumnName,
  _parentEntityId,
) {
  try {
    consoleLoggers.logNeutral(
      `(_getEntityAssignedAccounts)Got an entity assigned accounts request, processing...`,
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

    const result = await entityManagement.getEntityAssignedAccounts(
      connectionPool,
      true,
      accountTable_Name,
      accountTable_IdColumnName,
      assignationTable_Name,
      assignationTable_account_IdColumnName,
      assignationTable_parentEntity_IdColumnName,
      _parentEntityId,
    );
    if (!result)
      throw new Error(
        "Failed to get all accounts assigned to a certain entity!",
      );

    res.json({
      result: result,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_getEntityAssignedAccounts)General error while processing an entity assigned accounts request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _getEntityUnassignedEntities(
  req,
  res,
  childEntityTable_Name,
  childEntityTable_IdColumnName,
  assignationTable_Name,
  assignationTable_childEntity_IdColumnName,
  assignationTable_parentEntity_IdColumnName,
  _parentEntityId,
) {
  try {
    consoleLoggers.logNeutral(
      `(_getEntityUnassignedEntities)Got an entity unassigned entities request, processing...`,
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

    const result = await entityManagement.getEntityUnassignedEntities(
      connectionPool,
      true,
      childEntityTable_Name,
      childEntityTable_IdColumnName,
      assignationTable_Name,
      assignationTable_childEntity_IdColumnName,
      assignationTable_parentEntity_IdColumnName,
      _parentEntityId,
    );
    if (!result)
      throw new Error(
        "Failed to get all entities not assigned to a certain entity!",
      );

    res.json({
      result: result,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_getEntityUnassignedEntities)General error while processing an entity unassigned entities request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _getEntityUnassignedAccounts(
  req,
  res,
  accountTable_Name,
  accountTable_IdColumnName,
  assignationTable_Name,
  assignationTable_account_IdColumnName,
  assignationTable_parentEntity_IdColumnName,
  _parentEntityId,
) {
  try {
    consoleLoggers.logNeutral(
      `(_getEntityUnassignedAccounts)Got an entity unassigned accounts request, processing...`,
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

    const result = await entityManagement.getEntityUnassignedAccounts(
      connectionPool,
      true,
      accountTable_Name,
      accountTable_IdColumnName,
      assignationTable_Name,
      assignationTable_account_IdColumnName,
      assignationTable_parentEntity_IdColumnName,
      _parentEntityId,
    );
    if (!result)
      throw new Error(
        "Failed to get all accounts not assigned to a certain entity!",
      );

    res.json({
      result: result,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_getEntityUnassignedAccounts)General error while processing an entity unassigned accounts request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _unassignEntityAssignedEntities(
  req,
  res,
  assignationTableName,
  assignationTable_childEntity_IdColumnName,
  assignationTable_parentEntity_IdColumnName,
  _childEntity_IdSelection,
  _parentEntity_Id,
) {
  try {
    consoleLoggers.logNeutral(
      `(_unassignEntityAssignedEntities)Got an entity assigned entities selection unassignment request, processing...`,
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
      await entityManagement.unassignEntityAssignedEntities(
        connectionPool,
        true,
        assignationTableName,
        assignationTable_childEntity_IdColumnName,
        assignationTable_parentEntity_IdColumnName,
        _childEntity_IdSelection,
        _parentEntity_Id,
      );
    if (!unassignmentResult)
      throw new Error(
        "Failed to unassign the specified entity-assigned entities!",
      );

    res.json({ result: unassignmentResult });
  } catch (error) {
    consoleLoggers.logError(
      `(_unassignEntityAssignedEntities)General error while processing an entity assigned entities selection unassignment request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _assignEntitiesToEntity(
  req,
  res,
  assignationTableName,
  assignationTable_childEntity_IdColumnName,
  assignationTable_parentEntity_IdColumnName,
  _childEntity_IdSelection,
  _parentEntity_Id,
) {
  try {
    consoleLoggers.logNeutral(
      `(_assignEntitiesToEntity)Got an entity assigned entities selection assignment request, processing...`,
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

    const unassignmentResult = await entityManagement.assignEntitiesToEntity(
      connectionPool,
      true,
      assignationTableName,
      assignationTable_childEntity_IdColumnName,
      assignationTable_parentEntity_IdColumnName,
      _childEntity_IdSelection,
      _parentEntity_Id,
    );
    if (!unassignmentResult)
      throw new Error(
        "Failed to assign the specified entity-assigned entities!",
      );

    res.json({ result: unassignmentResult });
  } catch (error) {
    consoleLoggers.logError(
      `(_assignEntitiesToEntity)General error while processing an entity assigned entities selection assignment request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _deleteTwoKeyEntitySelection(
  req,
  res,
  entityTableName,
  entityIdColumn1_name,
  entityIdColumn2_name,
  _entityDoubleIdSelection,
) {
  try {
    consoleLoggers.logNeutral(
      `(_deleteTwoKeyEntitySelection)Got a two-key entity selection deletion request, processing...`,
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

    const deletionResult = await entityManagement.deleteTwoKeyEntitySelection(
      connectionPool,
      true,
      entityTableName,
      entityIdColumn1_name,
      entityIdColumn2_name,
      _entityDoubleIdSelection,
    );
    if (!deletionResult)
      throw new Error(
        "Failed to delete the specified two-key entity selection!",
      );

    res.json({ result: deletionResult });
  } catch (error) {
    consoleLoggers.logError(
      `(_deleteTwoKeyEntitySelection)General error while processing a two-key entity selection deletion request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _addNewSolution(
  req,
  res,
  entityTableName,
  _taskId,
  _studentId,
  _internet_file_link,
  _mark,
  _studentCommentary,
  _teacherCommentary,
) {
  try {
    consoleLoggers.logNeutral(
      `(_addNewSolution)Got a solution addition request, processing...`,
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

    const additionResult = await entityManagement.addSolution(
      connectionPool,
      true,
      entityTableName,
      _taskId,
      _studentId,
      _internet_file_link,
      _mark,
      _studentCommentary,
      _teacherCommentary,
    );
    if (!additionResult) throw new Error("Failed to add the almost-new task!");

    res.json({
      result: additionResult,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_addNewSolution)General error while processing a solution addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _getTwoKeyEntityInfo(
  req,
  res,
  entityTableName,
  entityKeyOneColumnName,
  entityKeyTwoColumnName,
  _entityKeyOne,
  _entityKeyTwo,
) {
  try {
    consoleLoggers.logNeutral(
      `(_getTwoKeyEntityInfo)Got a two-key entity info request, processing...`,
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

    const entity = await entityManagement.getTwoKeyEntity(
      connectionPool,
      true,
      entityTableName,
      entityKeyOneColumnName,
      entityKeyTwoColumnName,
      _entityKeyOne,
      _entityKeyTwo,
    );
    if (!entity) throw new Error("Could not find an entity with specified ID!");

    res.json({
      entity: entity,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_getTwoKeyEntityInfo)General error while processing a two-key entity info request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

//otherAccount routes

//1getall routes for admin

_adminRouter.post("/getall/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/getall/student)Got a student get all request, processing...`,
    );

    return await _getAllUserAccountInfo(req, res, "students", "student_id");
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/getall/student)General error while processing a student get all request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/getall/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/getall/teacher)Got a teacher get all request, processing...`,
    );

    return await _getAllUserAccountInfo(req, res, "teachers", "teacher_id");
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/getall/teacher)General error while processing a teacher get all request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/getall/studentgroups", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/getall/studentgroups)Got a student group get all request, processing...`,
    );

    return await _getAllEntityInfo(
      req,
      res,
      "student_groups",
      "student_group_id",
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/getall/studentgroups)General error while processing a student group get all request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/getall/specialties", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/getall/specialties)Got a specialty get all request, processing...`,
    );

    return await _getAllEntityInfo(req, res, "specialties", "specialty_id");
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/getall/specialties)General error while processing a specialty get all request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/getall/subjects", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/getall/subjects)Got a subject get all request, processing...`,
    );

    return await _getAllEntityInfo(req, res, "subjects", "subject_id");
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/getall/subjects)General error while processing a subject get all request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/getall/tasks", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/getall/tasks)Got a task get all request, processing...`,
    );

    return await _getAllEntityInfo(req, res, "tasks", "task_id");
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/getall/tasks)General error while processing a task get all request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/getall/solutions", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/getall/solutions)Got a solution get all request, processing...`,
    );

    return await _getAllEntityInfo(
      req,
      res,
      "done_tasks_status",
      "tasks_task_id",
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/getall/solutions)General error while processing a solution get all request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//2add routes for admin

_adminRouter.post("/add/account/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/add/account/student)Got a student addition request, processing...`,
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
      `(_adminRouter:/add/account/student)General error while processing a student addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/add/account/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/add/account/teacher)Got a teacher addition request, processing...`,
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
      `(_adminRouter:/add/account/teacher)General error while processing a teacher addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/add/studentgroup", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/add/studentgroup)Got a student group addition request, processing...`,
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
      `(_adminRouter:/add/studentgroup)General error while processing a student group addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/add/specialty", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/add/specialty)Got a specialty addition request, processing...`,
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
      `(_adminRouter:/add/specialty)General error while processing a specialty addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/add/subject", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/add/subject)Got a subject addition request, processing...`,
    );

    const { name, description } = req.body;

    if (!name) throw new Error("No name parameter in the received JSON.");
    if (!description)
      throw new Error("No description parameter in the received JSON.");

    return await _addNewSubject(req, res, "subjects", name, description);
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/add/subject)General error while processing a subject addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/add/task", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/add/task)Got a task addition request, processing...`,
    );

    const { name, instructions, time_due, can_be_handed_in_past_due } =
      req.body;

    if (!name) throw new Error("No name parameter in the received JSON.");
    if (!instructions)
      throw new Error("No instructions parameter in the received JSON.");
    if (!time_due)
      throw new Error("No time_due parameter in the received JSON.");
    if (typeof can_be_handed_in_past_due !== "boolean")
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
      `(_adminRouter:/add/task)General error while processing a task addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/add/solution", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/add/solution)Got a solution addition request, processing...`,
    );

    let {
      tasks_task_id,
      students_student_id,
      internet_file_link,
      mark,
      student_commentary,
      teacher_commentary,
    } = req.body;

    if (!tasks_task_id)
      throw new Error("No tasks_task_id parameter in the received JSON.");
    if (!students_student_id)
      throw new Error("No students_student_id parameter in the received JSON.");
    if (!internet_file_link)
      throw new Error("No internet_file_link parameter in the received JSON.");
    if (!mark || mark === "null") mark = null;
    else mark = Number(mark);
    if (!student_commentary || student_commentary === "null")
      student_commentary = null;
    if (!teacher_commentary || teacher_commentary === "null")
      teacher_commentary = null;

    return await _addNewSolution(
      req,
      res,
      "done_tasks_status",
      tasks_task_id,
      students_student_id,
      internet_file_link,
      mark,
      student_commentary,
      teacher_commentary,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/add/solution)General error while processing a solution addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//3getinfo routes for admin

_adminRouter.post("/getinfo/account/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/getinfo/account/student)Got a student admin_getinfo request, processing...`,
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
      `(_adminRouter:/getinfo/account/student)General error while processing a student admin_getinfo request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/getinfo/account/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/getinfo/account/teacher)Got a teacher admin_getinfo request, processing...`,
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
      `(_adminRouter:/getinfo/account/teacher)General error while processing a teacher admin_getinfo request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/getinfo/studentgroup", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/getinfo/studentgroup)Got a student group admin_getinfo request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    return await _getEntityInfo(
      req,
      res,
      "student_groups",
      "student_group_id",
      Number(id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/getinfo/studentgroup)General error while processing a student group admin_getinfo request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/getinfo/specialty", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/getinfo/specialty)Got a specialty admin_getinfo request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    return await _getEntityInfo(
      req,
      res,
      "specialties",
      "specialty_id",
      Number(id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/getinfo/specialty)General error while processing a specialty admin_getinfo request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/getinfo/subject", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/getinfo/subject)Got a subject admin_getinfo request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    return await _getEntityInfo(req, res, "subjects", "subject_id", Number(id));
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/getinfo/subject)General error while processing a subject admin_getinfo request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/getinfo/task", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/getinfo/task)Got a task admin_getinfo request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    return await _getEntityInfo(req, res, "tasks", "task_id", Number(id));
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/getinfo/task)General error while processing a task admin_getinfo request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/getinfo/solution", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/getinfo/solution)Got a solution admin_getinfo request, processing...`,
    );

    const { taskId, studentId } = req.body;

    if (!taskId) throw new Error("No taskId parameter in the received JSON.");
    if (!studentId)
      throw new Error("No studentId parameter in the received JSON.");

    return await _getTwoKeyEntityInfo(
      req,
      res,
      "done_tasks_status",
      "tasks_task_id",
      "students_student_id",
      Number(taskId),
      Number(studentId),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/getinfo/solution)General error while processing a solution admin_getinfo request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//4delete routes for admin

_adminRouter.post("/delete/accounts/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/delete/accounts/student)Got a student admin_delete request, processing...`,
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
      `(_adminRouter:/delete/accounts/student)General error while processing a student admin_delete request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/delete/accounts/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/delete/accounts/teacher)Got a teacher admin_delete request, processing...`,
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
      `(_adminRouter:/delete/accounts/teacher)General error while processing a teacher admin_delete request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/delete/studentgroups", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/delete/studentgroups)Got a student group admin_delete request, processing...`,
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
      `(_adminRouter:/delete/studentgroups)General error while processing a student group admin_delete request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/delete/specialties", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/delete/specialties)Got a specialty admin_delete request, processing...`,
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
      `(_adminRouter:/delete/specialties)General error while processing a specialty admin_delete request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/delete/subjects", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/delete/subjects)Got a subjects admin_delete request, processing...`,
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
      `(_adminRouter:/delete/subjects)General error while processing a subjects admin_delete request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/delete/tasks", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/delete/tasks)Got a tasks admin_delete request, processing...`,
    );

    const { id_selection } = req.body;

    if (!id_selection)
      throw new Error("No id_selection parameter in the received JSON.");

    return await _deleteEntitySelection(
      req,
      res,
      "tasks",
      "task_id",
      id_selection,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/delete/tasks)General error while processing a tasks admin_delete request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/delete/solutions", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/delete/solutions)Got a solutions admin_delete request, processing...`,
    );

    const { id_pairs_selection } = req.body;

    if (!id_pairs_selection)
      throw new Error("No id_pairs_selection parameter in the received JSON.");

    return await _deleteTwoKeyEntitySelection(
      req,
      res,
      "done_tasks_status",
      "tasks_task_id",
      "students_student_id",
      id_pairs_selection,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/delete/solutions)General error while processing a solutions admin_delete request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5update routes for admin

//5.1account pass update routes for admin

_adminRouter.post("/update/pass/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/pass/student)Got a student admin_update pass request, processing...`,
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
      `(_adminRouter:/update/pass/student)General error while processing a student admin_update pass request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/update/pass/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/pass/teacher)Got a teacher admin_update pass request, processing...`,
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
      `(_adminRouter:/update/pass/teacher)General error while processing a teacher admin_update pass request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.2account email update routes for admin

_adminRouter.post("/update/email/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/email/student)Got a student admin_update email request, processing...`,
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
      `(_adminRouter:/update/email/student)General error while processing a student admin_update email request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/update/email/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/email/teacher)Got a teacher admin_update email request, processing...`,
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
      `(_adminRouter:/update/email/teacher)General error while processing a teacher admin_update email request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.3account first name update routes for admin

_adminRouter.post("/update/firstname/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/firstname/student)Got a student admin_update first name request, processing...`,
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
      `(_adminRouter:/update/firstname/student)General error while processing a student admin_update first name request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/update/firstname/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/firstname/teacher)Got a teacher admin_update first name request, processing...`,
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
      `(_adminRouter:/update/firstname/teacher)General error while processing a teacher admin_update first name request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.4account last name update routes for admin

_adminRouter.post("/update/lastname/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/lastname/student)Got a student admin_update last name request, processing...`,
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
      `(_adminRouter:/update/lastname/student)General error while processing a student admin_update last name request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/update/lastname/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/lastname/teacher)Got a teacher admin_update last name request, processing...`,
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
      `(_adminRouter:/update/lastname/teacher)General error while processing a teacher admin_update last name request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.5account patronymic name update routes for admin

_adminRouter.post("/update/patronymicname/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/patronymicname/student)Got a student admin_update patronymic name request, processing...`,
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
      `(_adminRouter:/update/patronymicname/student)General error while processing a student admin_update patronymic name request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/update/patronymicname/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/patronymicname/teacher)Got a teacher admin_update patronymic name request, processing...`,
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
      `(_adminRouter:/update/patronymicname/teacher)General error while processing a teacher admin_update patronymic name request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.6student_group name update route for admin
_adminRouter.post("/update/studentgroup/name", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/studentgroup/name)Got a student group admin_update name request, processing...`,
    );

    const { id, newValue } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");
    if (!newValue)
      throw new Error("No newValue parameter in the received JSON.");

    return await _updateStudentGroupName(
      req,
      res,
      "student_groups",
      "student_group_id",
      Number(id),
      newValue,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/update/studentgroup/name)General error while processing a student group admin_update name request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.7student_group description update route for admin
_adminRouter.post("/update/studentgroup/desc", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/studentgroup/desc)Got a student group admin_update description request, processing...`,
    );

    const { id, newValue } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");
    if (!newValue)
      throw new Error("No newValue parameter in the received JSON.");

    return await _updateStudentGroupDesc(
      req,
      res,
      "student_groups",
      "student_group_id",
      Number(id),
      newValue,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/update/studentgroup/desc)General error while processing a student group admin_update description request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.8specialty name update route for admin
_adminRouter.post("/update/specialty/name", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/specialty/name)Got a specialty admin_update name request, processing...`,
    );

    const { id, newValue } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");
    if (!newValue)
      throw new Error("No newValue parameter in the received JSON.");

    return await _updateSpecialtyName(
      req,
      res,
      "specialties",
      "specialty_id",
      Number(id),
      newValue,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/update/specialty/name)General error while processing a specialty admin_update name request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.9specialty abbreviation update route for admin
_adminRouter.post("/update/specialty/abbr", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/specialty/abbr)Got a specialty admin_update abbreviation request, processing...`,
    );

    const { id, newValue } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");
    if (!newValue)
      throw new Error("No newValue parameter in the received JSON.");

    return await _updateSpecialtyAbbr(
      req,
      res,
      "specialties",
      "specialty_id",
      Number(id),
      newValue,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/update/specialty/abbr)General error while processing an abbreviation admin_update name request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.10specialty description update route for admin
_adminRouter.post("/update/specialty/desc", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/specialty/desc)Got a specialty admin_update description request, processing...`,
    );

    const { id, newValue } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");
    if (!newValue)
      throw new Error("No newValue parameter in the received JSON.");

    return await _updateSpecialtyDesc(
      req,
      res,
      "specialties",
      "specialty_id",
      Number(id),
      newValue,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/update/specialty/desc)General error while processing a description admin_update name request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.11subject name update route for admin
_adminRouter.post("/update/subject/name", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/subject/name)Got a subject admin_update name request, processing...`,
    );

    const { id, newValue } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");
    if (!newValue)
      throw new Error("No newValue parameter in the received JSON.");

    return await _updateSubjectName(
      req,
      res,
      "subjects",
      "subject_id",
      Number(id),
      newValue,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/update/subject/name)General error while processing a subject admin_update name request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.12subject description update route for admin
_adminRouter.post("/update/subject/desc", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/subject/desc)Got a subject admin_update description request, processing...`,
    );

    const { id, newValue } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");
    if (!newValue)
      throw new Error("No newValue parameter in the received JSON.");

    return await _updateSubjectDesc(
      req,
      res,
      "subjects",
      "subject_id",
      Number(id),
      newValue,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/update/subject/desc)General error while processing a subject admin_update description request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.13task name update route for admin
_adminRouter.post("/update/task/name", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/task/name)Got a task admin_update name request, processing...`,
    );

    const { id, newValue } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");
    if (!newValue)
      throw new Error("No newValue parameter in the received JSON.");

    return await _updateTaskName(
      req,
      res,
      "tasks",
      "task_id",
      Number(id),
      newValue,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/update/task/name)General error while processing a task admin_update name request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.14task instructions update route for admin
_adminRouter.post("/update/task/instr", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/task/instr)Got a task admin_update instructions request, processing...`,
    );

    const { id, newValue } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");
    if (!newValue)
      throw new Error("No newValue parameter in the received JSON.");

    return await _updateTaskInstr(
      req,
      res,
      "tasks",
      "task_id",
      Number(id),
      newValue,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/update/task/instr)General error while processing a task admin_update instructions request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.15task due date update route for admin
_adminRouter.post("/update/task/due", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/task/due)Got a task admin_update due date request, processing...`,
    );

    const { id, newValue } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");
    if (!newValue)
      throw new Error("No newValue parameter in the received JSON.");

    return await _updateTaskDue(
      req,
      res,
      "tasks",
      "task_id",
      Number(id),
      newValue,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/update/task/due)General error while processing a task admin_update due date request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.16task due date enforcement update route for admin
_adminRouter.post("/update/task/enforcedue", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter:/update/task/enforcedue)Got a task admin_update due date enforcement request, processing...`,
    );

    const { id, newBoolValue } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");
    if (typeof newBoolValue !== "boolean")
      throw new Error(
        "Typeof the newBoolValue parameter in the received JSON is not 'boolean'.",
      );

    return await _updateTaskEnforceDue(
      req,
      res,
      "tasks",
      "task_id",
      Number(id),
      Number(newBoolValue),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter:/update/task/enforcedue)General error while processing a task admin_update due date enforcement request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//6assigned routes for admin

//6.1student groups assigned to an account routes for admin

_adminRouter.post(
  "/getinfo/account/assigned/studentgroups/student",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/account/assigned/studentgroups/student)Got a student admin_getinfo assigned student groups request, processing...`,
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
        `(_adminRouter/getinfo/account/assigned/studentgroups/student)General error while processing a student admin_getinfo assigned student groups request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

_adminRouter.post(
  "/getinfo/account/assigned/studentgroups/teacher",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/account/assigned/studentgroups/teacher)Got a teacher admin_getinfo assigned student groups request, processing...`,
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
        `(_adminRouter/getinfo/account/assigned/studentgroups/teacher)General error while processing a teacher admin_getinfo assigned student groups request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//6.2specialties assigned to an account routes for admin

_adminRouter.post(
  "/getinfo/account/assigned/specialties/student",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/account/assigned/specialties/student)Got a student admin_getinfo assigned specialties request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getUserAccountAssignedEntities(
        req,
        res,
        "specialties",
        "specialty_id",
        "specialties_assigned_to_a_student_individually",
        "specialties_specialty_id",
        "students_student_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/account/assigned/specialties/student)General error while processing a student admin_getinfo assigned specialties request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

_adminRouter.post(
  "/getinfo/account/assigned/specialties/teacher",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/account/assigned/specialties/teacher)Got a teacher admin_getinfo assigned specialties request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getUserAccountAssignedEntities(
        req,
        res,
        "specialties",
        "specialty_id",
        "specialties_assigned_to_a_teacher_for_supervision",
        "specialties_specialty_id",
        "teachers_teacher_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/account/assigned/specialties/teacher)General error while processing a teacher admin_getinfo assigned specialties request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//6.3subjects assigned to an account routes for admin

_adminRouter.post(
  "/getinfo/account/assigned/subjects/student",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/account/assigned/subjects/student)Got a student admin_getinfo assigned subjects request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getUserAccountAssignedEntities(
        req,
        res,
        "subjects",
        "subject_id",
        "subjects_assigned_to_a_student_individually",
        "subjects_subject_id",
        "students_student_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/account/assigned/subjects/student)General error while processing a student admin_getinfo assigned subjects request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

_adminRouter.post(
  "/getinfo/account/assigned/subjects/teacher",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/account/assigned/subjects/teacher)Got a teacher admin_getinfo assigned subjects request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getUserAccountAssignedEntities(
        req,
        res,
        "subjects",
        "subject_id",
        "subjects_assigned_to_a_teacher_for_supervision",
        "subjects_subject_id",
        "teachers_teacher_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/account/assigned/subjects/teacher)General error while processing a teacher admin_getinfo assigned subjects request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//6.4tasks assigned to an account routes for admin

_adminRouter.post(
  "/getinfo/account/assigned/tasks/student",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/account/assigned/tasks/student)Got a student admin_getinfo assigned tasks request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getUserAccountAssignedEntities(
        req,
        res,
        "tasks",
        "task_id",
        "tasks_assigned_to_a_student_individually",
        "tasks_task_id",
        "students_student_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/account/assigned/tasks/student)General error while processing a student admin_getinfo assigned tasks request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

_adminRouter.post(
  "/getinfo/account/assigned/tasks/teacher",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/account/assigned/tasks/teacher)Got a teacher admin_getinfo assigned tasks request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getUserAccountAssignedEntities(
        req,
        res,
        "tasks",
        "task_id",
        "tasks_assigned_to_a_teacher_for_supervision",
        "tasks_task_id",
        "teachers_teacher_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/account/assigned/tasks/teacher)General error while processing a teacher admin_getinfo assigned tasks request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//6.5accounts assigned to a student group routes for admin

_adminRouter.post(
  "/getinfo/studentgroup/assigned/accounts/teacher",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/studentgroup/assigned/accounts/teacher)Got a studentgroup admin_getinfo assigned teachers request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityAssignedAccounts(
        req,
        res,
        "teachers",
        "teacher_id",
        "student_groups_assigned_to_a_teacher_for_supervision",
        "teachers_teacher_id",
        "student_groups_student_group_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/studentgroup/assigned/accounts/teacher)General error while processing a studentgroup admin_getinfo assigned teachers request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

_adminRouter.post(
  "/getinfo/studentgroup/assigned/accounts/student",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/studentgroup/assigned/accounts/student)Got a studentgroup admin_getinfo assigned students request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityAssignedAccounts(
        req,
        res,
        "students",
        "student_id",
        "students_assigned_to_a_student_group",
        "students_student_id",
        "student_groups_student_group_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/studentgroup/assigned/accounts/student)General error while processing a studentgroup admin_getinfo assigned students request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//6.6specialties assigned to a student group route for admin
_adminRouter.post(
  "/getinfo/studentgroup/assigned/specialties",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/studentgroup/assigned/specialties)Got a studentgroup admin_getinfo assigned specialties request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityAssignedEntities(
        req,
        res,
        "specialties",
        "specialty_id",
        "specialties_assigned_to_a_student_group",
        "specialties_specialty_id",
        "student_groups_student_group_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/studentgroup/assigned/specialties)General error while processing a studentgroup admin_getinfo assigned specialties request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//6.7accounts assigned to a specialty routes for admin

_adminRouter.post(
  "/getinfo/specialty/assigned/accounts/student",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/specialty/assigned/accounts/student)Got a specialty admin_getinfo assigned students request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityAssignedAccounts(
        req,
        res,
        "students",
        "student_id",
        "specialties_assigned_to_a_student_individually",
        "students_student_id",
        "specialties_specialty_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/specialty/assigned/accounts/student)General error while processing a specialty admin_getinfo assigned students request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

_adminRouter.post(
  "/getinfo/specialty/assigned/accounts/teacher",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/specialty/assigned/accounts/teacher)Got a specialty admin_getinfo assigned teachers request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityAssignedAccounts(
        req,
        res,
        "teachers",
        "teacher_id",
        "specialties_assigned_to_a_teacher_for_supervision",
        "teachers_teacher_id",
        "specialties_specialty_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/specialty/assigned/accounts/teacher)General error while processing a specialty admin_getinfo assigned teachers request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//6.8student groups assigned to a specialty route for admin
_adminRouter.post(
  "/getinfo/specialty/assigned/studentgroups",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/specialty/assigned/studentgroups)Got a specialty admin_getinfo assigned studentgroups request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityAssignedEntities(
        req,
        res,
        "student_groups",
        "student_group_id",
        "specialties_assigned_to_a_student_group",
        "student_groups_student_group_id",
        "specialties_specialty_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/specialty/assigned/studentgroups)General error while processing a specialty admin_getinfo assigned studentgroups request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//6.9subjects assigned to a specialty route for admin
_adminRouter.post("/getinfo/specialty/assigned/subjects", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/getinfo/specialty/assigned/subjects)Got a specialty admin_getinfo assigned subjects request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    return await _getEntityAssignedEntities(
      req,
      res,
      "subjects",
      "subject_id",
      "subjects_assigned_to_a_specialty",
      "subjects_subject_id",
      "specialties_specialty_id",
      Number(id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/getinfo/specialty/assigned/subjects)General error while processing a specialty admin_getinfo assigned subjects request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//6.10accounts assigned to a subject routes for admin

_adminRouter.post(
  "/getinfo/subject/assigned/accounts/student",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/subject/assigned/accounts/student)Got a subject admin_getinfo assigned students request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityAssignedAccounts(
        req,
        res,
        "students",
        "student_id",
        "subjects_assigned_to_a_student_individually",
        "students_student_id",
        "subjects_subject_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/subject/assigned/accounts/students)General error while processing a subject admin_getinfo assigned students request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

_adminRouter.post(
  "/getinfo/subject/assigned/accounts/teacher",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/subject/assigned/accounts/teacher)Got a subject admin_getinfo assigned teachers request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityAssignedAccounts(
        req,
        res,
        "teachers",
        "teacher_id",
        "subjects_assigned_to_a_teacher_for_supervision",
        "teachers_teacher_id",
        "subjects_subject_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/subject/assigned/accounts/teacher)General error while processing a subject admin_getinfo assigned teachers request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//6.11specialties assigned to a subject route for admin
_adminRouter.post("/getinfo/subject/assigned/specialties", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/getinfo/subject/assigned/specialties)Got a subject admin_getinfo assigned specialties request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    return await _getEntityAssignedEntities(
      req,
      res,
      "specialties",
      "specialty_id",
      "subjects_assigned_to_a_specialty",
      "specialties_specialty_id",
      "subjects_subject_id",
      Number(id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/getinfo/subject/assigned/specialties)General error while processing a subject admin_getinfo assigned specialties request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//6.12tasks assigned to a subject route for admin
_adminRouter.post("/getinfo/subject/assigned/tasks", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/getinfo/subject/assigned/tasks)Got a subject admin_getinfo assigned tasks request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    return await _getEntityAssignedEntities(
      req,
      res,
      "tasks",
      "task_id",
      "tasks_assigned_to_a_subject",
      "tasks_task_id",
      "subjects_subject_id",
      Number(id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/getinfo/subject/assigned/tasks)General error while processing a subject admin_getinfo assigned tasks request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//6.13accounts assigned to a task routes for admin

_adminRouter.post(
  "/getinfo/task/assigned/accounts/student",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/task/assigned/accounts/student)Got a task admin_getinfo assigned students request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityAssignedAccounts(
        req,
        res,
        "students",
        "student_id",
        "tasks_assigned_to_a_student_individually",
        "students_student_id",
        "tasks_task_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/task/assigned/accounts/student)General error while processing a task admin_getinfo assigned students request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

_adminRouter.post(
  "/getinfo/task/assigned/accounts/teacher",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/task/assigned/accounts/teacher)Got a task admin_getinfo assigned teachers request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityAssignedAccounts(
        req,
        res,
        "teachers",
        "teacher_id",
        "tasks_assigned_to_a_teacher_for_supervision",
        "teachers_teacher_id",
        "tasks_task_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/task/assigned/accounts/teacher)General error while processing a task admin_getinfo assigned teachers request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//6.14subjects assigned to a task route for admin
_adminRouter.post("/getinfo/task/assigned/subjects", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/getinfo/task/assigned/subjects)Got a task admin_getinfo assigned subjects request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    return await _getEntityAssignedEntities(
      req,
      res,
      "subjects",
      "subject_id",
      "tasks_assigned_to_a_subject",
      "subjects_subject_id",
      "tasks_task_id",
      Number(id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/getinfo/task/assigned/subjects)General error while processing a task admin_getinfo assigned subjects request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//7unassignment routes for admin

//7.1student group unassignment from an account routes for admin

_adminRouter.post("/unassign/studentgroups/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/unassign/studentgroups/student)Got a student admin_unassign student groups request, processing...`,
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
      `(_adminRouter/unassign/studentgroups/student)General error while processing a student admin_unassign student groups request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/unassign/studentgroups/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/unassign/studentgroups/teacher)Got a teacher admin_unassign student groups request, processing...`,
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
      `(_adminRouter/unassign/studentgroups/teacher)General error while processing a teacher admin_unassign student groups request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//7.2specialty unassignment from an account routes for admin

_adminRouter.post("/unassign/specialties/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/unassign/specialties/student)Got a student admin_unassign specialties request, processing...`,
    );

    const { specialty_id_selection, account_id } = req.body;

    if (!specialty_id_selection)
      throw new Error(
        "No specialty_id_selection parameter in the received JSON.",
      );
    if (!account_id)
      throw new Error("No account_id parameter in the received JSON.");

    return await _unassignUserAccountAssignedEntities(
      req,
      res,
      "specialties_assigned_to_a_student_individually",
      "specialties_specialty_id",
      "students_student_id",
      specialty_id_selection,
      Number(account_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/unassign/specialties/student)General error while processing a student admin_unassign specialties request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/unassign/specialties/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/unassign/specialties/teacher)Got a teacher admin_unassign specialties request, processing...`,
    );

    const { specialty_id_selection, account_id } = req.body;

    if (!specialty_id_selection)
      throw new Error(
        "No specialty_id_selection parameter in the received JSON.",
      );
    if (!account_id)
      throw new Error("No account_id parameter in the received JSON.");

    return await _unassignUserAccountAssignedEntities(
      req,
      res,
      "specialties_assigned_to_a_teacher_for_supervision",
      "specialties_specialty_id",
      "teachers_teacher_id",
      specialty_id_selection,
      Number(account_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/unassign/specialties/teacher)General error while processing a teacher admin_unassign specialties request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//7.3subject unassignment from an account routes for admin

_adminRouter.post("/unassign/subjects/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/unassign/subjects/student)Got a student admin_unassign subjects request, processing...`,
    );

    const { subject_id_selection, account_id } = req.body;

    if (!subject_id_selection)
      throw new Error(
        "No subject_id_selection parameter in the received JSON.",
      );
    if (!account_id)
      throw new Error("No account_id parameter in the received JSON.");

    return await _unassignUserAccountAssignedEntities(
      req,
      res,
      "subjects_assigned_to_a_student_individually",
      "subjects_subject_id",
      "students_student_id",
      subject_id_selection,
      Number(account_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/unassign/subjects/student)General error while processing a student admin_unassign subjects request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/unassign/subjects/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/unassign/subjects/teacher)Got a teacher admin_unassign subjects request, processing...`,
    );

    const { subject_id_selection, account_id } = req.body;

    if (!subject_id_selection)
      throw new Error(
        "No subject_id_selection parameter in the received JSON.",
      );
    if (!account_id)
      throw new Error("No account_id parameter in the received JSON.");

    return await _unassignUserAccountAssignedEntities(
      req,
      res,
      "subjects_assigned_to_a_teacher_for_supervision",
      "subjects_subject_id",
      "teachers_teacher_id",
      subject_id_selection,
      Number(account_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/unassign/subjects/teacher)General error while processing a teacher admin_unassign subjects request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//7.4task unassignment from an account routes for admin

_adminRouter.post("/unassign/tasks/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/unassign/tasks/student)Got a student admin_unassign tasks request, processing...`,
    );

    const { task_id_selection, account_id } = req.body;

    if (!task_id_selection)
      throw new Error("No task_id_selection parameter in the received JSON.");
    if (!account_id)
      throw new Error("No account_id parameter in the received JSON.");

    return await _unassignUserAccountAssignedEntities(
      req,
      res,
      "tasks_assigned_to_a_student_individually",
      "tasks_task_id",
      "students_student_id",
      task_id_selection,
      Number(account_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/unassign/tasks/student)General error while processing a student admin_unassign tasks request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/unassign/tasks/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/unassign/tasks/teacher)Got a teacher admin_unassign tasks request, processing...`,
    );

    const { task_id_selection, account_id } = req.body;

    if (!task_id_selection)
      throw new Error("No task_id_selection parameter in the received JSON.");
    if (!account_id)
      throw new Error("No account_id parameter in the received JSON.");

    return await _unassignUserAccountAssignedEntities(
      req,
      res,
      "tasks_assigned_to_a_teacher_for_supervision",
      "tasks_task_id",
      "teachers_teacher_id",
      task_id_selection,
      Number(account_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/unassign/tasks/teacher)General error while processing a teacher admin_unassign tasks request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//7.5account unassignment from a student group routes for admin

_adminRouter.post(
  "/unassign/studentgroup/accounts/student",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/unassign/studentgroup/accounts/student)Got a studentgroup admin_unassign students request, processing...`,
      );

      const { child_id_selection, parent_id } = req.body;

      if (!child_id_selection)
        throw new Error(
          "No child_id_selection parameter in the received JSON.",
        );
      if (!parent_id)
        throw new Error("No parent_id parameter in the received JSON.");

      return await _unassignEntityAssignedEntities(
        req,
        res,
        "students_assigned_to_a_student_group",
        "students_student_id",
        "student_groups_student_group_id",
        child_id_selection,
        Number(parent_id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/unassign/studentgroup/accounts/student)General error while processing a studentgroup admin_unassign students request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

_adminRouter.post(
  "/unassign/studentgroup/accounts/teacher",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/unassign/studentgroup/accounts/teacher)Got a studentgroup admin_unassign teachers request, processing...`,
      );

      const { child_id_selection, parent_id } = req.body;

      if (!child_id_selection)
        throw new Error(
          "No child_id_selection parameter in the received JSON.",
        );
      if (!parent_id)
        throw new Error("No parent_id parameter in the received JSON.");

      return await _unassignEntityAssignedEntities(
        req,
        res,
        "student_groups_assigned_to_a_teacher_for_supervision",
        "teachers_teacher_id",
        "student_groups_student_group_id",
        child_id_selection,
        Number(parent_id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/unassign/studentgroup/accounts/teacher)General error while processing a studentgroup admin_unassign teachers request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//7.6specialty unassignment from a student group route for admin
_adminRouter.post("/unassign/studentgroup/specialties", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/unassign/studentgroup/specialties)Got a studentgroup admin_unassign specialties request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _unassignEntityAssignedEntities(
      req,
      res,
      "specialties_assigned_to_a_student_group",
      "specialties_specialty_id",
      "student_groups_student_group_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/unassign/studentgroup/specialties)General error while processing a studentgroup admin_unassign specialties request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//7.7account unassignment from a specialty routes for admin

_adminRouter.post("/unassign/specialty/accounts/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/unassign/specialty/accounts/student)Got a specialty admin_unassign students request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _unassignEntityAssignedEntities(
      req,
      res,
      "specialties_assigned_to_a_student_individually",
      "students_student_id",
      "specialties_specialty_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/unassign/specialty/accounts/student)General error while processing a specialty admin_unassign students request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/unassign/specialty/accounts/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/unassign/specialty/accounts/teacher)Got a specialty admin_unassign teachers request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _unassignEntityAssignedEntities(
      req,
      res,
      "specialties_assigned_to_a_teacher_for_supervision",
      "teachers_teacher_id",
      "specialties_specialty_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/unassign/specialty/accounts/teacher)General error while processing a specialty admin_unassign teachers request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//7.8student group unassignment from a specialty route for admin
_adminRouter.post("/unassign/specialty/studentgroups", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/unassign/specialty/studentgroups)Got a specialty admin_unassign studentgroups request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _unassignEntityAssignedEntities(
      req,
      res,
      "specialties_assigned_to_a_student_group",
      "student_groups_student_group_id",
      "specialties_specialty_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/unassign/specialty/studentgroups)General error while processing a specialty admin_unassign studentgroups request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//7.9subject unassignment from a specialty route for admin
_adminRouter.post("/unassign/specialty/subjects", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/unassign/specialty/subjects)Got a specialty admin_unassign subjects request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _unassignEntityAssignedEntities(
      req,
      res,
      "subjects_assigned_to_a_specialty",
      "subjects_subject_id",
      "specialties_specialty_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/unassign/specialty/subjects)General error while processing a specialty admin_unassign subjects request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//7.10account unassignment from a subject routes for admin

_adminRouter.post("/unassign/subject/accounts/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/unassign/subject/accounts/student)Got a subject admin_unassign students request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _unassignEntityAssignedEntities(
      req,
      res,
      "subjects_assigned_to_a_student_individually",
      "students_student_id",
      "subjects_subject_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/unassign/subject/accounts/student)General error while processing a subject admin_unassign students request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/unassign/subject/accounts/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/unassign/subject/accounts/teacher)Got a subject admin_unassign teachers request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _unassignEntityAssignedEntities(
      req,
      res,
      "subjects_assigned_to_a_teacher_for_supervision",
      "teachers_teacher_id",
      "subjects_subject_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/unassign/subject/accounts/teacher)General error while processing a subject admin_unassign teachers request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//7.11specialty unassignment from a subject route for admin
_adminRouter.post("/unassign/subject/specialties", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/unassign/subject/specialties)Got a subject admin_unassign specialties request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _unassignEntityAssignedEntities(
      req,
      res,
      "subjects_assigned_to_a_specialty",
      "specialties_specialty_id",
      "subjects_subject_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/unassign/subject/specialties)General error while processing a subject admin_unassign specialties request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//7.12task unassignment from a subject route for admin
_adminRouter.post("/unassign/subject/tasks", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/unassign/subject/tasks)Got a subject admin_unassign tasks request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _unassignEntityAssignedEntities(
      req,
      res,
      "tasks_assigned_to_a_subject",
      "tasks_task_id",
      "subjects_subject_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/unassign/subject/tasks)General error while processing a subject admin_unassign tasks request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//7.13account unassignment from a task routes for admin

_adminRouter.post("/unassign/task/accounts/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/unassign/task/accounts/student)Got a task admin_unassign students request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _unassignEntityAssignedEntities(
      req,
      res,
      "tasks_assigned_to_a_student_individually",
      "students_student_id",
      "tasks_task_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/unassign/task/accounts/student)General error while processing a task admin_unassign students request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/unassign/task/accounts/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/unassign/task/accounts/teacher)Got a task admin_unassign teachers request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _unassignEntityAssignedEntities(
      req,
      res,
      "tasks_assigned_to_a_teacher_for_supervision",
      "teachers_teacher_id",
      "tasks_task_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/unassign/task/accounts/teacher)General error while processing a task admin_unassign teachers request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//7.14subject unassignment from a task route for admin
_adminRouter.post("/unassign/task/subjects", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/unassign/task/subjects)Got a task admin_unassign subjects request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _unassignEntityAssignedEntities(
      req,
      res,
      "tasks_assigned_to_a_subject",
      "subjects_subject_id",
      "tasks_task_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/unassign/task/subjects)General error while processing a task admin_unassign subjects request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//8unassigned routes for admin

//8.1student groups not assigned to an account routes for admin

_adminRouter.post(
  "/getinfo/account/unassigned/studentgroups/student",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/account/unassigned/studentgroups/student)Got a student admin_getinfo unassigned student groups request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getUserAccountUnassignedEntities(
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
        `(_adminRouter/getinfo/account/unassigned/studentgroups/student)General error while processing a student admin_getinfo unassigned student groups request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

_adminRouter.post(
  "/getinfo/account/unassigned/studentgroups/teacher",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/account/unassigned/studentgroups/teacher)Got a teacher admin_getinfo unassigned student groups request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getUserAccountUnassignedEntities(
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
        `(_adminRouter/getinfo/account/unassigned/studentgroups/teacher)General error while processing a teacher admin_getinfo unassigned student groups request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//8.2specialties not assigned to an account routes for admin

_adminRouter.post(
  "/getinfo/account/unassigned/specialties/student",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/account/unassigned/specialties/student)Got a student admin_getinfo unassigned specialties request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getUserAccountUnassignedEntities(
        req,
        res,
        "specialties",
        "specialty_id",
        "specialties_assigned_to_a_student_individually",
        "specialties_specialty_id",
        "students_student_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/account/unassigned/specialties/student)General error while processing a student admin_getinfo unassigned specialties request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

_adminRouter.post(
  "/getinfo/account/unassigned/specialties/teacher",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/account/unassigned/specialties/teacher)Got a teacher admin_getinfo unassigned specialties request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getUserAccountUnassignedEntities(
        req,
        res,
        "specialties",
        "specialty_id",
        "specialties_assigned_to_a_teacher_for_supervision",
        "specialties_specialty_id",
        "teachers_teacher_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/account/unassigned/specialties/teacher)General error while processing a teacher admin_getinfo unassigned specialties request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//8.3subjects not assigned to an account routes for admin

_adminRouter.post(
  "/getinfo/account/unassigned/subjects/student",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/account/unassigned/subjects/student)Got a student admin_getinfo unassigned subjects request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getUserAccountUnassignedEntities(
        req,
        res,
        "subjects",
        "subject_id",
        "subjects_assigned_to_a_student_individually",
        "subjects_subject_id",
        "students_student_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/account/unassigned/subjects/student)General error while processing a student admin_getinfo unassigned subjects request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

_adminRouter.post(
  "/getinfo/account/unassigned/subjects/teacher",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/account/unassigned/subjects/teacher)Got a teacher admin_getinfo unassigned subjects request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getUserAccountUnassignedEntities(
        req,
        res,
        "subjects",
        "subject_id",
        "subjects_assigned_to_a_teacher_for_supervision",
        "subjects_subject_id",
        "teachers_teacher_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/account/unassigned/subjects/teacher)General error while processing a teacher admin_getinfo unassigned subjects request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//8.4tasks not assigned to an account routes for admin

_adminRouter.post(
  "/getinfo/account/unassigned/tasks/student",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/account/unassigned/tasks/student)Got a student admin_getinfo unassigned tasks request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getUserAccountUnassignedEntities(
        req,
        res,
        "tasks",
        "task_id",
        "tasks_assigned_to_a_student_individually",
        "tasks_task_id",
        "students_student_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/account/unassigned/tasks/student)General error while processing a student admin_getinfo unassigned tasks request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

_adminRouter.post(
  "/getinfo/account/unassigned/tasks/teacher",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/account/unassigned/tasks/teacher)Got a teacher admin_getinfo unassigned tasks request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getUserAccountUnassignedEntities(
        req,
        res,
        "tasks",
        "task_id",
        "tasks_assigned_to_a_teacher_for_supervision",
        "tasks_task_id",
        "teachers_teacher_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/account/unassigned/tasks/teacher)General error while processing a teacher admin_getinfo unassigned tasks request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//8.5accounts not assigned to a student group routes for admin

_adminRouter.post(
  "/getinfo/studentgroup/unassigned/accounts/student",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/studentgroup/unassigned/accounts/student)Got a studentgroup admin_getinfo unassigned students request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityUnassignedAccounts(
        req,
        res,
        "students",
        "student_id",
        "students_assigned_to_a_student_group",
        "students_student_id",
        "student_groups_student_group_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/studentgroup/unassigned/accounts/student)General error while processing a studentgroup admin_getinfo unassigned students request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

_adminRouter.post(
  "/getinfo/studentgroup/unassigned/accounts/teacher",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/studentgroup/unassigned/accounts/teacher)Got a studentgroup admin_getinfo unassigned teachers request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityUnassignedAccounts(
        req,
        res,
        "teachers",
        "teacher_id",
        "student_groups_assigned_to_a_teacher_for_supervision",
        "teachers_teacher_id",
        "student_groups_student_group_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/studentgroup/unassigned/accounts/teacher)General error while processing a studentgroup admin_getinfo unassigned teachers request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//8.6specialties not assigned to a student group route for admin
_adminRouter.post(
  "/getinfo/studentgroup/unassigned/specialties",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/studentgroup/assigned/specialties)Got a studentgroup admin_getinfo unassigned specialties request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityUnassignedEntities(
        req,
        res,
        "specialties",
        "specialty_id",
        "specialties_assigned_to_a_student_group",
        "specialties_specialty_id",
        "student_groups_student_group_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/studentgroup/unassigned/specialties)General error while processing a studentgroup admin_getinfo unassigned specialties request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//8.7accounts not assigned to a specialty routes for admin

_adminRouter.post(
  "/getinfo/specialty/unassigned/accounts/student",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/specialty/unassigned/accounts/student)Got a specialty admin_getinfo unassigned students request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityUnassignedAccounts(
        req,
        res,
        "students",
        "student_id",
        "specialties_assigned_to_a_student_individually",
        "students_student_id",
        "specialties_specialty_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/specialty/unassigned/accounts/student)General error while processing a specialty admin_getinfo unassigned students request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

_adminRouter.post(
  "/getinfo/specialty/unassigned/accounts/teacher",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/specialty/unassigned/accounts/teacher)Got a specialty admin_getinfo unassigned teachers request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityUnassignedAccounts(
        req,
        res,
        "teachers",
        "teacher_id",
        "specialties_assigned_to_a_teacher_for_supervision",
        "teachers_teacher_id",
        "specialties_specialty_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/specialty/unassigned/accounts/teacher)General error while processing a specialty admin_getinfo unassigned teachers request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//8.8student groups not assigned to a specialty route for admin
_adminRouter.post(
  "/getinfo/specialty/unassigned/studentgroups",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/specialty/unassigned/studentgroups)Got a specialty admin_getinfo unassigned studentgroups request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityUnassignedEntities(
        req,
        res,
        "student_groups",
        "student_group_id",
        "specialties_assigned_to_a_student_group",
        "student_groups_student_group_id",
        "specialties_specialty_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/specialty/unassigned/studentgroups)General error while processing a specialty admin_getinfo unassigned studentgroups request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//8.9subjects not assigned to a specialty route for admin
_adminRouter.post(
  "/getinfo/specialty/unassigned/subjects",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/specialty/unassigned/subjects)Got a specialty admin_getinfo unassigned subjects request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityUnassignedEntities(
        req,
        res,
        "subjects",
        "subject_id",
        "subjects_assigned_to_a_specialty",
        "subjects_subject_id",
        "specialties_specialty_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/specialty/unassigned/subjects)General error while processing a specialty admin_getinfo unassigned subjects request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//8.10accounts not assigned to a subject routes for admin

_adminRouter.post(
  "/getinfo/subject/unassigned/accounts/student",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/subject/unassigned/accounts/student)Got a subject admin_getinfo unassigned students request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityUnassignedAccounts(
        req,
        res,
        "students",
        "student_id",
        "subjects_assigned_to_a_student_individually",
        "students_student_id",
        "subjects_subject_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/subject/unassigned/accounts/students)General error while processing a subject admin_getinfo unassigned students request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

_adminRouter.post(
  "/getinfo/subject/unassigned/accounts/teacher",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/subject/unassigned/accounts/teacher)Got a subject admin_getinfo unassigned teachers request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityUnassignedAccounts(
        req,
        res,
        "teachers",
        "teacher_id",
        "subjects_assigned_to_a_teacher_for_supervision",
        "teachers_teacher_id",
        "subjects_subject_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/subject/unassigned/accounts/teacher)General error while processing a subject admin_getinfo unassigned teachers request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//8.11specialties not assigned to a subject route for admin
_adminRouter.post(
  "/getinfo/subject/unassigned/specialties",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/subject/unassigned/specialties)Got a subject admin_getinfo unassigned specialties request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityUnassignedEntities(
        req,
        res,
        "specialties",
        "specialty_id",
        "subjects_assigned_to_a_specialty",
        "specialties_specialty_id",
        "subjects_subject_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/subject/unassigned/specialties)General error while processing a subject admin_getinfo unassigned specialties request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//8.12tasks not assigned to a subject route for admin
_adminRouter.post("/getinfo/subject/unassigned/tasks", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/getinfo/subject/unassigned/tasks)Got a subject admin_getinfo unassigned tasks request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    return await _getEntityUnassignedEntities(
      req,
      res,
      "tasks",
      "task_id",
      "tasks_assigned_to_a_subject",
      "tasks_task_id",
      "subjects_subject_id",
      Number(id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/getinfo/subject/unassigned/tasks)General error while processing a subject admin_getinfo unassigned tasks request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//8.13accounts not assigned to a task routes for admin

_adminRouter.post(
  "/getinfo/task/unassigned/accounts/student",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/task/unassigned/accounts/student)Got a task admin_getinfo unassigned students request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityUnassignedAccounts(
        req,
        res,
        "students",
        "student_id",
        "tasks_assigned_to_a_student_individually",
        "students_student_id",
        "tasks_task_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/task/unassigned/accounts/student)General error while processing a task admin_getinfo unassigned students request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

_adminRouter.post(
  "/getinfo/task/unassigned/accounts/teacher",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_adminRouter/getinfo/task/unassigned/accounts/teacher)Got a task admin_getinfo unassigned teachers request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      return await _getEntityUnassignedAccounts(
        req,
        res,
        "teachers",
        "teacher_id",
        "tasks_assigned_to_a_teacher_for_supervision",
        "teachers_teacher_id",
        "tasks_task_id",
        Number(id),
      );
    } catch (error) {
      consoleLoggers.logError(
        `(_adminRouter/getinfo/task/unassigned/accounts/teacher)General error while processing a task admin_getinfo unassigned teachers request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//8.14subjects not assigned to a task route for admin
_adminRouter.post("/getinfo/task/unassigned/subjects", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/getinfo/task/unassigned/subjects)Got a task admin_getinfo unassigned subjects request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    return await _getEntityUnassignedEntities(
      req,
      res,
      "subjects",
      "subject_id",
      "tasks_assigned_to_a_subject",
      "subjects_subject_id",
      "tasks_task_id",
      Number(id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/getinfo/task/unassigned/subjects)General error while processing a task admin_getinfo unassigned subjects request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//9assignment routes for admin

//9.1student group assignment to an account routes for admin

_adminRouter.post("/assign/studentgroups/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/studentgroups/student)Got a student admin_assign student groups request, processing...`,
    );

    const { student_group_id_selection, account_id } = req.body;

    if (!student_group_id_selection)
      throw new Error(
        "No student_group_id_selection parameter in the received JSON.",
      );
    if (!account_id)
      throw new Error("No account_id parameter in the received JSON.");

    return await _assignEntitiesToUserAccount(
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
      `(_adminRouter/assign/studentgroups/student)General error while processing a student admin_assign student groups request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/assign/studentgroups/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/studentgroups/teacher)Got a teacher admin_assign student groups request, processing...`,
    );

    const { student_group_id_selection, account_id } = req.body;

    if (!student_group_id_selection)
      throw new Error(
        "No student_group_id_selection parameter in the received JSON.",
      );
    if (!account_id)
      throw new Error("No account_id parameter in the received JSON.");

    return await _assignEntitiesToUserAccount(
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
      `(_adminRouter/assign/studentgroups/teacher)General error while processing a teacher admin_assign student groups request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//9.2specialty assignment to an account routes for admin

_adminRouter.post("/assign/specialties/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/specialties/student)Got a student admin_assign specialties request, processing...`,
    );

    const { specialty_id_selection, account_id } = req.body;

    if (!specialty_id_selection)
      throw new Error(
        "No specialty_id_selection parameter in the received JSON.",
      );
    if (!account_id)
      throw new Error("No account_id parameter in the received JSON.");

    return await _assignEntitiesToUserAccount(
      req,
      res,
      "specialties_assigned_to_a_student_individually",
      "specialties_specialty_id",
      "students_student_id",
      specialty_id_selection,
      Number(account_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/assign/specialties/student)General error while processing a student admin_assign specialties request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/assign/specialties/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/specialties/teacher)Got a teacher admin_assign specialties request, processing...`,
    );

    const { specialty_id_selection, account_id } = req.body;

    if (!specialty_id_selection)
      throw new Error(
        "No specialty_id_selection parameter in the received JSON.",
      );
    if (!account_id)
      throw new Error("No account_id parameter in the received JSON.");

    return await _assignEntitiesToUserAccount(
      req,
      res,
      "specialties_assigned_to_a_teacher_for_supervision",
      "specialties_specialty_id",
      "teachers_teacher_id",
      specialty_id_selection,
      Number(account_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/assign/specialties/teacher)General error while processing a teacher admin_assign specialties request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//9.3subject assignment to an account routes for admin

_adminRouter.post("/assign/subjects/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/subjects/student)Got a student admin_assign subjects request, processing...`,
    );

    const { subject_id_selection, account_id } = req.body;

    if (!subject_id_selection)
      throw new Error(
        "No subject_id_selection parameter in the received JSON.",
      );
    if (!account_id)
      throw new Error("No account_id parameter in the received JSON.");

    return await _assignEntitiesToUserAccount(
      req,
      res,
      "subjects_assigned_to_a_student_individually",
      "subjects_subject_id",
      "students_student_id",
      subject_id_selection,
      Number(account_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/assign/subjects/student)General error while processing a student admin_assign subjects request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/assign/subjects/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/subjects/teacher)Got a teacher admin_assign subjects request, processing...`,
    );

    const { subject_id_selection, account_id } = req.body;

    if (!subject_id_selection)
      throw new Error(
        "No subject_id_selection parameter in the received JSON.",
      );
    if (!account_id)
      throw new Error("No account_id parameter in the received JSON.");

    return await _assignEntitiesToUserAccount(
      req,
      res,
      "subjects_assigned_to_a_teacher_for_supervision",
      "subjects_subject_id",
      "teachers_teacher_id",
      subject_id_selection,
      Number(account_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/assign/subjects/teacher)General error while processing a teacher admin_assign subjects request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//9.4task assignment routes to an account for admin

_adminRouter.post("/assign/tasks/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/tasks/student)Got a student admin_assign tasks request, processing...`,
    );

    const { task_id_selection, account_id } = req.body;

    if (!task_id_selection)
      throw new Error("No task_id_selection parameter in the received JSON.");
    if (!account_id)
      throw new Error("No account_id parameter in the received JSON.");

    return await _assignEntitiesToUserAccount(
      req,
      res,
      "tasks_assigned_to_a_student_individually",
      "tasks_task_id",
      "students_student_id",
      task_id_selection,
      Number(account_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/assign/tasks/student)General error while processing a student admin_assign tasks request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/assign/tasks/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/tasks/teacher)Got a teacher admin_assign tasks request, processing...`,
    );

    const { task_id_selection, account_id } = req.body;

    if (!task_id_selection)
      throw new Error("No task_id_selection parameter in the received JSON.");
    if (!account_id)
      throw new Error("No account_id parameter in the received JSON.");

    return await _assignEntitiesToUserAccount(
      req,
      res,
      "tasks_assigned_to_a_teacher_for_supervision",
      "tasks_task_id",
      "teachers_teacher_id",
      task_id_selection,
      Number(account_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/assign/tasks/teacher)General error while processing a teacher admin_assign tasks request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//9.5account assignment to a student group routes for admin

_adminRouter.post("/assign/studentgroup/accounts/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/studentgroup/accounts/student)Got a studentgroup admin_assign students request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _assignEntitiesToEntity(
      req,
      res,
      "students_assigned_to_a_student_group",
      "students_student_id",
      "student_groups_student_group_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/assign/studentgroup/accounts/student)General error while processing a studentgroup admin_assign students request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/assign/studentgroup/accounts/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/studentgroup/accounts/teacher)Got a studentgroup admin_assign teachers request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _assignEntitiesToEntity(
      req,
      res,
      "student_groups_assigned_to_a_teacher_for_supervision",
      "teachers_teacher_id",
      "student_groups_student_group_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/assign/studentgroup/accounts/teacher)General error while processing a studentgroup admin_assign teachers request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//9.6specialty assignment to a student group route for admin
_adminRouter.post("/assign/studentgroup/specialties", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/studentgroup/specialties)Got a studentgroup admin_assign specialties request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _assignEntitiesToEntity(
      req,
      res,
      "specialties_assigned_to_a_student_group",
      "specialties_specialty_id",
      "student_groups_student_group_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/assign/studentgroup/specialties)General error while processing a studentgroup admin_assign specialties request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//9.7account assignment to a specialty routes for admin

_adminRouter.post("/assign/specialty/accounts/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/specialty/accounts/student)Got a specialty admin_assign students request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _assignEntitiesToEntity(
      req,
      res,
      "specialties_assigned_to_a_student_individually",
      "students_student_id",
      "specialties_specialty_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/assign/specialty/accounts/student)General error while processing a specialty admin_assign students request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/assign/specialty/accounts/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/specialty/accounts/teacher)Got a specialty admin_assign teachers request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _assignEntitiesToEntity(
      req,
      res,
      "specialties_assigned_to_a_teacher_for_supervision",
      "teachers_teacher_id",
      "specialties_specialty_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/assign/specialty/accounts/teacher)General error while processing a specialty admin_assign teachers request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//9.8student group assignment to a specialty route for admin
_adminRouter.post("/assign/specialty/studentgroups", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/specialty/studentgroups)Got a specialty admin_assign studentgroups request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _assignEntitiesToEntity(
      req,
      res,
      "specialties_assigned_to_a_student_group",
      "student_groups_student_group_id",
      "specialties_specialty_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/assign/specialty/studentgroups)General error while processing a specialty admin_assign studentgroups request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//9.9subject assignment to a specialty route for admin
_adminRouter.post("/assign/specialty/subjects", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/specialty/subjects)Got a specialty admin_assign subjects request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _assignEntitiesToEntity(
      req,
      res,
      "subjects_assigned_to_a_specialty",
      "subjects_subject_id",
      "specialties_specialty_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/assign/specialty/subjects)General error while processing a specialty admin_assign subjects request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//9.10account assignment to a subject routes for admin

_adminRouter.post("/assign/subject/accounts/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/subject/accounts/student)Got a subject admin_assign students request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _assignEntitiesToEntity(
      req,
      res,
      "subjects_assigned_to_a_student_individually",
      "students_student_id",
      "subjects_subject_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/assign/subject/accounts/student)General error while processing a subject admin_assign students request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/assign/subject/accounts/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/subject/accounts/teacher)Got a subject admin_assign teachers request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _assignEntitiesToEntity(
      req,
      res,
      "subjects_assigned_to_a_teacher_for_supervision",
      "teachers_teacher_id",
      "subjects_subject_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/assign/subject/accounts/teacher)General error while processing a subject admin_assign teachers request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//9.11specialty assignment from a subject route for admin
_adminRouter.post("/assign/subject/specialties", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/subject/specialties)Got a subject admin_assign specialties request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _assignEntitiesToEntity(
      req,
      res,
      "subjects_assigned_to_a_specialty",
      "specialties_specialty_id",
      "subjects_subject_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/assign/subject/specialties)General error while processing a subject admin_assign specialties request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//9.12task assignment from a subject route for admin
_adminRouter.post("/assign/subject/tasks", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/subject/tasks)Got a subject admin_assign tasks request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _assignEntitiesToEntity(
      req,
      res,
      "tasks_assigned_to_a_subject",
      "tasks_task_id",
      "subjects_subject_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/assign/subject/tasks)General error while processing a subject admin_assign tasks request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//9.13account assignment from a task routes for admin

_adminRouter.post("/assign/task/accounts/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/task/accounts/student)Got a task admin_assign students request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _assignEntitiesToEntity(
      req,
      res,
      "tasks_assigned_to_a_student_individually",
      "students_student_id",
      "tasks_task_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/assign/task/accounts/student)General error while processing a task admin_assign students request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_adminRouter.post("/assign/task/accounts/teacher", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/task/accounts/teacher)Got a task admin_assign teachers request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _assignEntitiesToEntity(
      req,
      res,
      "tasks_assigned_to_a_teacher_for_supervision",
      "teachers_teacher_id",
      "tasks_task_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/assign/task/accounts/teacher)General error while processing a task admin_assign teachers request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//9.14subject assignment from a task route for admin
_adminRouter.post("/assign/task/subjects", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/assign/task/subjects)Got a task admin_assign subjects request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    return await _assignEntitiesToEntity(
      req,
      res,
      "tasks_assigned_to_a_subject",
      "subjects_subject_id",
      "tasks_task_id",
      child_id_selection,
      Number(parent_id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_adminRouter/assign/task/subjects)General error while processing a task admin_assign subjects request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

export const adminRouter = _adminRouter;
