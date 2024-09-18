import {PropsWithChildren} from 'react';
import {Pressable, View} from 'react-native';
import {Icon, Surface, Text, useTheme} from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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
  const isPressedIn = useSharedValue(false);

  const onPressIn = () => {
    console.log('onPressIn');
    isPressedIn.value = true;
  };

  const onPressOut = () => {
    isPressedIn.value = false;
  };

  const animatedPressStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isPressedIn.value ? 0.1 : 0),
    };
  });

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
        <Animated.View
          style={[
            animatedPressStyle,
            {
              position: 'absolute',
              backgroundColor: '#000',
              borderRadius: 24,
              width: '100%',
              height: '100%',
            },
          ]}
        />
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
