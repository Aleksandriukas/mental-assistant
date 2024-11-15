import AsyncStorage from '@react-native-async-storage/async-storage';
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
  testId?: number;
};

export const getTestsInfo = async (): Promise<TestInfoType[]> => {
  const storedLanguage = await AsyncStorage.getItem('language');
  const user = await supabase.auth.getUser();
  const {data} = await supabase.rpc('get_test_info', {
    user_id: user.data.user?.id,
    selected_language: storedLanguage,
  });
  return data;
};
