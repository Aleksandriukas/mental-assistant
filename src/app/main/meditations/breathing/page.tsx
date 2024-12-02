import {Appbar, Text, useTheme} from 'react-native-paper';
import {Stack} from '../../../../components';
import {useNavigation} from '@react-navigation/native';
import {Dimensions, StyleSheet, View} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {BlurMask, Canvas, Circle} from '@shopify/react-native-skia';
import {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';

export default function BreathingPage() {
  const {goBack} = useNavigation();

  const {t} = useTranslation();

  return (
    <Stack style={{flex: 1}}>
      <Appbar.Header elevated>
        <Appbar.BackAction
          onPress={() => {
            goBack();
          }}
        />
        <Appbar.Content title={t('breathing')} />
      </Appbar.Header>
      <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        <AnimatedCircle />
      </View>
    </Stack>
  );
}

const AnimatedCircle = ({duration = 28000}) => {
  const RADIUS = 150;
  const SMALL_RADIUS = 16;

  const offsetX = 40;

  const {colors} = useTheme();

  const {t} = useTranslation();

  const [text, setText] = useState('inhale');

  const progress = useSharedValue(0);

  const angle = useSharedValue(-Math.PI / 2);

  const x = useDerivedValue(
    () => RADIUS * Math.cos(angle.value) + RADIUS + offsetX,
  );
  const y = useDerivedValue(() => RADIUS * Math.sin(angle.value) + RADIUS + 20);

  const innerCircleRadius = useSharedValue(0);

  useEffect(() => {
    angle.value = withRepeat(
      withTiming(Math.PI + Math.PI / 2, {duration: duration}),
      -1,
      false,
    );

    innerCircleRadius.value = withRepeat(
      withTiming(RADIUS, {duration: duration / 4}, () => {
        if (progress.value === 3) {
          progress.value = 0;
        } else {
          progress.value = progress.value + 1;
        }

        if (progress.value === 0) {
          runOnJS(setText)('inhale');
        } else if (progress.value === 1) {
          runOnJS(setText)('hold');
        } else if (progress.value === 2) {
          runOnJS(setText)('exhale');
        } else if (progress.value === 3) {
          runOnJS(setText)('hold');
        }
      }),
      -1,
      true,
    );
  }, []);

  return (
    <View
      style={{
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
      }}>
      <Canvas
        style={{
          width: RADIUS * 2 + offsetX * 2,
          height: RADIUS * 2 + 80,
        }}>
        <Circle
          cx={RADIUS + offsetX}
          cy={RADIUS + 20}
          r={RADIUS}
          style="stroke"
          strokeWidth={16}
          color={colors.primary}>
          <BlurMask blur={0.5} style={'normal'} />
        </Circle>
        <Circle
          cx={RADIUS + offsetX}
          cy={RADIUS + 20}
          r={innerCircleRadius}
          color={colors.primary}>
          <BlurMask blur={4} style={'normal'} />
        </Circle>
        <Circle cx={x} cy={y} r={SMALL_RADIUS} color={colors.primaryContainer}>
          <BlurMask blur={1} style={'normal'} />
        </Circle>
      </Canvas>
      <View style={{width: '100%'}}>
        <Text style={{textAlign: 'center'}} variant="headlineSmall">
          {t(text)}
        </Text>
      </View>
    </View>
  );
};
