import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { useColorContext } from '@/context/DarkModeContext';
import { useTranslation } from 'react-i18next';

const LanguageSelection = () => {
  const { selectedLanguage, changeLanguage } = useLanguage();
  const { colors } = useColorContext();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleLanguageChange = async (lang: 'en' | 'hi') => {
    await changeLanguage(lang);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 30 }}>
        {t('language')}
      </Text>

      <TouchableOpacity
        onPress={() => handleLanguageChange('en')}
        style={{
          backgroundColor: colors.card,
          padding: 16,
          borderRadius: 8,
          marginBottom: 16,
          borderWidth: selectedLanguage === 'en' ? 2 : 0,
          borderColor: '#3B82F6',
        }}
      >
        <Text style={{ color: colors.text, fontSize: 16 }}>🇬🇧 English</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleLanguageChange('hi')}
        style={{
          backgroundColor: colors.card,
          padding: 16,
          borderRadius: 8,
          borderWidth: selectedLanguage === 'hi' ? 2 : 0,
          borderColor: '#3B82F6',
        }}
      >
        <Text style={{ color: colors.text, fontSize: 16 }}>🇮🇳 हिंदी</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LanguageSelection;
