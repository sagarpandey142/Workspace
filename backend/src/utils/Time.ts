// src/utils/Time.ts
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ: string = process.env.TZ || "Asia/Kolkata";

/**
 * Convert a date/time string or Dayjs object to target timezone
 */
function toTz(d: string | Date | Dayjs): Dayjs {
  return dayjs(d).tz(TZ);
}

/**
 * Return current ISO timestamp in target timezone
 */
function nowIso(): string {
  return dayjs().tz(TZ).toISOString();
}

/**
 * Returns difference in minutes between two date/times
 */
function minutesBetween(start: string | Date | Dayjs, end: string | Date | Dayjs): number {
  return toTz(end).diff(toTz(start), "minute");
}

export { toTz, nowIso, minutesBetween };
