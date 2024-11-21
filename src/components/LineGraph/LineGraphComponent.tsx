import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, Platform, SafeAreaView, View} from 'react-native';
import {Button, SegmentedButtons, Text, useTheme} from 'react-native-paper';
import {DailyTestStatisticType} from '../../service/getDailyStatistics';
import {Area, CartesianChart, Line, useChartPressState} from 'victory-native';
import {useDerivedValue} from 'react-native-reanimated';
import {
  center,
  matchFont,
  Line as SkiaLine,
  useFont,
} from '@shopify/react-native-skia';

type LineGraphProps = {
  data: DailyTestStatisticType[] | undefined;
};

const getPoints = (
  data: DailyTestStatisticType[],
  key: 'anxietyLevel' | 'depressionLevel' | 'stressLevel',
): {date: number; points: number}[] => {
  return data.map(d => {
    return {
      date: new Date(d.created_at).getTime(),
      points: d[key],
    };
  });
};

const fontFamily = Platform.select({ios: 'Helvetica', default: 'serif'});
const fontStyle = {
  fontFamily,
  fontSize: 14,
  fontStyle: 'italic',
  fontWeight: 'bold',
};
const font = matchFont(fontStyle as Partial<any>);

const millisecondsInOneDay = 24 * 60 * 60 * 1000; // 86,400,000 milliseconds

const millisecondsIn2Weeks = 14 * millisecondsInOneDay;

const LineGraphComponent = ({data}: LineGraphProps) => {
  const [filteredData, setFilteredDate] = useState<
    {date: number; points: number}[]
  >([]);
  const {state, isActive} = useChartPressState({x: 0, y: {points: 0}});
  const [mentalType, setMentalType] = useState<
    'anxietyLevel' | 'depressionLevel' | 'stressLevel'
  >('stressLevel');
  const {t} = useTranslation();
  const {colors} = useTheme();

  const derivedYValue = useDerivedValue(() => {
    return state.y.points.value.value;
  }, [state]);

  const derivedXValue = useDerivedValue(() => {
    return state.x.value.value;
  }, [state]);

  useEffect(() => {
    if (data) {
      setFilteredDate(getPoints(data, mentalType));
    }
  }, [mentalType]);

  function transformString(input: string): string {
    const transformationMap: {[key: string]: string} = {
      anxietyLevel: t('anxietyLevel'),
      depressionLevel: t('depressionLevel'),
      stressLevel: t('stressLevel'),
    };
    return transformationMap[input] || input;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <SegmentedButtons
        style={{width: 'auto'}}
        value={mentalType}
        onValueChange={value =>
          setMentalType(
            value as 'anxietyLevel' | 'depressionLevel' | 'stressLevel',
          )
        }
        buttons={[
          {
            value: 'stressLevel',
            label: t('stress'),
          },
          {
            value: 'depressionLevel',
            label: t('depression'),
          },
          {value: 'anxietyLevel', label: t('anxiety')},
        ]}
      />
      <View style={{height: 320, width: Dimensions.get('window').width}}>
        {data && (
          <CartesianChart
            domain={{
              x: [
                Date.now() - millisecondsIn2Weeks,
                Date.now() + millisecondsInOneDay,
              ],
            }}
            xAxis={{
              font,
              formatXLabel: label => {
                const date = new Date(label);
                return `${date.getMonth() + 1}-${date.getDate()}`;
              },
              lineColor: colors.secondary,
            }}
            yAxis={[
              {
                font,
                lineColor: colors.secondary,
                tickValues: [0, 40, 80, 120, 160, 200],
              },
            ]}
            padding={20}
            data={filteredData}
            xKey={'date'}
            yKeys={['points']}
            chartPressState={state}>
            {({points, chartBounds}) => (
              <>
                {isActive && (
                  <SkiaLine
                    color={colors.tertiary}
                    p1={{x: state.x.position.value, y: chartBounds.top}}
                    p2={{x: state.x.position.value, y: chartBounds.bottom}}
                  />
                )}
                <Line
                  points={points.points}
                  color={colors.primary}
                  strokeWidth={2}
                  animate={{type: 'timing', duration: 300}}
                />
                <Area
                  points={points.points}
                  color={colors.primary}
                  y0={chartBounds.bottom}
                  opacity={0.5}
                  animate={{type: 'timing', duration: 300}}
                />
              </>
            )}
          </CartesianChart>
        )}
      </View>
      {isActive && (
        <View style={{alignItems: 'center'}}>
          <Text>
            {`${t('your')} ${transformString(mentalType)} ${new Date(
              derivedXValue.value,
            ).toLocaleDateString()} ${t('was')} ${derivedYValue.value}`}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default LineGraphComponent;
