import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/app/i18n';

const LanguageContext = createContext({
  selectedLanguage: 'en',
  changeLanguage: (lang: string) => {},
});

export const LanguageProvider = ({ children }: any) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    (async () => {
      const storedLang = await AsyncStorage.getItem('appLanguage');
      if (storedLang) {
        i18n.changeLanguage(storedLang);
        setSelectedLanguage(storedLang);
      }
    })();
  }, []);

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem('appLanguage', lang);
    setSelectedLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ selectedLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
