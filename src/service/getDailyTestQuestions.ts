import {supabase} from '../lib/supabase';
import {QuestionType} from './getTestQuestions';

export const getDailyTestQuestions = async (): Promise<QuestionType[]> => {
  const {data} = await supabase.rpc('get_daily_test_questions');
  return data as QuestionType[];
};
