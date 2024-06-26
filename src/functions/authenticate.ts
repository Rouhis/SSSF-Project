import {Request} from 'express';
import jwt from 'jsonwebtoken';
import {LoginUser, TokenContent} from '../types/DBTypes';
import {MyContext} from '../types/MyContext';

export default async (req: Request): Promise<MyContext> => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const token = authHeader.split(' ')[1];
      const userFromToken = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as LoginUser;
      if (!userFromToken) {
        return {};
      }
      const tokenContent: TokenContent = {
        role: userFromToken.role,
        token: token,
        user: userFromToken,
        organization: userFromToken.organization,
      };
      return {userdata: tokenContent};
    } catch (error) {
      return {};
    }
  }
  return {};
};
