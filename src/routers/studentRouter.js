//imports
import { Router } from "express";

//imports->project
import * as mysqlManagement from "../startup/databases/mysql/mysqlManagement.js";
import * as accountManagement from "../startup/databases/mysql/accounts/accountManagement.js";
import * as entityManagement from "../startup/databases/mysql/accounts/entityManagement.js";
import * as consoleLoggers from "../startup/console/consoleLoggers.js";

//.setup
const _studentRouter = Router();

//utility: student-only functions

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

    if ("student" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not student (current user type: ${req.user.type})`,
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

//routes

//6assigned routes for student

//6.1student groups assigned to own account route for student
_studentRouter.post("/getall/assigned/studentgroups", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_studentRouter/getall/assigned/studentgroups)Got a student_getall assigned student groups request, processing...`,
    );

    return await _getUserAccountAssignedEntities(
      req,
      res,
      "student_groups",
      "student_group_id",
      "students_assigned_to_a_student_group",
      "student_groups_student_group_id",
      "students_student_id",
      req.user.id,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_studentRouter/getall/assigned/studentgroups)General error while processing a student_getall assigned student groups request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//6.2specialties assigned to own account route for student
_studentRouter.post("/getall/assigned/specialties", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_studentRouter/getall/assigned/specialties)Got a student_getall assigned specialties request, processing...`,
    );

    return await _getUserAccountAssignedEntities(
      req,
      res,
      "specialties",
      "specialty_id",
      "specialties_assigned_to_a_student_individually",
      "specialties_specialty_id",
      "students_student_id",
      req.user.id,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_studentRouter/getall/assigned/specialties)General error while processing a student_getall assigned specialties request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//6.3subjects assigned to own account route for student
_studentRouter.post("/getall/assigned/subjects", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_studentRouter/getall/assigned/subjects)Got a student_getall assigned subjects request, processing...`,
    );

    return await _getUserAccountAssignedEntities(
      req,
      res,
      "subjects",
      "subject_id",
      "subjects_assigned_to_a_student_individually",
      "subjects_subject_id",
      "students_student_id",
      req.user.id,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_studentRouter/getall/assigned/subjects)General error while processing a student_getall assigned subjects request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//6.4tasks assigned to own account route for student
_studentRouter.post("/getall/assigned/tasks", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_studentRouter/getall/assigned/tasks)Got a student_getall assigned tasks request, processing...`,
    );

    return await _getUserAccountAssignedEntities(
      req,
      res,
      "tasks",
      "task_id",
      "tasks_assigned_to_a_student_individually",
      "tasks_task_id",
      "students_student_id",
      req.user.id,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_studentRouter/getall/assigned/tasks)General error while processing a student_getall assigned tasks request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

export const studentRouter = _studentRouter;
