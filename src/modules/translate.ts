type LangTemplate = Readonly<Record<string, unknown[]>>;
export type LangData<T extends LangTemplate> = {
  [K in keyof T]?: (...params: T[K]) => string;
};

export class Languages<
  Lang extends Readonly<string[]>,
  T extends LangTemplate,
> {
  private langData: Map<Lang[number], LangData<T>>;
  private currentLang: Lang[number];

  constructor(public readonly defaultLang: Lang[number]) {
    this.langData = new Map();
    this.currentLang = this.defaultLang;
  }

  register(lang: Lang[number], data: LangData<T>) {
    this.langData.set(lang, data);
  }

  setLang(lang: Lang[number]) {
    this.currentLang = lang;
  }

  translate<K extends keyof T>(key: K, ...args: T[K]): string;
  translate<S extends string>(
    key: Exclude<S, keyof T>,
    ...args: unknown[]
  ): string;
  translate<K extends keyof T>(key: K | string, ...args: T[K] | unknown[]) {
    const data = this.langData.get(this.currentLang)?.[key];
    const defaultData = this.langData.get(this.defaultLang)?.[key];
    return data?.(...args) ?? defaultData?.(...args) ?? (key as string);
  }

  tl = this.translate;

  translateLang<K extends keyof T>(
    lang: Lang[number],
    key: K,
    ...args: T[K]
  ): string;
  translateLang<S extends string>(
    lang: Lang[number],
    key: Exclude<S, keyof T>,
    ...args: unknown[]
  ): string;
  translateLang<K extends keyof T>(
    lang: Lang[number],
    key: K | string,
    ...args: T[K] | unknown[]
  ) {
    this.setLang(lang);
    return this.translate(key, ...(args as T[K] & T[string]));
  }

  tlLang = this.translateLang;

  get languages() {
    return this.langData.keys();
  }
}
