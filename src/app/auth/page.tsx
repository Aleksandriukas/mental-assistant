import {Button, Text} from 'react-native-paper';
import {Stack} from '../../components';

export default function AuthPage() {
  return (
    <Stack style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>MentalAssistant</Text>
      <Button
        onPress={() => {
          console.log('call to check health');
        }}
        icon="alien-outline">
        Check health
      </Button>
    </Stack>
  );
}
