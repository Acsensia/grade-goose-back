import { styleText } from 'node:util';
import { prompt } from 'prompt-sync';
import { logParameterTypeError} from 'mainConsoleLoggers.js';

function _consoleAskTwoOptions(_prompt, _optionYes, _optionNo) {
    if (typeof _prompt !== 'string'){
        logParameterTypeError('_prompt', 'string', _prompt, 'consoleAskTwoOptions');
        return undefined;
    }
    if (typeof _optionYes !== 'string'){
        logParameterTypeError('_optionYes', 'string', _optionYes, 'consoleAskTwoOptions');
        return undefined;
    }
    if (typeof _optionNo !== 'string'){
        logParameterTypeError('_optionNo', 'string', _optionNo, 'consoleAskTwoOptions');
        return undefined;
    }

    const input = prompt(
        styleText('yellow', _prompt) +
        "(" + styleText('green', _optionYes) +
        "/" + styleText('red', _optionNo) + ")"
    );
    if (input === _optionYes) return true;
    else return false;
}

//exports
export const consoleAskTwoOptions = _consoleAskTwoOptions;