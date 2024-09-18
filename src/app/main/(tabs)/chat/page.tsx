import {Text} from 'react-native-paper';
import {Stack} from '../../../../components';

export default function ChatPage() {
  console.log('chat page');
  return (
    <Stack
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>ChatPage</Text>
    </Stack>
  );
}
