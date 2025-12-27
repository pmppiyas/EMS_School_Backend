export const formatBDTime = (date: Date) => {
  return new Date(date.getTime() + 6 * 60 * 60 * 1000).toLocaleString('en-GB', {
    timeZone: 'Asia/Dhaka',
  });
};

// Utility to get Bangladesh date object
// export const formatBDTime = (date: Date) => {
//   // Shift UTC time by +6 hours to get Bangladesh time
//   return new Date(date.getTime() + 6 * 60 * 60 * 1000);
// };
