import {supabase} from '../lib/supabase';

export type DailyTestResult = {
  points: number;
};

export const setDailyTestResults = async (
  answers: string[],
  dailyTestId: number,
): Promise<DailyTestResult> => {
  const {data} = await supabase.rpc('set_daily_test_results', {
    daily_test_id: dailyTestId,
    answers: answers, // e.g. ["Always", "Never", "Rarely", "Sometimes", "Always"]
  });
  return {points: data};
};
