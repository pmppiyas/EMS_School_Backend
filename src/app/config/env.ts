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
  SSL: {
    STORE_ID: process.env.STORE_ID,
    STORE_PASS: process.env.STORE_PASS,
    PAYMENT_API: process.env.PAYMENT_API,
    VALIDATION_API: process.env.VALIDATION_API,
    SUCCESS_BACKEND_URL: process.env.SUCCESS_BACKEND_URL,
    FAIL_BACKEND_URL: process.env.FAIL_BACKEND_URL,
    CANCEL_BACKEND_URL: process.env.CANCEL_BACKEND_URL,
  },
};
