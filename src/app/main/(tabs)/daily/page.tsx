import {Text} from 'react-native-paper';
import {Stack} from '../../../../components';
import {useEffect, useState} from 'react';
import {supabase} from '../../../../lib/supabase';
import {UserMetadata} from '@supabase/supabase-js';

export default function DailyPage() {
  const [userData, setUserData] = useState<UserMetadata | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: {user},
      } = await supabase.auth.getUser();
      let metadata = user?.user_metadata;
      setUserData(metadata!);
    };
    fetchUserData();
  }, []);

  return (
    <Stack
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Hello, {userData?.name}</Text>
    </Stack>
  );
}
