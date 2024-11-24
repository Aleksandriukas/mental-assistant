import {
  Appbar,
  Icon,
  Surface,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import {useLinkTo, useNavigation} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {AnimatedPressable, Stack} from '../../../components';
import {useTranslation} from 'react-i18next';
import {useState} from 'react';
import {FlatList, LayoutAnimation, View} from 'react-native';
import {getAdvices, AdviceType} from '../../../service/getAdvices';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function Suggestions() {
  const {t} = useTranslation();

  const {goBack} = useNavigation();

  const {data} = useQuery({
    queryKey: ['suggestions'],
    queryFn: getAdvices,
  });

  const {bottom} = useSafeAreaInsets();

  return (
    <Stack
      style={{
        flex: 1,
      }}>
      <Appbar.Header elevated>
        <Appbar.BackAction
          onPress={() => {
            goBack();
          }}
        />
        <Appbar.Content title={t('suggestions')} />
      </Appbar.Header>
      <View style={{paddingHorizontal: 24, flex: 1}}>
        <FlatList
          ListEmptyComponent={<ActivityIndicator></ActivityIndicator>}
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: bottom,
            gap: 16,
          }}
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => <SuggestionItem {...item} />}
        />
      </View>
    </Stack>
  );
}

const SuggestionItem = ({adviceContent, id, title}: AdviceType) => {
  const [open, setOpen] = useState(false);

  const degree = useSharedValue(0);

  const onPress = () => {
    degree.value = open ? withTiming(0) : withTiming(-180);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    setOpen(old => !old);
  };

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${degree.value}deg`,
        },
      ],
    };
  });

  return (
    <AnimatedPressable
      stateLayerProps={{style: {borderRadius: 24}}}
      onPress={() => {
        onPress();
      }}>
      <Surface
        mode="flat"
        style={{
          borderRadius: 24,
        }}>
        <View
          style={{
            padding: 16,
            paddingBottom: 0,
          }}>
          <View
            style={{
              height: open ? undefined : 108,
              gap: 16,
              overflow: 'hidden',
            }}>
            <Text variant="titleMedium">{title}</Text>
            <Text
              style={{
                flexWrap: 'wrap',
                flex: 1,
              }}>
              {adviceContent}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
          }}>
          <Animated.View style={animatedIconStyle}>
            <Icon source={'chevron-down'} size={24}></Icon>
          </Animated.View>
        </View>
      </Surface>
    </AnimatedPressable>
  );
};
