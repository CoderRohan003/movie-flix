import { Client, Databases, Account, ID, Query } from 'react-native-appwrite'; 

// ✅ Environment variables
export const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
export const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
export const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
export const COLLECTION_ID_SAVED_MOVIES = process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_COLLECTION_ID!;
export const BUCKET_ID_PROFILE_PHOTOS = process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID_PROFILE_PHOTOS!;
export const PROFILE_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID!;

// ✅ Client setup
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);

// ✅ Services
const database = new Databases(client);
const account = new Account(client);

// ✅ Trending movie update/create logic
export const updateSearchCount = async (query: string, movie: Movie) => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', query),
        ]);

        if (result.documents.length > 0) {
            const existingMovie = result.documents[0];
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, existingMovie.$id, {
                count: existingMovie.count + 1,
            });
            console.log('Updated search count:', existingMovie.title);
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm: query,
                movie_id: movie.id,
                count: 1,
                title: movie.title,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });
            console.log('Created new trending document:', movie.title);
        }
    } catch (error) {
        console.error('Failed to update/create trending movie:', error);
        throw error;
    }
};

// ✅ Fetch top trending movies
export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count'),
        ]);

        return result.documents as unknown as TrendingMovie[];
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return undefined;
    }
};

// ✅ Export all services and IDs
export { client, database, account, ID, Query };
