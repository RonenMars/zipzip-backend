import { parsePhoneNumber } from 'libphonenumber-js';

const isValidPhoneNumber = (phoneString: string) =>
  parsePhoneNumber(phoneString, 'IL').isPossible();

const getPhoneNumber = (phoneString: string) => {
  const phoneNumber = parsePhoneNumber(phoneString, 'IL');
  if (phoneNumber) {
    return phoneNumber.number;
  }
  return '';
};

export { isValidPhoneNumber, getPhoneNumber };
