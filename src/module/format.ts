/* eslint-disable @typescript-eslint/no-explicit-any */
export namespace PlaceHolder {
  export type Prefix = '!' | '#' | '%' | '&' | '-' | '=' | '^';
  export type Brackets = '[]' | '{}' | '()' | '<>' | '';
}

export class PlaceHolder<T extends Readonly<Record<string, any>>> {
  private holder: Map<string, { key: string, callback: (params: T) => string }>;
  constructor(private _prefix: PlaceHolder.Prefix = '!', private _brackets: PlaceHolder.Brackets = '[]') {
    this.holder = new Map();
  }

  private _parse(str: string, params: T): string {
    const [start, end] = this.getBrackets();
    return str.replace(new RegExp(`(?<!\\\\)\\${this._prefix}(?<!\\\\)\\${start}(\\w+)(?<!\\\\)\\${end}`, 'g'), (input, key) => {
      const placeholder = this.holder.get(key);
      return placeholder?.callback?.(params) ?? input;
    });
  }

  parse(str: string, params: T): string;
  parse(obj: Readonly<Record<string | number | symbol, any>>, params: T): string;
  parse(str: string | Readonly<Record<string | number | symbol, any>>, params: T) {
    if (typeof str === 'string') return this._parse(str, params);
    return JSON.parse(JSON.stringify(str), (_, value) => {
      if (typeof value === 'string') return this._parse(value, params);
      return value;
    });
  }

  register(key: string, callback: (param: T) => string, force = false) {
    if (!key) throw new TypeError('A placeholder must be specified');
    if (!force && this.holder.has(key)) throw new TypeError('The placeholder is already registered');
    this.holder.set(key, { key, callback });
    return this;
  }

  list() {
    const [start, end] = this.getBrackets();
    return Array.from(this.holder.keys(), key => `${this._prefix}${start}${key}${end}`);
  }

  private getBrackets() {
    const [start = '', end = ''] = this._brackets.split('');
    return [start, end];
  }

  get prefix() {
    return this._prefix;
  }

  set prefix(prefix: PlaceHolder.Prefix) {
    this._prefix = prefix;
  }

  get brackets() {
    return this._brackets;
  }

  set brackets(brackets: PlaceHolder.Brackets) {
    this._brackets = brackets;
  }
}

export namespace Duration {
  const durations = {
    y: { time: 365 * 24 * 60 * 60 * 1000, long: 'year' },
    w: { time: 7 * 24 * 60 * 60 * 1000, long: 'week' },
    d: { time: 24 * 60 * 60 * 1000, long: 'day' },
    h: { time: 60 * 60 * 1000, long: 'hour' },
    m: { time: 60 * 1000, long: 'minute' },
    s: { time: 1000, long: 'second' },
    ms: { time: 1, long: 'millisecond' },
  };
  export type List = keyof typeof durations;

  const holder = new PlaceHolder<Partial<Record<List, number>>>('%', '');
  Object.keys(durations).forEach(key => {
    holder.register(key, data => {
      const date = data[key as List];
      return date ? date.toString() : '0';
    });
  });

  export function toMS(text: string) {
    const match = text.replace(/\s+/g, '').match(RegExp(Object.entries(durations).reduce((p, [short, { long }]) => p + `((?<${short}>-?(\\d*\\.\\d+|\\d+))(${short}|${long}))?`, ''), 'i'));
    return Object.entries(match?.groups ?? {}).reduce((p, [key, value = 0]) => p + Number(value) * durations[key as List].time || 0, 0);
  }

  export function parse(ms = 0, pass: List[] = []): Partial<Record<List, number>> {
    const absMs = Math.abs(ms);
    return Object.fromEntries(Object.entries(durations)
      .filter(([short]) => !pass.includes(short as List))
      .sort(([, { time: a }], [, { time: b }]) => b - a)
      .map(([k, v], i, a) => ({ ...v, short: k, diff: a[i - 1]?.[1]?.time / v.time }))
      .map(({ short, long, time, diff }) => ({ short, long, duration: isNaN(diff) ? Math.floor(absMs / time) : Math.floor(Math.floor(absMs / time) % diff) }))
      .filter(({ duration }) => duration != 0)
      .map(v => [v.short, v.duration])) as Partial<Record<List, number>>;
  }

  export function format(ms: number, compact: boolean, pass: List[]): string;
  export function format(ms: number, formatS: string): string;
  export function format(ms = 0, formatS: string | boolean = '', pass: List[] = []): string {
    if (typeof formatS === 'string' && formatS) return holder.parse(formatS, parse(ms, Object.keys(durations).filter(v => !formatS.includes(`%${v}`)) as List[]));
    return Object.entries(parse(ms, pass)).map(([short, duration]) => {
      const { long } = durations[short as List];
      return `${Math.sign(ms) == -1 ? '-' : ''}${duration}${formatS ? short : long}`;
    }).join(' ');
  }
}