import {supabase} from '../lib/supabase';

export type AdviceType = {
  id: number;
  title: string;
  adviceContent: string;
};

export const getAdvices = async (): Promise<AdviceType[]> => {
  const user = await supabase.auth.getUser();
  const {data, error} = await supabase.rpc('get_personalized_advices', {
    user_id: user.data.user?.id,
  });
  return data as AdviceType[];
};
