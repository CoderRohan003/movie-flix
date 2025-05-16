import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { database } from '@/services/appwrite';
import { DATABASE_ID, COLLECTION_ID_SAVED_MOVIES } from '@/services/appwrite';
import { useColorContext } from '@/context/DarkModeContext';

const Saved = () => {
  const [savedMovies, setSavedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { colors } = useColorContext();

  const fetchSavedMovies = async () => {
    try {
      const res = await database.listDocuments(DATABASE_ID, COLLECTION_ID_SAVED_MOVIES);
      setSavedMovies(res.documents);
    } catch (error) {
      console.error('Error fetching saved movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchSavedMovies();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.text} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
            Saved Movies
          </Text>
        </View>

        {savedMovies.length === 0 ? (
          <Text style={{ color: colors.secondaryText, fontSize: 16 }}>You haven't saved any movies yet</Text>
        ) : (
          savedMovies.map((movie) => (
            <TouchableOpacity
              key={movie.$id}
              style={{ marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 16 }}
              onPress={() => router.push(`/movie/${movie.movieId}`)}
            >
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500/${movie.posterPath}` }}
                style={{ width: 80, height: 112, borderRadius: 8 }}
                resizeMode="cover"
              />
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>{movie.title}</Text>
                <Text style={{ color: colors.secondaryText, fontSize: 14, marginTop: 4 }}>{movie.releaseDate}</Text>
                <Text style={{ color: colors.secondaryText, fontSize: 14, marginTop: 4 }}>
                  ⭐ {movie.voteAverage.toFixed(1)} / 10
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Saved;
