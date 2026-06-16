//imports
import { Router } from "express";

//imports->project
import * as mysqlManagement from "../startup/databases/mysql/mysqlManagement.js";
import * as accountManagement from "../startup/databases/mysql/accounts/accountManagement.js";
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
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
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
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
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

    if ("teacher" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
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

    if ("teacher" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
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

    if ("teacher" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
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

    if ("teacher" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
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

    if ("teacher" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
      });

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");

    const assignmentResult = await entityManagement.assignEntitiesToEntity(
      connectionPool,
      true,
      assignationTableName,
      assignationTable_childEntity_IdColumnName,
      assignationTable_parentEntity_IdColumnName,
      _childEntity_IdSelection,
      _parentEntity_Id,
    );
    if (!assignmentResult)
      throw new Error(
        "Failed to assign the specified entity-assigned entities!",
      );

    res.json({ result: assignmentResult });
  } catch (error) {
    consoleLoggers.logError(
      `(_assignEntitiesToEntity)General error while processing an entity assigned entities selection assignment request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function __checkTeacherAccessToStudent(_teacherId, _childId) {
  try {
    consoleLoggers.logNeutral(
      `(__checkTeacherAccessToStudent)Checking for teacher access to a student...`,
    );

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");
    if (
      //student->student_group->teacher
      await entityManagement.checkAssigned2Fecta(
        connectionPool,
        true,
        "students_assigned_to_a_student_group",
        "student_groups_assigned_to_a_teacher_for_supervision",
        "students_student_id",
        "student_groups_student_group_id",
        "teachers_teacher_id",
        _childId,
        _teacherId,
      )
    ) {
      return true;
    } else if (
      //student->specialty->teacher
      await entityManagement.checkAssigned2Fecta(
        connectionPool,
        true,
        "specialties_assigned_to_a_student_individually",
        "specialties_assigned_to_a_teacher_for_supervision",
        "students_student_id",
        "specialties_specialty_id",
        "teachers_teacher_id",
        _childId,
        _teacherId,
      )
    ) {
      return true;
    } else if (
      //student->specialty->student_group->teacher
      await entityManagement.checkAssigned3Fecta(
        connectionPool,
        true,
        "specialties_assigned_to_a_student_individually",
        "specialties_assigned_to_a_student_group",
        "student_groups_assigned_to_a_teacher_for_supervision",
        "students_student_id",
        "specialties_specialty_id",
        "student_groups_student_group_id",
        "teachers_teacher_id",
        _childId,
        _teacherId,
      )
    ) {
      return true;
    } else if (
      //student->subject->teacher
      await entityManagement.checkAssigned2Fecta(
        connectionPool,
        true,
        "subjects_assigned_to_a_student_individually",
        "subjects_assigned_to_a_teacher_for_supervision",
        "students_student_id",
        "subjects_subject_id",
        "teachers_teacher_id",
        _childId,
        _teacherId,
      )
    ) {
      return true;
    } else if (
      //student->subject->specialty->teacher
      await entityManagement.checkAssigned3Fecta(
        connectionPool,
        true,
        "subjects_assigned_to_a_student_individually",
        "subjects_assigned_to_a_specialty",
        "specialties_assigned_to_a_teacher_for_supervision",
        "students_student_id",
        "subjects_subject_id",
        "specialties_specialty_id",
        "teachers_teacher_id",
        _childId,
        _teacherId,
      )
    ) {
      return true;
    } else if (
      //student->subject->specialty->student_group->teacher
      await entityManagement.checkAssigned4Fecta(
        connectionPool,
        true,
        "subjects_assigned_to_a_student_individually",
        "subjects_assigned_to_a_specialty",
        "specialties_assigned_to_a_student_group",
        "student_groups_assigned_to_a_teacher_for_supervision",
        "students_student_id",
        "subjects_subject_id",
        "specialties_specialty_id",
        "student_groups_student_group_id",
        "teachers_teacher_id",
        _childId,
        _teacherId,
      )
    ) {
      return true;
    } else if (
      //student->task->teacher
      await entityManagement.checkAssigned2Fecta(
        connectionPool,
        true,
        "tasks_assigned_to_a_student_individually",
        "tasks_assigned_to_a_teacher_for_supervision",
        "students_student_id",
        "tasks_task_id",
        "teachers_teacher_id",
        _childId,
        _teacherId,
      )
    ) {
      return true;
    } else if (
      //student->task->subject->teacher
      await entityManagement.checkAssigned3Fecta(
        connectionPool,
        true,
        "tasks_assigned_to_a_student_individually",
        "tasks_assigned_to_a_subject",
        "subjects_assigned_to_a_teacher_for_supervision",
        "students_student_id",
        "tasks_task_id",
        "subjects_subject_id",
        "teachers_teacher_id",
        _childId,
        _teacherId,
      )
    ) {
      return true;
    } else if (
      //student->task->subject->specialty->teacher
      await entityManagement.checkAssigned4Fecta(
        connectionPool,
        true,
        "tasks_assigned_to_a_student_individually",
        "tasks_assigned_to_a_subject",
        "subjects_assigned_to_a_specialty",
        "specialties_assigned_to_a_teacher_for_supervision",
        "students_student_id",
        "tasks_task_id",
        "subjects_subject_id",
        "specialties_specialty_id",
        "teachers_teacher_id",
        _childId,
        _teacherId,
      )
    ) {
      return true;
    } else if (
      //student->task->subject->specialty->student_group->teacher
      await entityManagement.checkAssigned5Fecta(
        connectionPool,
        true,
        "tasks_assigned_to_a_student_individually",
        "tasks_assigned_to_a_subject",
        "subjects_assigned_to_a_specialty",
        "specialties_assigned_to_a_student_group",
        "student_groups_assigned_to_a_teacher_for_supervision",
        "students_student_id",
        "tasks_task_id",
        "subjects_subject_id",
        "specialties_specialty_id",
        "student_groups_student_group_id",
        "teachers_teacher_id",
        _childId,
        _teacherId,
      )
    ) {
      return true;
    } else return false;
  } catch (error) {
    consoleLoggers.logError(
      `(__checkTeacherAccessToStudent)General error while checking for teacher access to a student, error message: "${error}".`,
    );
    return undefined;
  }
}

async function __checkTeacherAccessToStudentGroup(_teacherId, _childId) {
  try {
    consoleLoggers.logNeutral(
      `(__checkTeacherAccessToStudentGroup)Checking for teacher access to a student group...`,
    );

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");
    if (
      //student_group->teacher
      await entityManagement.checkAssigned1Fecta(
        connectionPool,
        true,
        "student_groups_assigned_to_a_teacher_for_supervision",
        "student_groups_student_group_id",
        "teachers_teacher_id",
        _childId,
        _teacherId,
      )
    ) {
      return true;
    } else return false;
  } catch (error) {
    consoleLoggers.logError(
      `(__checkTeacherAccessToStudentGroup)General error while checking for teacher access to a student group, error message: "${error}".`,
    );
    return undefined;
  }
}

async function __checkTeacherAccessToSpecialty(_teacherId, _childId) {
  try {
    consoleLoggers.logNeutral(
      `(__checkTeacherAccessToSpecialty)Checking for teacher access to a specialty...`,
    );

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");
    if (
      //specialty->teacher
      await entityManagement.checkAssigned1Fecta(
        connectionPool,
        true,
        "specialties_assigned_to_a_teacher_for_supervision",
        "specialties_specialty_id",
        "teachers_teacher_id",
        _childId,
        _teacherId,
      )
    ) {
      return true;
    } else if (
      //specialty->student_group->teacher
      await entityManagement.checkAssigned2Fecta(
        connectionPool,
        true,
        "specialties_assigned_to_a_student_group",
        "student_groups_assigned_to_a_teacher_for_supervision",
        "specialties_specialty_id",
        "student_groups_student_group_id",
        "teachers_teacher_id",
        _childId,
        _teacherId,
      )
    ) {
      return true;
    } else return false;
  } catch (error) {
    consoleLoggers.logError(
      `(__checkTeacherAccessToSpecialty)General error while checking for teacher access to a specialty, error message: "${error}".`,
    );
    return undefined;
  }
}

async function __checkTeacherAccessToSubject(_teacherId, _childId) {
  try {
    consoleLoggers.logNeutral(
      `(__checkTeacherAccessToSubject)Checking for teacher access to a subject...`,
    );

    const connectionPool = await mysqlManagement.getConnectionPool(true);
    if (!connectionPool)
      throw new Error("Failed to access the connection pool!");
    if (
      //subject->teacher
      await entityManagement.checkAssigned1Fecta(
        connectionPool,
        true,
        "subjects_assigned_to_a_teacher_for_supervision",
        "subjects_subject_id",
        "teachers_teacher_id",
        _childId,
        _teacherId,
      )
    ) {
      return true;
    } else if (
      //subject->specialty->teacher
      await entityManagement.checkAssigned2Fecta(
        connectionPool,
        true,
        "subjects_assigned_to_a_specialty",
        "specialties_assigned_to_a_teacher_for_supervision",
        "subjects_subject_id",
        "specialties_specialty_id",
        "teachers_teacher_id",
        _childId,
        _teacherId,
      )
    ) {
      return true;
    } else if (
      //subject->specialty->student_group->teacher
      await entityManagement.checkAssigned3Fecta(
        connectionPool,
        true,
        "subjects_assigned_to_a_specialty",
        "specialties_assigned_to_a_student_group",
        "student_groups_assigned_to_a_teacher_for_supervision",
        "subjects_subject_id",
        "specialties_specialty_id",
        "student_groups_student_group_id",
        "teachers_teacher_id",
        _childId,
        _teacherId,
      )
    ) {
      return true;
    } else return false;
  } catch (error) {
    consoleLoggers.logError(
      `(__checkTeacherAccessToSubject)General error while checking for teacher access to a subject, error message: "${error}".`,
    );
    return undefined;
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

    if ("teacher" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
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

    if ("teacher" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
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

    if ("teacher" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
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

    if ("teacher" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
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

    if ("teacher" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
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

    if ("teacher" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
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

    if ("teacher" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
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

    if ("teacher" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
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

    if ("teacher" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
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

    if ("teacher" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
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

async function _getAllSubjectMarkedSolutions(req, res, _subjectId) {
  try {
    consoleLoggers.logNeutral(
      `(_getAllSubjectMarkedSolutions)Got an all subject marked solutions request, processing...`,
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

    const result = await entityManagement.getAllSubjectMarkedSolutions(
      connectionPool,
      true,
      _subjectId,
    );
    if (!result) throw new Error("Failed to get all subject marked solutions!");

    res.json({
      result: result,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_getAllSubjectMarkedSolutions)General error while processing an all subject marked solutions request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _getAllSubjectUnmarkedSolutions(req, res, _subjectId) {
  try {
    consoleLoggers.logNeutral(
      `(_getAllSubjectUnmarkedSolutions)Got an all subject unmarked solutions request, processing...`,
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

    const result = await entityManagement.getAllSubjectUnmarkedSolutions(
      connectionPool,
      true,
      _subjectId,
    );
    if (!result) throw new Error("Failed to get all subject marked solutions!");

    res.json({
      result: result,
    });
  } catch (error) {
    consoleLoggers.logError(
      `(_getAllSubjectUnmarkedSolutions)General error while processing an all subject unmarked solutions request, error message: "${error}".`,
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

    if ("teacher" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
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

    if ("teacher" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
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

    if ("teacher" !== req.user.type)
      return res.status(401).json({
        message: `Unauthorized: not teacher (current user type: ${req.user.type})`,
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

async function _updateSolutionMark(
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
      `(_updateSolutionMark)Got a solution mark update request, processing...`,
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

    entity.mark = _newValue;
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
      `(_updateSolutionMark)General error while processing a solution mark update request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
}

async function _updateSolutionTeComm(
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
      `(_updateSolutionTeComm)Got a solution teacher commentary update request, processing...`,
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

    entity.teacher_commentary = _newValue;
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
      `(_updateSolutionTeComm)General error while processing a solution teacher commentary update request, error message: "${error}".`,
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

//3getinfo routes for teacher

_teacherRouter.post("/getinfo/student", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter:/getinfo/student)Got a student teacher_getinfo request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!(await __checkTeacherAccessToStudent(req.user.id, Number(id)))) {
      return res
        .status(401)
        .json({ message: "No access to the specified student account" });
    }

    return await _getUserAccountInfo(
      req,
      res,
      "students",
      "student_id",
      Number(id),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_teacherRouter:/getinfo/student)General error while processing a student teacher_getinfo request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_teacherRouter.post("/getinfo/studentgroup", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter:/getinfo/studentgroup)Got a studentgroup teacher_getinfo request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!(await __checkTeacherAccessToStudentGroup(req.user.id, Number(id)))) {
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
      `(_teacherRouter:/getinfo/studentgroup)General error while processing a studentgroup teacher_getinfo request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_teacherRouter.post("/getinfo/specialty", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter:/getinfo/specialty)Got a specialty teacher_getinfo request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!(await __checkTeacherAccessToSpecialty(req.user.id, Number(id)))) {
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
      `(_teacherRouter:/getinfo/specialty)General error while processing a specialty teacher_getinfo request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_teacherRouter.post("/getinfo/subject", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter:/getinfo/subject)Got a subject teacher_getinfo request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!(await __checkTeacherAccessToSubject(req.user.id, Number(id)))) {
      return res
        .status(401)
        .json({ message: "No access to the specified subject" });
    }

    return await _getEntityInfo(req, res, "subjects", "subject_id", Number(id));
  } catch (error) {
    consoleLoggers.logError(
      `(_teacherRouter:/getinfo/subject)General error while processing a subject teacher_getinfo request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_teacherRouter.post("/getinfo/task", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter:/getinfo/task)Got a task teacher_getinfo request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    //intentionally no access check for teachers: they are supposed to
    //  have full access to all the tasks*/

    return await _getEntityInfo(req, res, "tasks", "task_id", Number(id));
  } catch (error) {
    consoleLoggers.logError(
      `(_teacherRouter:/getinfo/task)General error while processing a task teacher_getinfo request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_teacherRouter.post("/getinfo/solution", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter:/getinfo/solution)Got a solution teacher_getinfo request, processing...`,
    );

    const { taskId, studentId } = req.body;

    if (!taskId) throw new Error("No taskId parameter in the received JSON.");
    if (!studentId)
      throw new Error("No studentId parameter in the received JSON.");

    if (
      !(await __checkTeacherAccessToStudent(req.user.id, Number(studentId)))
    ) {
      return res
        .status(401)
        .json({ message: "No access to the specified student account" });
    }

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
      `(_teacherRouter:/getinfo/solution)General error while processing a solution teacher_getinfo request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//4delete routes for teacher

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

//5update routes for teacher

//5.1task name update route for teacher
_teacherRouter.post("/update/task/name", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter:/update/task/name)Got a task teacher_update name request, processing...`,
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
      `(_teacherRouter:/update/task/name)General error while processing a task teacher_update name request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.2task instructions update route for teacher
_teacherRouter.post("/update/task/instr", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter:/update/task/instr)Got a task teacher_update instructions request, processing...`,
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
      `(_teacherRouter:/update/task/instr)General error while processing a task teacher_update instructions request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.3task due date update route for teacher
_teacherRouter.post("/update/task/due", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter:/update/task/due)Got a task teacher_update due date request, processing...`,
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
      `(_teacherRouter:/update/task/due)General error while processing a task teacher_update due date request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.4task due date enforcement update route for teacher
_teacherRouter.post("/update/task/enforcedue", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter:/update/task/enforcedue)Got a task teacher_update due date enforcement request, processing...`,
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
      `(_teacherRouter:/update/task/enforcedue)General error while processing a task teacher_update due date enforcement request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.5solution mark update route for teacher
_teacherRouter.post("/update/solution/mark", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter:/update/solution/mark)Got a solution teacher_update mark request, processing...`,
    );

    const { taskId, studentId, newValue } = req.body;

    if (!taskId) throw new Error("No taskId parameter in the received JSON.");
    if (!studentId)
      throw new Error("No studentId parameter in the received JSON.");
    if (typeof newValue !== "number")
      throw new Error("No newValue parameter in the received JSON.");

    if (
      !(await __checkTeacherAccessToStudent(req.user.id, Number(studentId)))
    ) {
      return res
        .status(401)
        .json({ message: "No access to the specified student" });
    }

    return await _updateSolutionMark(
      req,
      res,
      "done_tasks_status",
      "tasks_task_id",
      "students_student_id",
      Number(taskId),
      Number(studentId),
      Number(newValue),
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_teacherRouter:/update/solution/mark)General error while processing a solution teacher_update mark request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//5.6solution teacher commentary update route for teacher
_teacherRouter.post("/update/solution/tecomm", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter:/update/solution/tecomm)Got a solution teacher_update teacher commentary request, processing...`,
    );

    const { taskId, studentId, newValue } = req.body;

    if (!taskId) throw new Error("No taskId parameter in the received JSON.");
    if (!studentId)
      throw new Error("No studentId parameter in the received JSON.");
    if (!newValue)
      throw new Error("No newValue parameter in the received JSON.");

    if (
      !(await __checkTeacherAccessToStudent(req.user.id, Number(studentId)))
    ) {
      return res
        .status(401)
        .json({ message: "No access to the specified student" });
    }

    return await _updateSolutionTeComm(
      req,
      res,
      "done_tasks_status",
      "tasks_task_id",
      "students_student_id",
      Number(taskId),
      Number(studentId),
      newValue,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_teacherRouter:/update/solution/tecomm)General error while processing a solution teacher_update teacher commentary request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//6assigned routes for teacher

//6.1student groups assigned to own account route for teacher
_teacherRouter.post("/getall/assigned/studentgroups", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/getall/assigned/studentgroups)Got a teacher_getall assigned student groups request, processing...`,
    );

    return await _getUserAccountAssignedEntities(
      req,
      res,
      "student_groups",
      "student_group_id",
      "student_groups_assigned_to_a_teacher_for_supervision",
      "student_groups_student_group_id",
      "teachers_teacher_id",
      req.user.id,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_teacherRouter/getall/assigned/studentgroups)General error while processing a teacher_getall assigned student groups request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//6.2specialties assigned to own account route for teacher
_teacherRouter.post("/getall/assigned/specialties", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/getall/assigned/specialties)Got a teacher_getall assigned specialties request, processing...`,
    );

    return await _getUserAccountAssignedEntities(
      req,
      res,
      "specialties",
      "specialty_id",
      "specialties_assigned_to_a_teacher_for_supervision",
      "specialties_specialty_id",
      "teachers_teacher_id",
      req.user.id,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_teacherRouter/getall/assigned/specialties)General error while processing a teacher_getall assigned specialties request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//6.3subjects assigned to own account route for teacher
_teacherRouter.post("/getall/assigned/subjects", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/getall/assigned/subjects)Got a teacher_getall assigned subjects request, processing...`,
    );

    return await _getUserAccountAssignedEntities(
      req,
      res,
      "subjects",
      "subject_id",
      "subjects_assigned_to_a_teacher_for_supervision",
      "subjects_subject_id",
      "teachers_teacher_id",
      req.user.id,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_teacherRouter/getall/assigned/subjects)General error while processing a teacher_getall assigned subjects request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//6.4tasks assigned to own account route for teacher
_teacherRouter.post("/getall/assigned/tasks", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/getall/assigned/tasks)Got a teacher_getall assigned tasks request, processing...`,
    );

    return await _getUserAccountAssignedEntities(
      req,
      res,
      "tasks",
      "task_id",
      "tasks_assigned_to_a_teacher_for_supervision",
      "tasks_task_id",
      "teachers_teacher_id",
      req.user.id,
    );
  } catch (error) {
    consoleLoggers.logError(
      `(_teacherRouter/getall/assigned/tasks)General error while processing a teacher_getall assigned tasks request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//6.5students assigned to a student group route for teacher
_teacherRouter.post(
  "/getall/studentgroup/assigned/students",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_teacherRouter/getall/studentgroup/assigned/students)Got a studentgroup teacher_getall assigned students request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      if (
        !(await __checkTeacherAccessToStudentGroup(req.user.id, Number(id)))
      ) {
        return res
          .status(401)
          .json({ message: "No access to the specified studentgroup" });
      }

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
        `(_teacherRouter/getall/studentgroup/assigned/students)General error while processing a studentgroup teacher_getall assigned students request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//6.6specialties assigned to a student group route for teacher
_teacherRouter.post(
  "/getall/studentgroup/assigned/specialties",
  async (req, res) => {
    try {
      consoleLoggers.logNeutral(
        `(_teacherRouter/getall/studentgroup/assigned/specialties)Got a studentgroup teacher_getall assigned specialties request, processing...`,
      );

      const { id } = req.body;

      if (!id) throw new Error("No id parameter in the received JSON.");

      if (
        !(await __checkTeacherAccessToStudentGroup(req.user.id, Number(id)))
      ) {
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
        `(_teacherRouter/getall/studentgroup/assigned/specialties)General error while processing a studentgroup teacher_getall assigned specialties request, error message: "${error}".`,
      );
      res.status(500).json({ message: "Server error" });
    }
  },
);

//6.7students assigned to a specialty route for teacher
_teacherRouter.post("/getall/specialty/assigned/students", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/getall/specialty/assigned/students)Got a specialty teacher_getall assigned students request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!(await __checkTeacherAccessToSpecialty(req.user.id, Number(id)))) {
      return res
        .status(401)
        .json({ message: "No access to the specified specialty" });
    }

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
      `(_teacherRouter/getall/specialty/assigned/students)General error while processing a specialty teacher_getall assigned students request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//6.8subjects assigned to a specialty route for teacher
_teacherRouter.post("/getall/specialty/assigned/subjects", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/getall/specialty/assigned/subjects)Got a specialty teacher_getall assigned subjects request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!(await __checkTeacherAccessToSpecialty(req.user.id, Number(id)))) {
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
      `(_teacherRouter/getall/specialty/assigned/subjects)General error while processing a specialty teacher_getall assigned subjects request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//6.9students assigned to a subject routes for teacher
_teacherRouter.post("/getall/subject/assigned/students", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/getall/subject/assigned/students)Got a subject teacher_getall assigned students request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!(await __checkTeacherAccessToSubject(req.user.id, Number(id)))) {
      return res
        .status(401)
        .json({ message: "No access to the specified subject" });
    }

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
      `(_teacherRouter/getall/subject/assigned/students)General error while processing a subject teacher_getall assigned students request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//6.10tasks assigned to a subject route for teacher
_teacherRouter.post("/getall/subject/assigned/tasks", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/getall/subject/assigned/tasks)Got a subject teacher_getall assigned tasks request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!(await __checkTeacherAccessToSubject(req.user.id, Number(id)))) {
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
      `(_teacherRouter/getall/subject/assigned/tasks)General error while processing a subject teacher_getall assigned tasks request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//6.11tasks assigned to a student route for teacher
_teacherRouter.post("/getall/student/assigned/tasks", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/getall/student/assigned/tasks)Got a student teacher_getall assigned tasks request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!(await __checkTeacherAccessToStudent(req.user.id, Number(id)))) {
      return res
        .status(401)
        .json({ message: "No access to the specified student" });
    }

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
      `(_adminRouter/getall/student/assigned/tasks)General error while processing a student teacher_getall assigned tasks request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//7unassignment routes for teacher

//7.1task unassignment from a student account route for teacher
_teacherRouter.post("/unassign/student/tasks", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/unassign/student/tasks)Got a student teacher_unassign tasks request, processing...`,
    );

    const { task_id_selection, account_id } = req.body;

    if (!task_id_selection)
      throw new Error("No task_id_selection parameter in the received JSON.");
    if (!account_id)
      throw new Error("No account_id parameter in the received JSON.");

    if (
      !(await __checkTeacherAccessToStudent(req.user.id, Number(account_id)))
    ) {
      return res
        .status(401)
        .json({ message: "No access to the specified student account" });
    }

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
      `(_teacherRouter/unassign/student/tasks)General error while processing a student teacher_unassign tasks request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//7.2task unassignment from a subject route for teacher
_teacherRouter.post("/unassign/subject/tasks", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/unassign/subject/tasks)Got a subject teacher_unassign tasks request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    if (
      !(await __checkTeacherAccessToSubject(req.user.id, Number(parent_id)))
    ) {
      return res
        .status(401)
        .json({ message: "No access to the specified subject" });
    }

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
      `(_teacherRouter/unassign/subject/tasks)General error while processing a subject teacher_unassign tasks request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//7.3student unassignment from a task route for teacher
_teacherRouter.post("/unassign/task/students", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/unassign/task/students)Got a task teacher_unassign students request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    child_id_selection.forEach(async (child_id) => {
      if (
        !(await __checkTeacherAccessToStudent(req.user.id, Number(child_id)))
      ) {
        return res.status(401).json({
          message: "No access to one or more of the specified students",
        });
      }
    });

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
      `(_teacherRouter/unassign/task/students)General error while processing a task teacher_unassign students request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//7.4subject unassignment from a task route for teacher
_teacherRouter.post("/unassign/task/subjects", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/unassign/task/subjects)Got a task teacher_unassign subjects request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    child_id_selection.forEach(async (child_id) => {
      if (
        !(await __checkTeacherAccessToSubject(req.user.id, Number(child_id)))
      ) {
        return res.status(401).json({
          message: "No access to one or more of the specified subjects",
        });
      }
    });

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
      `(_teacherRouter/unassign/task/subjects)General error while processing a task teacher_unassign subjects request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//8unassigned routes for teacher

//8.1tasks not assigned to a subject route for admin
_teacherRouter.post("/getall/subject/unassigned/tasks", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/getall/subject/unassigned/tasks)Got a subject teacher_getall unassigned tasks request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!(await __checkTeacherAccessToSubject(req.user.id, Number(id)))) {
      return res
        .status(401)
        .json({ message: "No access to the specified subject" });
    }

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
      `(_teacherRouter/getall/subject/unassigned/tasks)General error while processing a subject teacher_getall unassigned tasks request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//8.2tasks not assigned to a student route for teacher
_teacherRouter.post("/getall/student/unassigned/tasks", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_adminRouter/getall/student/unassigned/tasks)Got a student teacher_getall unassigned tasks request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!(await __checkTeacherAccessToStudent(req.user.id, Number(id)))) {
      return res
        .status(401)
        .json({ message: "No access to the specified student" });
    }

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
      `(_adminRouter/getall/student/unassigned/tasks)General error while processing a student teacher_getall unassigned tasks request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//9assignment routes for teacher

//9.1task assignment to a student account route for teacher
_teacherRouter.post("/assign/student/tasks", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/assign/student/tasks)Got a student teacher_assign tasks request, processing...`,
    );

    const { task_id_selection, account_id } = req.body;

    if (!task_id_selection)
      throw new Error("No task_id_selection parameter in the received JSON.");
    if (!account_id)
      throw new Error("No account_id parameter in the received JSON.");

    if (
      !(await __checkTeacherAccessToStudent(req.user.id, Number(account_id)))
    ) {
      return res
        .status(401)
        .json({ message: "No access to the specified student account" });
    }

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
      `(_teacherRouter/assign/student/tasks)General error while processing a student teacher_assign tasks request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//9.2task assignment to a subject route for teacher
_teacherRouter.post("/assign/subject/tasks", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/assign/subject/tasks)Got a subject teacher_assign tasks request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    if (
      !(await __checkTeacherAccessToSubject(req.user.id, Number(parent_id)))
    ) {
      return res
        .status(401)
        .json({ message: "No access to the specified subject" });
    }

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
      `(_teacherRouter/assign/subject/tasks)General error while processing a subject teacher_assign tasks request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//9.3student assignment to a task route for teacher
_teacherRouter.post("/assign/task/students", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/assign/task/students)Got a task teacher_assign students request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    child_id_selection.forEach(async (child_id) => {
      if (
        !(await __checkTeacherAccessToStudent(req.user.id, Number(child_id)))
      ) {
        return res.status(401).json({
          message: "No access to one or more of the specified students",
        });
      }
    });

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
      `(_teacherRouter/assign/task/students)General error while processing a task teacher_assign students request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//9.4subject assignment to a task route for teacher
_teacherRouter.post("/assign/task/subjects", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/assign/task/subjects)Got a task teacher_assign subjects request, processing...`,
    );

    const { child_id_selection, parent_id } = req.body;

    if (!child_id_selection)
      throw new Error("No child_id_selection parameter in the received JSON.");
    if (!parent_id)
      throw new Error("No parent_id parameter in the received JSON.");

    child_id_selection.forEach(async (child_id) => {
      if (
        !(await __checkTeacherAccessToSubject(req.user.id, Number(child_id)))
      ) {
        return res.status(401).json({
          message: "No access to one or more of the specified subjects",
        });
      }
    });

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
      `(_teacherRouter/assign/task/subjects)General error while processing a task teacher_assign subjects request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

//10solution routes for teacher

_teacherRouter.post("/getall/subject/marked/solutions", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/getall/subject/marked/solutions)Got a subject teacher_getall marked solutions request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!(await __checkTeacherAccessToSubject(req.user.id, Number(id)))) {
      return res
        .status(401)
        .json({ message: "No access to the specified subject" });
    }

    return await _getAllSubjectMarkedSolutions(req, res, Number(id));
  } catch (error) {
    consoleLoggers.logError(
      `(_teacherRouter/getall/subject/marked/solutions)General error while processing a subject teacher_getall marked solutions request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_teacherRouter.post("/getall/subject/unmarked/solutions", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/getall/subject/unmarked/solutions)Got a subject teacher_getall unmarked solutions request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!(await __checkTeacherAccessToSubject(req.user.id, Number(id)))) {
      return res
        .status(401)
        .json({ message: "No access to the specified subject" });
    }

    return await _getAllSubjectUnmarkedSolutions(req, res, Number(id));
  } catch (error) {
    consoleLoggers.logError(
      `(_teacherRouter/getall/subject/unmarked/solutions)General error while processing a subject teacher_getall unmarked solutions request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_teacherRouter.post("/getall/student/marked/solutions", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/getall/student/marked/solutions)Got a student teacher_getall marked solutions request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!(await __checkTeacherAccessToStudent(req.user.id, Number(id)))) {
      return res
        .status(401)
        .json({ message: "No access to the specified student" });
    }

    return await _getAllStudentMarkedSolutions(req, res, Number(id));
  } catch (error) {
    consoleLoggers.logError(
      `(_teacherRouter/getall/student/marked/solutions)General error while processing a student teacher_getall marked solutions request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

_teacherRouter.post("/getall/student/unmarked/solutions", async (req, res) => {
  try {
    consoleLoggers.logNeutral(
      `(_teacherRouter/getall/student/unmarked/solutions)Got a student teacher_getall unmarked solutions request, processing...`,
    );

    const { id } = req.body;

    if (!id) throw new Error("No id parameter in the received JSON.");

    if (!(await __checkTeacherAccessToStudent(req.user.id, Number(id)))) {
      return res
        .status(401)
        .json({ message: "No access to the specified student" });
    }

    return await _getAllStudentUnmarkedSolutions(req, res, Number(id));
  } catch (error) {
    consoleLoggers.logError(
      `(_teacherRouter/getall/student/unmarked/solutions)General error while processing a student teacher_getall unmarked solutions request, error message: "${error}".`,
    );
    res.status(500).json({ message: "Server error" });
  }
});

export const teacherRouter = _teacherRouter;
