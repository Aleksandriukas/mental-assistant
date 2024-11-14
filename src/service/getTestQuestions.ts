import {supabase} from '../lib/supabase';
import {getDailyTestQuestions} from './getDailyTestQuestions';

export type QuestionType = {
  id: number;
  created_at?: string;
  question: string;
  answers: string[];
  correctAnswers?: string[];
  points?: number;
};

export const getTestQuestions = async (
  testId: number,
): Promise<QuestionType[]> => {
  if (testId === -1) {
    const data = await getDailyTestQuestions();
    return data as QuestionType[];
  } else {
    const {data} = await supabase
      .from('testQuestions')
      .select()
      .eq('testId', testId);
    return data as QuestionType[];
  }
};
