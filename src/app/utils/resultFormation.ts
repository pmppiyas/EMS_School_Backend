import { EntityItem, GroupedResults } from "../module/result/result.interface";

export const resultFormation = async (entity: any[]) => {
  const grouped = entity.reduce((acc: GroupedResults, item: EntityItem) => {
    const year = item.year;
    const term = item.term;

    if (!acc[year]) acc[year] = {};
    if (!acc[year][term]) acc[year][term] = [];

    acc[year][term].push({
      subject: item.subject,
      marks: item.marks,
      grade: item.grade,
    });

    return acc;
  }, {} as GroupedResults);

  return grouped;
};
