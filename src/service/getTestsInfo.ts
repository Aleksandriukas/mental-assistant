import {supabase} from '../lib/supabase';

export type TestInfoType = {
  id: number;
  created_at?: Date;
  title: string;
  shortDescription: string; // max 2 sentences
  time: number; // in minutes
  icon?: string;
  completed: boolean;
  questionCount?: number;
};

export const getTestsInfo = async (): Promise<TestInfoType[]> => {
  const user = await supabase.auth.getUser();
  const {data} = await supabase.rpc('get_test_info', {
    user_id: user.data.user?.id,
  });
  return data;
};
