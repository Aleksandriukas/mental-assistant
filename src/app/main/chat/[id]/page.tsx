import {Appbar} from 'react-native-paper';
import {Stack} from '../../../../components';
import {useNavigation} from '@react-navigation/native';
import {rooms} from '../../rooms';
import {useParams} from '../../../../../charon';
import {Platform, View} from 'react-native';
import {Chat} from '../../../../components/Chat/Chat';
import {KeyboardAvoidingView} from 'react-native';

export default function ChatPage() {
  const {goBack} = useNavigation();

  const {id} = useParams();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <Appbar.Header elevated>
        <Appbar.BackAction
          onPress={() => {
            goBack();
          }}
        />
        <Appbar.Content
          title={rooms.find(value => value.id.toString() === id)?.label}
        />
      </Appbar.Header>
      <Stack style={{flex: 1}}>
        <Chat
          model="gpt-3.5-turbo"
          name={rooms.find(value => value.id.toString() === id)?.label ?? 'Eva'}
        />
      </Stack>
    </KeyboardAvoidingView>
  );
}
