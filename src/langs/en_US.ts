import { langKeys } from './langKeys';
import { LangKey, langData, tl } from './index';

const lang: Partial<langData> = {
  [langKeys.featureTitle](title) {
    return `\`🔧\` Setting: ${tl({ key: title as LangKey }, this.lang)}`;
  },
  [langKeys.joinLeaveMsgTitle]: 'Join and Leave Messages',
  [langKeys.inServerRptTitle]: 'In-server reporting',
  [langKeys.messageExpTitle]: 'Message URL expansion',
  [langKeys.eventLogTitle]: 'Event logs',
  [langKeys.chgVerifyLvTitle]: 'Automatic verification level change',
  [langKeys.autoPublicTitle]: 'Automatic Announcement Publication',
  [langKeys.autoModPlusTitle]: 'AutoMod Plus',
  [langKeys.autoThreadTitle]: 'Automatic thread creation',
}

export default lang;