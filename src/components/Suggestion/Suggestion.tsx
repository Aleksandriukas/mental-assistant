import {useState} from 'react';
import {Pressable, View} from 'react-native';
import {StateLayer} from '../StateLayer';
import {Avatar, Badge, Surface, Text, useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

type SuggestionsProps = {
  onPress: () => void;
};

const Suggestions = ({onPress}: SuggestionsProps) => {
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
          <Text numberOfLines={1} variant="titleLarge">
            {t('suggestions')}
          </Text>
          <Text numberOfLines={3} variant="bodyMedium">
            {t('suggestionsDescription')}
          </Text>
        </View>
      </Surface>
    </Pressable>
  );
};

export default Suggestions;
