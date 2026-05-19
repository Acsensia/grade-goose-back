//imports

//imports->project
import * as consoleLoggers from "../../../console/consoleLoggers.js";

//functions are supposed to work with mysql2/promise connections

// NON EXPORTED (UTILITY) FUNCTIONS //

// EXPORTED FUNCTIONS //

// select all function
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
        `(getAllStudentGroups)Trying to get all the entities from the "${entityTableName}"...`,
      );

    let sql = `
    SELECT t.*, t.${entityIdColumnName} AS id
    FROM \`${entityTableName}\` t
    `;
    const [results] = await databaseConnectionPool.execute(sql);
    if (results !== undefined) {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logSuccess(
          `(getAllStudentGroups)Successfully got all the entities from the "${entityTableName}"!`,
        );
      return results;
    } else {
      if (areMessagesToBeDisplayed)
        consoleLoggers.logError(
          `(getAllStudentGroups)Failed to get all the entities from the "${entityTableName}"!
          Query: "${sql}"
          Search results: "${results}"`,
        );
      return false;
    }
  } catch (error) {
    if (areMessagesToBeDisplayed)
      consoleLoggers.logError(
        `(getAllStudentGroups)Generally failed to get all the entities from the "${entityTableName}"!
        Error message: "${error}".`,
      );
    return false;
  }
}

// select one function
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
