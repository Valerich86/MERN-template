import {dirname} from 'path';
import { fileURLToPath } from 'url';

const currentDir = dirname(dirname(fileURLToPath(import.meta.url)));
export {currentDir};