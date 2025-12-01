import * as zod from "zod";
import { Class } from "./user.interface";

export const createStudentZodSchema = zod.object({
  body: zod.object({
    firstName: zod.string().min(1, "First name is required"),
    lastName: zod.string().min(1, "Last name is required"),
    email: zod.string().email("Invalid email address"),
    password: zod.string().min(6, "Password must be at least 6 characters"),
    phoneNumber: zod.string().optional(),
    address: zod.string().optional(),
    dateOfBirth: zod.string().datetime().optional(),
    class: zod.nativeEnum(Class),
    roll: zod.string().min(1, "Roll is required"),
    gender: zod.enum(["MALE", "FEMALE"]),
  }),
});

export const createAdminZodSchema = zod.object({
  body: zod.object({
    firstName: zod.string().min(1, "First name is required"),
    lastName: zod.string().min(1, "Last name is required"),
    email: zod.string().email("Valid email is required"),
    password: zod.string().min(6, "Password must be at least 6 characters"),
    phoneNumber: zod.string().optional(),
    address: zod.string().optional(),
    gender: zod.enum(["MALE", "FEMALE"]).optional(),
    designation: zod.string().optional(),
  }),
});

export const createTeacherZodSchema = zod.object({
  body: zod.object({
    firstName: zod.string().min(1, "First name is required"),
    lastName: zod.string().min(1, "Last name is required"),
    email: zod.string().email("Valid email is required"),
    password: zod.string().min(6, "Password must be at least 6 characters"),
    phoneNumber: zod.string().optional(),
    address: zod.string().optional(),
    dateOfBirth: zod.string().datetime().optional(),
    designation: zod.string().optional(),
    gender: zod.enum(["MALE", "FEMALE"]),
  }),
});

export const userStatusChangeValidation = zod.object({
  params: zod.object({
    id: zod.uuid({ message: "Invalid user ID format" }),
    status: zod.enum(["ACTIVE", "INACTIVE", "DELETED", "SUSPENDED"], {
      message: "Status must be either ACTIVE or INACTIVE or  SUSPENDED",
    }),
  }),
});
