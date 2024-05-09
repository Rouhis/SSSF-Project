import jwt from 'jsonwebtoken';
import {TokenContent} from '../types/DBTypes';

/**
 * Verifies the provided JWT token and returns its content.
 *
 * @param {string} token - The JWT token to verify.
 * @returns {TokenContent} The content of the verified token.
 * @throws {Error} If the token is invalid or expired.
 */
export const checkToken = (token: string): TokenContent => {
  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as TokenContent;
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
