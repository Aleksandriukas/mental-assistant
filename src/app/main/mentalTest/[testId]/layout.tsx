import {PropsWithChildren, useEffect, useRef, useState} from 'react';
import {TestContext} from './TestContext';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useParams} from '../../../../../charon';
import {getTestQuestions} from '../../../../service/getTestQuestions';
import {Dimensions, View} from 'react-native';
import {Appbar, Button, useTheme} from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Stack} from '../../../../components';
import {useLinkTo, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getTestResult} from '../../../../service/getTestResult';
import {
  setTestResults,
  TestResultAnswer,
} from '../../../../service/setTestResult';
import {getDailyTestId} from '../../../../service/getDailyTestId';
import {setDailyTestResults} from '../../../../service/setDailyTestResults';
import {DailyTestInfoType} from '../../../../service/getDailyTestInfo';
import {useTranslation} from 'react-i18next';

export default function TestLayout({children}: PropsWithChildren<{}>) {
  const windowWidth = Dimensions.get('window').width;

  const [isLoading, setIsLoading] = useState(false);

  const {goBack} = useNavigation();

  const {bottom} = useSafeAreaInsets();

  const linkTo = useLinkTo();

  const {testId} = useParams();

  const {t} = useTranslation();

  const {data} = useQuery({
    queryKey: ['test', testId],
    queryFn: () => getTestQuestions(Number(testId)),
  });

  const queryClient = useQueryClient();

  const {colors} = useTheme();

  const currentAnimatedIndex = useSharedValue(1);

  const currentIndex = useRef(0);

  const [clientAnswers, setClientAnswers] = useState<string[]>(
    new Array(data?.length).fill(''),
  );

  const progressStyle = useAnimatedStyle(() => {
    return {
      width:
        (currentAnimatedIndex.value * windowWidth) / (data ? data.length : 10),
    };
  });

  const complete = async () => {
    setIsLoading(true);

    if (Number(testId) === -1) {
      const dailyTestId = await getDailyTestId();
      await setDailyTestResults(clientAnswers, dailyTestId ?? 0);
      queryClient.setQueryData(['dailyTest'], (oldData: DailyTestInfoType) => {
        oldData.isCompleted = true;
        return oldData;
      });
      linkTo('/main/home');
      return;
    }

    let answers: TestResultAnswer[] = [];
    if (data) {
      answers = clientAnswers.map((value, index) => {
        return {questionId: data[index]?.id, answer: value};
      });
    }

    const resultId = await setTestResults(answers, Number(testId));

    await queryClient.prefetchQuery({
      queryKey: ['test', resultId, 'result'],
      queryFn: () => getTestResult(Number(resultId)),
    });

    setIsLoading(false);

    linkTo(`/main/mentalTest/result/${resultId}`);
  };
  if (!data) return <View></View>;
  return (
    <TestContext.Provider value={{clientAnswers, setClientAnswers}}>
      <Stack style={{width: '100%', height: '100%'}}>
        <Appbar.Header elevated>
          <Appbar.Content
            title={currentIndex.current + 1 + '/' + data?.length}
          />
        </Appbar.Header>
        <View
          style={{
            width: '100%',
            height: 2,
            backgroundColor: colors.background,
          }}>
          <Animated.View
            style={[
              progressStyle,
              {
                width: 128,
                height: 2,
                backgroundColor: colors.primary,
              },
            ]}></Animated.View>
        </View>
        <View style={{flex: 1, paddingHorizontal: 24}}>
          {children}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingBottom: bottom === 0 ? 8 : bottom,
            }}>
            <Button
              onPress={() => {
                currentAnimatedIndex.value = withTiming(
                  currentAnimatedIndex.value - 1,
                );

                if (currentIndex.current === 0) {
                  goBack();
                  return;
                }
                currentIndex.current -= 1;
                linkTo(`/main/mentalTest/${testId}/${currentIndex.current}`);
              }}>
              {t('back')}
            </Button>
            <Button
              disabled={!Boolean(clientAnswers[currentIndex.current])}
              loading={isLoading}
              mode="contained"
              onPress={() => {
                currentAnimatedIndex.value = withTiming(
                  currentAnimatedIndex.value + 1,
                );

                if (currentIndex.current === data.length - 1) {
                  complete();
                  return;
                }

                currentIndex.current += 1;
                linkTo(`/main/mentalTest/${testId}/${currentIndex.current}`);
              }}>
              {currentIndex.current + 1 === data.length
                ? t('complete')
                : t('next')}
            </Button>
          </View>
        </View>
      </Stack>
    </TestContext.Provider>
  );
}
