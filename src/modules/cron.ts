import fs from 'fs';
import path from 'path';
import { ScheduleOptions, getTasks, schedule, validate } from 'node-cron';

export class Cron {
  private options: ScheduleOptions;
  private constructor() {
    this.options = {};
  }

  private static readonly instance = new Cron();
  private static readonly exp = {
    second: Array.from(range(60)),
    minute: Array.from(range(60)),
    hour: Array.from(range(24)),
    date: Array.from(range(1, 32)),
    month: Array.from(range(1, 13)),
    day: Array.from(range(7)),
  };

  static setTimeZone(zone: string) {
    Cron.instance.options.timezone = zone;
  }

  static register(
    cronExpression: string | Cron.Schedule,
    func: (now: Date | 'manual' | 'init') => void,
    options?: ScheduleOptions,
  ) {
    if (typeof cronExpression === 'string') {
      if (!validate(cronExpression))
        throw new TypeError('Incorrect value for cronExpression');
      schedule(cronExpression, func, { ...Cron.instance.options, ...options });
    } else {
      const parsed = Cron.parseExpressions(cronExpression);
      if (!validate(parsed))
        throw new TypeError('Incorrect value for cronExpression');
      schedule(parsed, func, { ...Cron.instance.options, ...options });
    }
  }

  static getTasks() {
    return getTasks();
  }

  static async registerFiles(
    basePath: string,
    predicate?: (value: fs.Dirent) => boolean,
  ) {
    for (const filePath of Cron.getAllPath(basePath, predicate)) {
      const { default: fileData } = await import(filePath);
      if (!fileData) continue;
      const schedules = Array.isArray(fileData) ? fileData : [fileData];
      for (const { cronExpression, func, options } of schedules)
        Cron.register(cronExpression, func, options);
    }
  }

  private static getAllPath(
    basePath: string,
    predicate?: (value: fs.Dirent) => boolean,
    pre = new Set<string>(),
  ) {
    const predicateFunc =
      typeof predicate === 'function'
        ? predicate
        : (value: fs.Dirent) => !/^(-|_|\.)/.test(value.name);
    if (!fs.existsSync(basePath)) return [];
    for (const data of fs.readdirSync(basePath, { withFileTypes: true })) {
      if (data.isFile() && predicateFunc(data)) {
        pre.add(path.resolve(basePath, data.name));
        continue;
      }
      if (data.isDirectory() && predicateFunc(data))
        Cron.getAllPath(path.resolve(basePath, data.name), predicateFunc, pre);
    }
    return [...pre];
  }

  private static parseExpressions(expression: Cron.Schedule) {
    const exp: Required<Cron.Schedule> = {
      second: 0,
      minute: '*',
      hour: '*',
      date: '*',
      month: '*',
      day: '*',
      ...expression,
    };
    const parsed = Object.entries(exp).map(([k, v]) =>
      Cron.parseExpression(v, Cron.exp[k as keyof typeof Cron.exp]),
    );
    return parsed.join(' ');
  }

  private static parseExpression(
    exp: Cron.ScheduleFunc,
    validTimes: number[],
  ): string {
    if (typeof exp === 'string') return exp;
    if (typeof exp === 'number') return exp.toString();
    if (Array.isArray(exp)) return exp.join(',');
    return validTimes.filter(exp).join(',');
  }
}

function range(max: number): Generator<number>;
function range(min: number, max: number): Generator<number>;
function* range(_min: number, _max = 0) {
  const [min, max] = _min > _max ? [_max, _min] : [_min, _max];
  for (let i = min; i < max; i++) yield i;
}

export class CronBuilder {
  constructor(
    public readonly cronExpression: string | Cron.Schedule,
    public readonly func: (now: Date | 'manual' | 'init') => void,
    public readonly options?: ScheduleOptions,
  ) {}
}

export namespace Cron {
  export type Schedule = Partial<
    Record<
      'second' | 'minute' | 'hour' | 'date' | 'month' | 'day',
      ScheduleFunc
    >
  >;

  export type ScheduleFunc =
    | string
    | number
    | number[]
    | ((time: number) => boolean);
}
