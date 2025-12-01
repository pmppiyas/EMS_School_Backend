export interface createStudentInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address: string;
  dateOfBirth?: string;
  class: Class;
  roll: string;
  gender?: Gender;
}

export interface createAdminInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
  gender?: Gender;
  designation?: string;
}

export interface createTeacherInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  designation?: string;
  gender: Gender;
}

export type Gender = "MALE" | "FEMALE";

export enum Role {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}

export enum Class {
  PLAYGROUP = "PLAYGROUP",
  NURSERY = "NURSERY",
  STANDARD1 = "STANDARD1",
  STANDARD2 = "STANDARD2",
  STANDARD3 = "STANDARD3",
  STANDARD4 = "STANDARD4",
  STANDARD5 = "STANDARD5",
}
