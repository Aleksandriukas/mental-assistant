import {useState} from 'react';
import {FlatList, View} from 'react-native';
import {IconButton, Text, TextInput, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useChat} from '../../service/sendMessage';

export type ChatProps = {
  name: string;
  model: string;
};

export const Chat = ({model, name}: ChatProps) => {
  const {colors} = useTheme();

  const {messages, sendNewMessage, isLoading} = useChat({
    model: model,
    name: name,
  });

  const insets = useSafeAreaInsets();

  const [message, setMessage] = useState('');

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        snapToEnd
        inverted
        contentContainerStyle={{
          gap: 4,
          paddingHorizontal: 8,
          paddingVertical: 8,
        }}
        renderItem={({item}) => {
          return (
            <ChatItem
              content={item.message}
              isChat={item.type === 'Assistant'}
            />
          );
        }}
      />
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom === 0 ? 8 : insets.bottom,
          paddingTop: 8,
          backgroundColor: colors.surfaceVariant,
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}>
        <TextInput
          onChangeText={setMessage}
          value={message}
          style={{flex: 1}}
          multiline
          mode="flat"
        />
        <IconButton
          loading={isLoading}
          onPress={() => {
            setMessage('');
            sendNewMessage(message);
          }}
          icon="send"
        />
      </View>
    </View>
  );
};
type ChatItemProps = {
  content: string;
  isChat: boolean;
};

const ChatItem = ({content, isChat}: ChatItemProps) => {
  const {colors} = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        justifyContent: !isChat ? 'flex-end' : 'flex-start',
      }}>
      <View style={{width: '100%'}}>
        <View
          style={{
            borderRadius: 6,
            overflow: 'hidden',
            width: 'auto',
            backgroundColor: isChat ? colors.secondary : colors.primary,
            paddingVertical: 6,
            paddingHorizontal: 10,
            maxWidth: '80%',
            alignSelf: !isChat ? 'flex-end' : 'flex-start',
          }}>
          <Text
            style={{
              color: !isChat ? colors.onSecondary : colors.onPrimary,
            }}>
            {content}
          </Text>
        </View>
      </View>
    </View>
  );
};
