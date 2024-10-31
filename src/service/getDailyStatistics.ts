import {supabase} from '../lib/supabase';

export type DailyTestStatisticType = {
  id: number;
  created_at: Date;
  points: number;
};

export const getDailyStatistics = async (): Promise<
  DailyTestStatisticType[]
> => {
  const user = await supabase.auth.getUser();
  const {data} = await supabase.rpc('get_daily_statistics', {
    user_id: user.data.user?.id,
  });
  return data as DailyTestStatisticType[];
};
