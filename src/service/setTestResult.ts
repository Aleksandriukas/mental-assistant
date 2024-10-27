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
  const {data} = await supabase.rpc('set_test_results', {
    answers: answers,
    test_id: testId,
    user_id: user.data.user?.id,
  });
  return data as number;
};
