import React, { useState, useEffect, useRef } from 'react';
import './SearchModal.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSearch } from 'react-icons/fa';
import { searchMovies, getPosterUrl } from '../../services/tmdbService';
import { debounce } from '../../utils/helpers';
import { formatVote } from '../../utils/helpers';

const SearchModal = ({ isOpen, onClose, onMovieClick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('netflix-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Debounced search function
  const performSearch = useRef(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await searchMovies(searchQuery);
        setResults(data.results.slice(0, 20));
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500)
  ).current;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
  };

  const handleMovieClick = (movie) => {
    // Add to recent searches
    const newRecent = [
      movie.title,
      ...recentSearches.filter(s => s !== movie.title)
    ].slice(0, 5);
    
    setRecentSearches(newRecent);
    localStorage.setItem('netflix-recent-searches', JSON.stringify(newRecent));

    onMovieClick(movie.id);
    onClose();
    setQuery('');
    setResults([]);
  };

  const handleRecentClick = (searchTerm) => {
    setQuery(searchTerm);
    performSearch(searchTerm);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('netflix-recent-searches');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="search-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="search-modal-content"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Header */}
            <div className="search-header">
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for movies..."
                  value={query}
                  onChange={handleInputChange}
                  className="search-input"
                />
                {query && (
                  <button
                    className="search-clear"
                    onClick={() => {
                      setQuery('');
                      setResults([]);
                    }}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <button className="search-close" onClick={onClose}>
                <FaTimes />
              </button>
            </div>

            {/* Search Results */}
            <div className="search-results">
              {loading ? (
                <div className="search-loading">
                  <div className="spinner-small"></div>
                  <p>Searching...</p>
                </div>
              ) : query && results.length > 0 ? (
                <div className="results-grid">
                  {results.map((movie) => (
                    <div
                      key={movie.id}
                      className="result-card"
                      onClick={() => handleMovieClick(movie)}
                    >
                      {movie.poster_path ? (
                        <img
                          src={getPosterUrl(movie.poster_path, 'w200')}
                          alt={movie.title}
                          className="result-poster"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect fill="%23333" width="200" height="300"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="result-poster-placeholder">
                          <span>No Image</span>
                        </div>
                      )}
                      <div className="result-info">
                        <h3>{movie.title}</h3>
                        <div className="result-meta">
                          {movie.release_date && (
                            <span>{new Date(movie.release_date).getFullYear()}</span>
                          )}
                          {movie.vote_average > 0 && (
                            <span className="result-rating">
                              ★ {formatVote(movie.vote_average)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : query && !loading ? (
                <div className="search-empty">
                  <p>No results found for "{query}"</p>
                </div>
              ) : (
                <div className="search-suggestions">
                  {recentSearches.length > 0 && (
                    <div className="recent-searches">
                      <div className="recent-header">
                        <h3>Recent Searches</h3>
                        <button onClick={clearRecent} className="clear-btn">
                          Clear All
                        </button>
                      </div>
                      <div className="recent-list">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            className="recent-item"
                            onClick={() => handleRecentClick(search)}
                          >
                            <FaSearch size={14} />
                            <span>{search}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="search-placeholder">
                    <FaSearch size={48} />
                    <p>Start typing to search for movies</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
