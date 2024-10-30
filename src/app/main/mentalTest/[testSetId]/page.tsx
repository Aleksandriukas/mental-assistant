import {Appbar, Avatar, Card, Text} from 'react-native-paper';
import {useLinkTo, useNavigation} from '@react-navigation/native';
import {FlatList, View} from 'react-native';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {AnimatedPressable, Stack, StateLayer} from '../../../../components';
import {getTestsInfo, TestInfoType} from '../../../../service/getTestsInfo';
import {useParams} from '../../../../../charon';
import {getTestQuestions} from '../../../../service/getTest';

export default function ChatPage() {
  const linkTo = useLinkTo();

  const {testSetId} = useParams();

  const {data} = useQuery({
    queryKey: ['tests', testSetId],
    queryFn: () => getTestsInfo(Number(testSetId)),
  });
  // sort to completed be at the end
  const tests = data?.sort((a, b) => {
    if (a.completed && !b.completed) {
      return 1;
    }
    if (!a.completed && b.completed) {
      return -1;
    }
    return 0;
  });

  const queryClient = useQueryClient();

  return (
    <Stack style={{flex: 1}}>
      <Appbar.Header elevated>
        <Appbar.BackAction
          onPress={() => {
            linkTo('/main/home');
          }}
        />
        <Appbar.Content title="Select test" />
      </Appbar.Header>

      <FlatList
        data={data}
        renderItem={({item}) => {
          return (
            <TestItem
              onPress={async () => {
                await queryClient.prefetchQuery({
                  queryKey: ['test', item.id],
                  queryFn: () => getTestQuestions(item.id),
                });
                linkTo(`/main/mentalTest/${testSetId}/${item.id}/0`);
              }}
              id={item.id}
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

type TestItemProps = {
  onPress: () => void;
} & TestInfoType;

const TestItem = ({
  title,
  shortDescription,
  time,
  icon,
  completed,
  onPress,
}: TestItemProps) => {
  return (
    <AnimatedPressable
      onPress={() => {
        onPress();
      }}
      pointerEvents={completed ? 'none' : undefined}>
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
