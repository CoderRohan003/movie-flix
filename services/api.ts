export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
};

export const fetchMovies = async ({ query, language = "en-US" }: { query: string; language?: string }) => {
    const endpoint = query
        ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=${language}` // Add `language` to the search URL
        : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&language=${language}`; // Add `language` to the discover URL

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
        //@ts-ignore
        throw new Error('Failed to fetch movies', response.statusText);
    }

    const data = await response.json();
    return data.results;
};

export const fetchMovieDetails = async (movieId: string): Promise<MovieDetails> => {
    try {
        const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`, {
            method: 'GET',
            headers: TMDB_CONFIG.headers,
        });

        if (!response.ok) {
            //@ts-ignore
            throw new Error('Failed to fetch movie details', response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
