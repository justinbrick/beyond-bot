import { DateTime } from 'luxon';

// I put this here so we can easily simulate different times

export const getCurrentTime = () => DateTime.now().minus({ days: 7 });
//export const getCurrentTime = () => DateTime.fromISO('2022-06-30');
