import React, { useEffect, useRef, useState } from "react";
import "./TitleCards.css";
import { getMoviesByCategory, getPosterUrl } from "../../services/tmdbService";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import { FaPlus, FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useWatchlist } from "../../context/WatchlistContext";
import { useInView } from 'react-intersection-observer';

const TitleCards = ({ title, category, onCardClick, genreIds }) => {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const cardsRef = useRef();
  
  // Intersection Observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  const scrollLeft = () => {
    if (cardsRef.current) {
      cardsRef.current.scrollBy({ left: -800, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (cardsRef.current) {
      cardsRef.current.scrollBy({ left: 800, behavior: 'smooth' });
    }
  };

  // Initial load
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(false);
      setPage(1);
      setHasMore(true);
      try {
        let data;
        if (genreIds && genreIds.length > 0) {
          const genreString = genreIds.join(',');
          data = await fetch(
            `https://api.themoviedb.org/3/discover/movie?with_genres=${genreString}&language=en-US&page=1`,
            {
              method: 'GET',
              headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMWVlYTBiMmJkMTc5ZGYyNDRiOGI1NmQ2NzIxNWEwOCIsIm5iZiI6MTc2MjQ0NDE5MC44NzM5OTk4LCJzdWIiOiI2OTBjYzM5ZTAzMzQ3ZTdhNTEwNzE2MmYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.IjDpe-1JUTvUZWYywboBhvypvHZrLtlP9j1cqcW9Ujg'}`,
              },
            }
          ).then(res => res.json());
        } else {
          data = await getMoviesByCategory(category || 'now_playing', 1);
        }
        setApiData(data.results || []);
        setHasMore(data.page < data.total_pages);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();

    const currentRef = cardsRef.current;
    if (currentRef) {
      currentRef.addEventListener("wheel", handleWheel);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("wheel", handleWheel);
      }
    };
  }, [category, genreIds]);

  // Load more when scrolling
  useEffect(() => {
    const loadMore = async () => {
      if (inView && hasMore && !loading && !loadingMore) {
        setLoadingMore(true);
        const nextPage = page + 1;
        
        try {
          let data;
          if (genreIds && genreIds.length > 0) {
            const genreString = genreIds.join(',');
            data = await fetch(
              `https://api.themoviedb.org/3/discover/movie?with_genres=${genreString}&language=en-US&page=${nextPage}`,
              {
                method: 'GET',
                headers: {
                  accept: 'application/json',
                  Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMWVlYTBiMmJkMTc5ZGYyNDRiOGI1NmQ2NzIxNWEwOCIsIm5iZiI6MTc2MjQ0NDE5MC44NzM5OTk4LCJzdWIiOiI2OTBjYzM5ZTAzMzQ3ZTdhNTEwNzE2MmYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.IjDpe-1JUTvUZWYywboBhvypvHZrLtlP9j1cqcW9Ujg'}`,
                },
              }
            ).then(res => res.json());
          } else {
            data = await getMoviesByCategory(category || 'now_playing', nextPage);
          }
          
          setApiData(prev => [...prev, ...(data.results || [])]);
          setPage(nextPage);
          setHasMore(data.page < data.total_pages);
        } catch (err) {
          console.error('Error loading more movies:', err);
        } finally {
          setLoadingMore(false);
        }
      }
    };

    loadMore();
  }, [inView, hasMore, loading, loadingMore, page, category, genreIds]);

  const handleWatchlistClick = (e, movie) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist({
      id: movie.id,
      title: movie.original_title,
      backdrop_path: movie.backdrop_path,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date
    });
  };

  const handleCardClick = (e, movieId) => {
    e.preventDefault();
    if (onCardClick) {
      onCardClick(movieId);
    }
  };

  if (error) {
    return (
      <div className="title-cards">
        <h2>{title || "Popular on Netflix"}</h2>
        <div className="error-message">
          <p>Failed to load movies. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="title-cards">
      <h2>{title || "Popular on Netflix"}</h2>
      {loading ? (
        <LoadingSkeleton type="card" count={6} />
      ) : (
        <div className="card-list-wrapper">
          <button className="scroll-btn scroll-left" onClick={scrollLeft}>
            <FaChevronLeft />
          </button>
          <div className="card-list" ref={cardsRef}>
            {apiData.map((card) => (
              <div 
                className="card" 
                key={card.id}
                onClick={(e) => handleCardClick(e, card.id)}
              >
                <img
                  src={getPosterUrl(card.backdrop_path || card.poster_path)}
                  alt={card.original_title}
                />
                <div className="card-overlay">
                  <div className="card-info">
                    <p className="card-title">{card.original_title}</p>
                    <div className="card-actions">
                      <button 
                        className="card-watchlist-btn"
                        onClick={(e) => handleWatchlistClick(e, card)}
                        title={isInWatchlist(card.id) ? "Remove from My List" : "Add to My List"}
                      >
                        {isInWatchlist(card.id) ? <FaCheck /> : <FaPlus />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Infinite Scroll Trigger */}
            {hasMore && (
              <div ref={loadMoreRef} className="load-more-trigger">
                {loadingMore && (
                  <div className="loading-more">
                    <div className="spinner-small"></div>
                  </div>
                )}
              </div>
            )}
          </div>
          <button className="scroll-btn scroll-right" onClick={scrollRight}>
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default TitleCards;
