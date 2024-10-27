import {supabase} from '../lib/supabase';

export type TestSetType = {
  id: number;
  created_at?: Date;
  startDate: Date;
  endDate: Date;
  title: string;
  shortDescription: string;
  totalTests: number;
  completedTests: number;
};

export const getTestSets = (): Promise<TestSetType[]> => {
  return new Promise(async resolve => {
    const user = await supabase.auth.getUser();
    const {data} = await supabase.rpc('get_test_set_summary', {
      user_id: user.data.user?.id,
    });
    resolve(data);
  });
};
