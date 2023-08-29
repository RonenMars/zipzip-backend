/**
 * Generates a random one-time password (OTP) of a specified length.
 *
 * @param {number} n - The length of the OTP to generate.
 * @returns {string} A randomly generated OTP of the specified length.
 */
export const generateOTP = (n: number): string => {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < n; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }

  return otp;
};
