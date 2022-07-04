import { DateTime } from 'luxon';

// I put this here so we can easily simulate different times

//export const getCurrentTime = () => DateTime.now().plus({ days: 7 });
export const getCurrentTime = () => DateTime.fromISO('2022-10-05');
