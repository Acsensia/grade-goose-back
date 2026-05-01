import { styleText } from "node:util";

function _logParameterExistenceError(parameterName, functionName) {
  //logging written without 'logParameterTypeError' to prevent issues with infinite recursion
  if (parameterName === undefined) {
    console.log(styleText("magenta", "\n-- -- --"));
    console.log(
      styleText(
        "magenta",
        "PARAMETER EXISTENCE ERROR: 'logParameterExistenceError' was called without 'parameterName' parameter.",
      ),
    );
    console.log(styleText("magenta", "-- -- -- \n"));
    return;
  }
  if (functionName === undefined) {
    console.log(styleText("magenta", "\n-- -- --"));
    console.log(
      styleText(
        "magenta",
        "PARAMETER EXISTENCE ERROR: 'logParameterExistenceError' was called without 'functionName' parameter.",
      ),
    );
    console.log(styleText("magenta", "-- -- -- \n"));
    return;
  }
  if (typeof parameterName !== "string") {
    console.log(styleText("magenta", "\n-- -- --"));
    console.log(
      styleText(
        "magenta",
        "PARAMETER TYPE ERROR: 'logParameterExistenceError' was called when type of 'parameterName' was not 'string'.",
      ),
    );
    console.log(
      styleText(
        "magenta",
        "Instead, 'parameterName' was of type '" + typeof parameterName + "'.",
      ),
    );
    console.log(styleText("magenta", "-- -- -- \n"));
    return;
  }
  if (typeof functionName !== "string") {
    console.log(styleText("magenta", "\n-- -- --"));
    console.log(
      styleText(
        "magenta",
        "PARAMETER TYPE ERROR: 'logParameterExistenceError' was called when type of 'functionName' was not 'string'.",
      ),
    );
    console.log(
      styleText(
        "magenta",
        "Instead, 'functionName' was of type '" + typeof functionName + "'.",
      ),
    );
    console.log(styleText("magenta", "-- -- -- \n"));
    return;
  }

  //if the parameters are present and of the right type
  console.log(styleText("magenta", "\n-- -- --"));
  console.log(
    styleText(
      "magenta",
      "PARAMETER EXISTENCE ERROR: '" +
        functionName +
        "' was called without '" +
        parameterName +
        "' parameter.",
    ),
  );
  console.log(styleText("magenta", "-- -- -- \n"));
  return;
}

function _logParameterTypeError(
  parameterName,
  parameterExpectedType,
  parameter,
  functionName,
) {
  //logging written without 'logParameterExistenceError' to prevent issues with infinite recursion
  if (parameterName === undefined) {
    console.log(styleText("magenta", "\n-- -- --"));
    console.log(
      styleText(
        "magenta",
        "PARAMETER EXISTENCE ERROR: 'logParameterTypeError' was called without 'parameterName' parameter.",
      ),
    );
    console.log(styleText("magenta", "-- -- -- \n"));
    return;
  }
  if (parameterExpectedType === undefined) {
    console.log(styleText("magenta", "\n-- -- --"));
    console.log(
      styleText(
        "magenta",
        "PARAMETER EXISTENCE ERROR: 'logParameterTypeError' was called without 'parameterExpectedType' parameter.",
      ),
    );
    console.log(styleText("magenta", "-- -- -- \n"));
    return;
  }
  // if (parameter === undefined) {
  //   console.log(styleText("magenta", "\n-- -- --"));
  //   console.log(
  //     styleText(
  //       "magenta",
  //       "PARAMETER EXISTENCE ERROR: 'logParameterTypeError' was called without 'parameter' parameter.",
  //     ),
  //   );
  //   console.log(styleText("magenta", "-- -- -- \n"));
  //   return;
  // }
  if (functionName === undefined) {
    console.log(styleText("magenta", "\n-- -- --"));
    console.log(
      styleText(
        "magenta",
        "PARAMETER EXISTENCE ERROR: 'logParameterTypeError' was called without 'functionName' parameter.",
      ),
    );
    console.log(styleText("magenta", "-- -- -- \n"));
    return;
  }
  if (typeof parameterName !== "string") {
    console.log(styleText("magenta", "\n-- -- --"));
    console.log(
      styleText(
        "magenta",
        "PARAMETER TYPE ERROR: 'logParameterTypeError' was called when type of 'parameterName' was not 'string'.",
      ),
    );
    console.log(
      styleText(
        "magenta",
        "Instead, 'parameterName' was of type '" + typeof parameterName + "'.",
      ),
    );
    console.log(styleText("magenta", "-- -- -- \n"));
    return;
  }
  if (typeof parameterExpectedType !== "string") {
    console.log(styleText("magenta", "\n-- -- --"));
    console.log(
      styleText(
        "magenta",
        "PARAMETER TYPE ERROR: 'logParameterTypeError' was called when type of 'parameterExpectedType' was not 'string'.",
      ),
    );
    console.log(
      styleText(
        "magenta",
        "Instead, 'parameterExpectedType' was of type '" +
          typeof parameterExpectedType +
          "'.",
      ),
    );
    console.log(styleText("magenta", "-- -- -- \n"));
    return;
  }
  if (typeof functionName !== "string") {
    console.log(styleText("magenta", "\n-- -- --"));
    console.log(
      styleText(
        "magenta",
        "PARAMETER TYPE ERROR: 'logParameterTypeError' was called when type of 'functionName' was not 'string'.",
      ),
    );
    console.log(
      styleText(
        "magenta",
        "Instead, 'functionName' was of type '" + typeof functionName + "'.",
      ),
    );
    console.log(styleText("magenta", "-- -- -- \n"));
    return;
  }

  //if the parameters are present and of the right type
  console.log(styleText("magenta", "\n-- -- --"));
  console.log(
    styleText(
      "magenta",
      "PARAMETER TYPE ERROR: '" +
        functionName +
        "' was called when type of '" +
        parameterName +
        "' was not '" +
        parameterExpectedType +
        "'.",
    ),
  );
  console.log(
    styleText(
      "magenta",
      "Instead, '" +
        parameterName +
        "' was of type '" +
        typeof parameter +
        "'.",
    ),
  );
  console.log(styleText("magenta", "-- -- -- \n"));
}

function _logError(message) {
  if (message === undefined) {
    _logParameterExistenceError("message", "logError");
    return;
  }
  if (typeof message !== "string") {
    _logParameterTypeError("message", "string", message, "logError");
    return;
  }
  console.log(styleText("red", message));
}

function _logSuccess(message) {
  if (message === undefined) {
    _logParameterExistenceError("message", "logSuccess");
    return;
  }
  if (typeof message !== "string") {
    _logParameterTypeError("message", "string", message, "logSuccess");
    return;
  }
  console.log(styleText("green", message));
}

function _logFinalSuccess(message) {
  if (message === undefined) {
    _logParameterExistenceError("message", "logSuccess");
    return;
  }
  if (typeof message !== "string") {
    _logParameterTypeError("message", "string", message, "logSuccess");
    return;
  }
  console.log(styleText("bgGreen", message));
}

function _logNeutral(message) {
  if (message === undefined) {
    _logParameterExistenceError("message", "logNeutral");
    return;
  }
  if (typeof message !== "string") {
    _logParameterTypeError("message", "string", message, "logNeutral");
    return;
  }
  console.log(styleText("gray", message));
}

function _logWarning(message) {
  if (message === undefined) {
    _logParameterExistenceError("message", "logWarning");
    return;
  }
  if (typeof message !== "string") {
    _logParameterTypeError("message", "string", message, "logWarning");
    return;
  }
  console.log(styleText("yellow", message));
}

//exports
export const logParameterExistenceError = _logParameterExistenceError;
export const logParameterTypeError = _logParameterTypeError;
export const logError = _logError;
export const logSuccess = _logSuccess;
export const logFinalSuccess = _logFinalSuccess;
export const logNeutral = _logNeutral;
export const logWarning = _logWarning;
