import {StyleProp, ViewStyle} from 'react-native';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';

export type StateLayerProps = {
  color?: string;
  pressedOpacity?: number;
  pressed?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const StateLayer = ({
  color = '#fff',
  pressed = false,
  pressedOpacity = 0.1,
  style,
}: StateLayerProps) => {
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
