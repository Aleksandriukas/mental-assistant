import {supabase} from '../lib/supabase';

export type ResultType = {
  id: number;
  created_at?: Date;
  result: string;
  description?: string;
  testId: number;
};

export const getTestResult = async (id: number): Promise<ResultType> => {
  const {data} = await supabase.from('testResult').select().eq('id', id);
  return data?.at(0);
};
