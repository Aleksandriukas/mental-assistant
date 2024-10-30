import {PropsWithChildren} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {PaperProvider, useTheme} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {MD3DarkTheme} from 'react-native-paper';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function MainLayout({children}: PropsWithChildren<{}>) {
  const {colors} = useTheme();
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={MD3DarkTheme}>
        <SafeAreaProvider>
          <StatusBar
            translucent={true}
            backgroundColor="#00000000"
            barStyle="light-content"
          />
          <View
            style={[
              StyleSheet.absoluteFill,
              {backgroundColor: colors.background},
            ]}>
            {children}
          </View>
        </SafeAreaProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
