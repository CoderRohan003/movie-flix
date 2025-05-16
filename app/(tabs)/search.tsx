import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { images } from '@/constants/images';
import MovieCard from '@/components/MovieCard';
import useFetch from '@/services/useFetch';
import { fetchMovies } from '@/services/api';
import { icons } from '@/constants/icons';
import SearchBar from "@/components/SearchBar";
import { updateSearchCount } from '@/services/appwrite';
import { useColorContext } from '@/context/DarkModeContext';
import { useLanguage } from '@/context/LanguageContext';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { colors } = useColorContext();
  const { selectedLanguage } = useLanguage();

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: loadNewMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery, language: selectedLanguage }), false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadNewMovies();
      } else {
        reset();
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (movies?.length > 0 && movies?.[0]) {
      updateSearchCount(searchQuery, movies[0]);
    }
  }, [movies]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Image
        source={images.bg}
        style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}
        resizeMode="cover"
      />

      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginVertical: 16,
        }}
        ListHeaderComponent={
          <>
            <View style={{ alignItems: 'center', marginTop: 80 }}>
              <Image source={icons.logo} style={{ width: 48, height: 40 }} />
            </View>

            <View style={{ marginVertical: 20 }}>
              <SearchBar
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
                placeholder="Search movies..."
              />
            </View>

            {moviesLoading && (
              <ActivityIndicator size="large" color="#0000ff" style={{ marginVertical: 12 }} />
            )}

            {moviesError && (
              <Text style={{ color: 'red', paddingHorizontal: 20, marginVertical: 12 }}>
                Error: {moviesError?.message}
              </Text>
            )}

            {!moviesLoading && !moviesError && searchQuery.trim() && movies?.length > 0 && (
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>
                Search Results for <Text style={{ color: '#3B82F6' }}>{searchQuery}</Text>
              </Text>
            )}
          </>
        }

        ListEmptyComponent={
          !moviesLoading && !moviesError ? (
            <View style={{ marginTop: 40, paddingHorizontal: 20 }}>
              <Text style={{ textAlign: 'center', color: colors.secondaryText }}>
                {searchQuery.trim() ? 'No movies found' : 'Search for movies'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;
