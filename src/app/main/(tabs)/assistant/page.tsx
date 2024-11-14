import {Appbar} from 'react-native-paper';
import {Stack} from '../../../../components';
import {useLinkTo} from '@react-navigation/native';
import {FlatList, View} from 'react-native';
import {ChatRoom} from '../../../../components/ChatRoom/ChatRoom';
import {rooms} from '../../rooms';
import {useTranslation} from 'react-i18next';

export default function AssistantPage() {
  const linkTo = useLinkTo();

  const {t} = useTranslation();

  return (
    <View style={{flex: 1}}>
      <Appbar.Header elevated>
        <Appbar.Content title={t('yourAssistant')} />
      </Appbar.Header>
      <Stack style={{flex: 1}}>
        <FlatList
          style={{paddingTop: 24, paddingHorizontal: 24}}
          data={rooms}
          numColumns={2}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          contentContainerStyle={{gap: 20}}
          renderItem={({index, item}) => {
            return (
              <ChatRoom
                label={item.label}
                onPress={() => {
                  linkTo(`/main/chat/${item.id}`);
                }}
              />
            );
          }}
        />
      </Stack>
    </View>
  );
}
