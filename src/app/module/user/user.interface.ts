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
  gender: "MALE" | "FEMALE";
}

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
