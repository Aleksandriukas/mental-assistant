import {supabase} from '../lib/supabase';

export type DailyEnumLevels = {
  stressLevel: number;
  depressionLevel: number;
  anxietyLevel: number;
};

export const getDailyEnumLevels = async (): Promise<DailyEnumLevels> => {
  const user = await supabase.auth.getUser();
  const {data} = await supabase.rpc('get_daily_enum_levels', {
    user_id: user.data.user?.id,
  });
  return data as DailyEnumLevels;
};
