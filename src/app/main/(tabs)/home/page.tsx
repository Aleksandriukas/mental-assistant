import {Surface, Text, useTheme} from 'react-native-paper';
import {StateLayer} from '../../../../components';
import {useState} from 'react';
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
  PaintStyle,
  Path,
  Skia,
  StrokeCap,
} from '@shopify/react-native-skia';
import {useLinkTo} from '../../../../../charon';

export default function DailyPage() {
  const {top} = useSafeAreaInsets();

  const linkTo = useLinkTo();

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        paddingTop: top + 12,
        marginHorizontal: 24,
      }}>
      <Test
        completed={3} //TODO: @dungbui
        total={12} //TODO: @dungbui
        onPress={() => {
          console.log('pressed');
          linkTo('/main/mentalTest');
        }}
      />
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
      onPress={onPress}>
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
            emptyColor={colors.background}
            filledColor={colors.primary}
            size={96}
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

  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (2 * Math.PI * percentage) / 100;

  const filledPath = Skia.Path.Make();
  filledPath.addArc(
    {
      x: centerX - radius,
      y: centerY - radius,
      width: radius * 2,
      height: radius * 2,
    },
    startAngle * (180 / Math.PI),
    (endAngle - startAngle) * (180 / Math.PI),
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
