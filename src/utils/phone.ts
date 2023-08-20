import { parsePhoneNumber } from 'libphonenumber-js';

const getPhoneNumber = (phoneString: string) => {
  const phoneNumber = parsePhoneNumber(phoneString, 'IL');
  if (phoneNumber) {
    return phoneNumber.number;
  }
  return '';
};

export { getPhoneNumber };
