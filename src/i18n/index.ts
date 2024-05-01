import { LocaleMessage } from "@intlify/core-base";
import { VueMessageType, createI18n } from "vue-i18n";
import en from "./en.json";
import ru from "./ru.json";

const messages: {
  [x: string]: LocaleMessage<VueMessageType>;
} = {
  en,
  ru,
};

export const i18n = createI18n({
  legacy: false,
  locale: navigator.language.split("-")[0],
  fallbackLocale: "en",
  messages: messages,
});
