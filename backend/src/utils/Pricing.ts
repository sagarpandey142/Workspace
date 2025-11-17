// src/utils/pricer.ts
import { toTz } from "./Time";
import dayjs, { Dayjs } from "dayjs";

interface Room {
  baseHourlyRate: number;
}

// peak windows Mon-Fri: 10:00-13:00 and 16:00-19:00 (local time)
function isPeakMinute(t: Dayjs): boolean {
  const day = t.day(); // 0=Sun .. 6=Sat
  if (day < 1 || day > 5) return false; // Not Mon-Fri

  const hm = t.hour() * 60 + t.minute();
  const inRange = (a: number, b: number) => hm >= a && hm < b;

  if (inRange(10 * 60, 13 * 60)) return true;
  if (inRange(16 * 60, 19 * 60)) return true;

  return false;
}


function computePriceForRange(
  room: Room,
  startISO: string,
  endISO: string
): number {
  let cursor: Dayjs = toTz(startISO);
  const end: Dayjs = toTz(endISO);
  const basePerMin: number = room.baseHourlyRate / 60;
  let total = 0;

  while (cursor.isBefore(end)) {
    const peak = isPeakMinute(cursor);
    total += basePerMin * (peak ? 1.5 : 1);
    cursor = cursor.add(1, "minute");
  }

  return Math.round(total); 
}

export { computePriceForRange, isPeakMinute, Room };
