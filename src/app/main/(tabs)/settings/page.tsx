import {Button, Text} from 'react-native-paper';
import {Stack} from '../../../../components';
import {supabase} from '../../../../lib/supabase';

export default function DailyPage() {
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
        }}>
        Log out
      </Button>
    </Stack>
  );
}
