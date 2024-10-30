import {supabase} from '../lib/supabase';

export type QuestionType = {
  id: number;
  created_at?: string;
  question: string;
  answers: string[];
  correctAnswers: string[];
  points: number;
};

export const getTestQuestions = async (
  testId: number,
): Promise<QuestionType[]> => {
  const {data} = await supabase
    .from('testQuestions')
    .select()
    .eq('testId', testId);
  return data as QuestionType[];
};
