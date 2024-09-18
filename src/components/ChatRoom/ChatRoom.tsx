import {Dimensions, Pressable} from 'react-native';
import {Surface, Text, TouchableRipple} from 'react-native-paper';
import {StateLayer} from '../StateLayer';
import {useState} from 'react';

export type ChatRoomProps = {
  label: string;
  onPress: () => void;
};

export const ChatRoom = ({label, onPress}: ChatRoomProps) => {
  const {width} = Dimensions.get('screen');

  const [pressed, setPressed] = useState(false);

  const roomSize = width * 0.4;

  return (
    <Pressable
      onPressIn={() => {
        setPressed(true);
      }}
      onPressOut={() => {
        setPressed(false);
      }}
      onPress={onPress}>
      <StateLayer style={{borderRadius: 24}} pressed={pressed} />
      <Surface
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 12,
          borderRadius: 24,
          height: roomSize,
          width: roomSize,
        }}
        elevation={2}>
        <Text variant="bodyLarge">{label}</Text>
      </Surface>
    </Pressable>
  );
};
