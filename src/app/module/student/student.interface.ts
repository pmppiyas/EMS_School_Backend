import { Gender } from '@prisma/client';
import { IUser } from '../user/user.interface';

export interface IStudent {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  roll: string;
  gender: Gender;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;

  phoneNumber?: string | null;
  address?: string | null;
  dateOfBirth?: string | Date | null;
  classId?: string | null;

  user?: IUser;
  class?: IClass;
  subjects?: ISubject[];
  results?: IResult[];
  feePayments?: IFeePayment[];
}

export interface IResult {
  id: string;
  studentId: string;
  grade: string;
  marks: number;
}

export interface IFeePayment {
  id: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  date: string | Date;
}

export interface IClass {
  id: string;
  name: string;
}

export interface ISubject {
  id: string;
  name: string;
  code: string;
}


export
