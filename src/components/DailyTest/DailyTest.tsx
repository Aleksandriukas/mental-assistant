import {useState} from 'react';
import {Pressable, View} from 'react-native';
import {StateLayer} from '../StateLayer';
import {Avatar, Badge, Surface, Text, useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

type DailyTestProps = {
  onPress: () => void;
  isCompleted: boolean;
  streak: number;
};

const DailyTest = ({onPress, isCompleted, streak}: DailyTestProps) => {
  const [pressed, setPressed] = useState(false);

  const {t} = useTranslation();
  const {colors} = useTheme();

  return (
    <Pressable
      style={{width: '45%'}}
      onPressIn={() => {
        setPressed(true);
      }}
      onPressOut={() => {
        setPressed(false);
      }}
      onPress={onPress}>
      <StateLayer style={{borderRadius: 24}} pressed={pressed} />
      <Surface
        style={{
          width: '100%',
          padding: 16,
          flexDirection: 'row',
          borderRadius: 24,
          height: 144,
          position: 'relative',
        }}
        elevation={2}>
        <View style={{gap: 6}}>
          {streak > 1 && (
            <Badge
              style={{
                position: 'absolute',
                top: -20,
                right: -20,
                backgroundColor: colors.onBackground,
                fontWeight: 'bold',
              }}
              size={24}>
              {`${streak}🔥`}
            </Badge>
          )}
          <Text numberOfLines={1} variant="titleLarge">
            {t('dailyTest')}
          </Text>
          <Text numberOfLines={3} variant="bodyMedium">
            {t('dailyTestDescription')}
          </Text>
          {!isCompleted && (
            <Text
              style={{
                color: '#339CFF',
                textAlign: 'right',
              }}
              variant="bodySmall">
              {t('new')}
            </Text>
          )}
        </View>
      </Surface>
    </Pressable>
  );
};

export default DailyTest;
