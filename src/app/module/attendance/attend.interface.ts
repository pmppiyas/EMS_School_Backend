export enum IAttendStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  LEAVE = "LEAVE",
}

export interface IAttendRecord {
  userId: string;
  inTime?: string;
  outTime?: string;
  status: IAttendStatus;
}
