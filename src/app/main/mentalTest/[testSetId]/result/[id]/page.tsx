import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useParams} from '../../../../../../../charon';
import {Stack} from '../../../../../../components';
import {Appbar, Button, Text} from 'react-native-paper';
import {useLinkTo} from '@react-navigation/native';
import {getTestResult} from '../../../../../../service/getTestResult';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useEffect} from 'react';
import {TestInfoType} from '../../../../../../service/getTestsInfo';

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
  const {id, testSetId} = useParams();

  const {bottom} = useSafeAreaInsets();

  const {data} = useQuery({
    queryKey: ['test', id, 'result'],
    queryFn: () => getTestResult(Number(id)),
  });

  const queryClient = useQueryClient();

  const linkTo = useLinkTo();

  const close = () => {
    // queryClient.setQueryData(
    //   ['tests', testSetId],
    //   (oldData: TestInfoType[]) => {
    //     const oldDataCopy = [...oldData];

    //     oldDataCopy.find(item => item.id === Number(id))!.completed = true;
    //     return oldDataCopy;
    //   },
    // );

    queryClient.invalidateQueries({queryKey: ['tests', testSetId]});
    queryClient.invalidateQueries({queryKey: ['testSets']});

    linkTo(`/main/mentalTest/${testSetId}`);
  };

  return (
    <Stack style={{flex: 1}}>
      <Appbar.Header elevated>
        <Appbar.Content title="Test Result" />
      </Appbar.Header>
      <View style={{padding: 24, flex: 1}}>
        <Text>Your result is: {data && data[0].result}</Text>
        <Text>{data && data[0].description}</Text>
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
