import {Icon, Surface, Text} from 'react-native-paper';
import {AnimatedPressable, Stack} from '../../../../components';
import {Dimensions, ScrollView, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useLinkTo} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

export default function DailyPage() {
  const {bottom, top} = useSafeAreaInsets();

  const {t} = useTranslation();
  return (
    <ScrollView>
      <Stack
        style={{
          paddingTop: top,
          paddingBottom: bottom,
          marginHorizontal: 24,
          flex: 1,
        }}>
        <MeditationItem
          icon="meditation"
          path="/main/meditations/breathing"
          title={t('breathing')}
        />
      </Stack>
    </ScrollView>
  );
}

type MeditationItemType = {
  title: string;
  icon: string;
  path: string;
};

const MeditationItem = ({icon, path, title}: MeditationItemType) => {
  const {width} = Dimensions.get('screen');
  const roomSize = width * 0.4;

  const linkTo = useLinkTo();

  return (
    <AnimatedPressable
      onPress={() => {
        linkTo(path);
      }}
      stateLayerProps={{
        style: {borderRadius: 24, width: roomSize, height: roomSize},
      }}>
      <Surface
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 12,
          borderRadius: 24,
          height: roomSize,
          width: roomSize,
          gap: 8,
        }}>
        <Icon source={icon} size={48} />
        <Text>{title}</Text>
      </Surface>
    </AnimatedPressable>
  );
};
