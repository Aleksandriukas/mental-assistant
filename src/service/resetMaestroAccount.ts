import {supabase} from '../lib/supabase';

export const deleteTestsFromMaestro = async (): Promise<void> => {
  await supabase.rpc('delete_test_and_daily_of_maestro');
};
