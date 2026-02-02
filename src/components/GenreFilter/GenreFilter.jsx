import React, { useState, useEffect } from 'react';
import './GenreFilter.css';
import { getGenres } from '../../services/tmdbService';
import clsx from 'clsx';

const GenreFilter = ({ selectedGenres, onGenreChange }) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres();
        setGenres(data.genres || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreClick = (genreId) => {
    if (selectedGenres.includes(genreId)) {
      // Remove genre
      onGenreChange(selectedGenres.filter(id => id !== genreId));
    } else {
      // Add genre
      onGenreChange([...selectedGenres, genreId]);
    }
  };

  const handleClearAll = () => {
    onGenreChange([]);
  };

  if (loading) {
    return (
      <div className="genre-filter">
        <div className="genre-loading">Loading genres...</div>
      </div>
    );
  }

  return (
    <div className="genre-filter">
      <div className="genre-header">
        <h3>Genres</h3>
        {selectedGenres.length > 0 && (
          <button className="clear-genres-btn" onClick={handleClearAll}>
            Clear All
          </button>
        )}
      </div>
      <div className="genre-pills">
        {genres.map((genre) => (
          <button
            key={genre.id}
            className={clsx('genre-pill', {
              'active': selectedGenres.includes(genre.id)
            })}
            onClick={() => handleGenreClick(genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;
