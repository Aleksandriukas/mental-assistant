import {useState} from 'react';
import {FlatList, View} from 'react-native';
import {IconButton, Text, TextInput, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export type Message = {
  content: string;
  isChat: boolean;
};

export type ChatProps = {
  messages: Message[];
  onSend: (message: string) => void;
};

export const Chat = ({messages, onSend}: ChatProps) => {
  const {colors} = useTheme();

  const insets = useSafeAreaInsets();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = () => {
    onSend(message);
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        snapToEnd
        inverted
        contentContainerStyle={{
          gap: 1,
          paddingHorizontal: 8,
          paddingVertical: 8,
        }}
        renderItem={({item}) => {
          return <ChatItem content={item.content} isChat={item.isChat} />;
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
          onPress={() => {
            sendMessage();
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

  console.log(content);
  console.log(isChat);
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
