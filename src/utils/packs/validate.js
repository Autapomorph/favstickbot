import { packNameMaxLength } from '../../config/packs.js';

export const validateNameLength = name =>
  name && name.length > 0 && name.length <= packNameMaxLength;

export const validateNameSymbols = name => name && /^(?!.*__)[a-zA-Z]\w*$/.test(name);
