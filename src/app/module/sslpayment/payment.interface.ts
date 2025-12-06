import { ITerm } from "../fee/fee.interfaces";

export interface IPayment {
  feeTypeId: string;
  amount: number;
  transactionId: string;
  months?: string;
  term?: ITerm;
}
