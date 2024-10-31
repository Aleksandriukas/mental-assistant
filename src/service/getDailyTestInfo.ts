import {supabase} from '../lib/supabase';

export type DailyTestInfoType = {
  isCompleted: boolean;
  streakCount: number;
};

export const getDailyTestInfo = async (): Promise<DailyTestInfoType> => {
  const user = await supabase.auth.getUser();
  const {data, error} = await supabase.rpc('get_completion_streak', {
    user_id: user.data.user?.id,
  });
  return data as DailyTestInfoType;
};
