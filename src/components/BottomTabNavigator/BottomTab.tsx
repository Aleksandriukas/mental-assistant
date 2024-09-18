import {PropsWithChildren, useState} from 'react';
import {Pressable, View} from 'react-native';
import {Icon, Surface, Text, useTheme} from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StateLayer} from '../StateLayer';

export const BottomBar = ({children}: PropsWithChildren<{}>) => {
  const {bottom} = useSafeAreaInsets();
  return (
    <Surface
      elevation={1}
      style={{
        paddingBottom: bottom === 0 ? 16 : bottom,
        paddingTop: 16,
        paddingHorizontal: 32,
        justifyContent: 'space-around',
        flexDirection: 'row',
      }}>
      {children}
    </Surface>
  );
};

export type TabProps = {
  isFocused: boolean;
  icon: string;
  label: string;
  onPress?: () => void;
};

export const Tab = ({icon, isFocused, label, onPress}: TabProps) => {
  const [pressed, setPressed] = useState(false);

  const onPressIn = () => {
    setPressed(true);
  };

  const onPressOut = () => {
    setPressed(false);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scaleX: withTiming(isFocused ? 1 : 0, {
            duration: !isFocused ? 300 : 150,
          }),
        },
      ],
      opacity: withTiming(isFocused ? 1 : 0, {
        duration: !isFocused ? 150 : 300,
      }),
    };
  });

  const {colors} = useTheme();
  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      style={{gap: 4, alignItems: 'center'}}>
      <View>
        <Animated.View
          style={[
            animatedStyle,
            {
              position: 'absolute',
              backgroundColor: colors.primary,
              borderRadius: 24,
              width: '100%',
              height: '100%',
            },
          ]}
        />
        <StateLayer pressed={pressed} style={{borderRadius: 24}} />
        <View style={{paddingHorizontal: 20, paddingVertical: 8}}>
          <Icon
            source={icon}
            color={isFocused ? colors.onPrimary : colors.onSurface}
            size={24}
          />
        </View>
      </View>
      <Text variant="labelMedium">{label}</Text>
    </Pressable>
  );
};
