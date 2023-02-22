/* eslint-disable @typescript-eslint/no-explicit-any */

export class PlaceHolder {
  #placeholders: Map<string, { placeholder: string, callback: (params: { [K in string]: any }) => string }>;
  constructor() {
    this.#placeholders = new Map();
  }

  parse(str: string, params: { [K in string]: any }) {
    return str.replace(/(?<!\\)!(?<!\\)\[(\w+)?\]/g, (input, key) => {
      const placeholder = this.#placeholders.get(key);
      return placeholder?.callback?.(params) ?? input;
    });
  }

  register(placeholder: string, callback: { (params: { [K in string]: any }): string }, force = false) {
    if (!placeholder) throw new TypeError('A placeholder must be specified');
    if (!force && this.#placeholders.has(placeholder)) throw new TypeError('The placeholder is already registered');
    this.#placeholders.set(placeholder, { placeholder, callback });
    return this;
  }

  list() {
    return [...this.#placeholders.keys()].map(key => `![${key}]`);
  }
}