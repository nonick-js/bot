class PlaceHolder {
  /** @type {Map<string, { placeholder: string, callback: (params: { [K in string]: any }) => string }>} */
  #placeholders;
  constructor() {
    this.#placeholders = new Map();
  }

  /**
   * @param {string} str
   * @param {{ [K in string]: any }} params
   */
  parse(str, params) {
    return str.replace(/(?<!\\)!(?<!\\)\[(\w+)?\]/g, (input, key) => {
      const placeholder = this.#placeholders.get(key);
      return placeholder?.callback?.(params) ?? input;
    });
  }

  /**
   * @param {string} placeholder
   * @param {(params: { [K in string]: any }) => string} callback
   * @param {boolean} [force]
   */
  register(placeholder, callback, force = false) {
    if (!placeholder) throw new TypeError('A placeholder must be specified');
    if (!force && this.#placeholders.has(placeholder)) throw new TypeError('The placeholder is already registered');
    this.#placeholders.set(placeholder, { placeholder, callback });
    return this;
  }

  list() {
    return [...this.#placeholders.keys()].map(key => `![${key}]`);
  }
}

module.exports = PlaceHolder;