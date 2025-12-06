export const generateTransactionId = (): string => {
  const prefix = "FEE";
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${year}${month}-${randomStr}`;
};
