import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { icons } from '@/constants/icons';
import { useColorContext } from '@/context/DarkModeContext';

const MovieCard = ({ id, poster_path, title, vote_average, release_date, original_language }: Movie) => {
  const { colors } = useColorContext();

  return (
    <Link href={`/movie/${id}`} asChild>
      <TouchableOpacity className="w-[30%]">
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8watGkfA9TOtdzR9JvkXzaDEO5s3XW0FILA&s',
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />

        <Text style={{ color: colors.text }} className="text-sm font-bold mt-2" numberOfLines={1}>
          {title}
        </Text>

        <View className="flex flex-row items-center justify-between w-full">
          <View className="flex flex-row items-center gap-x-1">
            <Image source={icons.star} className="size-4" />
            <Text style={{ color: colors.text }} className="text-xs font-bold uppercase">
              {Math.round(vote_average / 2)}
            </Text>
          </View>
          <Text style={{ color: colors.text }} className="text-xs font-medium uppercase">
            .{original_language}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text style={{ color: colors.secondaryText }} className="text-xs font-medium mt-1">
            {release_date?.split('-')[0]}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
