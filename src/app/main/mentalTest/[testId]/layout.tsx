import {PropsWithChildren, useRef, useState} from 'react';
import {TestContext} from './TestContext';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useParams} from '../../../../../charon';
import {getTest} from './getTest';
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
import {getTestResult} from '../result/getTestResult';

export default function TestLayout({children}: PropsWithChildren<{}>) {
  const windowWidth = Dimensions.get('window').width;

  const [isLoading, setIsLoading] = useState(false);

  const {goBack} = useNavigation();

  const {bottom} = useSafeAreaInsets();

  const linkTo = useLinkTo();

  const {testId} = useParams();

  const {data} = useQuery({queryKey: ['test', testId], queryFn: getTest});

  const queryClient = useQueryClient();

  const {colors} = useTheme();

  const currentAnimatedIndex = useSharedValue(1);

  const currentIndex = useRef(0);

  const [clientAnswers, setClientAnswers] = useState<number[]>([]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width:
        (currentAnimatedIndex.value * windowWidth) / (data ? data.length : 10),
    };
  });

  const complete = async () => {
    // TODO @DungBui: Implement this function to save the answers to the server

    console.log('Client answers:', clientAnswers);
    setIsLoading(true);

    const data = await queryClient.prefetchQuery({
      queryKey: ['test', testId, 'result'],
      queryFn: getTestResult,
    });

    setTimeout(() => {}, 1000);

    setIsLoading(false);

    linkTo(`/main/mentalTest/result/${testId}`);
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
                linkTo(`/main/mentalTest/${testId}/${currentIndex.current}`);
              }}>
              {currentIndex.current === data.length ? 'Complete' : 'Next'}
            </Button>
          </View>
        </View>
      </Stack>
    </TestContext.Provider>
  );
}
