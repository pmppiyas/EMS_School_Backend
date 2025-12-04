export interface AddResultBody {
  studentId: string;
  subjectId: string;
  marks: number;
  grade: string;
  term: string;
  year: number;
}

export interface Result {
  subject: string;
  marks: number;
  grade: string;
}

export interface EntityItem {
  year: string;
  term: string;
  subject: string;
  marks: number;
  grade: string;
}

export type GroupedResults = Record<string, Record<string, Result[]>>;
