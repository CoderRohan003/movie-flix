import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Account, Client, Databases, ID } from 'react-native-appwrite';
import { PROFILE_COLLECTION_ID, DATABASE_ID, PROJECT_ID } from '@/services/appwrite';
import { useRouter } from 'expo-router';

// Appwrite client setup
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

// Type for context
type AuthContextType = {
    user: any;
    register: (data: { email: string; password: string; name: string }) => Promise<void>;
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

    const getUserProfile = async (userId: string) => {
        const result = await databases.listDocuments(DATABASE_ID, PROFILE_COLLECTION_ID);
        return result.documents.find((doc) => doc.userId === userId);
    };

    const register = async ({ email, password, name }: { email: string; password: string; name: string }) => {
        try {
            const newAccount = await account.create(ID.unique(), email, password, name);
            if (!newAccount) throw new Error('Account creation failed');

            await account.createEmailPasswordSession(email, password);

            const accountData = await account.get();

            await databases.createDocument(DATABASE_ID, PROFILE_COLLECTION_ID, ID.unique(), {
                userId: newAccount.$id,
                name,
            });

            const profileData = await getUserProfile(newAccount.$id);
            setUser({ ...accountData, ...profileData });
            

        } catch (error: any) {
            console.error('Registration failed:', error);
            throw new Error(error?.message || 'User registration failed.');
        }
    };

    const login = async (email: string, password: string) => {
        try {
            await account.createEmailPasswordSession(email, password);
            const accountData = await account.get();
            const profileData = await getUserProfile(accountData.$id);
            setUser({ ...accountData, ...profileData });
            router.push('/(tabs)/profile'); // changed from replace to push
        } catch (error: any) {
            console.error('Login failed:', error);
            throw new Error(error?.message || 'Login failed.');
        }
    };
    

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
            router.push('/movie/login'); // changed from replace to push
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
    

    const checkLoggedIn = async () => {
        try {
            const accountData = await account.get();
            const profileData = await getUserProfile(accountData.$id);
            setUser({ ...accountData, ...profileData });
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
