import * as bcrypt from 'bcrypt';

/**
 * Hashes a password using bcrypt.
 *
 * @param {string | undefined} password - The password to be hashed.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
export const hashPassword = async (
  password: string | undefined,
): Promise<string> => {
  if (password) {
    return (await bcrypt.hash(password, 10)) || '';
  } else return '';
};

/**
 * Verifies a password by comparing it to a hashed version using bcrypt.
 *
 * @param {object} options - An object containing the password and its hash.
 * @param {string} options.password - The password to be verified.
 * @param {string} options.hash - The hashed password to compare against.
 * @returns {Promise<boolean>} A promise that resolves to true if the password matches the hash, otherwise false.
 */
export const verifyPassword = async ({
  password,
  hash,
}: {
  password: string;
  hash: string;
}): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
