import { View, Text, Image, TouchableOpacity, Switch, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '@/constants/icons';
import { useColorContext } from '@/context/DarkModeContext';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/authContext';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { darkMode, toggleDarkMode } = useColorContext();
  const { selectedLanguage } = useLanguage();
  const { t } = useTranslation();
  const router = useRouter();
  const { user, logout } = useAuth();

  const textColor = darkMode ? '#ffffff' : '#000000';
  const cardBackground = darkMode ? '#333' : '#f0f0f0';
  const borderColor = darkMode ? '#444' : '#ccc';
  const arrowTint = darkMode ? '#fff' : '#000';

  useEffect(() => {
    console.log('User data changed:', user);
  }, [user]);

  const profileImage =
    user?.profileImageUrl && typeof user.profileImageUrl === 'string'
      ? { uri: `${user.profileImageUrl}` }
      : require('@/assets/images/image.png');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#121212' : '#ffffff' }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {/* Heading */}
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ color: textColor, fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 }}>
            {t('profile')}
          </Text>
        </View>

        {/* Profile Image & Info */}
        <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 24 }}>
          <Image
            source={profileImage}
            style={{ width: 100, height: 100, borderRadius: 50 }}
            resizeMode="cover"
          />
          <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 20, marginTop: 16 }}>
            {user?.name || 'John Doe'}
          </Text>
          <Text style={{ color: textColor, fontSize: 14, marginTop: 4 }}>
            {user?.email || 'johndoe123@example.com'}
          </Text>
        </View>

        {/* Settings List */}
        <View style={{ backgroundColor: cardBackground, borderRadius: 12, overflow: 'hidden' }}>
          {/* Log In / Log Out */}
          <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}
            onPress={() => {
              if (user) logout();
              else router.push('/movie/login');
            }}
          >
            <Text style={{ color: textColor, fontSize: 16 }}>
              {user ? t('logout') : t('login')}
            </Text>
            <Image source={icons.arrow} style={{ width: 16, height: 16, tintColor: arrowTint }} />
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: borderColor, marginHorizontal: 20 }} />

          {/* Sign Up */}
          {!user && (
            <>
              <TouchableOpacity
                style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}
                onPress={() => router.push('/movie/register')}
              >
                <Text style={{ color: textColor, fontSize: 16 }}>{t('signup')}</Text>
                <Image source={icons.arrow} style={{ width: 16, height: 16, tintColor: arrowTint }} />
              </TouchableOpacity>
              <View style={{ height: 1, backgroundColor: borderColor, marginHorizontal: 20 }} />
            </>
          )}

          {/* App Language */}
          <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}
            onPress={() => router.push('/LanguageSelection')}
          >
            <Text style={{ color: textColor, fontSize: 16 }}>{t('language')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: textColor, fontSize: 14, marginRight: 8 }}>
                {selectedLanguage === 'en' ? 'English' : selectedLanguage === 'hi' ? 'Hindi' : ''}
              </Text>
              <Image source={icons.arrow} style={{ width: 16, height: 16, tintColor: arrowTint }} />
            </View>
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: borderColor, marginHorizontal: 20 }} />

          {/* Help & Support */}
          <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
            <Text style={{ color: textColor, fontSize: 16 }}>{t('help')}</Text>
            <Image source={icons.arrow} style={{ width: 16, height: 16, tintColor: arrowTint }} />
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: borderColor, marginHorizontal: 20 }} />

          {/* Dark Mode Toggle */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
            <Text style={{ color: textColor, fontSize: 16 }}>{t('dark_mode')}</Text>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#767577', true: '#3B82F6' }}
              thumbColor="#f4f3f4"
            />
          </View>
          <View style={{ height: 1, backgroundColor: borderColor, marginHorizontal: 20 }} />

          {/* Version Info */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
            <Text style={{ color: textColor, fontSize: 16 }}>{t('version')}</Text>
            <Text style={{ color: textColor, fontSize: 14 }}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
