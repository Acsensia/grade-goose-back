import promptSync from 'prompt-sync';
const prompt = promptSync();
import { logParameterTypeError } from './mainConsoleLoggers.js';

function _askTwoOptions(_prompt, _optionYes, _optionNo) {
    if (typeof _prompt !== 'string'){
        logParameterTypeError('_prompt', 'string', _prompt, '_askTwoOptions');
        return undefined;
    }
    if (typeof _optionYes !== 'string'){
        logParameterTypeError('_optionYes', 'string', _optionYes, '_askTwoOptions');
        return undefined;
    }
    if (typeof _optionNo !== 'string'){
        logParameterTypeError('_optionNo', 'string', _optionNo, '_askTwoOptions');
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

//exports
export const askTwoOptions = _askTwoOptions;