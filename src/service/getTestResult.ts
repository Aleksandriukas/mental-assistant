import {supabase} from '../lib/supabase';

export type ResultType = {
  id: number;
  created_at?: Date;
  result: string;
  description?: string;
  testId: number;
};

export const getTestResult = (id: number): Promise<ResultType[]> => {
  return new Promise(async resolve => {
    const {data} = await supabase.from('testResult').select().eq('id', id);
    resolve(data as ResultType[]);
  });
};
