import { Image, View, Text, ScrollView, ActivityIndicator, FlatList } from "react-native";
import { Link } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { getTrendingMovies } from "@/services/appwrite";
import TrendingCard from "@/components/TrendingCard";
import { useColorContext } from "@/context/DarkModeContext"; // Import color context
import { useLanguage } from "@/context/LanguageContext";

export default function Index() {
  const router = useRouter();
  const { darkMode } = useColorContext(); // Get dark mode status from color context
  const { selectedLanguage } = useLanguage(); // Get selected language from context

  const {
    data: trendingMovies,
    loading: trendingMoviesLoading,
    error: trendingMoviesError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: '', language: selectedLanguage }));

  // Dynamic styling based on dark mode
  const backgroundColor = darkMode ? '#121212' : '#ffffff';
  const textColor = darkMode ? '#ffffff' : '#000000';
  const secondaryText = darkMode ? '#aaaaaa' : '#444444';

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <Image source={images.bg} style={{ flex: 1, position: 'absolute', width: '100%', zIndex: 0 }} />
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} style={{ width: 48, height: 40, marginTop: 20, marginBottom: 20, alignSelf: 'center' }} />

        {moviesLoading || trendingMoviesLoading ? (
          <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20, alignSelf: 'center' }} />
        ) : moviesError || trendingMoviesError ? (
          <Text style={{ color: 'red', textAlign: 'center' }}>Error: {moviesError?.message || trendingMoviesError?.message}</Text>
        ) : (
          <View style={{ flex: 1, marginTop: 20 }}>
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Search for a Movie"
            />

            {trendingMovies && (
              <View style={{ marginTop: 30 }}>
                <Text style={{ color: textColor, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Trending Movies</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={trendingMovies}
                  contentContainerStyle={{
                    gap: 26,
                  }}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                  ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                />
              </View>
            )}

            <>
              <Text style={{ color: textColor, fontSize: 18, fontWeight: 'bold', marginTop: 30, marginBottom: 10 }}>Latest Movies</Text>

              <FlatList
                data={movies}
                renderItem={({ item }) => (
                  <MovieCard {...item} />
                )}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{ justifyContent: 'flex-start', gap: 20, paddingRight: 5, marginBottom: 10 }}
                style={{ marginTop: 10, paddingBottom: 30 }}
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
