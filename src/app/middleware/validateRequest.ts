import { NextFunction, Request, Response } from 'express';
import { ZodObject } from 'zod';

export const validateRequest =
  (schema: ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "Request body is empty. Make sure you're sending form data correctly.",
        });
      }

      let bodyData = req.body;

      if (req.body.data) {
        try {
          bodyData =
            typeof req.body.data === 'string'
              ? JSON.parse(req.body.data)
              : req.body.data;
        } catch (parseError) {
          return res.status(400).json({
            success: false,
            message: 'Invalid JSON in data field',
          });
        }
      } else {
        console.log('No req.body.data found, using req.body directly');
      }

      const parsed = schema.safeParse(bodyData);

      if (!parsed.success) {
        console.error(
          'Zod validation failed:',
          JSON.stringify(parsed.error.issues, null, 2)
        );
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: parsed.error.issues,
        });
      }

      req.body = parsed.data;

      if (req.file) {
        req.body.photoUrl = req.file.path;
        req.body.photoPublicId = req.file.filename;
      }

      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation middleware error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
