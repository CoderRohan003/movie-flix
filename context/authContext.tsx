import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  Account,
  Client,
  ID,
  Storage,
} from 'react-native-appwrite';
import {
  PROJECT_ID,
  BUCKET_ID_PROFILE_PHOTOS,
} from '@/services/appwrite';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { URL } from 'react-native-url-polyfill';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);

const account = new Account(client);
const storage = new Storage(client);

type AuthContextType = {
  user: any;
  register: (data: {
    email: string;
    password: string;
    name: string;
    profilePhoto?: {
      uri: string;
      fileName?: string;
      mimeType?: string;
      fileSize?: number;
    };
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const prepareNativeFile = async (asset: {
    uri: string;
    fileName?: string;
    mimeType?: string;
    fileSize?: number;
  }) => {
    const url = new URL(asset.uri);

    return {
      name: asset.fileName || url.pathname.split('/').pop() || 'profile.jpg',
      size: asset.fileSize || 100000,
      type: asset.mimeType || 'image/jpeg',
      uri: url.href,
    };
  };

  const register = async ({
    email,
    password,
    name,
    profilePhoto,
  }: {
    email: string;
    password: string;
    name: string;
    profilePhoto?: {
      uri: string;
      fileName?: string;
      mimeType?: string;
      fileSize?: number;
    };
  }) => {
    try {
      const newAccount = await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      const accountData = await account.get();

      let profileImageUrl: string | undefined;

      if (profilePhoto) {
        const file =
          Platform.OS === 'web'
            ? (profilePhoto as any) // web fallback (not used)
            : await prepareNativeFile(profilePhoto);

        const upload = await storage.createFile(
          BUCKET_ID_PROFILE_PHOTOS,
          accountData.$id,
          file
        );

        profileImageUrl = storage.getFileView(
          BUCKET_ID_PROFILE_PHOTOS,
          upload.$id
        ).href;
      }

      setUser({
        ...accountData,
        profileImageUrl,
      });
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw new Error(error?.message || 'User registration failed.');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const accountData = await account.get();
      const profileImageUrl = storage.getFileView(BUCKET_ID_PROFILE_PHOTOS, accountData.$id).href;

      setUser({
        ...accountData,
        profileImageUrl,
      });

      router.push('/(tabs)/profile');
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error?.message || 'Login failed.');
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      router.push('/movie/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const checkLoggedIn = async () => {
    try {
      const accountData = await account.get();
      const profileImageUrl = storage.getFileView(BUCKET_ID_PROFILE_PHOTOS, accountData.$id).href;

      setUser({
        ...accountData,
        profileImageUrl,
      });
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
