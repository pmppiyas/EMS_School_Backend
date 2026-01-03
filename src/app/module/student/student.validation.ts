import * as zod from 'zod';

export const updateStudentZodSchema = zod.object({
  firstName: zod.string().min(1),
  lastName: zod.string().min(1),
  photo: zod.string().optional(),
  roll: zod.union([zod.string(), zod.number()]),
  gender: zod.enum(['MALE', 'FEMALE']),
  classId: zod.string().optional(),
  phoneNumber: zod.string().optional(),
  address: zod.string().optional(),
  dateOfBirth: zod.string().datetime().optional(),
});
