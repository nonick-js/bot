import fs from 'node:fs';
import path from 'node:path';
import { Client, ClientEvents } from 'discord.js';

export interface DiscordEvent<T extends keyof ClientEvents> {
  type: T,
  once?: boolean,
  execute: (...args: ClientEvents[T]) => void
}

export class DiscordEventBuilder<T extends keyof ClientEvents> implements DiscordEvent<T> {
  readonly type: T;
  private _once?: boolean;
  private _execute: (...args: ClientEvents[T]) => void;
  constructor(data: DiscordEvent<T>)
  constructor(execute: (...args: ClientEvents[T]) => void, type: T, once?: boolean)
  constructor(data: DiscordEvent<T> | ((...args: ClientEvents[T]) => void), type?: T, once?: boolean) {
    if (typeof data === 'function') {
      if (!type) throw new TypeError('type is not specified');
      data = {
        execute: data,
        type,
        once,
      };
    }
    this.type = data.type;
    this._once = data.once;
    this._execute = data.execute;
  }

  setOnce(once: boolean): this {
    this._once = once;
    return this;
  }

  setExecute(execute: (...args: ClientEvents[T]) => void): this {
    this._execute = execute;
    return this;
  }

  get once() {
    return this._once;
  }

  get execute() {
    return this._execute;
  }
}

export class DiscordEvents {
  private data: Partial<{ [K in keyof ClientEvents]: { once: ((...args: ClientEvents[K]) => void)[], on: ((...args: ClientEvents[K]) => void)[] } }>;
  constructor(private client: Client) {
    this.data = {};
  }

  register(basePath: string, predicate?: (value: fs.Dirent) => boolean) {
    this.getAllPath(basePath, predicate).forEach(filePath => {
      const eventData = require(filePath) as DiscordEvent<keyof ClientEvents> | DiscordEvent<keyof ClientEvents>[];
      if (Array.isArray(eventData)) {
        eventData.forEach(event => this.pushEvent(event));
      }
      else {
        this.pushEvent(eventData);
      }
    });
  }

  private pushEvent<T extends keyof ClientEvents>(event: DiscordEvent<T>) {
    if (!this.data[event.type]) {
      this.data[event.type] = { once: [], on: [] };
      this.client.on(event.type, (...args: ClientEvents[T]) => {
        this.data[event.type]?.on.forEach(execute => {
          execute(...args);
        });
      });
    }
    if (event.once) {
      if (!this.data[event.type]?.once.length) {
        this.client.once(event.type, (...args: ClientEvents[T]) => {
          this.data[event.type]?.once.forEach((execute, i) => {
            execute(...args);
            this.data[event.type]?.once.splice(i, 1);
          });
        });
      }
      this.data[event.type]?.once.push(event.execute);
    }
    else {
      this.data[event.type]?.on.push(event.execute);
    }
  }

  private getAllPath(basePath: string, predicate?: (value: fs.Dirent) => boolean, pre = new Set<string>()) {
    if (typeof predicate !== 'function') predicate = (value) => !/^(-|_|\.)/.test(value.name);
    if (!fs.existsSync(basePath)) return [];
    fs.readdirSync(basePath, { withFileTypes: true }).forEach((v) => {
      if (v.isFile() && (predicate?.(v) ?? true)) return pre.add(path.resolve(basePath, v.name));
      if (v.isDirectory() && (predicate?.(v) ?? true)) this.getAllPath(path.resolve(basePath, v.name), predicate, pre);
    });
    return [...pre];
  }
}