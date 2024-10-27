import {QueryClient, useQuery, useQueryClient} from '@tanstack/react-query';
import {useParams} from '../../../../../../charon';
import {Stack} from '../../../../../components';
import {getTest} from '../../[testId]/getTest';
import {Appbar, Button, Text} from 'react-native-paper';
import {useLinkTo} from '@react-navigation/native';
import {getTestResult} from '../getTestResult';
import {View} from 'react-native';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {TestInfoType} from '../../getTestsInfo';

type Result = 'Good' | 'Average' | 'Bad';
export type ResultType = {
  result: Result;
  description: string;
};

const getTitle = (type: Result) => {
  if (type === 'Good') {
    return 'Congratulations!';
  }
  if (type === 'Average') {
    return 'Good Job!';
  }
  return 'Keep Trying!';
};

export default function Result() {
  const {id} = useParams();

  const {bottom} = useSafeAreaInsets();

  const {data} = useQuery({
    queryKey: ['test', id, 'result'],
    queryFn: getTestResult,
  });

  const queryClient = useQueryClient();

  const linkTo = useLinkTo();

  const close = () => {
    queryClient.setQueryData(['tests'], (oldData: TestInfoType[]) => {
      const oldDataCopy = [...oldData];

      oldDataCopy.find(item => item.id === Number(id))!.completed = true;
      return oldDataCopy;
    });

    linkTo('/main/mentalTest');
  };

  return (
    <Stack style={{flex: 1}}>
      <Appbar.Header elevated>
        <Appbar.Content title={getTitle(data!.result)} />
      </Appbar.Header>
      <View style={{padding: 24, flex: 1}}>
        <Text>{data?.description}</Text>
      </View>
      <View
        style={{
          paddingHorizontal: 24,
          paddingBottom: bottom === 0 ? 8 : bottom,
          alignItems: 'flex-end',
        }}>
        <Button
          mode="contained"
          onPress={() => {
            close();
          }}>
          Close
        </Button>
      </View>
    </Stack>
  );
}
