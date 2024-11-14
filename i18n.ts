import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import lt from './locales/lt.json';

// Configure i18n with translations and AsyncStorage
i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3', // Compatibility setting for async storage
  resources: {
    en: {translation: en},
    lt: {translation: lt},
  },
  lng: 'en', // Default language
  fallbackLng: 'en',
  interpolation: {escapeValue: false},
});

// Set up language persistence
i18n.on('languageChanged', lng => {
  AsyncStorage.setItem('language', lng);
});

// Load saved language
AsyncStorage.getItem('language').then(savedLanguage => {
  if (savedLanguage) {
    i18n.changeLanguage(savedLanguage);
  }
});

export default i18n;
