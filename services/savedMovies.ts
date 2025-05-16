import { account, database } from './appwrite';
import { DATABASE_ID, COLLECTION_ID_SAVED_MOVIES } from './appwrite';
import { ID, Query } from 'react-native-appwrite';

export const saveMovieToAppwrite = async (movie: MovieDetails) => {
  try {
    const existing = await database.listDocuments(DATABASE_ID, COLLECTION_ID_SAVED_MOVIES, [
      Query.equal('movieId', movie.id.toString())
    ]);

    if (existing.total > 0) {
      console.log('Movie already saved.');
      return existing.documents[0]; 
    }

    const newDoc = await database.createDocument(
      DATABASE_ID,
      COLLECTION_ID_SAVED_MOVIES,
      ID.unique(),
      {
        movieId: movie.id.toString(),
        title: movie.title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        genres: movie.genres?.map(g => g.name).join(', '),
      }
    );

    console.log('Movie saved successfully.');
    return newDoc;
  } catch (err) {
    console.error('Error saving movie:', err);
    throw err;
  }
};

export const checkIfMovieIsSaved = async (movieId: string) => {
  const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID_SAVED_MOVIES, [
    Query.equal("movieId", movieId),
  ]);

  if (response.documents.length > 0) {
    return { exists: true, docId: response.documents[0].$id };
  }

  return { exists: false, docId: null };
};


export const getAllSavedMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID_SAVED_MOVIES);
    return result.documents;
  } catch (err) {
    console.error('Error fetching saved movies:', err);
    return [];
  }
};

export const unsaveMovieFromAppwrite = async (documentId: string) => {
  try {
    await database.deleteDocument(DATABASE_ID, COLLECTION_ID_SAVED_MOVIES, documentId);
  } catch (error) {
    console.error("Failed to unsave movie:", error);
  }
};
