import promptSync from 'prompt-sync';
const prompt = promptSync();
import * as consoleLoggers from './consoleLoggers.js';

function _askTwoOptions(_prompt, _optionYes, _optionNo) {
    if (typeof _prompt !== 'string'){
        consoleLoggers.logParameterTypeError('_prompt', 'string', _prompt, '_askTwoOptions');
        return undefined;
    }
    if (typeof _optionYes !== 'string'){
        consoleLoggers.logParameterTypeError('_optionYes', 'string', _optionYes, '_askTwoOptions');
        return undefined;
    }
    if (typeof _optionNo !== 'string'){
        consoleLoggers.logParameterTypeError('_optionNo', 'string', _optionNo, '_askTwoOptions');
        return undefined;
    }

    const input = prompt(
        _prompt +
        "(" + _optionYes +
        "/" + _optionNo + ") "
    );
    if (input === _optionYes) return true;
    else return false;
}

function _ask(_prompt) {
    if (typeof _prompt !== 'string'){
        consoleLoggers.logParameterTypeError('_prompt', 'string', _prompt, '_ask');
        return undefined;
    }

    return prompt(_prompt);
}

function _askEnsureTwice(_prompt, _promptAgain) {
    if (typeof _prompt !== 'string'){
        consoleLoggers.logParameterTypeError('_prompt', 'string', _prompt, '_askEnsureTwice');
        return undefined;
    }
    if (typeof _promptAgain !== 'string'){
        consoleLoggers.logParameterTypeError('_promptAgain', 'string', _promptAgain, '_askEnsureTwice');
        return undefined;
    }

    for (;;) {
        const input = prompt(_prompt);
        const inputAgain = prompt(_promptAgain);
        if (input !== inputAgain) {
            consoleLoggers.logError(`${input} does not equal to ${inputAgain}!`);
            if (askTwoOptions(`Try again?`, 'Y', 'N')) continue;
            else return undefined;
        } else return input;
    }
}

//exports
export const askTwoOptions = _askTwoOptions;
export const ask = _ask;
export const askEnsureTwice = _askEnsureTwice;