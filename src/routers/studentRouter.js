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

async function __checkStudentAccessToStudentGroup(_studentId, _childId) {
  try {
    consoleLoggers.logNeutral(
      `(__checkStudentAccessToStudentGroup)Checking for student access to a student group...`,
    );

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");
    if (
      //student_group->student
      await entityManagement.checkAssigned1Fecta(
        connectionPool,
        true,
        "students_assigned_to_a_student_group",
        "student_groups_student_group_id",
        "students_student_id",
        _childId,
        _studentId,
      )
    ) {
      return true;
    } else return false;
  } catch (error) {
    consoleLoggers.logError(
      `(__checkStudentAccessToStudentGroup)General error while checking for student access to a student group, error message: "${error}".`,
    );
    return undefined;
  }
}

async function __checkStudentAccessToSpecialty(_studentId, _childId) {
  try {
    consoleLoggers.logNeutral(
      `(__checkStudentAccessToSpecialty)Checking for student access to a specialty...`,
    );

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");
    if (
      //specialty->student
      await entityManagement.checkAssigned1Fecta(
        connectionPool,
        true,
        "specialties_assigned_to_a_student_individually",
        "specialties_specialty_id",
        "students_student_id",
        _childId,
        _studentId,
      )
    ) {
      return true;
    } else if (
      //specialty->student_group->student
      await entityManagement.checkAssigned2Fecta(
        connectionPool,
        true,
        "specialties_assigned_to_a_student_group",
        "students_assigned_to_a_student_group",
        "specialties_specialty_id",
        "student_groups_student_group_id",
        "students_student_id",
        _childId,
        _studentId,
      )
    ) {
      return true;
    } else return false;
  } catch (error) {
    consoleLoggers.logError(
      `(__checkStudentAccessToSpecialty)General error while checking for student access to a specialty, error message: "${error}".`,
    );
    return undefined;
  }
}

async function __checkStudentAccessToSubject(_studentId, _childId) {
  try {
    consoleLoggers.logNeutral(
      `(__checkStudentAccessToSubject)Checking for student access to a subject...`,
    );

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");
    if (
      //subject->student
      await entityManagement.checkAssigned1Fecta(
        connectionPool,
        true,
        "subjects_assigned_to_a_student_individually",
        "subjects_subject_id",
        "students_student_id",
        _childId,
        _studentId,
      )
    ) {
      return true;
    } else if (
      //subject->specialty->student
      await entityManagement.checkAssigned2Fecta(
        connectionPool,
        true,
        "subjects_assigned_to_a_specialty",
        "specialties_assigned_to_a_student_individually",
        "subjects_subject_id",
        "specialties_specialty_id",
        "students_student_id",
        _childId,
        _studentId,
      )
    ) {
      return true;
    } else if (
      //subject->specialty->student_group->student
      await entityManagement.checkAssigned3Fecta(
        connectionPool,
        true,
        "subjects_assigned_to_a_specialty",
        "specialties_assigned_to_a_student_group",
        "students_assigned_to_a_student_group",
        "subjects_subject_id",
        "specialties_specialty_id",
        "student_groups_student_group_id",
        "students_student_id",
        _childId,
        _studentId,
      )
    ) {
      return true;
    } else return false;
  } catch (error) {
    consoleLoggers.logError(
      `(__checkStudentAccessToSubject)General error while checking for student access to a subject, error message: "${error}".`,
    );
    return undefined;
  }
}

async function __checkStudentAccessToTask(_studentId, _childId) {
  try {
    consoleLoggers.logNeutral(
      `(__checkStudentAccessToTask)Checking for student access to a task...`,
    );

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");
    if (
      //task->student
      await entityManagement.checkAssigned1Fecta(
        connectionPool,
        true,
        "tasks_assigned_to_a_student_individually",
        "tasks_task_id",
        "students_student_id",
        _childId,
        _studentId,
      )
    ) {
      return true;
    } else if (
      //task->subject->student
      await entityManagement.checkAssigned2Fecta(
        connectionPool,
        true,
        "tasks_assigned_to_a_subject",
        "subjects_assigned_to_a_student_individually",
        "tasks_task_id",
        "subjects_subject_id",
        "students_student_id",
        _childId,
        _studentId,
      )
    ) {
      return true;
    } else if (
      //task->subject->specialty->student
      await entityManagement.checkAssigned3Fecta(
        connectionPool,
        true,
        "tasks_assigned_to_a_subject",
        "subjects_assigned_to_a_specialty",
        "specialties_assigned_to_a_student_individually",
        "tasks_task_id",
        "subjects_subject_id",
        "specialties_specialty_id",
        "students_student_id",
        _childId,
        _studentId,
      )
    ) {
      return true;
    } else if (
      //task->subject->specialty->student_group->student
      await entityManagement.checkAssigned4Fecta(
        connectionPool,
        true,
        "tasks_assigned_to_a_subject",
        "subjects_assigned_to_a_specialty",
        "specialties_assigned_to_a_student_group",
        "students_assigned_to_a_student_group",
        "tasks_task_id",
        "subjects_subject_id",
        "specialties_specialty_id",
        "student_groups_student_group_id",
        "students_student_id",
        _childId,
        _studentId,
      )
    ) {
      return true;
    }
  } catch (error) {
    consoleLoggers.logError(
      `(__checkStudentAccessToTask)General error while checking for student access to a task, error message: "${error}".`,
    );
    return undefined;
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

    if ("student" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not student (current user type: ${req.user.type})`,
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

    if ("student" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not student (current user type: ${req.user.type})`,
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

async function _checkExistsTwoKeyEntity(
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
      `(_checkExistsTwoKeyEntity)Got a two-key entity check_exists request, processing...`,
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

    const checkResult = await entityManagement.checkExistsTwoKeyEntity(
      connectionPool,
      true,
      entityTableName,
      entityKeyOneColumnName,
      entityKeyTwoColumnName,
      _entityKeyOne,
      _entityKeyTwo,
    );
    if (!checkResult)
      throw new Error(
        "Could not check if an entity with the specified IDs exists!",
      );

    res.json({
      exists_flag: checkResult.exists_flag,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_checkExistsTwoKeyEntity)General error while processing a two-key entity check_exists request, error message: "${error}".`,
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

    if ("student" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not student (current user type: ${req.user.type})`,
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

async function _updateSolutionLink(
  req,
  res,
  entityTableName,
  entityKeyOneColumnName,
  entityKeyTwoColumnName,
  _entityKeyOne,
  _entityKeyTwo,
  _newValue,
) {
  try {
    consoleLoggers.logNeutral(
      `(_updateSolutionLink)Got a solution link update request, processing...`,
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

    const entity = await entityManagement.getTwoKeyEntity(
      connectionPool,
      true,
      entityTableName,
      entityKeyOneColumnName,
      entityKeyTwoColumnName,
      _entityKeyOne,
      _entityKeyTwo,
    );
    if (!entity)
      throw new Error("Could not find user account with specified ID!");

    entity.internet_file_link = _newValue;
    const updateResult = await entityManagement.updateSolution(
      connectionPool,
      true,
      entityTableName,
      entityKeyOneColumnName,
      entityKeyTwoColumnName,
      _entityKeyOne,
      _entityKeyTwo,
      entity,
    );
    if (!updateResult)
      throw new Error(
        "Failed to update the solution with the newly specified information!",
      );

    res.status(200).json({ message: "Successfully changed solution link" });
  } catch (error) {
    consoleLoggers.logError(
      `(_updateSolutionLink)General error while processing a solution link update request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _updateSolutionStComm(
  req,
  res,
  entityTableName,
  entityKeyOneColumnName,
  entityKeyTwoColumnName,
  _entityKeyOne,
  _entityKeyTwo,
  _newValue,
) {
  try {
    consoleLoggers.logNeutral(
      `(_updateSolutionStComm)Got a solution student commentary update request, processing...`,
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

    const entity = await entityManagement.getTwoKeyEntity(
      connectionPool,
      true,
      entityTableName,
      entityKeyOneColumnName,
      entityKeyTwoColumnName,
      _entityKeyOne,
      _entityKeyTwo,
    );
    if (!entity)
      throw new Error("Could not find user account with specified ID!");

    entity.student_commentary = _newValue;
    const updateResult = await entityManagement.updateSolution(
      connectionPool,
      true,
      entityTableName,
      entityKeyOneColumnName,
      entityKeyTwoColumnName,
      _entityKeyOne,
      _entityKeyTwo,
      entity,
    );
    if (!updateResult)
      throw new Error(
        "Failed to update the solution with the newly specified information!",
      );

    res.status(200).json({ message: "Successfully changed solution mark" });
  } catch (error) {
    consoleLoggers.logError(
      `(_updateSolutionStComm)General error while processing a solution student commentary update request, error message: "${error}".`,
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

    if ("student" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not student (current user type: ${req.user.type})`,
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

async function _getAllStudentSubjectMarkedSolutions(
  req,
  res,
  _subjectId,
  _studentId,
) {
  try {
    consoleLoggers.logNeutral(
      `(_getAllStudentSubjectMarkedSolutions)Got an all student-subject marked solutions request, processing...`,
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

    const result = await entityManagement.getAllStudentSubjectMarkedSolutions(
      connectionPool,
      true,
      _subjectId,
      _studentId,
    );
    if (!result) throw new Error("Failed to get all subject marked solutions!");

    res.json({
      result: result,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_getAllStudentSubjectMarkedSolutions)General error while processing an all student-subject marked solutions request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _getAllStudentSubjectUnmarkedSolutions(
  req,
  res,
  _subjectId,
  _studentId,
) {
  try {
    consoleLoggers.logNeutral(
      `(_getAllStudentSubjectUnmarkedSolutions)Got an all student-subject unmarked solutions request, processing...`,
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

    const result = await entityManagement.getAllStudentSubjectUnmarkedSolutions(
      connectionPool,
      true,
      _subjectId,
      _studentId,
    );
    if (!result) throw new Error("Failed to get all subject marked solutions!");

    res.json({
      result: result,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_getAllStudentSubjectUnmarkedSolutions)General error while processing an all student-subject unmarked solutions request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _getAllStudentMarkedSolutions(req, res, _studentId) {
  try {
    consoleLoggers.logNeutral(
      `(_getAllStudentMarkedSolutions)Got an all student marked solutions request, processing...`,
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

    const result = await accountManagement.getAllStudentMarkedSolutions(
      connectionPool,
      true,
      _studentId,
    );
    if (!result) throw new Error("Failed to get all student marked solutions!");

    res.json({
      result: result,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_getAllStudentMarkedSolutions)General error while processing an all student marked solutions request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _getAllStudentUnmarkedSolutions(req, res, _studentId) {
  try {
    consoleLoggers.logNeutral(
      `(_getAllStudentUnmarkedSolutions)Got an all student unmarked solutions request, processing...`,
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

    const result = await accountManagement.getAllStudentUnmarkedSolutions(
      connectionPool,
      true,
      _studentId,
    );
    if (!result)
      throw new Error("Failed to get all student unmarked solutions!");

    res.json({
      result: result,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_getAllStudentUnmarkedSolutions)General error while processing an all student unmarked solutions request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

//routes

//2add routes for student

_studentRouter.post("/add/solution", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_studentRouter:/add/solution)Got a solution addition request, processing...`,
    );

    let { tasks_task_id, internet_file_link, student_commentary } = req.body;

    if (!tasks_task_id)
      throw new Error("No tasks_task_id parameter in the received JSON.");
    if (!internet_file_link)
      throw new Error("No internet_file_link parameter in the received JSON.");
    if (!student_commentary || student_commentary === "null")
      student_commentary = null;

    if (!__checkStudentAccessToTask(req.user.id, Number(tasks_task_id))) {
      return res
        .status(401)
        .json({ message: "No access to the specified task" });
    }

    return await _addNewSolution(
      req,
      res,
      "done_tasks_status",
      Number(tasks_task_id),
      req.user.id,
      internet_file_link,
      null,
      student_commentary,
      null,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_studentRouter:/add/solution)General error while processing a solution addition request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//3getinfo routes for student

_studentRouter.post("/getinfo/studentgroup", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_studentRouter:/getinfo/studentgroup)Got a studentgroup student_getinfo request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!__checkStudentAccessToStudentGroup(req.user.id, Number(id))) {
      return res
        .status(401)
        .json({ message: "No access to the specified studentgroup" });
    }

    return await _getEntityInfo(
      req,
      res,
      "student_groups",
      "student_group_id",
      Number(id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_studentRouter:/getinfo/studentgroup)General error while processing a studentgroup student_getinfo request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_studentRouter.post("/getinfo/specialty", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_studentRouter:/getinfo/specialty)Got a specialty student_getinfo request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!__checkStudentAccessToSpecialty(req.user.id, Number(id))) {
      return res
        .status(401)
        .json({ message: "No access to the specified specialty" });
    }

    return await _getEntityInfo(
      req,
      res,
      "specialties",
      "specialty_id",
      Number(id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_studentRouter:/getinfo/specialty)General error while processing a specialty student_getinfo request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_studentRouter.post("/getinfo/subject", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_studentRouter:/getinfo/subject)Got a subject student_getinfo request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!__checkStudentAccessToSubject(req.user.id, Number(id))) {
      return res
        .status(401)
        .json({ message: "No access to the specified subject" });
    }

    return await _getEntityInfo(req, res, "subjects", "subject_id", Number(id));
  } catch (error) {
    consoleLoggers.logError(
      `(_studentRouter:/getinfo/subject)General error while processing a subject student_getinfo request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_studentRouter.post("/getinfo/task", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_studentRouter:/getinfo/task)Got a task student_getinfo request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!__checkStudentAccessToTask(req.user.id, Number(id))) {
      return res
        .status(401)
        .json({ message: "No access to the specified task" });
    }

    return await _getEntityInfo(req, res, "tasks", "task_id", Number(id));
  } catch (error) {
    consoleLoggers.logError(
      `(_studentRouter:/getinfo/task)General error while processing a task student_getinfo request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_studentRouter.post("/getinfo/solution", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_studentRouter:/getinfo/solution)Got a solution student_getinfo request, processing...`,
    );

    const { taskId } = req.body;

    if (!taskId) throw new Error("No taskId parameter in the received JSON.");

    if (!__checkStudentAccessToTask(req.user.id, Number(taskId))) {
      return res
        .status(401)
        .json({ message: "No access to the specified task" });
    }

    return await _getTwoKeyEntityInfo(
      req,
      res,
      "done_tasks_status",
      "tasks_task_id",
      "students_student_id",
      Number(taskId),
      req.user.id,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_studentRouter:/getinfo/solution)General error while processing a solution student_getinfo request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5update routes for student

//5.1solution link update route for student
_studentRouter.post("/update/solution/link", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_studentRouter:/update/solution/link)Got a solution student_update link request, processing...`,
    );

    const { taskId, newValue } = req.body;

    if (!taskId) throw new Error("No taskId parameter in the received JSON.");
    if (!newValue)
      throw new Error("No newValue parameter in the received JSON.");

    if (!__checkStudentAccessToTask(req.user.id, Number(taskId))) {
      return res
        .status(401)
        .json({ message: "No access to the specified task" });
    }

    return await _updateSolutionLink(
      req,
      res,
      "done_tasks_status",
      "tasks_task_id",
      "students_student_id",
      Number(taskId),
      req.user.id,
      newValue,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_studentRouter:/update/solution/link)General error while processing a solution student_update link request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_studentRouter.post("/update/solution/stcomm", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_studentRouter:/update/solution/stcomm)Got a solution student_update student commentary request, processing...`,
    );

    const { taskId, newValue } = req.body;

    if (!taskId) throw new Error("No taskId parameter in the received JSON.");
    if (!newValue)
      throw new Error("No newValue parameter in the received JSON.");

    if (!__checkStudentAccessToTask(req.user.id, Number(taskId))) {
      return res
        .status(401)
        .json({ message: "No access to the specified task" });
    }

    return await _updateSolutionStComm(
      req,
      res,
      "done_tasks_status",
      "tasks_task_id",
      "students_student_id",
      Number(taskId),
      req.user.id,
      newValue,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_studentRouter:/update/solution/stcomm)General error while processing a solution student_update student commentary request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

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

//6.5specialties assigned to a student group route for student
_studentRouter.post(
  "/getall/studentgroup/assigned/specialties",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_studentRouter/getall/studentgroup/assigned/specialties)Got a studentgroup student_getall assigned specialties request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      if (!__checkStudentAccessToStudentGroup(req.user.id, Number(id))) {
        return res
          .status(401)
          .json({ message: "No access to the specified studentgroup" });
      }

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
        `(_studentRouter/getall/studentgroup/assigned/specialties)General error while processing a studentgroup student_getall assigned specialties request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//6.6subjects assigned to a specialty route for student
_studentRouter.post("/getall/specialty/assigned/subjects", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_studentRouter/getall/specialty/assigned/subjects)Got a specialty student_getall assigned subjects request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!__checkStudentAccessToSpecialty(req.user.id, Number(id))) {
      return res
        .status(401)
        .json({ message: "No access to the specified specialty" });
    }

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
      `(_studentRouter/getall/specialty/assigned/subjects)General error while processing a specialty student_getall assigned subjects request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//6.10tasks assigned to a subject route for student
_studentRouter.post("/getall/subject/assigned/tasks", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_studentRouter/getall/subject/assigned/tasks)Got a subject student_getall assigned tasks request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!__checkStudentAccessToSubject(req.user.id, Number(id))) {
      return res
        .status(401)
        .json({ message: "No access to the specified subject" });
    }

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
      `(_studentRouter/getall/subject/assigned/tasks)General error while processing a subject student_getall assigned tasks request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//10solution routes for student

_studentRouter.post("/getall/subject/marked/solutions", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_studentRouter/getall/subject/marked/solutions)Got a subject student_getall marked solutions request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!__checkStudentAccessToSubject(req.user.id, Number(id))) {
      return res
        .status(401)
        .json({ message: "No access to the specified subject" });
    }

    return await _getAllStudentSubjectMarkedSolutions(
      req,
      res,
      Number(id),
      req.user.id,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_studentRouter/getall/subject/marked/solutions)General error while processing a subject student_getall marked solutions request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_studentRouter.post("/getall/subject/unmarked/solutions", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_studentRouter/getall/subject/unmarked/solutions)Got a subject student_getall unmarked solutions request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!__checkStudentAccessToSubject(req.user.id, Number(id))) {
      return res
        .status(401)
        .json({ message: "No access to the specified subject" });
    }

    return await _getAllStudentSubjectUnmarkedSolutions(
      req,
      res,
      Number(id),
      req.user.id,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_studentRouter/getall/subject/unmarked/solutions)General error while processing a subject student_getall unmarked solutions request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_studentRouter.post("/getall/marked/solutions", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_studentRouter/getall/student/marked/solutions)Got a student_getall own marked solutions request, processing...`,
    );

    return await _getAllStudentMarkedSolutions(req, res, req.user.id);
  } catch (error) {
    consoleLoggers.logError(
      `(_studentRouter/getall/student/marked/solutions)General error while processing a student_getall own marked solutions request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_studentRouter.post("/getall/unmarked/solutions", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_studentRouter/getall/student/unmarked/solutions)Got a student_getall own unmarked solutions request, processing...`,
    );

    return await _getAllStudentUnmarkedSolutions(req, res, req.user.id);
  } catch (error) {
    consoleLoggers.logError(
      `(_studentRouter/getall/student/unmarked/solutions)General error while processing a student_getall own unmarked solutions request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//11checkExists routes for student

_studentRouter.post("/checkexists/solution", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_studentRouter:/checkExists/solution)Got a solution student_checkexists request, processing...`,
    );

    const { taskId } = req.body;

    if (!taskId) throw new Error("No taskId parameter in the received JSON.");

    if (!__checkStudentAccessToTask(req.user.id, Number(taskId))) {
      return res
        .status(401)
        .json({ message: "No access to the specified task" });
    }

    return await _checkExistsTwoKeyEntity(
      req,
      res,
      "done_tasks_status",
      "tasks_task_id",
      "students_student_id",
      Number(taskId),
      req.user.id,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_studentRouter:/checkexists/solution)General error while processing a solution student_checkexists request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

export const studentRouter = _studentRouter;
