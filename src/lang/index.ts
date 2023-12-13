import { Utils } from '@models';
import { Languages } from '@modules/translate';
import { en_US } from './en-US';
import { ja_JP } from './ja-JP';
import { LangTemplate } from './template';

export const langs = new Languages<typeof Utils.LangKey, LangTemplate>('ja-JP');

langs.register('ja-JP', ja_JP);
langs.register('en-US', en_US);
