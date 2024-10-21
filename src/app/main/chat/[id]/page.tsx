import {Appbar} from 'react-native-paper';
import {Stack} from '../../../../components';
import {useNavigation} from '@react-navigation/native';
import {rooms} from '../../rooms';
import {useParams} from '../../../../../charon';
import {View} from 'react-native';
import {useEffect, useState} from 'react';
import {Chat, Message} from '../../../../components/Chat/Chat';
import OpenAI from 'react-native-openai';

const openAI = new OpenAI({
  apiKey: process.env.OPENAI_KEY || '',
  organization: 'MentalAssistant',
});

export default function ChatPage() {
  const {goBack} = useNavigation();

  const [messages, setMessages] = useState<Message[]>([]);

  const {id} = useParams();

  useEffect(() => {
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
            setMessages(old => [{content: message, isChat: false}, ...old]);
            try {
              const res = await openAI.chat.create({
                model: 'gpt-4',
                messages: [{role: 'user', content: message}],
              });

              console.log(JSON.stringify(res));
            } catch (e) {
              console.log(e);
            }
          }}
        />
      </Stack>
    </View>
  );
}
