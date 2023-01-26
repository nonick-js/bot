/* eslint-disable no-shadow */
const dur = {
  year:365 * 24 * 60 * 60 * 1000,
  week:7 * 24 * 60 * 60 * 1000,
  day:24 * 60 * 60 * 1000,
  hour:60 * 60 * 1000,
  minute:60 * 1000,
  second:1000,
  millisecond:1,
};
  /** @typedef {"y"|"w"|"d"|"h"|"m"|"s"|"ms"} durName */

export function toMS(text: string): number {
  /** @type {RegExpMatchArray} */
  const timeText = text.replace(/\s+/g, '').match(/((?<year>\d+)(?:y|year))?((?<week>\d+)(?:w|week))?((?<day>\d+)(?:d|day))?((?<hour>\d+)(?:h|hour))?((?<minute>\d+)(?:m|minute))?((?<second>\d+)(?:s|second))?((?<millisecond>\d+)(?:ms|millisecond))?/i);
  let ms = 0;
  ms += Number(timeText?.groups?.year ?? 0) * dur.year;
  ms += Number(timeText?.groups?.week ?? 0) * dur.week;
  ms += Number(timeText?.groups?.day ?? 0) * dur.day;
  ms += Number(timeText?.groups?.hour ?? 0) * dur.hour;
  ms += Number(timeText?.groups?.minute ?? 0) * dur.minute;
  ms += Number(timeText?.groups?.second ?? 0) * dur.second;
  ms += Number(timeText?.groups?.millisecond ?? 0) * dur.millisecond;
  return ms;
}

export function toText(time: number = 0, compact: boolean = false, pass: any[] = []): string {
  const absMs = Math.abs(time);
  const duration = [
    { short:'y', long:'year', duration:Math.floor(absMs / dur.year) },
    { short:'w', long:'week', duration:Math.floor(absMs / dur.week) },
    { short:'d', long:'day', duration:Math.floor(absMs / dur.day) % 7 },
    { short:'h', long:'hour', duration:Math.floor(absMs / dur.hour) % 24 },
    { short:'m', long:'minute', duration:Math.floor(absMs / dur.minute) % 60 },
    { short:'s', long:'second', duration:Math.floor(absMs / dur.second) % 60 },
    { short:'ms', long:'millisecond', duration:absMs % 1000 },
  ];
  const mapDur = duration
    .filter(dur => dur.duration != 0 && !pass.includes(dur.short))
    .map(dur => `${Math.sign(time) == -1 ? '-' : ''}${compact ? `${Math.floor(dur.duration)}${dur.short}` : `${Math.floor(dur.duration)}${dur.long}`}`).join(' ');
  return mapDur;
}