import {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import {PaperProvider, useTheme} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {MD3DarkTheme} from 'react-native-paper';

export default function MainLayout({children}: PropsWithChildren<{}>) {
  const {colors} = useTheme();
  return (
    <PaperProvider theme={MD3DarkTheme}>
      <SafeAreaProvider>
        <View
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: colors.background},
          ]}>
          {children}
        </View>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
