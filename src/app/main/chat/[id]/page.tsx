import {Appbar} from 'react-native-paper';
import {Stack} from '../../../../components';
import {useNavigation} from '@react-navigation/native';
import {rooms} from '../../rooms';
import {useParams} from '../../../../../charon';
import {View} from 'react-native';

export default function ChatPage() {
  const {goBack} = useNavigation();

  const {id} = useParams();

  return (
    <View style={{flex: 1}}>
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
      <Stack style={{flex: 1}}></Stack>
    </View>
  );
}
