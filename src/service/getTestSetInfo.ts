import {supabase} from '../lib/supabase';

export type TestSetType = {
  totalTests: number;
  completedTests: number;
};

export const getTestSetInfo = async (): Promise<TestSetType> => {
  const user = await supabase.auth.getUser();
  const {data} = await supabase.rpc('get_test_set_summary', {
    user_id: user.data.user?.id,
  });
  return data[0];
};
