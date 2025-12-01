import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape } from "zod";

export const validateRequest =
  (schema: ZodObject<ZodRawShape>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bodyData = req.body?.data ? JSON.parse(req.body.data) : req.body;

      // console.log("Incoming bodyData:", bodyData);

      const parsed = schema.safeParse({
        body: bodyData,
        query: req.query,
        params: req.params,
      });

      // console.log("Parsed Data:", parsed);

      if (!parsed.success) {
        return next(parsed.error);
      }

      if (parsed.data.body) {
        req.body = parsed.data.body;
      }

      next();
    } catch (error) {
      console.error("Validation Error:", error);
      next(error);
    }
  };
