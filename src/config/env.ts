import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env").toString() });

export const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
};
