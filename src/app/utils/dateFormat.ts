export const formatBDTime = (date: Date) => {
  return new Date(date.getTime() + 6 * 60 * 60 * 1000).toLocaleString('en-GB', {
    timeZone: 'Asia/Dhaka',
  });
};
