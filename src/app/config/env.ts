import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env").toString() });

export const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET as string,
  BCRYPT: {
    SALTNUMBER: process.env.SALTNUMBER,
  },
};
