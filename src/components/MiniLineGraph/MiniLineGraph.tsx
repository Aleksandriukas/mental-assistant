import {useTranslation} from 'react-i18next';
import {Dimensions, Pressable, View} from 'react-native';
import {Area, CartesianChart, Line} from 'victory-native';
import {AnimatedPressable} from '../AnimatedPressable';
import {Surface, Text, useTheme} from 'react-native-paper';

type LineGraphProps = {
  data:
    | {
        date: number;
        stressLevel: number;
      }[]
    | undefined;
  onPress: () => void;
};

const MiniLineGraph = ({data, onPress}: LineGraphProps) => {
  const {t} = useTranslation();
  const {colors} = useTheme();

  return (
    <AnimatedPressable style={{width: '100%'}} onPress={onPress}>
      <Surface
        style={{
          width: '100%',
          justifyContent: 'space-between',

          padding: 16,
          flexDirection: 'column',
          borderRadius: 24,
          height: 144,
        }}
        elevation={2}>
        <Text variant="titleLarge">{t('checkStats')}</Text>
        {data && (
          <CartesianChart
            domain={{
              y: [0, 160],
            }}
            data={data}
            xAxis={{tickCount: 0}}
            yAxis={[{tickCount: 0}]}
            xKey={'date'}
            yKeys={['stressLevel']}>
            {({points, chartBounds}) => (
              <>
                <Line
                  points={points.stressLevel}
                  color={colors.primary}
                  strokeWidth={2}
                  opacity={0.8}
                  curveType="natural"
                />
                <Area
                  points={points.stressLevel}
                  color={colors.primary}
                  y0={chartBounds.bottom}
                  curveType="natural"
                  opacity={0.2}
                />
              </>
            )}
          </CartesianChart>
        )}
      </Surface>
    </AnimatedPressable>
  );
};

export default MiniLineGraph;
