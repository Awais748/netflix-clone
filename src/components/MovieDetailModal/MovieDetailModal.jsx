import React, { useEffect, useState } from 'react';
import './MovieDetailModal.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaTimes, FaPlus, FaCheck } from 'react-icons/fa';
import { 
  getMovieDetails, 
  getMovieCredits, 
  getSimilarMovies,
  getPosterUrl,
  getBackdropUrl
} from '../../services/tmdbService';
import { formatRuntime, formatVote, getYear, getRatingColor } from '../../utils/helpers';
import { useWatchlist } from '../../context/WatchlistContext';
import { useNavigate } from 'react-router-dom';

const MovieDetailModal = ({ movieId, onClose, onMovieClick }) => {
  const [movieData, setMovieData] = useState(null);
  const [credits, setCredits] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!movieId) return;
      
      setLoading(true);
      setError(false);
      try {
        const [details, creditsData, similar] = await Promise.all([
          getMovieDetails(movieId),
          getMovieCredits(movieId),
          getSimilarMovies(movieId)
        ]);
        
        setMovieData(details);
        setCredits(creditsData);
        setSimilarMovies(similar.results?.slice(0, 6) || []);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  const handlePlayClick = () => {
    navigate(`/player/${movieId}`);
    onClose();
  };

  const handleWatchlistToggle = () => {
    if (movieData) {
      toggleWatchlist({
        id: movieData.id,
        title: movieData.title,
        backdrop_path: movieData.backdrop_path,
        poster_path: movieData.poster_path,
        vote_average: movieData.vote_average,
        release_date: movieData.release_date
      });
    }
  };

  const handleSimilarMovieClick = (movie) => {
    if (onMovieClick) {
      onMovieClick(movie.id);
    }
  };

  return (
    <AnimatePresence>
      {movieId && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="modal-content scale-in"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={onClose} aria-label="Close modal">
              <FaTimes />
            </button>

            {loading ? (
              <div className="modal-loading">
                <div className="spinner"></div>
                <p>Loading movie details...</p>
              </div>
            ) : error ? (
              <div className="modal-error">
                <p>Failed to load movie details</p>
                <button onClick={onClose} className="btn-retry">Close</button>
              </div>
            ) : movieData ? (
              <>
                {/* Hero Section */}
                <div className="modal-hero">
                  {movieData.backdrop_path ? (
                    <img 
                      src={getBackdropUrl(movieData.backdrop_path)} 
                      alt={movieData.title}
                      className="modal-backdrop"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="modal-backdrop-placeholder">
                      <span>No Image Available</span>
                    </div>
                  )}
                  <div className="modal-hero-overlay"></div>
                  <div className="modal-hero-content">
                    <h1 className="modal-title">{movieData.title}</h1>
                    <div className="modal-actions">
                      <button className="btn-play" onClick={handlePlayClick}>
                        <FaPlay /> Play
                      </button>
                      <button 
                        className="btn-watchlist" 
                        onClick={handleWatchlistToggle}
                        title={isInWatchlist(movieId) ? "Remove from My List" : "Add to My List"}
                        aria-label={isInWatchlist(movieId) ? "Remove from watchlist" : "Add to watchlist"}
                      >
                        {isInWatchlist(movieId) ? <FaCheck /> : <FaPlus />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="modal-details">
                  <div className="modal-info">
                    <div className="modal-meta">
                      <span 
                        className="modal-rating"
                        style={{ color: getRatingColor(movieData.vote_average) }}
                      >
                        ★ {formatVote(movieData.vote_average)}
                      </span>
                      <span className="modal-year">{getYear(movieData.release_date)}</span>
                      <span className="modal-runtime">{formatRuntime(movieData.runtime)}</span>
                    </div>

                    <p className="modal-overview">{movieData.overview || 'No description available.'}</p>

                    {movieData.genres && movieData.genres.length > 0 && (
                      <div className="modal-genres">
                        <span className="label">Genres:</span>
                        <span className="value">
                          {movieData.genres.map(g => g.name).join(', ')}
                        </span>
                      </div>
                    )}

                    {credits?.cast && credits.cast.length > 0 && (
                      <div className="modal-cast">
                        <span className="label">Cast:</span>
                        <span className="value">
                          {credits.cast.slice(0, 5).map(c => c.name).join(', ')}
                        </span>
                      </div>
                    )}

                    {credits?.crew && credits.crew.length > 0 && (
                      <div className="modal-crew">
                        <span className="label">Director:</span>
                        <span className="value">
                          {credits.crew
                            .filter(c => c.job === 'Director')
                            .map(c => c.name)
                            .join(', ') || 'N/A'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Similar Movies */}
                  {similarMovies.length > 0 && (
                    <div className="modal-similar">
                      <h3>More Like This</h3>
                      <div className="similar-grid">
                        {similarMovies.map((movie) => (
                          <div 
                            key={movie.id} 
                            className="similar-card"
                            onClick={() => handleSimilarMovieClick(movie)}
                          >
                            {movie.poster_path ? (
                              <img 
                                src={getPosterUrl(movie.poster_path, 'w300')} 
                                alt={movie.title}
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450"%3E%3Crect fill="%23333" width="300" height="450"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                                }}
                              />
                            ) : (
                              <div className="similar-placeholder">No Image</div>
                            )}
                            <div className="similar-info">
                              <h4>{movie.title}</h4>
                              <span className="similar-rating">
                                ★ {formatVote(movie.vote_average)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MovieDetailModal;
