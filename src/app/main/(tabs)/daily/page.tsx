import {Text} from 'react-native-paper';
import {Stack} from '../../../../components';
import {useEffect, useState} from 'react';
import {supabase} from '../../../../lib/supabase';
import {UserMetadata} from '@supabase/supabase-js';
import useUserData from '../../../../hooks/useUserData';

export default function DailyPage() {
  const userData = useUserData();

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
