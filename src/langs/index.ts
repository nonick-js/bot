import { langKeys } from './langKeys';
import ja_JP from './ja_JP';
import en_US from './en_US';
import { Locale } from 'discord.js';

export * from './langKeys';
export type LangKey = typeof langKeys[keyof typeof langKeys];

export type langData = Record<
  LangKey,
  string | ((this: { lang: SupportLangs }, ...args: string[]) => string)
>;
export const defaultLang = Locale.Japanese;
export const supportLangs = [
  Locale.EnglishUS
] as const;
export type SupportLangs = typeof supportLangs[number] | typeof defaultLang;

export const langs: Record<
  SupportLangs,
  Partial<langData>
> & { [defaultLang]: langData } = {
  [Locale.Japanese]: ja_JP,
  [Locale.EnglishUS]: en_US
}

export function tl(
  data: { key: LangKey, args?: string[] },
  lang?: SupportLangs
) {
  const selectLang = lang ?? defaultLang;
  const langData = langs[selectLang];
  const langMsg = langData[data.key];
  const msg = langMsg ?? langs[defaultLang][data.key];
  if (typeof msg === 'function') return msg.call({ lang: langMsg ? selectLang : defaultLang }, ...(data.args ?? []));
  if (!data.args?.length) return msg;
  data.args.unshift(msg);
  return String(...data.args);
}