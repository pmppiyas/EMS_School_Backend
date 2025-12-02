const weekOrder: Record<string, number> = {
  SUNDAY: 1,
  MONDAY: 2,
  TUESDAY: 3,
  WEDNESDAY: 4,
  THURSDAY: 5,
  FRIDAY: 6,
  SATURDAY: 7,
};

export const groupAndSortSchedules = (schedules: any[]) => {
  //  Sort by day + startTime
  const sorted = schedules.sort((a, b) => {
    const dayCompare = weekOrder[a.day] - weekOrder[b.day];
    if (dayCompare !== 0) return dayCompare;

    const aStart = a.classTime?.startTime ?? "";
    const bStart = b.classTime?.startTime ?? "";
    return aStart.localeCompare(bStart);
  });

  const grouped: Record<string, any[]> = {
    SUNDAY: [],
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
  };

  for (const item of sorted) {
    grouped[item.day].push(item);
  }

  return grouped;
};
