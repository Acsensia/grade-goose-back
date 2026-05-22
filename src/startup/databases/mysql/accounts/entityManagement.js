//imports

//imports->project
import * as consoleLoggers from "../../../console/consoleLoggers.js";

//functions are supposed to work with mysql2/promise connections

// NON EXPORTED (UTILITY) FUNCTIONS //

// EXPORTED FUNCTIONS //

// select all functions

export async function getAllEntities(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  entityTableName,
  entityIdColumnName,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "getAllEntities",
      );
      return false;
    }
  }
  if (typeof entityTableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityTableName",
      "string",
      entityTableName,
      "getAllEntities",
    );
    return false;
  }
  if (typeof entityIdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityIdColumnName",
      "string",
      entityIdColumnName,
      "getAllEntities",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(getAllEntities)Trying to get all the entities from the "${entityTableName}"...`,
      );

    let sql = `
    SELECT t.*, t.${entityIdColumnName} AS id
    FROM \`${entityTableName}\` t
    `;
    const [results] = await databaseConnectionPool.execute(sql);
    if (results !== undefined) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(getAllEntities)Successfully got all the entities from the "${entityTableName}"!`,
        );
      return results;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(getAllEntities)Failed to get all the entities from the "${entityTableName}"!
          Query: "${sql}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(getAllEntities)Generally failed to get all the entities from the "${entityTableName}"!
        Error message: "${error}".`,
      );
    return false;
  }
}

export async function getAllSubjectMarkedSolutions(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  _subjectId,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "getAllSubjectMarkedSolutions",
      );
      return false;
    }
  }
  if (typeof _subjectId !== "number") {
    consoleLoggers.logParameterTypeError(
      "_subjectId",
      "number",
      _subjectId,
      "getAllSubjectMarkedSolutions",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(getAllSubjectMarkedSolutions)Trying to get all the marked solutions for the subject with id "${_subjectId}"...`,
      );

    let sql = `
    SELECT dt.*, dt.tasks_task_id AS id
    FROM \`done_tasks_status\` dt
    JOIN \`tasks_assigned_to_a_subject\` ta
      ON ta.tasks_task_id = dt.tasks_task_id
    WHERE ta.subjects_subject_id = ${_subjectId}
      AND dt.mark IS NOT NULL
    `;
    const [results] = await databaseConnectionPool.execute(sql);
    if (results !== undefined) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(getAllSubjectMarkedSolutions)Successfully got all the marked solutions for the subject with id "${_subjectId}"!`,
        );
      return results;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(getAllSubjectMarkedSolutions)Failed to get all the marked solutions for the subject with id "${_subjectId}"!
          Query: "${sql}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(getAllSubjectMarkedSolutions)Generally failed to get all the marked solutions for the subject with id "${_subjectId}"!
        Error message: "${error}".`,
      );
    return false;
  }
}

export async function getAllSubjectUnmarkedSolutions(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  _subjectId,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "getAllSubjectUnmarkedSolutions",
      );
      return false;
    }
  }
  if (typeof _subjectId !== "number") {
    consoleLoggers.logParameterTypeError(
      "_subjectId",
      "number",
      _subjectId,
      "getAllSubjectUnmarkedSolutions",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(getAllSubjectUnmarkedSolutions)Trying to get all the unmarked solutions for the subject with id "${_subjectId}"...`,
      );

    let sql = `
    SELECT dt.*, dt.tasks_task_id AS id
    FROM \`done_tasks_status\` dt
    JOIN \`tasks_assigned_to_a_subject\` ta
      ON ta.tasks_task_id = dt.tasks_task_id
    WHERE ta.subjects_subject_id = ${_subjectId}
      AND dt.mark IS NULL
    `;
    const [results] = await databaseConnectionPool.execute(sql);
    if (results !== undefined) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(getAllSubjectUnmarkedSolutions)Successfully got all the unmarked solutions for the subject with id "${_subjectId}"!`,
        );
      return results;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(getAllSubjectUnmarkedSolutions)Failed to get all the unmarked solutions for the subject with id "${_subjectId}"!
          Query: "${sql}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(getAllSubjectUnmarkedSolutions)Generally failed to get all the unmarked solutions for the subject with id "${_subjectId}"!
        Error message: "${error}".`,
      );
    return false;
  }
}

export async function getAllStudentSubjectMarkedSolutions(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  _subjectId,
  _studentId,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "getAllStudentSubjectMarkedSolutions",
      );
      return false;
    }
  }
  if (typeof _subjectId !== "number") {
    consoleLoggers.logParameterTypeError(
      "_subjectId",
      "number",
      _subjectId,
      "getAllStudentSubjectMarkedSolutions",
    );
    return false;
  }
  if (typeof _studentId !== "number") {
    consoleLoggers.logParameterTypeError(
      "_studentId",
      "number",
      _studentId,
      "getAllStudentSubjectMarkedSolutions",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(getAllStudentSubjectMarkedSolutions)Trying to get all the marked solutions for the subject with id "${_subjectId}" for the student with id "${_studentId}"...`,
      );

    let sql = `
    SELECT dt.*, dt.tasks_task_id AS id
    FROM \`done_tasks_status\` dt
    JOIN \`tasks_assigned_to_a_subject\` ta
      ON ta.tasks_task_id = dt.tasks_task_id
    WHERE ta.subjects_subject_id = ${_subjectId}
      AND dt.students_student_id = ${_studentId}
      AND dt.mark IS NOT NULL
    `;
    const [results] = await databaseConnectionPool.execute(sql);
    if (results !== undefined) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(getAllStudentSubjectMarkedSolutions)Successfully got all the marked solutions for the subject with id "${_subjectId} for the student with id "${_studentId}""!`,
        );
      return results;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(getAllStudentSubjectMarkedSolutions)Failed to get all the marked solutions for the subject with id "${_subjectId} for the student with id "${_studentId}""!
          Query: "${sql}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(getAllStudentSubjectMarkedSolutions)Generally failed to get all the marked solutions for the subject with id "${_subjectId} for the student with id "${_studentId}""!
        Error message: "${error}".`,
      );
    return false;
  }
}

export async function getAllStudentSubjectUnmarkedSolutions(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  _subjectId,
  _studentId,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "getAllStudentSubjectUnmarkedSolutions",
      );
      return false;
    }
  }
  if (typeof _subjectId !== "number") {
    consoleLoggers.logParameterTypeError(
      "_subjectId",
      "number",
      _subjectId,
      "getAllStudentSubjectUnmarkedSolutions",
    );
    return false;
  }
  if (typeof _studentId !== "number") {
    consoleLoggers.logParameterTypeError(
      "_studentId",
      "number",
      _studentId,
      "getAllStudentSubjectUnmarkedSolutions",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(getAllStudentSubjectUnmarkedSolutions)Trying to get all the unmarked solutions for the subject with id "${_subjectId}" for the student with id "${_studentId}"...`,
      );

    let sql = `
    SELECT dt.*, dt.tasks_task_id AS id
    FROM \`done_tasks_status\` dt
    JOIN \`tasks_assigned_to_a_subject\` ta
      ON ta.tasks_task_id = dt.tasks_task_id
    WHERE ta.subjects_subject_id = ${_subjectId}
      AND dt.students_student_id = ${_studentId}
      AND dt.mark IS NULL
    `;
    const [results] = await databaseConnectionPool.execute(sql);
    if (results !== undefined) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(getAllStudentSubjectUnmarkedSolutions)Successfully got all the unmarked solutions for the subject with id "${_subjectId} for the student with id "${_studentId}""!`,
        );
      return results;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(getAllStudentSubjectUnmarkedSolutions)Failed to get all the unmarked solutions for the subject with id "${_subjectId} for the student with id "${_studentId}""!
          Query: "${sql}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(getAllStudentSubjectUnmarkedSolutions)Generally failed to get all the unmarked solutions for the subject with id "${_subjectId} for the student with id "${_studentId}""!
        Error message: "${error}".`,
      );
    return false;
  }
}

// export async function getAllStudentDoneTasks(
//   databaseConnectionPool,
//   areMessagesToBeDisplayed,
//   _studentId,
// ) {
//   if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
//   else {
//     if (typeof areMessagesToBeDisplayed !== "boolean") {
//       consoleLoggers.logParameterTypeError(
//         "areMessagesToBeDisplayed",
//         "boolean",
//         areMessagesToBeDisplayed,
//         "getAllStudentDoneTasks",
//       );
//       return false;
//     }
//   }
//   if (typeof _studentId !== "number") {
//     consoleLoggers.logParameterTypeError(
//       "_studentId",
//       "number",
//       _studentId,
//       "getAllStudentDoneTasks",
//     );
//     return false;
//   }

//   try {
//     if (areMessagesToBeDisplayed)
//       consoleLoggers.logNeutral(
//         `(getAllStudentDoneTasks)Trying to get all the done tasks for the student with id "${_studentId}"...`,
//       );
//     let sql = `
//     SELECT t.*, t.task_id AS id
//     FROM \`tasks\` t
//     JOIN \`done_tasks_status\` dt
//       ON t.task_id = dt.tasks_task_id
//     WHERE dt.students_student_id = ${_studentId}
//     `;
//     const [results] = await databaseConnectionPool.execute(sql);
//     if (results !== undefined) {
//       if (areMessagesToBeDisplayed)
//         consoleLoggers.logSuccess(
//           `(getAllStudentDoneTasks)Successfully got all the done tasks for the student with id "${_studentId}""!`,
//         );
//       return results;
//     } else {
//       if (areMessagesToBeDisplayed)
//         consoleLoggers.logError(
//           `(getAllStudentDoneTasks)Failed to get all the done tasks for the student with id "${_studentId}""!
//           Query: "${sql}"
//           Search results: "${results}"`,
//         );
//       return false;
//     }
//   } catch (error) {
//     if (areMessagesToBeDisplayed)
//       consoleLoggers.logError(
//         `(getAllStudentDoneTasks)Generally failed to get all the done tasks for the student with id "${_studentId}""!
//         Error message: "${error}".`,
//       );
//     return false;
//   }
// }

// export async function getAllStudentUndoneTasks(
//   databaseConnectionPool,
//   areMessagesToBeDisplayed,
//   _studentId,
// ) {
//   if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
//   else {
//     if (typeof areMessagesToBeDisplayed !== "boolean") {
//       consoleLoggers.logParameterTypeError(
//         "areMessagesToBeDisplayed",
//         "boolean",
//         areMessagesToBeDisplayed,
//         "getAllStudentUndoneTasks",
//       );
//       return false;
//     }
//   }
//   if (typeof _studentId !== "number") {
//     consoleLoggers.logParameterTypeError(
//       "_studentId",
//       "number",
//       _studentId,
//       "getAllStudentUndoneTasks",
//     );
//     return false;
//   }

//   try {
//     if (areMessagesToBeDisplayed)
//       consoleLoggers.logNeutral(
//         `(getAllStudentUndoneTasks)Trying to get all the not done tasks for the student with id "${_studentId}"...`,
//       );
//     let sql = `
//     SELECT t.*, t.task_id AS id
//     FROM \`tasks\` t
//     LEFT JOIN \`done_tasks_status\` d
//       ON t.task_id = d.tasks_task_id
//       AND d.students_student_id = ${_studentId}
//     WHERE d.students_student_id IS NULL;
//     `;
//     const [results] = await databaseConnectionPool.execute(sql);
//     if (results !== undefined) {
//       if (areMessagesToBeDisplayed)
//         consoleLoggers.logSuccess(
//           `(getAllStudentUndoneTasks)Successfully got all the not done tasks for the student with id "${_studentId}""!`,
//         );
//       return results;
//     } else {
//       if (areMessagesToBeDisplayed)
//         consoleLoggers.logError(
//           `(getAllStudentUndoneTasks)Failed to get all the not done tasks for the student with id "${_studentId}""!
//           Query: "${sql}"
//           Search results: "${results}"`,
//         );
//       return false;
//     }
//   } catch (error) {
//     if (areMessagesToBeDisplayed)
//       consoleLoggers.logError(
//         `(getAllStudentUndoneTasks)Generally failed to get all the not done tasks for the student with id "${_studentId}""!
//         Error message: "${error}".`,
//       );
//     return false;
//   }
// }

export async function getAllStudentSubjectDoneTasks(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  _studentId,
  _subjectId,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "getAllStudentSubjectDoneTasks",
      );
      return false;
    }
  }
  if (typeof _studentId !== "number") {
    consoleLoggers.logParameterTypeError(
      "_studentId",
      "number",
      _studentId,
      "getAllStudentSubjectDoneTasks",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(getAllStudentSubjectDoneTasks)Trying to get all the done tasks for the student with id "${_studentId}" and for the subject with id "${_subjectId}"...`,
      );
    let sql = `
    SELECT t.*, t.task_id AS id
    FROM \`tasks\` t
    JOIN \`tasks_assigned_to_a_subject\` ta
      ON t.task_id = ta.tasks_task_id
    JOIN \`done_tasks_status\` d
      ON t.task_id = d.tasks_task_id
    WHERE ta.subjects_subject_id = ${_subjectId}
      AND d.students_student_id = ${_studentId}
    `;
    const [results] = await databaseConnectionPool.execute(sql);
    if (results !== undefined) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(getAllStudentSubjectDoneTasks)Successfully got all the done tasks for the student with id "${_studentId}" and for the subject with id "${_subjectId}"!`,
        );
      return results;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(getAllStudentSubjectDoneTasks)Failed to get all the done tasks for the student with id "${_studentId}" and for the subject with id "${_subjectId}"!
          Query: "${sql}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(getAllStudentSubjectDoneTasks)Generally failed to get all the done tasks for the student with id "${_studentId}" and for the subject with id "${_subjectId}"!
        Error message: "${error}".`,
      );
    return false;
  }
}

export async function getAllStudentSubjectUndoneTasks(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  _studentId,
  _subjectId,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "getAllStudentSubjectUndoneTasks",
      );
      return false;
    }
  }
  if (typeof _studentId !== "number") {
    consoleLoggers.logParameterTypeError(
      "_studentId",
      "number",
      _studentId,
      "getAllStudentSubjectUndoneTasks",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(getAllStudentSubjectUndoneTasks)Trying to get all the not done tasks for the student with id "${_studentId}" and for the subject with id "${_subjectId}"...`,
      );
    let sql = `
    SELECT t.*, t.task_id AS id
    FROM \`tasks\` t
    JOIN \`tasks_assigned_to_a_subject\` ta
      ON t.task_id = ta.tasks_task_id
    LEFT JOIN \`done_tasks_status\` d
      ON t.task_id = d.tasks_task_id
      AND d.students_student_id = ${_studentId}
    WHERE ta.subjects_subject_id = ${_subjectId}
      AND d.students_student_id IS NULL;
    `;
    const [results] = await databaseConnectionPool.execute(sql);
    if (results !== undefined) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(getAllStudentSubjectUndoneTasks)Successfully got all the not done tasks for the student with id "${_studentId}" and for the subject with id "${_subjectId}"!`,
        );
      return results;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(getAllStudentSubjectUndoneTasks)Failed to get all the not done tasks for the student with id "${_studentId}" and for the subject with id "${_subjectId}"!
          Query: "${sql}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(getAllStudentSubjectUndoneTasks)Generally failed to get all the not done tasks for the student with id "${_studentId}" and for the subject with id "${_subjectId}"!
        Error message: "${error}".`,
      );
    return false;
  }
}

// select one functions

export async function getEntity(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  entityTableName,
  entityIdColumnName,
  _entityId,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "getEntity",
      );
      return false;
    }
  }
  if (typeof entityTableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityTableName",
      "string",
      entityTableName,
      "getEntity",
    );
    return false;
  }
  if (typeof entityIdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityIdColumnName",
      "string",
      entityIdColumnName,
      "getEntity",
    );
    return false;
  }
  if (typeof _entityId !== "number") {
    consoleLoggers.logParameterTypeError(
      "_entityId",
      "string",
      _entityId,
      "getEntity",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(getEntity)Trying to get an entity with the id "${_entityId}" from the "${entityTableName}"...`,
      );

    let sql = `
    SELECT t.*, t.${entityIdColumnName} AS id
    FROM \`${entityTableName}\` t
    WHERE t.${entityIdColumnName} = ?
    `;
    const params = [_entityId];
    const [results] = await databaseConnectionPool.execute(sql, params);
    if (results !== undefined && results.length !== 0) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(getEntity)Successfully got an entity with the id "${_entityId}" from the "${entityTableName}"!`,
        );
      return results[0];
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(getEntity)Failed to get an entity with the id "${_entityId}" from the "${entityTableName}"!
          Query: "${sql}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(getEntity)Generally failed to get an entity with the id "${_entityId}" from the "${entityTableName}"!
        Error message: "${error}".`,
      );
    return false;
  }
}

export async function getTwoKeyEntity(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  entityTableName,
  entityKeyOneColumnName,
  entityKeyTwoColumnName,
  _entityKeyOne,
  _entityKeyTwo,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "getTwoKeyEntity",
      );
      return false;
    }
  }
  if (typeof entityTableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityTableName",
      "string",
      entityTableName,
      "getTwoKeyEntity",
    );
    return false;
  }
  if (typeof entityKeyOneColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityKeyOneColumnName",
      "string",
      entityKeyOneColumnName,
      "getTwoKeyEntity",
    );
    return false;
  }
  if (typeof entityKeyTwoColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityKeyTwoColumnName",
      "string",
      entityKeyTwoColumnName,
      "getTwoKeyEntity",
    );
    return false;
  }
  if (typeof _entityKeyOne !== "number") {
    consoleLoggers.logParameterTypeError(
      "_entityKeyOne",
      "string",
      _entityKeyOne,
      "getTwoKeyEntity",
    );
    return false;
  }
  if (typeof _entityKeyTwo !== "number") {
    consoleLoggers.logParameterTypeError(
      "_entityKeyTwo",
      "string",
      _entityKeyTwo,
      "getTwoKeyEntity",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(getTwoKeyEntity)Trying to get a two-key entity with the ids "${_entityKeyOne}" and "${_entityKeyTwo}" from the "${entityTableName}"...`,
      );

    let sql = `
    SELECT t.*, t.${entityKeyOneColumnName} AS id
    FROM \`${entityTableName}\` t
    WHERE t.${entityKeyOneColumnName} = ?
      AND t.${entityKeyTwoColumnName} = ?
    `;
    const params = [_entityKeyOne, _entityKeyTwo];
    const [results] = await databaseConnectionPool.execute(sql, params);
    if (results !== undefined && results.length !== 0) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(getTwoKeyEntity)Successfully got a two-key entity with the ids "${_entityKeyOne}" and "${_entityKeyTwo}" from the "${entityTableName}"!`,
        );
      return results[0];
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(getTwoKeyEntity)Failed to get a two-key entity with the ids "${_entityKeyOne}" and "${_entityKeyTwo}" from the "${entityTableName}"!
          Query: "${sql}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(getTwoKeyEntity)Generally failed to get a two-key entity with the ids "${_entityKeyOne}" and "${_entityKeyTwo}" from the "${entityTableName}"!
        Error message: "${error}".`,
      );
    return false;
  }
}

// checkExists functions

export async function checkExistsTwoKeyEntity(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  entityTableName,
  entityKeyOneColumnName,
  entityKeyTwoColumnName,
  _entityKeyOne,
  _entityKeyTwo,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "checkExistsTwoKeyEntity",
      );
      return false;
    }
  }
  if (typeof entityTableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityTableName",
      "string",
      entityTableName,
      "checkExistsTwoKeyEntity",
    );
    return false;
  }
  if (typeof entityKeyOneColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityKeyOneColumnName",
      "string",
      entityKeyOneColumnName,
      "checkExistsTwoKeyEntity",
    );
    return false;
  }
  if (typeof entityKeyTwoColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityKeyTwoColumnName",
      "string",
      entityKeyTwoColumnName,
      "checkExistsTwoKeyEntity",
    );
    return false;
  }
  if (typeof _entityKeyOne !== "number") {
    consoleLoggers.logParameterTypeError(
      "_entityKeyOne",
      "string",
      _entityKeyOne,
      "checkExistsTwoKeyEntity",
    );
    return false;
  }
  if (typeof _entityKeyTwo !== "number") {
    consoleLoggers.logParameterTypeError(
      "_entityKeyTwo",
      "string",
      _entityKeyTwo,
      "checkExistsTwoKeyEntity",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(checkExistsTwoKeyEntity)Trying to check if a two-key entity with the ids "${_entityKeyOne}" and "${_entityKeyTwo}" from the "${entityTableName}" exists...`,
      );

    const sql = `
      SELECT EXISTS(
        SELECT 1 FROM \`${entityTableName}\`
        WHERE \`${entityKeyOneColumnName}\` = ? AND \`${entityKeyTwoColumnName}\` = ?
      ) AS exists_flag
    `;
    const params = [_entityKeyOne, _entityKeyTwo];
    const [results] = await databaseConnectionPool.execute(sql, params);
    if (results !== undefined && results.length !== 0) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(checkExistsTwoKeyEntity)Successfully checked if a two-key entity with the ids "${_entityKeyOne}" and "${_entityKeyTwo}" from the "${entityTableName}" exists!`,
        );
      return results[0];
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(checkExistsTwoKeyEntity)Failed to check if a two-key entity with the ids "${_entityKeyOne}" and "${_entityKeyTwo}" from the "${entityTableName}" exists!
          Query: "${sql}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(checkExistsTwoKeyEntity)Generally failed to check if a two-key entity with the ids "${_entityKeyOne}" and "${_entityKeyTwo}" from the "${entityTableName}" exists!
        Error message: "${error}".`,
      );
    return false;
  }
}

// checkAssigned functions //

// child 1-->1 parent
export async function checkAssigned1Fecta(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  assignationTable_name,
  childEntity_idColumnName,
  parentEntity_idColumnName,
  _childEntity_id,
  _parentEntity_id,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "checkAssigned1Fecta",
      );
      return false;
    }
  }
  if (typeof assignationTable_name !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_name",
      "string",
      assignationTable_name,
      "checkAssigned1Fecta",
    );
    return false;
  }
  if (typeof childEntity_idColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "childEntity_idColumnName",
      "string",
      childEntity_idColumnName,
      "checkAssigned1Fecta",
    );
    return false;
  }
  if (typeof parentEntity_idColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "parentEntity_idColumnName",
      "string",
      parentEntity_idColumnName,
      "checkAssigned1Fecta",
    );
    return false;
  }
  if (typeof _childEntity_id !== "number") {
    consoleLoggers.logParameterTypeError(
      "_childEntity_id",
      "string",
      _childEntity_id,
      "checkAssigned1Fecta",
    );
    return false;
  }
  if (typeof _parentEntity_id !== "number") {
    consoleLoggers.logParameterTypeError(
      "_parentEntity_id",
      "string",
      _parentEntity_id,
      "checkAssigned1Fecta",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(checkAssigned1Fecta)Trying to make a 1fecta assignation check...`,
      );
    const sql = `
    SELECT EXISTS(
      SELECT 1
      FROM \`${assignationTable_name}\` t
      WHERE t.${childEntity_idColumnName} = ${_childEntity_id}
        AND t.${parentEntity_idColumnName} = ${_parentEntity_id}
    ) AS is_assigned;
    `;
    const [results] = await databaseConnectionPool.query(sql);
    if (results !== undefined) {
      if (areMessagesToBeDisplayed)
        if (results[0].is_assigned) {
          consoleLoggers.logSuccess(
            `(checkAssigned1Fecta)Check successful, result: "assigned"!`,
          );
        } else {
          consoleLoggers.logSuccess(
            `(checkAssigned1Fecta)Check successful, result: "not assigned"!`,
          );
        }
      return results[0].is_assigned;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(checkAssigned1Fecta)Check unsuccessful!
          Query: "${sql}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(checkAssigned1Fecta)Generally failed to make a 1fecta assignation check!
        Error message: "${error}".`,
      );
    return false;
  }
}

// child 1-->middleman-->1 parent
export async function checkAssigned2Fecta(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  assignationTable_childToMiddleman_name,
  assignationTable_middlemanToParent_name,
  childEntity_idColumnName,
  middlemanEntity_idColumnName,
  parentEntity_idColumnName,
  _childEntity_id,
  _parentEntity_id,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "checkAssigned2Fecta",
      );
      return false;
    }
  }
  if (typeof assignationTable_childToMiddleman_name !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_childToMiddleman_name",
      "string",
      assignationTable_childToMiddleman_name,
      "checkAssigned2Fecta",
    );
    return false;
  }
  if (typeof assignationTable_middlemanToParent_name !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_middlemanToParent_name",
      "string",
      assignationTable_middlemanToParent_name,
      "checkAssigned2Fecta",
    );
    return false;
  }
  if (typeof childEntity_idColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "childEntity_idColumnName",
      "string",
      childEntity_idColumnName,
      "checkAssigned2Fecta",
    );
    return false;
  }
  if (typeof middlemanEntity_idColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "middlemanEntity_idColumnName",
      "string",
      middlemanEntity_idColumnName,
      "checkAssigned2Fecta",
    );
    return false;
  }
  if (typeof parentEntity_idColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "parentEntity_idColumnName",
      "string",
      parentEntity_idColumnName,
      "checkAssigned2Fecta",
    );
    return false;
  }
  if (typeof _childEntity_id !== "number") {
    consoleLoggers.logParameterTypeError(
      "_childEntity_id",
      "string",
      _childEntity_id,
      "checkAssigned2Fecta",
    );
    return false;
  }
  if (typeof _parentEntity_id !== "number") {
    consoleLoggers.logParameterTypeError(
      "_parentEntity_id",
      "string",
      _parentEntity_id,
      "checkAssigned2Fecta",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(checkAssigned2Fecta)Trying to make a 2fecta assignation check...`,
      );

    const sql = `
    SELECT EXISTS(
      SELECT 1
      FROM \`${assignationTable_childToMiddleman_name}\` c2m
      JOIN \`${assignationTable_middlemanToParent_name}\` m2p
        ON c2m.\`${middlemanEntity_idColumnName}\` = m2p.\`${middlemanEntity_idColumnName}\`
      WHERE c2m.\`${childEntity_idColumnName}\` = ${_childEntity_id}
        AND m2p.\`${parentEntity_idColumnName}\` = ${_parentEntity_id}
    ) AS is_assigned;
    `;
    const [results] = await databaseConnectionPool.query(sql);
    if (results !== undefined) {
      if (areMessagesToBeDisplayed)
        if (results[0].is_assigned) {
          consoleLoggers.logSuccess(
            `(checkAssigned2Fecta)Check successful, result: "assigned"!`,
          );
        } else {
          consoleLoggers.logSuccess(
            `(checkAssigned2Fecta)Check successful, result: "not assigned"!`,
          );
        }
      return results[0].is_assigned;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(checkAssigned2Fecta)Check unsuccessful!
          Query: "${sql}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(checkAssigned2Fecta)Generally failed to make a 2fecta assignation check!
        Error message: "${error}".`,
      );
    return false;
  }
}

// child 1-->middlemanOne-->middlemanTwo-->1 parent
export async function checkAssigned3Fecta(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  assignationTable_childToMiddleman1_name,
  assignationTable_middleman1ToMiddleman2_name,
  assignationTable_middleman2ToParent_name,
  childEntity_idColumnName,
  middleman1Entity_idColumnName,
  middleman2Entity_idColumnName,
  parentEntity_idColumnName,
  _childEntity_id,
  _parentEntity_id,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "checkAssigned3Fecta",
      );
      return false;
    }
  }
  if (typeof assignationTable_childToMiddleman1_name !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_childToMiddleman1_name",
      "string",
      assignationTable_childToMiddleman1_name,
      "checkAssigned3Fecta",
    );
    return false;
  }
  if (typeof assignationTable_middleman1ToMiddleman2_name !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_middleman1ToMiddleman2_name",
      "string",
      assignationTable_middleman1ToMiddleman2_name,
      "checkAssigned3Fecta",
    );
    return false;
  }
  if (typeof assignationTable_middleman2ToParent_name !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_middleman2ToParent_name",
      "string",
      assignationTable_middleman2ToParent_name,
      "checkAssigned3Fecta",
    );
    return false;
  }
  if (typeof childEntity_idColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "childEntity_idColumnName",
      "string",
      childEntity_idColumnName,
      "checkAssigned3Fecta",
    );
    return false;
  }
  if (typeof middleman1Entity_idColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "middleman1Entity_idColumnName",
      "string",
      middleman1Entity_idColumnName,
      "checkAssigned3Fecta",
    );
    return false;
  }
  if (typeof middleman2Entity_idColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "middleman2Entity_idColumnName",
      "string",
      middleman2Entity_idColumnName,
      "checkAssigned3Fecta",
    );
    return false;
  }
  if (typeof parentEntity_idColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "parentEntity_idColumnName",
      "string",
      parentEntity_idColumnName,
      "checkAssigned3Fecta",
    );
    return false;
  }
  if (typeof _childEntity_id !== "number") {
    consoleLoggers.logParameterTypeError(
      "_childEntity_id",
      "string",
      _childEntity_id,
      "checkAssigned3Fecta",
    );
    return false;
  }
  if (typeof _parentEntity_id !== "number") {
    consoleLoggers.logParameterTypeError(
      "_parentEntity_id",
      "string",
      _parentEntity_id,
      "checkAssigned3Fecta",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(checkAssigned3Fecta)Trying to make a 3fecta assignation check...`,
      );

    const sql = `
    SELECT EXISTS(
      SELECT 1
      FROM \`${assignationTable_childToMiddleman1_name}\` c2m1
      JOIN \`${assignationTable_middleman1ToMiddleman2_name}\` m12
        ON c2m1.\`${middleman1Entity_idColumnName}\` = m12.\`${middleman1Entity_idColumnName}\`
      JOIN \`${assignationTable_middleman2ToParent_name}\` m23
        ON m12.\`${middleman2Entity_idColumnName}\` = m23.\`${middleman2Entity_idColumnName}\`
      WHERE c2m1.\`${childEntity_idColumnName}\` = ${_childEntity_id}
        AND m23.\`${parentEntity_idColumnName}\` = ${_parentEntity_id}
    ) AS is_assigned;
    `;
    const [results] = await databaseConnectionPool.query(sql);
    if (results !== undefined) {
      if (areMessagesToBeDisplayed)
        if (results[0].is_assigned) {
          consoleLoggers.logSuccess(
            `(checkAssigned3Fecta)Check successful, result: "assigned"!`,
          );
        } else {
          consoleLoggers.logSuccess(
            `(checkAssigned3Fecta)Check successful, result: "not assigned"!`,
          );
        }
      return results[0].is_assigned;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(checkAssigned3Fecta)Check unsuccessful!
          Query: "${sql}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(checkAssigned3Fecta)Generally failed to make a 3fecta assignation check!
        Error message: "${error}".`,
      );
    return false;
  }
}

// child 1-->middlemanOne-->middlemanTwo-->middlemanThree-->1 parent
export async function checkAssigned4Fecta(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  assignationTable_childToMiddleman1_name,
  assignationTable_middleman1ToMiddleman2_name,
  assignationTable_middleman2ToMiddleman3_name,
  assignationTable_middleman3ToParent_name,
  childEntity_idColumnName,
  middleman1Entity_idColumnName,
  middleman2Entity_idColumnName,
  middleman3Entity_idColumnName,
  parentEntity_idColumnName,
  _childEntity_id,
  _parentEntity_id,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "checkAssigned4Fecta",
      );
      return false;
    }
  }
  if (typeof assignationTable_childToMiddleman1_name !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_childToMiddleman1_name",
      "string",
      assignationTable_childToMiddleman1_name,
      "checkAssigned4Fecta",
    );
    return false;
  }
  if (typeof assignationTable_middleman1ToMiddleman2_name !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_middleman1ToMiddleman2_name",
      "string",
      assignationTable_middleman1ToMiddleman2_name,
      "checkAssigned4Fecta",
    );
    return false;
  }
  if (typeof assignationTable_middleman2ToMiddleman3_name !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_middleman2ToMiddleman3_name",
      "string",
      assignationTable_middleman2ToMiddleman3_name,
      "checkAssigned4Fecta",
    );
    return false;
  }
  if (typeof assignationTable_middleman3ToParent_name !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_middleman3ToParent_name",
      "string",
      assignationTable_middleman3ToParent_name,
      "checkAssigned4Fecta",
    );
    return false;
  }
  if (typeof childEntity_idColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "childEntity_idColumnName",
      "string",
      childEntity_idColumnName,
      "checkAssigned4Fecta",
    );
    return false;
  }
  if (typeof middleman1Entity_idColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "middleman1Entity_idColumnName",
      "string",
      middleman1Entity_idColumnName,
      "checkAssigned4Fecta",
    );
    return false;
  }
  if (typeof middleman2Entity_idColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "middleman2Entity_idColumnName",
      "string",
      middleman2Entity_idColumnName,
      "checkAssigned4Fecta",
    );
    return false;
  }
  if (typeof middleman3Entity_idColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "middleman3Entity_idColumnName",
      "string",
      middleman3Entity_idColumnName,
      "checkAssigned4Fecta",
    );
    return false;
  }
  if (typeof parentEntity_idColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "parentEntity_idColumnName",
      "string",
      parentEntity_idColumnName,
      "checkAssigned4Fecta",
    );
    return false;
  }
  if (typeof _childEntity_id !== "number") {
    consoleLoggers.logParameterTypeError(
      "_childEntity_id",
      "string",
      _childEntity_id,
      "checkAssigned4Fecta",
    );
    return false;
  }
  if (typeof _parentEntity_id !== "number") {
    consoleLoggers.logParameterTypeError(
      "_parentEntity_id",
      "string",
      _parentEntity_id,
      "checkAssigned4Fecta",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(checkAssigned4Fecta)Trying to make a 4fecta assignation check...`,
      );

    const sql = `
    SELECT EXISTS(
      FROM \`${assignationTable_childToMiddleman1_name}\` t1
      JOIN \`${assignationTable_middleman1ToMiddleman2_name}\` t2
        ON t1.\`${middleman1Entity_idColumnName}\` = t2.\`${middleman1Entity_idColumnName}\`
      JOIN \`${assignationTable_middleman2ToMiddleman3_name}\` t3
        ON t2.\`${middleman2Entity_idColumnName}\` = t3.\`${middleman2Entity_idColumnName}\`
      JOIN \`${assignationTable_middleman3ToParent_name}\` t4
        ON t3.\`${middleman3Entity_idColumnName}\` = t4.\`${middleman3Entity_idColumnName}\`
      WHERE t1.\`${childEntity_idColumnName}\` = ${_childEntity_id}
        AND t4.\`${parentEntity_idColumnName}\` = ${_parentEntity_id}
    ) AS is_assigned;
    `;
    const [results] = await databaseConnectionPool.query(sql);
    if (results !== undefined) {
      if (areMessagesToBeDisplayed)
        if (results[0].is_assigned) {
          consoleLoggers.logSuccess(
            `(checkAssigned4Fecta)Check successful, result: "assigned"!`,
          );
        } else {
          consoleLoggers.logSuccess(
            `(checkAssigned4Fecta)Check successful, result: "not assigned"!`,
          );
        }
      return results[0].is_assigned;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(checkAssigned4Fecta)Check unsuccessful!
          Query: "${sql}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(checkAssigned4Fecta)Generally failed to make a 4fecta assignation check!
        Error message: "${error}".`,
      );
    return false;
  }
}

// child 1-->middlemanOne-->middlemanTwo-->middlemanThree-->middlemanFour-->1 parent
export async function checkAssigned5Fecta(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  assignationTable_childToMiddleman1_name,
  assignationTable_middleman1ToMiddleman2_name,
  assignationTable_middleman2ToMiddleman3_name,
  assignationTable_middleman3ToMiddleman4_name,
  assignationTable_middleman4ToParent_name,
  childEntity_idColumnName,
  middleman1Entity_idColumnName,
  middleman2Entity_idColumnName,
  middleman3Entity_idColumnName,
  middleman4Entity_idColumnName,
  parentEntity_idColumnName,
  _childEntity_id,
  _parentEntity_id,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "checkAssigned5Fecta",
      );
      return false;
    }
  }
  if (typeof assignationTable_childToMiddleman1_name !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_childToMiddleman1_name",
      "string",
      assignationTable_childToMiddleman1_name,
      "checkAssigned5Fecta",
    );
    return false;
  }
  if (typeof assignationTable_middleman1ToMiddleman2_name !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_middleman1ToMiddleman2_name",
      "string",
      assignationTable_middleman1ToMiddleman2_name,
      "checkAssigned5Fecta",
    );
    return false;
  }
  if (typeof assignationTable_middleman2ToMiddleman3_name !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_middleman2ToMiddleman3_name",
      "string",
      assignationTable_middleman2ToMiddleman3_name,
      "checkAssigned5Fecta",
    );
    return false;
  }
  if (typeof assignationTable_middleman3ToMiddleman4_name !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_middleman3ToMiddleman4_name",
      "string",
      assignationTable_middleman3ToMiddleman4_name,
      "checkAssigned5Fecta",
    );
    return false;
  }
  if (typeof assignationTable_middleman4ToParent_name !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_middleman4ToParent_name",
      "string",
      assignationTable_middleman4ToParent_name,
      "checkAssigned5Fecta",
    );
    return false;
  }
  if (typeof childEntity_idColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "childEntity_idColumnName",
      "string",
      childEntity_idColumnName,
      "checkAssigned5Fecta",
    );
    return false;
  }
  if (typeof middleman1Entity_idColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "middleman1Entity_idColumnName",
      "string",
      middleman1Entity_idColumnName,
      "checkAssigned5Fecta",
    );
    return false;
  }
  if (typeof middleman2Entity_idColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "middleman2Entity_idColumnName",
      "string",
      middleman2Entity_idColumnName,
      "checkAssigned5Fecta",
    );
    return false;
  }
  if (typeof middleman3Entity_idColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "middleman3Entity_idColumnName",
      "string",
      middleman3Entity_idColumnName,
      "checkAssigned5Fecta",
    );
    return false;
  }
  if (typeof middleman4Entity_idColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "middleman4Entity_idColumnName",
      "string",
      middleman4Entity_idColumnName,
      "checkAssigned5Fecta",
    );
    return false;
  }
  if (typeof parentEntity_idColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "parentEntity_idColumnName",
      "string",
      parentEntity_idColumnName,
      "checkAssigned5Fecta",
    );
    return false;
  }
  if (typeof _childEntity_id !== "number") {
    consoleLoggers.logParameterTypeError(
      "_childEntity_id",
      "string",
      _childEntity_id,
      "checkAssigned5Fecta",
    );
    return false;
  }
  if (typeof _parentEntity_id !== "number") {
    consoleLoggers.logParameterTypeError(
      "_parentEntity_id",
      "string",
      _parentEntity_id,
      "checkAssigned5Fecta",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(checkAssigned5Fecta)Trying to make a 5fecta assignation check...`,
      );

    const sql = `
    SELECT EXISTS(
      SELECT 1
      FROM \`${assignationTable_childToMiddleman1_name}\` t1
      JOIN \`${assignationTable_middleman1ToMiddleman2_name}\` t2
        ON t1.\`${middleman1Entity_idColumnName}\` = t2.\`${middleman1Entity_idColumnName}\`
      JOIN \`${assignationTable_middleman2ToMiddleman3_name}\` t3
        ON t2.\`${middleman2Entity_idColumnName}\` = t3.\`${middleman2Entity_idColumnName}\`
      JOIN \`${assignationTable_middleman3ToMiddleman4_name}\` t4
        ON t3.\`${middleman3Entity_idColumnName}\` = t4.\`${middleman3Entity_idColumnName}\`
      JOIN \`${assignationTable_middleman4ToParent_name}\` t5
        ON t4.\`${middleman4Entity_idColumnName}\` = t5.\`${middleman4Entity_idColumnName}\`
      WHERE t1.\`${childEntity_idColumnName}\` = ${_childEntity_id}
        AND t5.\`${parentEntity_idColumnName}\` = ${_parentEntity_id}
    ) AS is_assigned;
    `;
    const [results] = await databaseConnectionPool.query(sql);
    if (results !== undefined) {
      if (areMessagesToBeDisplayed)
        if (results[0].is_assigned) {
          consoleLoggers.logSuccess(
            `(checkAssigned5Fecta)Check successful, result: "assigned"!`,
          );
        } else {
          consoleLoggers.logSuccess(
            `(checkAssigned5Fecta)Check successful, result: "not assigned"!`,
          );
        }
      return results[0].is_assigned;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(checkAssigned5Fecta)Check unsuccessful!
          Query: "${sql}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(checkAssigned5Fecta)Generally failed to make a 5fecta assignation check!
        Error message: "${error}".`,
      );
    return false;
  }
}

// entity update functions //

export async function updateStudentGroup(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  entityTableName,
  _entityIdColumnName,
  _entityIdColumnValue,
  _updatedEntity,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "updateStudentGroup",
      );
      return false;
    }
  }
  if (typeof entityTableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityTableName",
      "string",
      entityTableName,
      "updateStudentGroup",
    );
    return false;
  }
  if (typeof _entityIdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "_entityIdColumnName",
      "string",
      _entityIdColumnName,
      "updateStudentGroup",
    );
    return false;
  }
  if (typeof _entityIdColumnValue !== "number") {
    consoleLoggers.logParameterTypeError(
      "_entityIdColumnValue",
      "number",
      _entityIdColumnValue,
      "updateStudentGroup",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(updateStudentGroup)Trying to update a student group...`,
      );

    const sql = `UPDATE \`${entityTableName}\`
        SET name = ?, description = ?
        WHERE ${_entityIdColumnName} = ?`;
    const params = [
      _updatedEntity.name,
      _updatedEntity.description,
      _entityIdColumnValue,
    ];
    await databaseConnectionPool.execute(sql, params);

    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(
        `(updateStudentGroup)Successfully updated a student group.`,
      );
    return true;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(updateStudentGroup)Generally failed to update a student group! Error message: ${error}`,
      );
    return false;
  }
}

export async function updateSpecialty(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  entityTableName,
  _entityIdColumnName,
  _entityIdColumnValue,
  _updatedEntity,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "updateSpecialty",
      );
      return false;
    }
  }
  if (typeof entityTableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityTableName",
      "string",
      entityTableName,
      "updateSpecialty",
    );
    return false;
  }
  if (typeof _entityIdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "_entityIdColumnName",
      "string",
      _entityIdColumnName,
      "updateSpecialty",
    );
    return false;
  }
  if (typeof _entityIdColumnValue !== "number") {
    consoleLoggers.logParameterTypeError(
      "_entityIdColumnValue",
      "number",
      _entityIdColumnValue,
      "updateSpecialty",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(updateSpecialty)Trying to update a specialty...`,
      );

    const sql = `UPDATE \`${entityTableName}\`
        SET name = ?, abbreviation = ?, description = ?
        WHERE ${_entityIdColumnName} = ?`;
    const params = [
      _updatedEntity.name,
      _updatedEntity.abbreviation,
      _updatedEntity.description,
      _entityIdColumnValue,
    ];
    await databaseConnectionPool.execute(sql, params);

    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(
        `(updateSpecialty)Successfully updated a specialty.`,
      );
    return true;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(updateSpecialty)Generally failed to update a specialty! Error message: ${error}`,
      );
    return false;
  }
}

export async function updateSubject(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  entityTableName,
  _entityIdColumnName,
  _entityIdColumnValue,
  _updatedEntity,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "updateSubject",
      );
      return false;
    }
  }
  if (typeof entityTableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityTableName",
      "string",
      entityTableName,
      "updateSubject",
    );
    return false;
  }
  if (typeof _entityIdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "_entityIdColumnName",
      "string",
      _entityIdColumnName,
      "updateSubject",
    );
    return false;
  }
  if (typeof _entityIdColumnValue !== "number") {
    consoleLoggers.logParameterTypeError(
      "_entityIdColumnValue",
      "number",
      _entityIdColumnValue,
      "updateSubject",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(`(updateSubject)Trying to update a subject...`);

    const sql = `UPDATE \`${entityTableName}\`
        SET name = ?, description = ?
        WHERE ${_entityIdColumnName} = ?`;
    const params = [
      _updatedEntity.name,
      _updatedEntity.description,
      _entityIdColumnValue,
    ];
    await databaseConnectionPool.execute(sql, params);

    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(
        `(updateSubject)Successfully updated a subject.`,
      );
    return true;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(updateSubject)Generally failed to update a subject! Error message: ${error}`,
      );
    return false;
  }
}

export async function updateTask(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  entityTableName,
  _entityIdColumnName,
  _entityIdColumnValue,
  _updatedEntity,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "updateTask",
      );
      return false;
    }
  }
  if (typeof entityTableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityTableName",
      "string",
      entityTableName,
      "updateTask",
    );
    return false;
  }
  if (typeof _entityIdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "_entityIdColumnName",
      "string",
      _entityIdColumnName,
      "updateTask",
    );
    return false;
  }
  if (typeof _entityIdColumnValue !== "number") {
    consoleLoggers.logParameterTypeError(
      "_entityIdColumnValue",
      "number",
      _entityIdColumnValue,
      "updateTask",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(`(updateTask)Trying to update a task...`);

    const sql = `UPDATE \`${entityTableName}\`
        SET name = ?, instructions = ?,
        time_due = ?,
        can_be_handed_in_past_due = ?
        WHERE ${_entityIdColumnName} = ?`;
    const params = [
      _updatedEntity.name,
      _updatedEntity.instructions,
      _updatedEntity.time_due,
      _updatedEntity.can_be_handed_in_past_due,
      _entityIdColumnValue,
    ];
    await databaseConnectionPool.execute(sql, params);

    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(`(updateTask)Successfully updated a task.`);
    return true;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(updateTask)Generally failed to update a task! Error message: ${error}`,
      );
    return false;
  }
}

export async function updateSolution(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  entityTableName,
  entityKeyOneColumnName,
  entityKeyTwoColumnName,
  _entityKeyOne,
  _entityKeyTwo,
  _updatedEntity,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "updateSolution",
      );
      return false;
    }
  }
  if (typeof entityTableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityTableName",
      "string",
      entityTableName,
      "updateSolution",
    );
    return false;
  }
  if (typeof entityKeyOneColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityKeyOneColumnName",
      "string",
      entityKeyOneColumnName,
      "updateSolution",
    );
    return false;
  }
  if (typeof entityKeyTwoColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityKeyTwoColumnName",
      "string",
      entityKeyTwoColumnName,
      "updateSolution",
    );
    return false;
  }
  if (typeof _entityKeyOne !== "number") {
    consoleLoggers.logParameterTypeError(
      "_entityKeyOne",
      "number",
      _entityKeyOne,
      "updateSolution",
    );
    return false;
  }
  if (typeof _entityKeyTwo !== "number") {
    consoleLoggers.logParameterTypeError(
      "_entityKeyTwo",
      "number",
      _entityKeyTwo,
      "updateSolution",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(updateSolution)Trying to update a solution...`,
      );

    const sql = `
        UPDATE \`${entityTableName}\`
        SET internet_file_link = ?,
          mark = ?, student_commentary = ?,
          teacher_commentary = ?
        WHERE ${entityKeyOneColumnName} = ?
          AND ${entityKeyTwoColumnName} = ?
        `;
    const params = [
      _updatedEntity.internet_file_link,
      _updatedEntity.mark,
      _updatedEntity.student_commentary,
      _updatedEntity.teacher_commentary,
      _entityKeyOne,
      _entityKeyTwo,
    ];
    await databaseConnectionPool.execute(sql, params);

    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(
        `(updateSolution)Successfully updated a solution.`,
      );
    return true;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(updateSolution)Generally failed to update a solution! Error message: ${error}`,
      );
    return false;
  }
}

// entity addition functions //

export async function addStudentGroup(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  entityTableName,
  _name,
  _description,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "addStudentGroup",
      );
      return false;
    }
  }
  if (typeof entityTableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityTableName",
      "string",
      entityTableName,
      "addStudentGroup",
    );
    return false;
  }
  if (typeof _name !== "string") {
    consoleLoggers.logParameterTypeError(
      "_name",
      "string",
      _name,
      "addStudentGroup",
    );
    return false;
  }
  if (typeof _description !== "string") {
    consoleLoggers.logParameterTypeError(
      "_description",
      "string",
      _description,
      "addStudentGroup",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(addStudentGroup)Trying to insert the new student group into the "${entityTableName}" table...`,
      );
    const sql = `INSERT INTO \`${entityTableName}\` (name, description) VALUES (?, ?)`;
    const params = [_name, _description];
    await databaseConnectionPool.execute(sql, params);
    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(
        `(addStudentGroup)Successfully inserted the new student group into the "${entityTableName}" table (name: ${_name})!`,
      );
    return true;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(addStudentGroup)Failed to insert the new student group into the "${entityTableName}" table! Error message: ${error}`,
      );
    return false;
  }
}

export async function addSpecialty(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  entityTableName,
  _name,
  _abbreviation,
  _description,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "addSpecialty",
      );
      return false;
    }
  }
  if (typeof entityTableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityTableName",
      "string",
      entityTableName,
      "addSpecialty",
    );
    return false;
  }
  if (typeof _name !== "string") {
    consoleLoggers.logParameterTypeError(
      "_name",
      "string",
      _name,
      "addSpecialty",
    );
    return false;
  }
  if (typeof _abbreviation !== "string") {
    consoleLoggers.logParameterTypeError(
      "_abbreviation",
      "string",
      _abbreviation,
      "addSpecialty",
    );
    return false;
  }
  if (typeof _description !== "string") {
    consoleLoggers.logParameterTypeError(
      "_description",
      "string",
      _description,
      "addSpecialty",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(addSpecialty)Trying to insert the new specialty into the "${entityTableName}" table...`,
      );
    const sql = `INSERT INTO \`${entityTableName}\` (name, abbreviation, description) VALUES (?, ?, ?)`;
    const params = [_name, _abbreviation, _description];
    await databaseConnectionPool.execute(sql, params);
    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(
        `(addSpecialty)Successfully inserted the new specialty into the "${entityTableName}" table (name: ${_name})!`,
      );
    return true;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(addSpecialty)Failed to insert the new specialty into the "${entityTableName}" table! Error message: ${error}`,
      );
    return false;
  }
}

export async function addSubject(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  entityTableName,
  _name,
  _description,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "addSubject",
      );
      return false;
    }
  }
  if (typeof entityTableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityTableName",
      "string",
      entityTableName,
      "addSubject",
    );
    return false;
  }
  if (typeof _name !== "string") {
    consoleLoggers.logParameterTypeError(
      "_name",
      "string",
      _name,
      "addSubject",
    );
    return false;
  }
  if (typeof _description !== "string") {
    consoleLoggers.logParameterTypeError(
      "_description",
      "string",
      _description,
      "addSubject",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(addSubject)Trying to insert the new subject into the "${entityTableName}" table...`,
      );
    const sql = `INSERT INTO \`${entityTableName}\` (name, description) VALUES (?, ?)`;
    const params = [_name, _description];
    await databaseConnectionPool.execute(sql, params);
    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(
        `(addSubject)Successfully inserted the new subject into the "${entityTableName}" table (name: ${_name})!`,
      );
    return true;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(addSubject)Failed to insert the new subject into the "${entityTableName}" table! Error message: ${error}`,
      );
    return false;
  }
}

export async function addTask(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  entityTableName,
  _name,
  _instructions,
  _timeDue,
  _canBeHandedInPastDue,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "addTask",
      );
      return false;
    }
  }
  if (typeof entityTableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityTableName",
      "string",
      entityTableName,
      "addTask",
    );
    return false;
  }
  if (typeof _name !== "string") {
    consoleLoggers.logParameterTypeError("_name", "string", _name, "addTask");
    return false;
  }
  if (typeof _instructions !== "string") {
    consoleLoggers.logParameterTypeError(
      "_description",
      "string",
      _instructions,
      "addTask",
    );
    return false;
  }
  if (typeof _canBeHandedInPastDue !== "boolean") {
    consoleLoggers.logParameterTypeError(
      "_canBeHandedInPastDue",
      "boolean",
      _canBeHandedInPastDue,
      "addTask",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(addTask)Trying to insert the new task into the "${entityTableName}" table...`,
      );
    const sql = `
    INSERT INTO \`${entityTableName}\`
    (name, instructions, time_due, can_be_handed_in_past_due)
    VALUES (?, ?, ?, ?)
    `;
    const params = [_name, _instructions, _timeDue, _canBeHandedInPastDue];
    await databaseConnectionPool.execute(sql, params);
    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(
        `(addTask)Successfully inserted the new task into the "${entityTableName}" table (name: ${_name})!`,
      );
    return true;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(addTask)Failed to insert the new task into the "${entityTableName}" table! Error message: ${error}`,
      );
    return false;
  }
}

export async function addSolution(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  entityTableName,
  _taskId,
  _studentId,
  _internet_file_link,
  _mark,
  _studentCommentary,
  _teacherCommentary,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "addSolution",
      );
      return false;
    }
  }
  if (typeof entityTableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityTableName",
      "string",
      entityTableName,
      "addSolution",
    );
    return false;
  }
  if (typeof _taskId !== "number") {
    consoleLoggers.logParameterTypeError(
      "_taskId",
      "number",
      _taskId,
      "addSolution",
    );
    return false;
  }
  if (typeof _studentId !== "number") {
    consoleLoggers.logParameterTypeError(
      "_studentId",
      "number",
      _studentId,
      "addSolution",
    );
    return false;
  }
  if (typeof _internet_file_link !== "string") {
    consoleLoggers.logParameterTypeError(
      "_internet_file_link",
      "string",
      _internet_file_link,
      "addSolution",
    );
    return false;
  }
  if (typeof _mark !== "string" && _mark !== null) {
    consoleLoggers.logParameterTypeError(
      "_mark",
      "string or null",
      _mark,
      "addSolution",
    );
    return false;
  }
  if (typeof _studentCommentary !== "string" && _studentCommentary !== null) {
    consoleLoggers.logParameterTypeError(
      "_studentCommentary",
      "string or null",
      _studentCommentary,
      "addSolution",
    );
    return false;
  }
  if (typeof _teacherCommentary !== "string" && _teacherCommentary !== null) {
    consoleLoggers.logParameterTypeError(
      "_teacherCommentary",
      "string or null",
      _teacherCommentary,
      "addSolution",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(addSolution)Trying to insert the new solution into the "${entityTableName}" table...`,
      );
    const sql = `
    INSERT INTO \`${entityTableName}\`
    (tasks_task_id, students_student_id, internet_file_link, mark, student_commentary, teacher_commentary)
    VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      _taskId,
      _studentId,
      _internet_file_link,
      _mark,
      _studentCommentary,
      _teacherCommentary,
    ];
    await databaseConnectionPool.execute(sql, params);
    if (areMessagesToBeDisplayed)
      consoleLoggers.logSuccess(
        `(addSolution)Successfully inserted the new solution into the "${entityTableName}" table!`,
      );
    return true;
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(addSolution)Failed to insert the new solution into the "${entityTableName}" table! Error message: ${error}`,
      );
    return false;
  }
}

// entity getAssigned functions //

export async function getEntityAssignedEntities(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  childEntityTable_Name,
  childEntityTable_IdColumnName,
  assignationTable_Name,
  assignationTable_childEntity_IdColumnName,
  assignationTable_parentEntity_IdColumnName,
  _parentEntityId,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "getEntityAssignedEntities",
      );
      return false;
    }
  }
  if (typeof childEntityTable_Name !== "string") {
    consoleLoggers.logParameterTypeError(
      "childEntityTable_Name",
      "string",
      childEntityTable_Name,
      "getEntityAssignedEntities",
    );
    return false;
  }
  if (typeof childEntityTable_IdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "childEntityTable_IdColumnName",
      "string",
      childEntityTable_IdColumnName,
      "getEntityAssignedEntities",
    );
    return false;
  }
  if (typeof assignationTable_Name !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_Name",
      "string",
      assignationTable_Name,
      "getEntityAssignedEntities",
    );
    return false;
  }
  if (typeof assignationTable_childEntity_IdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_childEntity_IdColumnName",
      "string",
      assignationTable_childEntity_IdColumnName,
      "getEntityAssignedEntities",
    );
    return false;
  }
  if (typeof assignationTable_parentEntity_IdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_parentEntity_IdColumnName",
      "string",
      assignationTable_parentEntity_IdColumnName,
      "getEntityAssignedEntities",
    );
    return false;
  }
  if (typeof _parentEntityId !== "number") {
    consoleLoggers.logParameterTypeError(
      "_parentEntityId",
      "number",
      _parentEntityId,
      "getEntityAssignedEntities",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(getEntityAssignedEntities)Trying to find all entities assigned to a certain parent entity...`,
      );
    const sql = `
    SELECT e.*, e.${childEntityTable_IdColumnName} AS id
    FROM ${childEntityTable_Name} e
    JOIN ${assignationTable_Name} a ON a.${assignationTable_childEntity_IdColumnName} = e.${childEntityTable_IdColumnName}
    WHERE a.${assignationTable_parentEntity_IdColumnName} = ${_parentEntityId};
    `;
    const [results] = await databaseConnectionPool.execute(sql);
    if (results !== undefined) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(getEntityAssignedEntities)Successfully found entities assigned to a certain parent entity!`,
        );
      return results;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(getEntityAssignedEntities)Failed to find entities assigned to a certain parent entity!
          Query: "${sql}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(getEntityAssignedEntities)Generally failed to find entities assigned to a certain parent entity!
        Error message: "${error}".`,
      );
    return false;
  }
}

export async function getEntityAssignedAccounts(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  accountTable_Name,
  accountTable_IdColumnName,
  assignationTable_Name,
  assignationTable_account_IdColumnName,
  assignationTable_parentEntity_IdColumnName,
  _parentEntityId,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "getEntityAssignedAccounts",
      );
      return false;
    }
  }
  if (typeof accountTable_Name !== "string") {
    consoleLoggers.logParameterTypeError(
      "accountTable_Name",
      "string",
      accountTable_Name,
      "getEntityAssignedAccounts",
    );
    return false;
  }
  if (typeof accountTable_IdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "accountTable_IdColumnName",
      "string",
      accountTable_IdColumnName,
      "getEntityAssignedAccounts",
    );
    return false;
  }
  if (typeof assignationTable_Name !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_Name",
      "string",
      assignationTable_Name,
      "getEntityAssignedAccounts",
    );
    return false;
  }
  if (typeof assignationTable_account_IdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_account_IdColumnName",
      "string",
      assignationTable_account_IdColumnName,
      "getEntityAssignedAccounts",
    );
    return false;
  }
  if (typeof assignationTable_parentEntity_IdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_parentEntity_IdColumnName",
      "string",
      assignationTable_parentEntity_IdColumnName,
      "getEntityAssignedAccounts",
    );
    return false;
  }
  if (typeof _parentEntityId !== "number") {
    consoleLoggers.logParameterTypeError(
      "_parentEntityId",
      "number",
      _parentEntityId,
      "getEntityAssignedAccounts",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(getEntityAssignedAccounts)Trying to find all accounts assigned to a certain parent entity...`,
      );
    const sql = `
    SELECT e.${accountTable_IdColumnName} AS id,
      e.${accountTable_IdColumnName}, e.email, e.first_name,
      e.last_name, e.patronymic_name
    FROM ${accountTable_Name} e
    JOIN ${assignationTable_Name} a ON a.${assignationTable_account_IdColumnName} = e.${accountTable_IdColumnName}
    WHERE a.${assignationTable_parentEntity_IdColumnName} = ${_parentEntityId};
    `;
    const [results] = await databaseConnectionPool.execute(sql);
    if (results !== undefined) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(getEntityAssignedAccounts)Successfully found accounts assigned to a certain parent entity!`,
        );
      return results;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(getEntityAssignedAccounts)Failed to find accounts assigned to a certain parent entity!
          Query: "${sql}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(getEntityAssignedAccounts)Generally failed to find accounts assigned to a certain parent entity!
        Error message: "${error}".`,
      );
    return false;
  }
}

// entity getUnassigned functions //

export async function getEntityUnassignedEntities(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  childEntityTable_Name,
  childEntityTable_IdColumnName,
  assignationTable_Name,
  assignationTable_childEntity_IdColumnName,
  assignationTable_parentEntity_IdColumnName,
  _parentEntityId,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "getEntityUnassignedEntities",
      );
      return false;
    }
  }
  if (typeof childEntityTable_Name !== "string") {
    consoleLoggers.logParameterTypeError(
      "childEntityTable_Name",
      "string",
      childEntityTable_Name,
      "getEntityUnassignedEntities",
    );
    return false;
  }
  if (typeof childEntityTable_IdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "childEntityTable_IdColumnName",
      "string",
      childEntityTable_IdColumnName,
      "getEntityUnassignedEntities",
    );
    return false;
  }
  if (typeof assignationTable_Name !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_Name",
      "string",
      assignationTable_Name,
      "getEntityUnassignedEntities",
    );
    return false;
  }
  if (typeof assignationTable_childEntity_IdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_childEntity_IdColumnName",
      "string",
      assignationTable_childEntity_IdColumnName,
      "getEntityUnassignedEntities",
    );
    return false;
  }
  if (typeof assignationTable_parentEntity_IdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_parentEntity_IdColumnName",
      "string",
      assignationTable_parentEntity_IdColumnName,
      "getEntityUnassignedEntities",
    );
    return false;
  }
  if (typeof _parentEntityId !== "number") {
    consoleLoggers.logParameterTypeError(
      "_parentEntityId",
      "number",
      _parentEntityId,
      "getEntityUnassignedEntities",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(getEntityUnassignedEntities)Trying to find all entities not assigned to a certain parent entity...`,
      );
    const sql = `
    SELECT e.*, e.${childEntityTable_IdColumnName} AS id
    FROM ${childEntityTable_Name} e
    LEFT JOIN ${assignationTable_Name} et
      ON et.${assignationTable_childEntity_IdColumnName} = e.${childEntityTable_IdColumnName}
      AND et.${assignationTable_parentEntity_IdColumnName} = ${_parentEntityId}
    WHERE et.${assignationTable_parentEntity_IdColumnName} IS NULL;
    `;
    const [results] = await databaseConnectionPool.execute(sql);
    if (results !== undefined) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(getEntityUnassignedEntities)Successfully found entities not assigned to a certain parent entity!`,
        );
      return results;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(getEntityUnassignedEntities)Failed to find entities not assigned to a certain parent entity!
          Query: "${sql}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(getEntityUnassignedEntities)Generally failed to find entities not assigned to a certain parent entity!
        Error message: "${error}".`,
      );
    return false;
  }
}

export async function getEntityUnassignedAccounts(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  accountTable_Name,
  accountTable_IdColumnName,
  assignationTable_Name,
  assignationTable_account_IdColumnName,
  assignationTable_parentEntity_IdColumnName,
  _parentEntityId,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "getEntityUnassignedAccounts",
      );
      return false;
    }
  }
  if (typeof accountTable_Name !== "string") {
    consoleLoggers.logParameterTypeError(
      "accountTable_Name",
      "string",
      accountTable_Name,
      "getEntityUnassignedAccounts",
    );
    return false;
  }
  if (typeof accountTable_IdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "accountTable_IdColumnName",
      "string",
      accountTable_IdColumnName,
      "getEntityUnassignedAccounts",
    );
    return false;
  }
  if (typeof assignationTable_Name !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_Name",
      "string",
      assignationTable_Name,
      "getEntityUnassignedAccounts",
    );
    return false;
  }
  if (typeof assignationTable_account_IdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_account_IdColumnName",
      "string",
      assignationTable_account_IdColumnName,
      "getEntityUnassignedAccounts",
    );
    return false;
  }
  if (typeof assignationTable_parentEntity_IdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_parentEntity_IdColumnName",
      "string",
      assignationTable_parentEntity_IdColumnName,
      "getEntityUnassignedAccounts",
    );
    return false;
  }
  if (typeof _parentEntityId !== "number") {
    consoleLoggers.logParameterTypeError(
      "_parentEntityId",
      "number",
      _parentEntityId,
      "getEntityUnassignedAccounts",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(getEntityUnassignedAccounts)Trying to find all accounts not assigned to a certain parent entity...`,
      );
    const sql = `
    SELECT e.${accountTable_IdColumnName} AS id,
      e.${accountTable_IdColumnName}, e.email,
      e.first_name, e.last_name, e.patronymic_name
    FROM ${accountTable_Name} e
    LEFT JOIN ${assignationTable_Name} et
      ON et.${assignationTable_account_IdColumnName} = e.${accountTable_IdColumnName}
      AND et.${assignationTable_parentEntity_IdColumnName} = ${_parentEntityId}
    WHERE et.${assignationTable_parentEntity_IdColumnName} IS NULL;
    `;
    const [results] = await databaseConnectionPool.execute(sql);
    if (results !== undefined) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(getEntityUnassignedAccounts)Successfully found accounts not assigned to a certain parent entity!`,
        );
      return results;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(getEntityUnassignedAccounts)Failed to find accounts not assigned to a certain parent entity!
          Query: "${sql}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(getEntityUnassignedAccounts)Generally failed to find accounts not assigned to a certain parent entity!
        Error message: "${error}".`,
      );
    return false;
  }
}

// entity assign function (works for accounts too) //
export async function assignEntitiesToEntity(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  assignationTableName,
  assignationTable_childEntity_IdColumnName,
  assignationTable_parentEntity_IdColumnName,
  _childEntity_IdSelection,
  _parentEntity_Id,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "assignEntitiesToEntity",
      );
      return false;
    }
  }
  if (typeof assignationTableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTableName",
      "string",
      assignationTableName,
      "assignEntitiesToEntity",
    );
    return false;
  }
  if (typeof assignationTable_childEntity_IdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_childEntity_IdColumnName",
      "string",
      assignationTable_childEntity_IdColumnName,
      "assignEntitiesToEntity",
    );
    return false;
  }
  if (typeof assignationTable_parentEntity_IdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_parentEntity_IdColumnName",
      "string",
      assignationTable_parentEntity_IdColumnName,
      "assignEntitiesToEntity",
    );
    return false;
  }
  if (typeof _parentEntity_Id !== "number") {
    consoleLoggers.logParameterTypeError(
      "_parentEntity_Id",
      "number",
      _parentEntity_Id,
      "assignEntitiesToEntity",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(assignEntitiesToEntity)Trying to assign a selection of entities in the "${assignationTableName}" table to a certain parent entity...`,
      );

    if (_childEntity_IdSelection.length === 0)
      throw new Error("Child entity id selection array was empty!");

    const placeholders = _childEntity_IdSelection.map(() => "(?,?)").join(",");
    const sql = `
    INSERT IGNORE INTO \`${assignationTableName}\`
    (${assignationTable_childEntity_IdColumnName}, ${assignationTable_parentEntity_IdColumnName})
    VALUES ${placeholders}
    `;
    const params = [];
    for (const entityId of _childEntity_IdSelection) {
      params.push(entityId, _parentEntity_Id);
    }
    const [results] = await databaseConnectionPool.execute(sql, params);
    if (results !== undefined && results.length !== 0) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(assignEntitiesToEntity)Successfully assigned a selection of entities in the "${assignationTableName}" table table to a certain parent entity!`,
        );
      return results;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(assignEntitiesToEntity)Failed to assign a selection of entities in the "${assignationTableName}" table table to a certain parent entity!
          Query: "${sql}"
          Parameters: "${params}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(assignEntitiesToEntity)Generally failed to assign a selection of entities in the "${assignationTableName}" table table to a certain parent entity!
        Error message: "${error}".`,
      );
    return false;
  }
}

// entity unassign function (works for accounts too) //
export async function unassignEntityAssignedEntities(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  assignationTableName,
  assignationTable_childEntity_IdColumnName,
  assignationTable_parentEntity_IdColumnName,
  _childEntity_IdSelection,
  _parentEntity_Id,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "unassignEntityAssignedEntities",
      );
      return false;
    }
  }
  if (typeof assignationTableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTableName",
      "string",
      assignationTableName,
      "unassignEntityAssignedEntities",
    );
    return false;
  }
  if (typeof assignationTable_childEntity_IdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_childEntity_IdColumnName",
      "string",
      assignationTable_childEntity_IdColumnName,
      "unassignEntityAssignedEntities",
    );
    return false;
  }
  if (typeof assignationTable_parentEntity_IdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "assignationTable_parentEntity_IdColumnName",
      "string",
      assignationTable_parentEntity_IdColumnName,
      "unassignEntityAssignedEntities",
    );
    return false;
  }
  if (typeof _parentEntity_Id !== "number") {
    consoleLoggers.logParameterTypeError(
      "_parentEntity_Id",
      "number",
      _parentEntity_Id,
      "unassignEntityAssignedEntities",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(unassignEntityAssignedEntities)Trying to unassign a selection of entities in the "${assignationTableName}" table from a certain parent entity...`,
      );

    if (_childEntity_IdSelection.length === 0)
      throw new Error("Child entity id selection array was empty!");

    const placeholders = _childEntity_IdSelection.map(() => "?").join(",");
    const sql = `
    DELETE FROM \`${assignationTableName}\`
    WHERE \`${assignationTable_childEntity_IdColumnName}\` IN (${placeholders})
    AND \`${assignationTable_parentEntity_IdColumnName}\` = ?
    `;
    const params = [..._childEntity_IdSelection, _parentEntity_Id];
    const [results] = await databaseConnectionPool.execute(sql, params);
    if (results !== undefined && results.length !== 0) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(unassignEntityAssignedEntities)Successfully unassigned a selection of entities in the "${assignationTableName}" table from a certain parent entity!`,
        );
      return results;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(unassignEntityAssignedEntities)Failed to unassign a selection of entities in the "${assignationTableName}" table from a certain parent entity!
          Query: "${sql}"
          Parameters: "${params}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(unassignEntityAssignedEntities)Generally failed to unassign a selection of entities in the "${assignationTableName}" table from a certain parent entity!
        Error message: "${error}".`,
      );
    return false;
  }
}

// entity selection functions //

export async function deleteEntitySelection(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  entityTableName,
  entityIdColumnName,
  _entityIdSelection,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "deleteEntitySelection",
      );
      return false;
    }
  }
  if (typeof entityTableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityTableName",
      "string",
      entityTableName,
      "deleteEntitySelection",
    );
    return false;
  }
  if (typeof entityIdColumnName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityIdColumnName",
      "string",
      entityIdColumnName,
      "deleteEntitySelection",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(deleteEntitySelection)Trying to delete a selection of entities in the "${entityTableName}" table...`,
      );

    if (_entityIdSelection.length === 0)
      throw new Error("Entity id selection array was empty!");

    const placeholders = _entityIdSelection.map(() => "?").join(",");
    const sql = `DELETE FROM \`${entityTableName}\` WHERE \`${entityIdColumnName}\` IN (${placeholders})`;
    //_entityIdSelection here is used directly as the parameter array
    const [results] = await databaseConnectionPool.execute(
      sql,
      _entityIdSelection,
    );
    if (results !== undefined && results.length !== 0) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(deleteEntitySelection)Successfully a selection of entities in the "${entityTableName}" table!`,
        );
      return results;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(deleteEntitySelection)Failed to delete a selection of entities in the "${entityTableName}" table!
          Query: "${sql}"
          Parameters: "${_entityIdSelection}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(deleteEntitySelection)Generally failed to delete a selection of entities in the "${entityTableName}" table!
        Error message: "${error}".`,
      );
    return false;
  }
}

export async function deleteTwoKeyEntitySelection(
  databaseConnectionPool,
  areMessagesToBeDisplayed,
  entityTableName,
  entityIdColumn1_name,
  entityIdColumn2_name,
  _entityDoubleIdSelection,
) {
  if (areMessagesToBeDisplayed === undefined) areMessagesToBeDisplayed = true;
  else {
    if (typeof areMessagesToBeDisplayed !== "boolean") {
      consoleLoggers.logParameterTypeError(
        "areMessagesToBeDisplayed",
        "boolean",
        areMessagesToBeDisplayed,
        "deleteTwoKeyEntitySelection",
      );
      return false;
    }
  }
  if (typeof entityTableName !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityTableName",
      "string",
      entityTableName,
      "deleteTwoKeyEntitySelection",
    );
    return false;
  }
  if (typeof entityIdColumn1_name !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityIdColumn1_name",
      "string",
      entityIdColumn1_name,
      "deleteTwoKeyEntitySelection",
    );
    return false;
  }
  if (typeof entityIdColumn2_name !== "string") {
    consoleLoggers.logParameterTypeError(
      "entityIdColumn2_name",
      "string",
      entityIdColumn2_name,
      "deleteTwoKeyEntitySelection",
    );
    return false;
  }

  try {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logNeutral(
        `(deleteTwoKeyEntitySelection)Trying to delete a selection of two-key entities in the "${entityTableName}" table...`,
      );

    if (_entityDoubleIdSelection.length === 0)
      throw new Error("Entity double id selection array was empty!");

    const pairCount = _entityDoubleIdSelection.length;
    const placeholders = new Array(pairCount).fill("(?,?)").join(",");
    const params = _entityDoubleIdSelection.flat();
    const sql = `
      DELETE FROM \`${entityTableName}\`
      WHERE (\`${entityIdColumn1_name}\`, \`${entityIdColumn2_name}\`) IN (${placeholders})
    `;
    const [results] = await databaseConnectionPool.execute(sql, params);
    if (results !== undefined && results.length !== 0) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(deleteTwoKeyEntitySelection)Successfully a selection of two-key entities in the "${entityTableName}" table!`,
        );
      return results;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(deleteTwoKeyEntitySelection)Failed to delete a selection of two-key entities in the "${entityTableName}" table!
          Query: "${sql}"
          Parameters: "${params}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(deleteTwoKeyEntitySelection)Generally failed to delete a selection of two-key entities in the "${entityTableName}" table!
        Error message: "${error}".`,
      );
    return false;
  }
}
