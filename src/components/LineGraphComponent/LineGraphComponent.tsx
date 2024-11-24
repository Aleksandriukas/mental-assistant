import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, Platform, SafeAreaView, View} from 'react-native';
import {Button, SegmentedButtons, Text, useTheme} from 'react-native-paper';
import {DailyTestStatisticType} from '../../service/getDailyStatistics';
import {Area, CartesianChart, Line, useChartPressState} from 'victory-native';
import {useDerivedValue} from 'react-native-reanimated';
import {Circle, matchFont, Line as SkiaLine} from '@shopify/react-native-skia';

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

export const millisecondsInOneDay = 24 * 60 * 60 * 1000; // 86,400,000 milliseconds

export const millisecondsIn2Weeks = 14 * millisecondsInOneDay;

const maxHigh = 240;

const LineGraphComponent = ({data}: LineGraphProps) => {
  const [filteredData, setFilteredData] = useState<
    {date: number; points: number}[]
  >([]);
  const {state} = useChartPressState({x: 0, y: {points: 0}});
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
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
      const newFilteredData = getPoints(data, mentalType);
      newFilteredData.push({
        date: newFilteredData.at(-1)?.date ?? 0,
        points: 0,
      });
      setFilteredData(newFilteredData);
      setIsAnimating(true);
    }

    const animationTimeout = setTimeout(() => {
      setIsAnimating(false);
    }, 320);

    return () => clearTimeout(animationTimeout);
  }, [mentalType]);

  function transformString(input: string): string {
    const transformationMap: {[key: string]: string} = {
      anxietyLevel: t('anxietyLevel'),
      depressionLevel: t('depressionLevel'),
      stressLevel: t('stressLevel'),
    };
    return transformationMap[input] || input;
  }

  function getLowMediumHigh(derivedYValue: number): String {
    if (derivedYValue < 100) {
      return `${t('low')}. ${t('youreFine')}`;
    } else if (derivedYValue < 180) {
      return `${t('medium')}. ${t('seekAdvice')}`;
    } else {
      return `${t('high')}. ${t('getHelp')}`;
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <SegmentedButtons
        style={{width: 'auto', padding: 20}}
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
            style: {
              backgroundColor: `${
                mentalType === 'stressLevel'
                  ? 'rgba(103, 80, 164, 0.5)'
                  : colors.background
              }`,
            },
          },
          {
            value: 'depressionLevel',
            label: t('depression'),
            style: {
              backgroundColor: `${
                mentalType === 'depressionLevel'
                  ? 'rgba(103, 80, 164, 0.5)'
                  : colors.background
              }`,
            },
          },
          {
            value: 'anxietyLevel',
            label: t('anxiety'),
            style: {
              backgroundColor: `${
                mentalType === 'anxietyLevel'
                  ? 'rgba(103, 80, 164, 0.5)'
                  : colors.background
              }`,
            },
          },
        ]}
      />
      <View style={{height: 480, width: Dimensions.get('window').width}}>
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
                return `${(date.getMonth() + 1)
                  .toString()
                  .padStart(2, '0')}-${date
                  .getDate()
                  .toString()
                  .padStart(2, '0')}`;
              },
              lineColor: colors.secondary,
              lineWidth: 0,
              labelColor: colors.secondary,
              tickCount: 2,
              tickValues: [
                Date.now() - millisecondsIn2Weeks + millisecondsInOneDay,
                Date.now(),
              ],
            }}
            yAxis={[
              {
                font,
                formatYLabel: label => {
                  return label === 5 ? t('Low') : t('High');
                },
                lineColor: colors.secondary,
                labelColor: colors.secondary,
                lineWidth: 0,
                tickCount: 2,
                tickValues: [0, 5, maxHigh],
              },
            ]}
            padding={20}
            data={filteredData}
            xKey={'date'}
            yKeys={['points']}
            chartPressState={state}>
            {({points, chartBounds}) => (
              <>
                {!isAnimating &&
                filteredData.findIndex(
                  d =>
                    d.points === derivedYValue.value &&
                    d.date === derivedXValue.value,
                ) !== -1 ? (
                  <Circle
                    cx={state.x.position.value}
                    cy={state.y.points.position.value}
                    r={6}
                    color={colors.primary}
                  />
                ) : (
                  !isAnimating && (
                    <Circle
                      cx={points.points.at(-2)?.x}
                      cy={points.points.at(-2)?.y ?? 0}
                      r={6}
                      color={colors.primary}
                    />
                  )
                )}
                <SkiaLine
                  color={colors.primary}
                  strokeWidth={4}
                  p1={{x: chartBounds.left, y: chartBounds.bottom}}
                  p2={{x: chartBounds.left, y: chartBounds.top}}
                  strokeCap={'round'}
                />
                <SkiaLine
                  color={colors.primary}
                  strokeWidth={4}
                  p1={{
                    x: chartBounds.left,
                    y: chartBounds.bottom,
                  }}
                  p2={{
                    x: chartBounds.right,
                    y: chartBounds.bottom,
                  }}
                  strokeCap={'round'}
                />
                <Line
                  points={points.points}
                  color={colors.primary}
                  strokeWidth={2}
                  curveType="natural"
                  strokeCap={'round'}
                  animate={{type: 'timing', duration: 300}}
                />
                <Area
                  points={points.points}
                  color={colors.primary}
                  y0={chartBounds.bottom}
                  curveType="natural"
                  opacity={0.5}
                  animate={{type: 'timing', duration: 300}}
                />
              </>
            )}
          </CartesianChart>
        )}
      </View>
      {filteredData.findIndex(
        d => d.points === derivedYValue.value && d.date === derivedXValue.value,
      ) !== -1 ? (
        <View style={{alignItems: 'center', padding: 20}}>
          <Text variant="bodyMedium">
            {derivedXValue.value !== 0 &&
              `${t('your')} ${transformString(mentalType)} ${new Date(
                derivedXValue.value,
              ).toLocaleDateString()} ${t('was')} ${derivedYValue.value} ${t(
                'whichIs',
              )} ${getLowMediumHigh(derivedYValue.value)}`}
          </Text>
        </View>
      ) : (
        !isAnimating && (
          <View style={{alignItems: 'center', padding: 20}}>
            <Text variant="bodyMedium">
              {`${t('your')} ${transformString(mentalType)} ${new Date(
                filteredData.at(-2)?.date ?? 0,
              ).toLocaleDateString()} ${t('was')} ${
                filteredData.at(-2)?.points
              } ${t('whichIs')} ${getLowMediumHigh(
                filteredData.at(-2)?.points ?? 0,
              )}`}
            </Text>
          </View>
        )
      )}
    </SafeAreaView>
  );
};

export default LineGraphComponent;
