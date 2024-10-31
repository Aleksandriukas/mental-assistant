import {supabase} from '../lib/supabase';

export type DailyAnswerType = {
  answer: string;
  weight: number;
};

export type DailyQuestionType = {
  id: number;
  question: string;
  answers: DailyAnswerType[];
};

export const getDailyTestQuestions = async (): Promise<DailyQuestionType[]> => {
  const {data} = await supabase.from('dailyQuestions').select();
  return data as DailyQuestionType[];
};
