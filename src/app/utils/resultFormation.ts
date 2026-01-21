export const resultFormation = (entity: any[]) => {
  const grouped = entity.reduce((acc: any, item: any) => {
    const studentId = item.studentId || item.student.email;

    if (!acc[studentId]) {
      acc[studentId] = {
        studentId: studentId,
        name: `${item.student.firstName} ${item.student.lastName}`,
        className: item.student.class.name,
        term: item.term,
        results: {},
        totalMarks: 0,
      };
    }

    const currentMarks = Number(item.marks) || 0;
    acc[studentId].results[item.subject.name] = currentMarks;
    acc[studentId].totalMarks += currentMarks;

    return acc;
  }, {});

  const sortedStudents = Object.values(grouped).sort(
    (a: any, b: any) => b.totalMarks - a.totalMarks
  );

  return sortedStudents.map((student: any, index: number) => ({
    ...student,
    rollNo: index + 1,
  }));
};
