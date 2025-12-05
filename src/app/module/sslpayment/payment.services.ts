import axios from "axios";
import { env } from "../../config/env";
import { IPayment } from "./payment.interface";

const paymentInit = async (payload: IPayment) => {
  const data = {
    store_id: env.SSL.STORE_ID,
    store_passwd: env.SSL.STORE_PASS,
    total_amount: payload.amount,
    currency: "BDT",
    tran_id: payload.transactionId,

    // SUCCESS / FAIL / CANCEL CALLBACKS
    success_url: `${env.SSL.SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
    fail_url: `${env.SSL.FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
    cancel_url: `${env.SSL.CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,

    shipping_method: "N/A",

    // 🔹 FEE PAYMENT DETAILS
    product_name: "School Fee Payment",
    product_category: "Education",
    product_profile: "general",

    // 🔹 CUSTOMER INFO (STUDENT/PARENT)
    cus_name: payload.name,
    cus_email: payload.email,
    cus_add1: payload.address,
    cus_add2: "N/A",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: payload.phoneNumber,
    cus_fax: "N/A",

    // Shipping (no need for fee payment)
    ship_name: "N/A",
    ship_add1: "N/A",
    ship_add2: "N/A",
    ship_city: "N/A",
    ship_state: "N/A",
    ship_postcode: "1000",
    ship_country: "N/A",
  };

  const res = await axios({
    method: "POST",
    url: env.SSL.PAYMENT_API,
    data: new URLSearchParams(data as any).toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return res.data;
};

export const PaymentService = {
  paymentInit,
};
