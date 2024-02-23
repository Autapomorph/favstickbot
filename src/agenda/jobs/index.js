import { packsDeleteOutdatedJob } from './packsDeleteOutdated.js';
import { packsDeleteEmptyJob } from './packsDeleteEmpty.js';
import { packsDeleteNonExistentJob } from './packsDeleteNonExistent.js';
import { usersDeleteZeroPacksJob } from './usersDeleteZeroPacks.js';

export const jobs = [
  packsDeleteOutdatedJob,
  packsDeleteEmptyJob,
  packsDeleteNonExistentJob,
  usersDeleteZeroPacksJob,
];
