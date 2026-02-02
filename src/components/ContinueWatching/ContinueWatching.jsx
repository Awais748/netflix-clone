import React from 'react';
import './ContinueWatching.css';
import { useContinueWatching } from '../../context/ContinueWatchingContext';
import { FaTimes, FaPlay } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ContinueWatching = ({ onMovieClick }) => {
  const { continueWatching, removeFromContinueWatching } = useContinueWatching();
  const navigate = useNavigate();

  if (continueWatching.length === 0) {
    return null;
  }

  const handleCardClick = (movie) => {
    if (onMovieClick) {
      onMovieClick(movie.id);
    }
  };

  const handlePlayClick = (e, movieId) => {
    e.stopPropagation();
    navigate(`/player/${movieId}`);
  };

  const handleRemove = (e, movieId) => {
    e.stopPropagation();
    removeFromContinueWatching(movieId);
  };

  return (
    <div className="continue-watching-section">
      <h2>Continue Watching</h2>
      <div className="continue-watching-grid">
        {continueWatching.map((movie) => (
          <div
            key={movie.id}
            className="continue-watching-card"
            onClick={() => handleCardClick(movie)}
          >
            <div className="continue-watching-image-wrapper">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
                alt={movie.title}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="281"%3E%3Crect fill="%23333" width="500" height="281"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
              <div className="continue-watching-overlay">
                <button
                  className="continue-play-btn"
                  onClick={(e) => handlePlayClick(e, movie.id)}
                  aria-label="Continue watching"
                >
                  <FaPlay />
                </button>
              </div>
              <button
                className="continue-remove-btn"
                onClick={(e) => handleRemove(e, movie.id)}
                aria-label="Remove from continue watching"
              >
                <FaTimes />
              </button>
              {/* Progress Bar */}
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${movie.progress || 0}%` }}
                ></div>
              </div>
            </div>
            <div className="continue-watching-info">
              <h3>{movie.title}</h3>
              <p className="continue-watching-meta">
                {movie.progress ? `${Math.round(movie.progress)}% watched` : 'Recently viewed'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContinueWatching;
