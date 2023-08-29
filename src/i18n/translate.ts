import { I18nContext } from 'nestjs-i18n';

/**
 * Translates a given string using the current locale's translation resources.
 *
 * @function
 * @param {string} translateStr - The string to be translated.
 * @returns {string} The translated string if found; otherwise, 'no translation found'.
 *
 * @example
 * import { Controller, Get } from '@nestjs/common';
 * import { I18nService } from 'nestjs-i18n';
 * import { translate } from '@i18n/translate';
 *
 * @Controller('example')
 * export class ExampleController {
 *   constructor(private readonly i18n: I18nService) {}
 *
 *   @Get('translate')
 *   translateExample() {
 *     const translatedText = translate('hello');
 *     return { translatedText };
 *   }
 * }
 */
export const translate = (translateStr: string): string => {
  const i18n = I18nContext.current();
  return i18n?.t(translateStr) || 'no translation found';
};
