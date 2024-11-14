import {PropsWithChildren, useEffect, useState} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {MD3LightTheme, PaperProvider, useTheme} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {MD3DarkTheme} from 'react-native-paper';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {MainContext, MessageType} from './MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const queryClient = new QueryClient();

export default function MainLayout({children}: PropsWithChildren<{}>) {
  const {colors} = useTheme();

  const [messages, setMessages] = useState<MessageType[]>([]);

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme) {
          setTheme(storedTheme as 'light' | 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem('theme', theme);
      } catch (error) {
        console.error('Failed to save theme:', error);
      }
    };
    saveTheme();
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme === 'dark' ? MD3DarkTheme : MD3LightTheme}>
        <MainContext.Provider
          value={{
            messages: messages,
            setMessages: setMessages,
            setTheme: setTheme,
            theme: theme,
          }}>
          <SafeAreaProvider>
            <StatusBar
              translucent={true}
              backgroundColor="#00000000"
              barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
            />
            <View
              style={[
                StyleSheet.absoluteFill,
                {backgroundColor: colors.background},
              ]}>
              {children}
            </View>
          </SafeAreaProvider>
        </MainContext.Provider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
