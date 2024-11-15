import {useQuery} from '@tanstack/react-query';
import {useParams} from '../../../../../../charon';
import {AnimatedPressable, Stack} from '../../../../../components';
import {getTestQuestions} from '../../../../../service/getTestQuestions';
import {Card, Text, useTheme} from 'react-native-paper';
import {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useTestContext} from '../TestContext';
import {useSafeContext} from '@sirse-dev/safe-context';
import {MainContext} from '../../../../MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Question() {
  const {testId, qId} = useParams();
  const [storedLanguage, setStoredLanguage] = useState<string>();

  const {data} = useQuery({
    queryKey: ['test', testId],
    queryFn: () => getTestQuestions(Number(testId)),
  });

  const {clientAnswers, setClientAnswers} = useTestContext();

  const answer = clientAnswers[Number(qId)];

  const setSelectedAnswer = (answer: string) => {
    setClientAnswers(old => {
      const copy = [...old];
      copy[Number(qId)] = answer;
      return copy;
    });
  };

  if (!data) {
    return (
      <Stack style={{flex: 1}}>
        <Text>No data</Text>
      </Stack>
    );
  }

  useEffect(() => {
    const getLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('language');
      setStoredLanguage(storedLanguage ?? '');
    };
    getLanguage();
  }, []);

  const question = data[Number(qId)].question;
  const answers = data[Number(qId)].answers;

  return (
    <Stack style={{flex: 1, gap: 16}}>
      <FlatList
        ListHeaderComponent={() => (
          <Text style={{paddingVertical: 12}} variant="bodyLarge">
            {typeof question === 'string'
              ? question
              : storedLanguage === 'lt'
              ? question.lt
              : question.en}
          </Text>
        )}
        contentContainerStyle={{gap: 4}}
        data={answers}
        renderItem={({index, item}) => {
          return (
            <AnswerItem
              accessibilityLabel={`answer-${index}`}
              checked={answer === answers[index]}
              title={
                storedLanguage === 'lt' && Number(testId) === -1
                  ? data[Number(qId)].answerslt?.at(index) ?? ''
                  : item
              }
              onPress={() => {
                setSelectedAnswer(item);
              }}
            />
          );
        }}
      />
    </Stack>
  );
}

const AnswerItem = ({
  checked,
  title,
  onPress,
  accessibilityLabel,
}: {
  checked: boolean;
  title: string;
  onPress: () => void;
  accessibilityLabel?: string;
}) => {
  const progress = useSharedValue(0);

  const {colors} = useTheme();

  const {theme} = useSafeContext(MainContext);

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, {duration: 300});
  }, [checked]);

  const animatedContainer = useAnimatedStyle(() => {
    const color = theme === 'dark' ? '#252329' : '#f7f3f9'; //TODO: Find in react-native-paper Card color;

    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [color, colors.primary],
      ),
    };
  });

  const animatedText = useAnimatedStyle(() => {
    const color = theme === 'light' ? '#252329' : '#f7f3f9'; //TODO: Find in react-native-paper Card color;
    return {
      color: interpolateColor(
        progress.value,
        [0, 1],
        [color, colors.onPrimary],
      ),
    };
  });

  return (
    <AnimatedPressable
      accessibilityLabel={accessibilityLabel}
      stateLayerProps={{style: {borderRadius: 12}}}
      onPress={() => {
        onPress();
      }}>
      <Animated.View
        style={[
          animatedContainer,
          {
            padding: 16,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.05,
          },
        ]}>
        <Animated.Text style={animatedText}>{title}</Animated.Text>
      </Animated.View>
    </AnimatedPressable>
  );
};
