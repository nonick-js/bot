import { Locale } from "discord.js";
import { langKeys, tl } from "./index";

const titleJP = tl({
  key: langKeys.featureTitle,
  args: [langKeys.inServerRptTitle]
});

const titleUS = tl({
  key: langKeys.featureTitle,
  args: [langKeys.inServerRptTitle]
}, Locale.EnglishUS);

console.info(titleJP);
console.info(titleUS);