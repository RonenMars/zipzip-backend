import { parsePhoneNumber } from 'libphonenumber-js';

/**
 * Parses a phone number string and returns the normalized phone number in Israel format.
 *
 * @function
 * @param {string} phoneString - The phone number string to parse.
 * @returns {string} The normalized phone number in Israel format, or an empty string if the input is not a valid phone number.
 * @throws {Error} If there is an issue parsing the phone number.
 * @example
 * const phoneNumberString = '+972123456789';
 * const normalizedPhoneNumber = getPhoneNumber(phoneNumberString);
 * console.log(normalizedPhoneNumber); // Output: "123456789"
 */
const getPhoneNumber = (phoneString: string) => {
  const phoneNumber = parsePhoneNumber(phoneString, 'IL');
  if (phoneNumber) {
    return phoneNumber.number;
  }
  return '';
};

export { getPhoneNumber };
