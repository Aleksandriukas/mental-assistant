import {createSafeContext, useSafeContext} from '@sirse-dev/safe-context';

export type MessageType = {
  message: string;
  type: 'User' | 'Assistant';
  chatName: string;
};

type MainContextType = {
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  theme: 'light' | 'dark';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
};

export const MainContext = createSafeContext<MainContextType>();
