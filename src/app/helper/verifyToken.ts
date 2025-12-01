import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

export const verifyToken = (tokan: string) => {
  return jwt.verify(tokan, env.JWT_SECRET) as JwtPayload;
};
