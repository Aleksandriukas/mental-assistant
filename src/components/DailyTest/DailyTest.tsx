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
        <View style={{flex: 2, gap: 6}}>
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
          <Text variant="titleLarge">{t('dailyTest')}</Text>
          <Text variant="bodyMedium">{t('dailyTestDescription')}</Text>
          {isCompleted ? (
            <Avatar.Icon
              accessibilityLabel="done daily test"
              icon="check-circle-outline"
              style={{
                position: 'absolute',
                backgroundColor: 'transparent',
                right: -20,
                bottom: -20,
              }}
              color="green"
            />
          ) : (
            <Avatar.Icon
              accessibilityLabel="not done daily test"
              icon="alert-circle-outline"
              style={{
                position: 'absolute',
                backgroundColor: 'transparent',
                right: -20,
                bottom: -20,
              }}
              color="yellow"
            />
          )}
        </View>
      </Surface>
    </Pressable>
  );
};

export default DailyTest;
