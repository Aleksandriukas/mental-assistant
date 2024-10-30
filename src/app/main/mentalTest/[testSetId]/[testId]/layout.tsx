import {PropsWithChildren, useEffect, useRef, useState} from 'react';
import {TestContext} from './TestContext';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useParams} from '../../../../../../charon';
import {getTestQuestions} from '../../../../../service/getTestQuestions';
import {Dimensions, View} from 'react-native';
import {Appbar, Button, useTheme} from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Stack} from '../../../../../components';
import {useLinkTo, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getTestResult} from '../../../../../service/getTestResult';
import {
  setTestResults,
  TestResultAnswer,
} from '../../../../../service/setTestResult';

export default function TestLayout({children}: PropsWithChildren<{}>) {
  const windowWidth = Dimensions.get('window').width;

  const [isLoading, setIsLoading] = useState(false);

  const {goBack} = useNavigation();

  const {bottom} = useSafeAreaInsets();

  const linkTo = useLinkTo();

  const {testSetId, testId} = useParams();

  const {data} = useQuery({
    queryKey: ['test', testId],
    queryFn: () => getTestQuestions(Number(testId)),
  });

  const queryClient = useQueryClient();

  const {colors} = useTheme();

  const currentAnimatedIndex = useSharedValue(1);

  const currentIndex = useRef(0);

  const [clientAnswers, setClientAnswers] = useState<string[]>([]);

  useEffect(() => {
    setClientAnswers(new Array(data?.length).fill(''));
  }, []);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width:
        (currentAnimatedIndex.value * windowWidth) / (data ? data.length : 10),
    };
  });

  const complete = async () => {
    setIsLoading(true);

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

    linkTo(`/main/mentalTest/${testSetId}/result/${resultId}`);
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
                linkTo(
                  `/main/mentalTest/${testSetId}/${testId}/${currentIndex.current}`,
                );
              }}>
              Back
            </Button>
            <Button
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
                linkTo(
                  `/main/mentalTest/${testSetId}/${testId}/${currentIndex.current}`,
                );
              }}>
              {currentIndex.current === data.length ? 'Complete' : 'Next'}
            </Button>
          </View>
        </View>
      </Stack>
    </TestContext.Provider>
  );
}
