import AsyncStorage from '@react-native-async-storage/async-storage';
import {supabase} from '../lib/supabase';

export type TestResultAnswer = {
  answer: string;
  questionId: number;
};

export const setTestResults = async (
  answers: TestResultAnswer[],
  testId: number,
): Promise<number> => {
  const user = await supabase.auth.getUser();
  const storedLanguage = await AsyncStorage.getItem('language');
  const {data} = await supabase.rpc('set_test_results', {
    answers: answers,
    test_id: testId,
    user_id: user.data.user?.id,
    selected_language: storedLanguage,
  });
  return data as number;
};
