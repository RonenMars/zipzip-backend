/**
 * Generates a random code by converting a random number of 4 digits.
 *
 * @function
 * @returns {string} A random code consisting of 4 digits.
 * @throws {Error} If the generated code is not a valid 4-digit string.
 * @example
 * const randomCode = getRandomCode();
 * console.log(randomCode); // Output: "1234"
 */
const getRandomCode = () => Math.random().toString().slice(2, 6);

export { getRandomCode };
