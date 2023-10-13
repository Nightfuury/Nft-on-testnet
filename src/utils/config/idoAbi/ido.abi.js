import { harmonyABI } from '../../abi/ido/harmony/harmony.abi';

const idoAbiList = {
    harmony: harmonyABI
}


export const fetchIdoAbi = (
    { name } = { name: 'harmony' }
) => idoAbiList[`${name}`];