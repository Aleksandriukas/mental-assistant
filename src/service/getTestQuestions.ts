import AsyncStorage from '@react-native-async-storage/async-storage';
import {supabase} from '../lib/supabase';
import {getDailyTestQuestions} from './getDailyTestQuestions';

export type QuestionType = {
  id: number;
  created_at?: string;
  question: string | {en: string; lt: string};
  answers: string[];
  answerslt?: string[];
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
    const storedLanguage = await AsyncStorage.getItem('language');
    const {data} = await supabase
      .from('testQuestions')
      .select()
      .eq('testId', testId)
      .eq('language', storedLanguage);
    return data as QuestionType[];
  }
};
