import {Appbar} from 'react-native-paper';
import {useLinkTo} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {Stack} from '../../../components';
import {useTranslation} from 'react-i18next';
import LineGraphComponent from '../../../components/LineGraphComponent/LineGraphComponent';
import {getDailyStatistics} from '../../../service/getDailyStatistics';

export default function GraphStatsPage() {
  const linkTo = useLinkTo();

  const {t} = useTranslation();

  const {data} = useQuery({
    queryKey: ['dailyStatistics'],
    queryFn: getDailyStatistics,
  });

  return (
    <Stack
      style={{
        flex: 1,
      }}>
      <Appbar.Header elevated>
        <Appbar.BackAction
          onPress={() => {
            linkTo('/main/home');
          }}
        />
        <Appbar.Content title={t('yourStats')} />
      </Appbar.Header>
      <LineGraphComponent data={data} />
    </Stack>
  );
}
