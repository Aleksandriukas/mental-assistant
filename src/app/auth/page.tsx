import {Button, Text} from 'react-native-paper';
import {Stack} from '../../components';
import {useLinkTo} from '../../../charon';

export default function AuthPage() {
  const linkTo = useLinkTo();

  return (
    <Stack style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>MentalAssistant</Text>
      <Button
        onPress={() => {
          linkTo('/main/assistant');
        }}
        icon="alien-outline">
        Check health
      </Button>
    </Stack>
  );
}
