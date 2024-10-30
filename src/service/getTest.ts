import {supabase} from '../lib/supabase';

export type QuestionType = {
  id: number;
  created_at?: string;
  question: string;
  answers: string[];
  correctAnswers: string[];
  points: number;
};

export const getTestQuestions = (testId: number): Promise<QuestionType[]> => {
  return new Promise(async resolve => {
    const {data} = await supabase
      .from('testQuestions')
      .select()
      .eq('testId', testId);
    resolve(data as QuestionType[]);
  });
};
