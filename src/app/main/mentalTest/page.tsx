import {
  Appbar,
  Avatar,
  Card,
  IconButton,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {FlatList, View} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {AnimatedPressable, Stack, StateLayer} from '../../../components';

type TestInfoType = {
  title: string;
  shortDescription: string; // max 2 sentences
  time: number; // in minutes
  icon?: string;
  completed: boolean;
};

const getTestsInfo = (): Promise<TestInfoType[]> => {
  //TODO Change this mock promise to real data fetching @DungBui
  return new Promise(resolve => {
    const testsInfo: TestInfoType[] = [
      {
        title: 'Memory Test',
        shortDescription: 'A test to evaluate your memory skills.',
        time: 5,
        icon: 'brain',
        completed: false,
      },
      {
        title: 'Attention Test',
        shortDescription: 'A test to measure your attention span.',
        time: 10,
        icon: 'eye',
        completed: true,
      },
      {
        title: 'Cognitive Flexibility Test',
        shortDescription: 'A test to assess your cognitive flexibility.',
        time: 15,
        icon: 'shuffle',
        completed: false,
      },
      {
        title: 'Problem Solving Test',
        shortDescription: 'A test to gauge your problem-solving abilities.',
        time: 5,
        icon: 'puzzle',
        completed: false,
      },
    ];
    resolve(testsInfo);
  });
};

export default function ChatPage() {
  const {goBack} = useNavigation();

  const {data} = useQuery({
    queryKey: ['tests'],
    queryFn: async () => {
      const result = await getTestsInfo();

      return result.sort((a, b) => Number(a.completed) - Number(b.completed));
    },
  });

  return (
    <Stack style={{flex: 1}}>
      <Appbar.Header elevated>
        <Appbar.BackAction
          onPress={() => {
            goBack();
          }}
        />
        <Appbar.Content title="Select test" />
      </Appbar.Header>

      <FlatList
        data={data}
        renderItem={({item}) => {
          return (
            <TestItem
              completed={item.completed}
              time={item.time}
              shortDescription={item.shortDescription}
              title={item.title}
              icon={item.icon}
            />
          );
        }}
      />
    </Stack>
  );
}

const TestItem = ({
  title,
  shortDescription,
  time,
  icon,
  completed,
}: TestInfoType) => {
  return (
    <AnimatedPressable pointerEvents={completed ? 'none' : undefined}>
      <Card.Title
        title={title}
        subtitle={shortDescription}
        left={props => (
          <Avatar.Icon
            {...props}
            style={{backgroundColor: completed ? 'green' : undefined}}
            color={completed ? 'white' : undefined}
            icon={completed ? 'check' : icon ?? 'brain'}
          />
        )}
        right={props => (
          <View style={{padding: 16}}>
            <Text variant="titleMedium">
              {completed ? 'Completed' : time + ':00 min.'}
            </Text>
          </View>
        )}
      />
    </AnimatedPressable>
  );
};
