import {useLinkTo} from '@react-navigation/native';
import {Fragment, PropsWithChildren} from 'react';
import {View} from 'react-native';
import {useActiveRoute} from '../../../../charon';
import {BottomBar, Tab} from '../../../components';
import {useTranslation} from 'react-i18next';

export default function TabsLayout({children}: PropsWithChildren<{}>) {
  const linkTo = useLinkTo();
  const activeRoute = useActiveRoute();

  const currentTab = activeRoute ? activeRoute.split('/') : ['daily'];

  const {t} = useTranslation();

  return (
    <View style={{height: '100%', width: '100%'}}>
      {children}
      <BottomBar>
        <Tab
          onPress={() => linkTo('/main/home')}
          isFocused={Boolean(currentTab.find(value => value === 'home'))}
          icon="account"
          label={t('home')}
        />
        <Tab
          onPress={() => linkTo('/main/assistant')}
          isFocused={Boolean(currentTab.find(value => value === 'assistant'))}
          icon="assistant"
          label={t('assistant')}
        />
        <Tab
          onPress={() => linkTo('/main/meditation')}
          isFocused={Boolean(currentTab.find(value => value === 'meditation'))}
          icon="meditation"
          label={t('meditation')}
        />
        <Tab
          onPress={() => linkTo('/main/settings')}
          isFocused={Boolean(currentTab.find(value => value === 'settings'))}
          icon="hammer-wrench"
          label={t('settings')}
        />
      </BottomBar>
    </View>
  );
}
