import React, { createContext, useContext, useState, useEffect } from 'react';

const ContinueWatchingContext = createContext();

export const useContinueWatching = () => {
  const context = useContext(ContinueWatchingContext);
  if (!context) {
    throw new Error('useContinueWatching must be used within ContinueWatchingProvider');
  }
  return context;
};

export const ContinueWatchingProvider = ({ children }) => {
  const [continueWatching, setContinueWatching] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('netflix-continue-watching');
    if (saved) {
      try {
        setContinueWatching(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading continue watching:', error);
      }
    }
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('netflix-continue-watching', JSON.stringify(continueWatching));
  }, [continueWatching]);

  const addToContinueWatching = (movie) => {
    setContinueWatching((prev) => {
      // Remove if already exists
      const filtered = prev.filter((item) => item.id !== movie.id);
      
      // Add to beginning with timestamp
      const newItem = {
        ...movie,
        timestamp: Date.now(),
        progress: movie.progress || 0, // Progress percentage (0-100)
      };
      
      // Keep only last 10
      return [newItem, ...filtered].slice(0, 10);
    });
  };

  const removeFromContinueWatching = (movieId) => {
    setContinueWatching((prev) => prev.filter((item) => item.id !== movieId));
  };

  const updateProgress = (movieId, progress) => {
    setContinueWatching((prev) =>
      prev.map((item) =>
        item.id === movieId ? { ...item, progress, timestamp: Date.now() } : item
      )
    );
  };

  const clearContinueWatching = () => {
    setContinueWatching([]);
  };

  const value = {
    continueWatching,
    addToContinueWatching,
    removeFromContinueWatching,
    updateProgress,
    clearContinueWatching,
  };

  return (
    <ContinueWatchingContext.Provider value={value}>
      {children}
    </ContinueWatchingContext.Provider>
  );
};

export default ContinueWatchingContext;
