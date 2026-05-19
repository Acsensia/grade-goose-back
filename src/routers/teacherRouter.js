//imports
import { Router } from "express";

//imports->project
import * as mysqlManagement from "../startup/databases/mysql/mysqlManagement.js";
import * as entityManagement from "../startup/databases/mysql/accounts/entityManagement.js";
import * as consoleLoggers from "../startup/console/consoleLoggers.js";

//.setup
const _teacherRouter = Router();

//utility: teacher-only functions

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

    if ("teacher" !== req.user.type)
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

    if ("teacher" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
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

    if ("teacher" !== req.user.type)
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

//routes

//1getall routes for teacher

_teacherRouter.post("/getall/tasks", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter:/getall/tasks)Got a task get all request, processing...`,
    );

    return await _getAllEntityInfo(req, res, "tasks", "task_id");
  } catch (error) {
    consoleLoggers.logError(
      `(_teacherRouter:/getall/tasks)General error while processing a task get all request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//2add routes for teacher

_teacherRouter.post("/add/task", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter:/add/task)Got a task addition request, processing...`,
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
      `(_teacherRouter:/add/task)General error while processing a task addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//4delete routes for admin

_teacherRouter.post("/delete/tasks", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter:/delete/tasks)Got a tasks admin_delete request, processing...`,
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
      `(_teacherRouter:/delete/tasks)General error while processing a tasks admin_delete request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

export const teacherRouter = _teacherRouter;
