import {Appbar} from 'react-native-paper';
import {Stack} from '../../../../components';
import {useNavigation} from '@react-navigation/native';
import {rooms} from '../../rooms';
import {useParams} from '../../../../../charon';
import {View} from 'react-native';
import {useEffect, useState} from 'react';
import {Chat, Message} from '../../../../components/Chat/Chat';
import OpenAI from 'react-native-openai';
import {OPENAI_KEY} from '@env';

const openAI = new OpenAI({
  apiKey: OPENAI_KEY || '',
  organization: 'MentalAssistant',
});

export default function ChatPage() {
  const {goBack} = useNavigation();

  const [messages, setMessages] = useState<Message[]>([]);

  const {id} = useParams();

  useEffect(() => {
    //FIXME: This library does not work properly
    openAI.chat.addListener('onChatMessageReceived', payload => {
      console.log('payload', payload);
      setMessages(message => {
        const newMessage = payload.choices[0]?.delta.content;
        if (newMessage) {
          return [{content: newMessage, isChat: true}, ...message];
        }
        return message;
      });
    });
    return () => {
      openAI.chat.removeListener('onChatMessageReceived');
    };
  }, [openAI]);

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
      <Stack style={{flex: 1}}>
        <Chat
          messages={messages}
          onSend={async message => {
            openAI.chat.stream({
              messages: [{role: 'system', content: message}],
              model: 'gpt-3.5-turbo',
            });
          }}
        />
      </Stack>
    </View>
  );
}
