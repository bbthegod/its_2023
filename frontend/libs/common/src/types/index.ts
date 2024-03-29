export interface Table {
  id: string;
  data: string[];
}

export interface DataSet {
  title: string;
  value: string;
  type: 'string' | 'image';
}

export interface Option {
  _id: string;
  answer: string;
  numbering: number;
}
export interface Question {
  _id: string;
  content: string;
  options: Option[];
}
export interface PlayData {
  timeOut: Date;
  playScore: number;
  userId: string;
  _id: string;
  questions: QuestionAnswer[];
}
export interface QuestionAnswer {
  _id: string;
  answer: number;
  answered?: boolean;
  questionId: Question;
}
export interface User {
  _id: string;
  studentClass: string;
  studentCode: string;
  studentName: string;
  studentPhone: string;
  isOnline: boolean;
  password: string;
  image: string;
  role?: string;
  status?: number;
}
export interface Play {
  comment: string;
  interviewScore: number;
  interviewer: string;
  isInterviewed: boolean;
  questions: Question;
  timeOut: Date;
  playScore: number;
  userId: User;
  createdAt: Date;
  updatedAt: Date;
}
