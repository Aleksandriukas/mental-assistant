import {supabase} from '../lib/supabase';

export const getDailyTestId = async (): Promise<number | null> => {
  const user = await supabase.auth.getUser();
  const {data} = await supabase
    .from('dailyTests')
    .select('id')
    .eq('userId', user.data.user?.id)
    .order('created_at', {
      ascending: false,
    })
    .limit(1);
  if (!data || data.length === 0) {
    return null;
  }

  return (data[0] as {id: number}).id;
};
