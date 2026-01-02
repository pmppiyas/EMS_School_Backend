import * as zod from 'zod';

export const createStudentZodSchema = zod.object({
  firstName: zod.string().min(1),
  lastName: zod.string().min(1),
  email: zod.string().email(),
  password: zod.string().min(6),
  roll: zod.union([zod.string(), zod.number()]),
  gender: zod.enum(['MALE', 'FEMALE']),
  classId: zod.string().optional(),
  phoneNumber: zod.string().optional(),
  address: zod.string().optional(),
  dateOfBirth: zod.string().datetime().optional(),
});

export const createAdminZodSchema = zod.object({
  firstName: zod.string().min(1, 'First name is required'),
  lastName: zod.string().min(1, 'Last name is required'),
  email: zod.string().email('Valid email is required'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: zod.string().optional(),
  address: zod.string().optional(),
  gender: zod.enum(['MALE', 'FEMALE']).optional(),
  designation: zod.string().optional(),
});

export const createTeacherZodSchema = zod.object({
  firstName: zod.string().min(1, 'First name is required'),
  lastName: zod.string().min(1, 'Last name is required'),
  email: zod.string().email('Valid email is required'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: zod.string().optional(),
  address: zod.string().optional(),
  dateOfBirth: zod.string().datetime().optional(),
  designation: zod.string().optional(),
  gender: zod.enum(['MALE', 'FEMALE']),
});

export const userStatusChangeValidation = zod.object({
  params: zod.object({
    id: zod.uuid({ message: 'Invalid user ID format' }),
    status: zod.enum(['ACTIVE', 'INACTIVE', 'DELETED', 'SUSPENDED'], {
      message: 'Status must be either ACTIVE or INACTIVE or  SUSPENDED',
    }),
  }),
});
