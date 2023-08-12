import { I18nContext } from 'nestjs-i18n';

export const translate = (translateStr: string): string => {
  const i18n = I18nContext.current();
  return i18n?.t(translateStr) || 'no translation found';
};
