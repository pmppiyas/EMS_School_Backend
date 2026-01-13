export type IFeeCategory =
  | 'ADMISSION'
  | 'SESSION'
  | 'MONTHLY'
  | 'TUITION'
  | 'EXAM'
  | 'TRANSPORT'
  | 'LAB'
  | 'OTHER';

export interface IFeeType {
  name: string;
  amount: number;
  category: IFeeCategory;
  isMonthly: boolean;
  classId?: string;
}

export type ITerm = 'FIRST' | 'SECOND' | 'THIRD' | 'FINAL';
