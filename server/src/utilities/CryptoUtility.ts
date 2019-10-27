const crypto2 = require('crypto');

export class CryptoUtility {
  /**
   * generates random string of characters i.e salt
   * @function
   * @param {number} length - Length of the random string.
   */
  public static genRandomString(length: number): string {
    return crypto2
      .randomBytes(Math.ceil(length / 2))
      .toString('hex') /** convert to hexadecimal format */
      .slice(0, length); /** return required number of characters */
  }

  /**
   * hash password with sha512.
   * @function
   * @param {string} password - List of required fields.
   * @param {string} salt - Data to be validated.
   */
  public static sha512(password: string, salt: string): string {
    const hash = crypto2.createHmac('sha512', salt);
    /** Hashing algorithm sha512 */
    hash.update(password);
    return hash.digest('hex');
  }
}
