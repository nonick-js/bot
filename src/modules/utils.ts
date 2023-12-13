import { GeneralSetting, Utils } from '@models';
import { langs } from 'lang';

export async function setLang(serverId: string) {
  const setting = await GeneralSetting.findOne({ serverId });
  if (setting?.lang)
    langs.setLang(setting.lang as (typeof Utils.LangKey)[number]);
}
