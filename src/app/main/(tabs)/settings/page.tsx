import {Button, Text} from 'react-native-paper';
import {Stack} from '../../../../components';
import {supabase} from '../../../../lib/supabase';
import {useLinkTo} from '../../../../../charon';
import {useQueryClient} from '@tanstack/react-query';

export default function DailyPage() {
  const linkTo = useLinkTo();

  const queryClient = useQueryClient();

  return (
    <Stack
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Settings Page</Text>
      <Button
        mode="contained"
        onPress={async () => {
          await supabase.auth.signOut();
          queryClient.invalidateQueries({queryKey: ['testSet']});
          queryClient.invalidateQueries({queryKey: ['test']});
          linkTo('/auth/login');
        }}>
        Log out
      </Button>
    </Stack>
  );
}
