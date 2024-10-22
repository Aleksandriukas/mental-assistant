import {useLinkTo} from '@react-navigation/native';
import {Fragment, PropsWithChildren} from 'react';
import {View} from 'react-native';
import {useActiveRoute} from '../../../../charon';
import {BottomBar, Tab} from '../../../components';

export default function TabsLayout({children}: PropsWithChildren<{}>) {
  const linkTo = useLinkTo();
  const activeRoute = useActiveRoute();

  const currentTab = activeRoute ? activeRoute.split('/') : ['daily'];

  console.log('currentTab', currentTab);
  return (
    <View style={{height: '100%', width: '100%'}}>
      {children}
      <BottomBar>
        <Tab
          onPress={() => linkTo('/main/home')}
          isFocused={Boolean(currentTab.find(value => value === 'home'))}
          icon="account"
          label="Home"
        />
        <Tab
          onPress={() => linkTo('/main/assistant')}
          isFocused={Boolean(currentTab.find(value => value === 'assistant'))}
          icon="assistant"
          label="Assistant"
        />
        <Tab
          onPress={() => linkTo('/main/meditation')}
          isFocused={Boolean(currentTab.find(value => value === 'meditation'))}
          icon="meditation"
          label="Meditation"
        />
        <Tab
          onPress={() => linkTo('/main/settings')}
          isFocused={Boolean(currentTab.find(value => value === 'settings'))}
          icon="hammer-wrench"
          label="Settings"
        />
      </BottomBar>
    </View>
  );
}
