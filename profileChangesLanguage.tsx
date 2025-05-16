import { View, Text, Image, TouchableOpacity, Switch, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { useColorContext } from '@/context/DarkModeContext';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';

const Profile = () => {
  const { darkMode, toggleDarkMode, colors } = useColorContext();
  const { selectedLanguage } = useLanguage();
  const router = useRouter();

  const translations = {
    'en-US': {
      myProfile: 'My Profile',
      name: 'John Doe',
      email: 'johndoe@email.com',
      phone: '+91 9123 678 526',
      login: 'Log In',
      appLanguage: 'App Language',
      helpSupport: 'Help & Support',
      darkMode: 'Dark Mode',
      version: 'Version',
      english: 'English',
      hindi: 'Hindi',
    },
    'hi-IN': {
      myProfile: 'मेरी प्रोफ़ाइल',
      name: 'जॉन डो',
      email: 'johndoe@ईमेल.कॉम',
      phone: '+91 9123 678 526',
      login: 'लॉग इन',
      appLanguage: 'ऐप भाषा',
      helpSupport: 'सहायता और समर्थन',
      darkMode: 'डार्क मोड',
      version: 'संस्करण',
      english: 'अंग्रेज़ी',
      hindi: 'हिंदी',
    },
  };

  const t = translations[selectedLanguage as keyof typeof translations] || translations['en-US'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {/* Heading */}
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 }}>
            {t.myProfile}
          </Text>
        </View>

        {/* Profile Image & Info */}
        <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 24 }}>
          <Image
            source={require('@/assets/images/image.png')}
            style={{ width: 100, height: 100, borderRadius: 50 }}
            resizeMode="cover"
          />
          <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 20, marginTop: 16 }}>{t.name}</Text>
          <Text style={{ color: colors.text, fontSize: 14, marginTop: 4 }}>{t.email}</Text>
          <Text style={{ color: colors.text, fontSize: 14 }}>{t.phone}</Text>
        </View>

        {/* Settings List */}
        <View style={{ backgroundColor: colors.card, borderRadius: 12, overflow: 'hidden' }}>
          {/* Login */}
          <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
            <Text style={{ color: colors.text, fontSize: 16 }}>{t.login}</Text>
            <Image source={icons.arrow} style={{ width: 16, height: 16, tintColor: colors.arrow }} />
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 20 }} />

          {/* App Language */}
          <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}
            onPress={() => router.push('../LanguageSelection')}
          >
            <Text style={{ color: colors.text, fontSize: 16 }}>{t.appLanguage}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: colors.text, fontSize: 14, marginRight: 8 }}>
                {selectedLanguage === 'en-US' ? t.english : t.hindi}
              </Text>
              <Image source={icons.arrow} style={{ width: 16, height: 16, tintColor: colors.arrow }} />
            </View>
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 20 }} />

          {/* Help & Support */}
          <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
            <Text style={{ color: colors.text, fontSize: 16 }}>{t.helpSupport}</Text>
            <Image source={icons.arrow} style={{ width: 16, height: 16, tintColor: colors.arrow }} />
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 20 }} />

          {/* Dark Mode Toggle */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
            <Text style={{ color: colors.text, fontSize: 16 }}>{t.darkMode}</Text>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: "#767577", true: "#3B82F6" }}
              thumbColor="#f4f3f4"
            />
          </View>
          <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 20 }} />

          {/* Version Info */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
            <Text style={{ color: colors.text, fontSize: 16 }}>{t.version}</Text>
            <Text style={{ color: colors.text, fontSize: 14 }}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
