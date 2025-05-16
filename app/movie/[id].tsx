import { Image, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import useFetch from '@/services/useFetch';
import { fetchMovieDetails } from '@/services/api';
import { icons } from '@/constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveMovieToAppwrite, checkIfMovieIsSaved, unsaveMovieFromAppwrite } from '@/services/savedMovies';

const formatCurrency = (amount: number) => {
    if (!amount) return "N/A";
    return `$${(amount / 1_000_000).toFixed(2)} mil`;
};

const MovieInfo = ({ label, value }: { label: string; value?: string | null }) => (
    <View className="flex-col items-start justify-center mt-5">
        <Text className="text-light-200 font-normal text-sm">{label}</Text>
        <Text className="text-white font-bold mt-2 text-sm">{value ?? "N/A"}</Text>
    </View>
);

const MovieDetails = () => {
    const { id } = useLocalSearchParams();
    const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string));
    const [isSaved, setIsSaved] = useState(false);
    const [savedDocId, setSavedDocId] = useState<string | null>(null);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        if (movie) {
            checkIfMovieIsSaved(movie.id.toString()).then(({ exists, docId }) => {
                setIsSaved(exists);
                setSavedDocId(docId);
            });
        }
    }, [movie]);

    const handleSaveToggle = async () => {
        setSaveLoading(true);
        try {
            if (isSaved && savedDocId) {
                await unsaveMovieFromAppwrite(savedDocId);
                setIsSaved(false);
                setSavedDocId(null);
            } else if (movie) {
                const doc = await saveMovieToAppwrite(movie);
                setIsSaved(true);
                setSavedDocId(doc?.$id || null);
            }
        } catch (err) {
            console.error("Error toggling save:", err);
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading || !movie) {
        return (
            <SafeAreaView className="flex-1 bg-primary justify-center items-center">
                <ActivityIndicator size="large" color="#FFFFFF" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['bottom']} className="bg-primary flex-1">
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View>
                    <Image
                        className="w-full h-[550px]"
                        resizeMode="stretch"
                        source={{ uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}` }}
                    />
                </View>

                <View className="flex-col items-start justify-center mt-5 px-5">
                    <Text className="text-white font-bold text-xl">{movie.title}</Text>
                    <View className="flex-row items-center gap-x-1 mt-2">
                        <Text className="text-light-200 text-sm">{movie.release_date?.split('-')[0]}{"  "}</Text>
                        <Text className="text-light-200 text-sm">
                            {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "N/A"}
                        </Text>
                    </View>
                    <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
                        <Image source={icons.star} className="size-4" />
                        <Text className="text-white font-bold text-sm">{Math.round(movie.vote_average ?? 0)} / 10</Text>
                        <Text className="text-light-200 text-sm">({movie.vote_count} votes)</Text>
                    </View>
                    <MovieInfo label="Overview" value={movie.overview} />
                    <MovieInfo label="Genres" value={movie.genres?.map(g => g.name).join(' - ') || "N/A"} />
                    <View className="flex flex-row justify-between w-1/2">
                        <MovieInfo label="Budget" value={formatCurrency(movie.budget)} />
                        <MovieInfo label="Revenue" value={formatCurrency(movie.revenue)} />
                    </View>
                    <MovieInfo
                        label="Production Companies"
                        value={movie.production_companies?.map(pc => pc.name).join(' - ') || "N/A"}
                    />
                </View>

                {/* Save / Unsave Button */}
                <TouchableOpacity
                    className={`mx-5 mt-6 mb-4 rounded-lg py-3.5 flex-row items-center justify-center 
                        ${isSaved ? 'bg-amber-500' : 'bg-dark-300'}`}
                    onPress={handleSaveToggle}
                    disabled={saveLoading}
                >
                    {saveLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <>
                            <Image source={icons.star} className="size-5 mr-2" tintColor="#FFFFFF" />
                            <Text className="text-white font-semibold text-base">
                                {isSaved ? 'Saved' : 'Save This Movie'}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Go Back Button */}
                <TouchableOpacity
                    className="bg-accent rounded-lg py-3.5 mx-5 mb-10 flex-row items-center justify-center"
                    onPress={router.back}
                >
                    <Image source={icons.arrow} className="size-5 mr-1 mt-0.5 rotate-180" tintColor="#fff" />
                    <Text className="text-white font-semibold text-base">Go Back</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default MovieDetails;
