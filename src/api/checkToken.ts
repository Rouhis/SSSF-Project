import jwt from 'jsonwebtoken';
import {TokenContent} from '../types/DBTypes';

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
