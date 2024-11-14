import {
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {useParams} from '../../../../../../charon';
import {Stack} from '../../../../../components';
import {Appbar, Button, Text} from 'react-native-paper';
import {useLinkTo} from '@react-navigation/native';
import {getTestResult} from '../../../../../service/getTestResult';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TestInfoType} from '../../../../../service/getTestsInfo';
import {TestSetType} from '../../../../../service/getTestSetInfo';
import {useTranslation} from 'react-i18next';

type Result = 'Good' | 'Average' | 'Bad';
export type ResultType = {
  result: Result;
  description: string;
};

export default function Result() {
  const {id} = useParams();

  const {t} = useTranslation();

  const {bottom} = useSafeAreaInsets();

  const {data} = useQuery({
    queryKey: ['testResult', id],
    queryFn: () => getTestResult(Number(id)),
  });

  const queryClient = useQueryClient();

  const linkTo = useLinkTo();

  const close = async () => {
    try {
      await queryClient.refetchQueries({queryKey: ['tests']});
      await queryClient.refetchQueries({queryKey: ['testSet']});
    } catch (e) {
      console.log(e);
      queryClient.invalidateQueries({queryKey: ['tests']});
      queryClient.invalidateQueries({queryKey: ['testSet']});
    }

    linkTo(`/main/mentalTest`);
  };

  return (
    <Stack style={{flex: 1}}>
      <Appbar.Header elevated>
        <Appbar.Content title={t('testResults')} />
      </Appbar.Header>
      <View style={{padding: 24, flex: 1}}>
        <Text>
          {t('yourResultIs')} {data?.result}
        </Text>
        <Text>{data && data?.description}</Text>
      </View>
      <View
        style={{
          paddingHorizontal: 24,
          paddingBottom: bottom === 0 ? 8 : bottom,
          alignItems: 'flex-end',
        }}>
        <Button
          loading={Boolean(queryClient.isFetching())}
          mode="contained"
          onPress={() => {
            close();
          }}>
          {t('close')}
        </Button>
      </View>
    </Stack>
  );
}
