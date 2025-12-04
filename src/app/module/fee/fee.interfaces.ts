export type IFeeCategory =
  | "ADMISSION"
  | "SESSION"
  | "MONTHLY"
  | "TUITION"
  | "EXAM"
  | "TRANSPORT"
  | "LAB"
  | "OTHER";

export interface IFeeType {
  amount: number;
  category: IFeeCategory;
  isMonthly?: boolean;
}
