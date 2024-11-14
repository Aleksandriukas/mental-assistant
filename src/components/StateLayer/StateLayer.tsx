import {useSafeContext} from '@sirse-dev/safe-context';
import {StyleProp, ViewStyle} from 'react-native';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {MainContext} from '../../app/MainContext';

export type StateLayerProps = {
  color?: string;
  pressedOpacity?: number;
  pressed?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const StateLayer = ({
  color,
  pressed = false,
  pressedOpacity = 0.1,
  style,
}: StateLayerProps) => {
  const {theme} = useSafeContext(MainContext);

  if (!color) {
    color = theme === 'dark' ? 'white' : 'black';
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {opacity: withTiming(pressed ? pressedOpacity : 0)};
  });

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          backgroundColor: color,
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 1,
        },
        style,
      ]}
    />
  );
};
