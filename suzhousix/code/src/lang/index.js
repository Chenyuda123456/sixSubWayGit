import { createI18n } from 'vue-i18n';
import CNMessage from './cn';
import ENMessage from './en';

const i18n = createI18n({
  locale: window.localStorage.getItem('lang') || 'cn',
  legacy: false,
  messages: {
    cn: CNMessage,
    en: ENMessage
  }
});

export default i18n;
