import { Stack } from "expo-router";
import './globals.css';
import { StatusBar } from "react-native";
import { ColorProvider } from "@/context/DarkModeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ColorProvider>
          <StatusBar hidden={true} />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="LanguageSelection" options={{ headerShown: false }} />

            {/* ✅ Include login and register pages */}
            <Stack.Screen name="movie/login" options={{ headerShown: false }} />
            <Stack.Screen name="movie/register" options={{ headerShown: false }} />
          </Stack>
        </ColorProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
