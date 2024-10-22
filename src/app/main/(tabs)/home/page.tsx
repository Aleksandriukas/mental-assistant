import {Surface, Text, useTheme} from 'react-native-paper';
import {Stack, StateLayer} from '../../../../components';
import {useEffect, useState} from 'react';
import {supabase} from '../../../../lib/supabase';
import {UserMetadata} from '@supabase/supabase-js';
import {useQuery} from '@tanstack/react-query';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Canvas,
  Circle,
  Group,
  PaintStyle,
  Path,
  Skia,
  StrokeCap,
} from '@shopify/react-native-skia';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';

export default function DailyPage() {
  const query = useQuery({
    queryKey: ['home', 'userData'],
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    queryFn: () => {
      return supabase.auth.getUser();
    },
  });

  const {top} = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        paddingTop: top === 0 ? 24 : top,
        marginHorizontal: 24,
      }}>
      <Test completed={2} total={12} onPress={() => {}} />
    </ScrollView>
  );
}

type TestProps = {
  onPress: () => void;
  completed: number;
  total: number;
};

const Test = ({completed, onPress, total}: TestProps) => {
  const [pressed, setPressed] = useState(false);

  const {colors} = useTheme();

  return (
    <Pressable
      style={{width: '100%'}}
      onPressIn={() => {
        setPressed(true);
      }}
      onPressOut={() => {
        setPressed(false);
      }}
      // onPress={onPress}
    >
      <StateLayer style={{borderRadius: 24}} pressed={pressed} />
      <Surface
        style={{
          width: '100%',
          justifyContent: 'space-between',

          padding: 16,
          flexDirection: 'row',
          borderRadius: 24,
          height: 144,
        }}
        elevation={2}>
        <View style={{flex: 2, gap: 6}}>
          <Text variant="titleLarge">Complete tests</Text>
          <Text variant="bodyMedium">
            Tests will help us to give you suggestions and track you mental
            health
          </Text>
        </View>
        <View style={{flex: 1}}>
          <CircularProgress
            total={total}
            completed={completed}
            emptyColor="black"
            filledColor={colors.primary}
            size={120}
            strokeWidth={14}
          />
        </View>
      </Surface>
    </Pressable>
  );
};

type CircularProgressProps = {
  size: number;
  strokeWidth: number;
  filledColor: string;
  emptyColor: string;
  style?: StyleProp<ViewStyle>;
  total: number;
  completed: number;
};
const CircularProgress = ({
  size,
  strokeWidth,
  filledColor,
  emptyColor,
  style,
  completed,
  total,
}: CircularProgressProps) => {
  const radius = size / 2 - strokeWidth / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  const percentage = (completed / total) * 100;

  const startAngle = -Math.PI / 2; // Начнем сверху (угол -90 градусов)
  const endAngle = startAngle + (2 * Math.PI * percentage) / 100; // Угол для заполнения круга

  const filledPath = Skia.Path.Make();
  filledPath.addArc(
    {
      x: centerX - radius,
      y: centerY - radius,
      width: radius * 2,
      height: radius * 2,
    },
    startAngle * (180 / Math.PI), // Начальный угол в градусах
    (endAngle - startAngle) * (180 / Math.PI), // Угол заполнения
  );

  const emptyPath = Skia.Path.Make();
  emptyPath.addArc(
    {
      x: centerX - radius,
      y: centerY - radius,
      width: radius * 2,
      height: radius * 2,
    },
    0,
    360,
  );

  const emptyPaint = Skia.Paint();
  emptyPaint.setColor(Skia.Color(emptyColor));
  emptyPaint.setStyle(PaintStyle.Stroke);
  emptyPaint.setStrokeWidth(strokeWidth);
  emptyPaint.setAntiAlias(true);

  const filledPaint = Skia.Paint();
  filledPaint.setColor(Skia.Color(filledColor));
  filledPaint.setStyle(PaintStyle.Stroke);
  filledPaint.setStrokeWidth(strokeWidth);
  filledPaint.setAntiAlias(true);
  filledPaint.setStrokeCap(StrokeCap.Round);

  return (
    <View style={[styles.container, style]}>
      <Canvas style={{width: size, height: size}}>
        <Path path={emptyPath} paint={emptyPaint} />
        <Path path={filledPath} paint={filledPaint} />
      </Canvas>
      <View style={styles.textContainer}>
        <Text variant="titleLarge">{completed + '/' + total}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
