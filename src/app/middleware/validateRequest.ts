import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape } from "zod";

export const validateRequest =
  (schema: ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("=== VALIDATION MIDDLEWARE DEBUG ===");
      console.log("req.body:", JSON.stringify(req.body, null, 2));
      console.log("req.file:", req.file);
      console.log("Content-Type:", req.headers["content-type"]);

      // Check if body exists at all
      if (!req.body || Object.keys(req.body).length === 0) {
        console.error("❌ req.body is empty or undefined");
        return res.status(400).json({
          success: false,
          message:
            "Request body is empty. Make sure you're sending form data correctly.",
        });
      }

      // Extract data from the `data` field (multipart/form-data)
      let bodyData = req.body;

      if (req.body.data) {
        console.log("Found req.body.data:", req.body.data);
        try {
          bodyData =
            typeof req.body.data === "string"
              ? JSON.parse(req.body.data)
              : req.body.data;
          console.log("Parsed bodyData:", bodyData);
        } catch (parseError) {
          console.error("Failed to parse req.body.data:", parseError);
          return res.status(400).json({
            success: false,
            message: "Invalid JSON in data field",
          });
        }
      } else {
        console.log("No req.body.data found, using req.body directly");
      }

      console.log(
        "Final bodyData to validate:",
        JSON.stringify(bodyData, null, 2)
      );

      // Parse with Zod
      const parsed = schema.safeParse(bodyData);

      if (!parsed.success) {
        console.error(
          "Zod validation failed:",
          JSON.stringify(parsed.error.errors, null, 2)
        );
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: parsed.error.errors,
        });
      }

      console.log("✅ Validation successful");

      // Replace body with validated data
      req.body = parsed.data;

      // Attach file if present
      if (req.file) {
        req.body.photoUrl = req.file.path; // Cloudinary URL
        req.body.photoPublicId = req.file.filename; // Cloudinary public_id
      }

      next();
    } catch (error) {
      console.error("Validation middleware error:", error);
      return res.status(400).json({
        success: false,
        message: "Validation middleware error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
