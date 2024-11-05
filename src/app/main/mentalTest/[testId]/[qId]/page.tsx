import {useQuery} from '@tanstack/react-query';
import {useParams} from '../../../../../../charon';
import {AnimatedPressable, Stack} from '../../../../../components';
import {getTestQuestions} from '../../../../../service/getTestQuestions';
import {Text, useTheme} from 'react-native-paper';
import {useEffect} from 'react';
import {FlatList} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useTestContext} from '../TestContext';

export default function Question() {
  const {testId, qId} = useParams();

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

  const question = data[Number(qId)].question;
  const answers = data[Number(qId)].answers;

  return (
    <Stack style={{flex: 1, gap: 16}}>
      <FlatList
        ListHeaderComponent={() => (
          <Text style={{paddingVertical: 12}} variant="bodyLarge">
            {question}
          </Text>
        )}
        contentContainerStyle={{gap: 4}}
        data={answers}
        renderItem={({index, item}) => {
          return (
            <AnswerItem
              accessibilityLabel={`answer-${index}`}
              checked={answer === answers[index]}
              title={item}
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

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, {duration: 300});
  }, [checked]);

  const animatedContainer = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ['#252329', colors.primary], //TODO: Find in react-native-paper Card color;
      ),
    };
  });

  const animatedText = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        progress.value,
        [0, 1],
        ['#ffffff', colors.onPrimary],
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
              height: 2,
            },
            shadowOpacity: 0.25,
          },
        ]}>
        <Animated.Text style={animatedText}>{title}</Animated.Text>
      </Animated.View>
    </AnimatedPressable>
  );
};
