import AsyncStorage from '@react-native-async-storage/async-storage';
import {supabase} from '../lib/supabase';

export type AdviceType = {
  id: number;
  title: string;
  adviceContent: string;
};

export const getAdvices = async (): Promise<AdviceType[]> => {
  const storedLanguage = await AsyncStorage.getItem('language');
  const user = await supabase.auth.getUser();
  const {data} = await supabase.rpc('get_personalized_advices', {
    user_id: user.data.user?.id,
    selected_language: storedLanguage,
  });
  return data as AdviceType[];
};
