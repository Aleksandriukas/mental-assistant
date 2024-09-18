import {useLinkTo} from '@react-navigation/native';
import {Fragment, PropsWithChildren} from 'react';
import {View} from 'react-native';
import {useActiveRoute} from '../../../../charon';
import {BottomBar, Tab} from '../../../components';

export default function TabsLayout({children}: PropsWithChildren<{}>) {
  const linkTo = useLinkTo();
  const activeRoute = useActiveRoute();

  const currentTab = activeRoute ? activeRoute.split('/') : [];

  console.log('currentTab', currentTab);
  return (
    <View style={{height: '100%', width: '100%'}}>
      {children}
      <BottomBar>
        <Tab
          onPress={() => linkTo('/main/assistant')}
          isFocused={Boolean(currentTab.find(value => value === 'assistant'))}
          icon="alien-outline"
          label="Assistant"
        />
        <Tab
          onPress={() => linkTo('/main/daily')}
          isFocused={Boolean(currentTab.find(value => value === 'daily'))}
          icon="alien-outline"
          label="daily"
        />
      </BottomBar>
    </View>
  );
}
