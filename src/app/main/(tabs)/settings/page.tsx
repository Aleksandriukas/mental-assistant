import {
  Appbar,
  Button,
  Divider,
  Icon,
  Modal,
  Portal,
  RadioButton,
  Text,
  useTheme,
} from 'react-native-paper';
import {AnimatedPressable, Stack} from '../../../../components';
import {supabase} from '../../../../lib/supabase';
import {useLinkTo} from '../../../../../charon';
import {useQueryClient} from '@tanstack/react-query';
import {
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useSafeContext} from '@sirse-dev/safe-context';
import {MainContext} from '../../../MainContext';
import {useTranslation} from 'react-i18next';
import CountryFlag from 'react-native-country-flag';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useCallback, useEffect, useRef, useState} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const availableLanguages = ['en', 'lt'];

export default function SettingsPage() {
  const linkTo = useLinkTo();

  const {setTheme, theme} = useSafeContext(MainContext);

  const [bottomSheetIndex, setBottomSheetIndex] = useState<number>(-1);

  const [visibleModal, setVisibleModal] = useState(false);

  const {colors} = useTheme();

  const queryClient = useQueryClient();

  const {t, i18n} = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    setBottomSheetIndex(index);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <View style={{flex: 1}}>
          <Appbar.Header elevated>
            <Appbar.Content title={t('settings')} />
          </Appbar.Header>
          <TouchableWithoutFeedback
            onPress={() => {
              if (bottomSheetIndex === 0) {
                bottomSheetModalRef.current?.dismiss();
              }
            }}>
            <Stack
              pointerEvents={bottomSheetIndex === 0 ? 'box-only' : 'auto'}
              style={{
                flex: 1,
              }}>
              <ListItem
                onPress={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                }}
                leftComponent={
                  <Icon
                    size={24}
                    source={
                      theme === 'dark' ? 'weather-night' : 'white-balance-sunny'
                    }
                  />
                }
                text={theme === 'dark' ? t('darkMode') : t('lightMode')}
              />
              <ListItem
                onPress={() => {
                  handlePresentModalPress();
                }}
                leftComponent={
                  <CountryFlag
                    style={{borderRadius: 2}}
                    isoCode={i18n.language === 'en' ? 'gb' : i18n.language}
                    size={20}
                  />
                }
                text={t('fullLanguage')}
              />
              <ListItem
                onPress={() => {
                  setVisibleModal(true);
                }}
                leftComponent={<Icon size={24} source={'logout'} />}
                text={t('logout')}
              />
            </Stack>
          </TouchableWithoutFeedback>
        </View>
        <Portal>
          <Modal
            visible={visibleModal}
            onDismiss={() => setVisibleModal(false)}
            contentContainerStyle={{
              backgroundColor: colors.surface,
              marginHorizontal: 32,
              padding: 24,
              borderRadius: 12,
            }}>
            <Text variant="titleLarge">{t('logout')}</Text>
            <Divider style={{width: '100%', marginVertical: 12}} />
            <Text>{t('logoutConfirmation')}</Text>
            <View
              style={{
                flexDirection: 'row',
                paddingTop: 20,
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}>
              <Button
                onPress={() => {
                  setVisibleModal(false);
                }}>
                {t('close')}
              </Button>
              <Button
                onPress={() => {
                  supabase.auth.signOut();
                  queryClient.clear();
                  linkTo('/auth/login');
                  setVisibleModal(false);
                }}>
                {t('logout')}
              </Button>
            </View>
          </Modal>
        </Portal>

        <BottomSheetModal
          $modal
          backgroundStyle={{
            backgroundColor: colors.surface,
          }}
          containerStyle={{
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          handleIndicatorStyle={{
            backgroundColor: colors.onSurface,
          }}
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}>
          <BottomSheetView style={{minHeight: 128, paddingBottom: 24}}>
            <Text
              style={{paddingHorizontal: 12, paddingVertical: 8}}
              variant="titleLarge">
              Select language
            </Text>

            <RadioButton.Group
              value={i18n.language}
              onValueChange={value => {
                i18n.changeLanguage(value);
              }}>
              <FlatList
                data={availableLanguages}
                ItemSeparatorComponent={() => <Divider />}
                renderItem={({item}) => (
                  <ListItem
                    onPress={() => {
                      i18n.changeLanguage(item);
                      bottomSheetModalRef.current?.dismiss();
                    }}
                    leftComponent={
                      <CountryFlag
                        style={{borderRadius: 2}}
                        isoCode={item === 'en' ? 'gb' : item}
                        size={20}
                      />
                    }
                    rightComponent={
                      <RadioButtonItem checked={item === i18n.language} />
                    }
                    text={t(`${item}`)}
                  />
                )}
              />
            </RadioButton.Group>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

type ListItemProps = {
  leftComponent: React.ReactNode;
  rightComponent?: React.ReactNode;
  text: string;
  onPress?: () => void;
};

const ListItem = ({
  leftComponent: iconComponent,
  text,
  onPress,
  rightComponent,
}: ListItemProps) => {
  return (
    <AnimatedPressable onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingVertical: 12,
          width: '100%',
        }}>
        <View style={{width: 32, alignItems: 'center'}}>{iconComponent}</View>
        <Text variant="titleMedium"> {text}</Text>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
          }}>
          {rightComponent}
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type RadioButtonItemProps = {
  checked: boolean;
};

const RadioButtonItem = ({checked}: RadioButtonItemProps) => {
  const {colors} = useTheme();

  const progress = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0);
  }, [checked]);

  const colorStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(checked ? colors.primary : colors.outline),
    };
  });

  const scaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: withTiming(checked ? 1 : 0, {duration: 150})}],
      opacity: withTiming(checked ? 1 : 0, {duration: 150}),
    };
  });

  return (
    <Animated.View
      style={[
        colorStyle,
        {
          borderRadius: 1000,
          borderWidth: 2,
          width: 22,
          height: 22,
        },
      ]}>
      <Animated.View
        style={[
          scaleStyle,
          {
            flex: 1,
            margin: 2,
            backgroundColor: colors.primary,
            borderRadius: 1000,
          },
        ]}
      />
    </Animated.View>
  );
};
