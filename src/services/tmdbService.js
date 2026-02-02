// TMDb API Service
// Centralized API calls for The Movie Database

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMWVlYTBiMmJkMTc5ZGYyNDRiOGI1NmQ2NzIxNWEwOCIsIm5iZiI6MTc2MjQ0NDE5MC44NzM5OTk4LCJzdWIiOiI2OTBjYzM5ZTAzMzQ3ZTdhNTEwNzE2MmYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.IjDpe-1JUTvUZWYywboBhvypvHZrLtlP9j1cqcW9Ujg';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

/**
 * Generic fetch function with error handling
 * @param {string} url - API endpoint URL
 * @returns {Promise<any>} API response data
 */
const fetchData = async (url) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};

/**
 * Get movies by category
 * @param {string} category - Movie category (now_playing, popular, top_rated, upcoming)
 * @param {number} page - Page number
 * @returns {Promise<Object>} Movies data
 */
export const getMoviesByCategory = async (category = 'now_playing', page = 1) => {
  const url = `${BASE_URL}/movie/${category}?language=en-US&page=${page}`;
  return fetchData(url);
};

/**
 * Get movie details by ID
 * @param {number} movieId - Movie ID
 * @returns {Promise<Object>} Movie details
 */
export const getMovieDetails = async (movieId) => {
  const url = `${BASE_URL}/movie/${movieId}?language=en-US`;
  return fetchData(url);
};

/**
 * Get movie videos (trailers, teasers, etc.)
 * @param {number} movieId - Movie ID
 * @returns {Promise<Object>} Movie videos
 */
export const getMovieVideos = async (movieId) => {
  const url = `${BASE_URL}/movie/${movieId}/videos?language=en-US`;
  return fetchData(url);
};

/**
 * Get movie credits (cast and crew)
 * @param {number} movieId - Movie ID
 * @returns {Promise<Object>} Movie credits
 */
export const getMovieCredits = async (movieId) => {
  const url = `${BASE_URL}/movie/${movieId}/credits?language=en-US`;
  return fetchData(url);
};

/**
 * Get similar movies
 * @param {number} movieId - Movie ID
 * @param {number} page - Page number
 * @returns {Promise<Object>} Similar movies
 */
export const getSimilarMovies = async (movieId, page = 1) => {
  const url = `${BASE_URL}/movie/${movieId}/similar?language=en-US&page=${page}`;
  return fetchData(url);
};

/**
 * Search movies
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @returns {Promise<Object>} Search results
 */
export const searchMovies = async (query, page = 1) => {
  const encodedQuery = encodeURIComponent(query);
  const url = `${BASE_URL}/search/movie?query=${encodedQuery}&language=en-US&page=${page}`;
  return fetchData(url);
};

/**
 * Get trending movies
 * @param {string} timeWindow - Time window (day or week)
 * @returns {Promise<Object>} Trending movies
 */
export const getTrendingMovies = async (timeWindow = 'week') => {
  const url = `${BASE_URL}/trending/movie/${timeWindow}?language=en-US`;
  return fetchData(url);
};

/**
 * Get movie genres
 * @returns {Promise<Object>} List of genres
 */
export const getGenres = async () => {
  const url = `${BASE_URL}/genre/movie/list?language=en-US`;
  return fetchData(url);
};

/**
 * Discover movies by genre
 * @param {number} genreId - Genre ID
 * @param {number} page - Page number
 * @returns {Promise<Object>} Movies in genre
 */
export const discoverByGenre = async (genreId, page = 1) => {
  const url = `${BASE_URL}/discover/movie?with_genres=${genreId}&language=en-US&page=${page}`;
  return fetchData(url);
};

/**
 * Get image URL
 * @param {string} path - Image path
 * @param {string} size - Image size (w200, w300, w500, original, etc.)
 * @returns {string} Full image URL
 */
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

/**
 * Get backdrop URL
 * @param {string} path - Backdrop path
 * @returns {string} Full backdrop URL
 */
export const getBackdropUrl = (path) => {
  return getImageUrl(path, 'original');
};

/**
 * Get poster URL
 * @param {string} path - Poster path
 * @param {string} size - Size (w200, w500, original)
 * @returns {string} Full poster URL
 */
export const getPosterUrl = (path, size = 'w500') => {
  return getImageUrl(path, size);
};

export default {
  getMoviesByCategory,
  getMovieDetails,
  getMovieVideos,
  getMovieCredits,
  getSimilarMovies,
  searchMovies,
  getTrendingMovies,
  getGenres,
  discoverByGenre,
  getImageUrl,
  getBackdropUrl,
  getPosterUrl,
};
