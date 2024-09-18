import {useLinkTo} from '@react-navigation/native';
import {Fragment, PropsWithChildren} from 'react';
import {View} from 'react-native';
import {useActiveRoute} from '../../../../charon';
import {BottomBar, Tab} from '../../../components';

export default function TabsLayout({children}: PropsWithChildren<{}>) {
  const linkTo = useLinkTo();
  const activeRoute = useActiveRoute();

  const currentTab = activeRoute!.split('/');

  return (
    <View style={{height: '100%', width: '100%'}}>
      {children}
      <BottomBar>
        <Tab
          onPress={() => linkTo('/main/daily')}
          isFocused={Boolean(currentTab.find(value => value === 'daily'))}
          icon="alien-outline"
          label="daily"
        />
        <Tab
          onPress={() => linkTo('/main/chat')}
          isFocused={Boolean(currentTab.find(value => value === 'chat'))}
          icon="alien-outline"
          label="chat"
        />
      </BottomBar>
    </View>
  );
}
