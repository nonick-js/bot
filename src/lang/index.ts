import { Languages } from '@modules/translate';
import { type ChatInputApplicationCommandData, Locale } from 'discord.js';
import { en_US } from './en-US';
import { ja_JP } from './ja-JP';
import { LangTemplate } from './template';

export const langs = new Languages<Locale[], LangTemplate>(Locale.EnglishUS);

langs.register(Locale.Japanese, ja_JP);
langs.register(Locale.EnglishUS, en_US);

export function createDescription(
  key: keyof LangTemplate,
): Pick<
  ChatInputApplicationCommandData,
  'description' | 'descriptionLocalizations'
> {
  const descriptionLocalizations: ChatInputApplicationCommandData['descriptionLocalizations'] =
    {};
  for (const lang of langs.languages)
    descriptionLocalizations[lang] = langs.tlLang(lang, key);
  return {
    description: langs.tlLang(Locale.EnglishUS, key),
    descriptionLocalizations,
  };
}
