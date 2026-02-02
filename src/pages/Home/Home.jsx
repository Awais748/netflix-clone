import React, { useState, useEffect, useCallback } from "react";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import play_icon from "../../assets/play_icon.png";
import info_icon from "../../assets/info_icon.png";
import TitleCards from "../../components/TitleCards/TitleCards";
import Footer from "../../components/Footer/Footer";
import SearchModal from "../../components/SearchModal/SearchModal";
import MovieDetailModal from "../../components/MovieDetailModal/MovieDetailModal";
import ContinueWatching from "../../components/ContinueWatching/ContinueWatching";
import GenreFilter from "../../components/GenreFilter/GenreFilter";
import { useWatchlist } from "../../context/WatchlistContext";
import { getTrendingMovies, getBackdropUrl } from "../../services/tmdbService";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const { watchlist } = useWatchlist();
  const navigate = useNavigate();

  const selectRandomHero = useCallback((movies) => {
    if (movies.length > 0) {
      const randomIdx = Math.floor(Math.random() * Math.min(movies.length, 10));
      setHeroMovie(movies[randomIdx]);
    }
  }, []);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const data = await getTrendingMovies('week');
        const results = data.results || [];
        setTrendingMovies(results);
        selectRandomHero(results);
      } catch (error) {
        console.error("Error fetching hero movie:", error);
      }
    };

    fetchHeroData();
  }, [selectRandomHero]);

  // Auto-rotate hero movie every 15 seconds
  useEffect(() => {
    if (trendingMovies.length === 0) return;
    
    const interval = setInterval(() => {
      selectRandomHero(trendingMovies);
    }, 15000);

    return () => clearInterval(interval);
  }, [trendingMovies, selectRandomHero]);

  const handleSearchClick = () => {
    setShowSearchModal(true);
  };

  const handleMovieClick = (movieId) => {
    setSelectedMovieId(movieId);
  };

  const handleCloseModal = () => {
    setSelectedMovieId(null);
  };

  const handleCloseSearch = () => {
    setShowSearchModal(false);
  };

  const handleGenreChange = (genres) => {
    setSelectedGenres(genres);
  };

  const handlePlayClick = () => {
    if (heroMovie) {
      navigate(`/player/${heroMovie.id}`);
    }
  };

  const handleInfoClick = () => {
    if (heroMovie) {
      setSelectedMovieId(heroMovie.id);
    }
  };

  return (
    <div className="home">
      <Navbar onSearchClick={handleSearchClick} />
      
      {heroMovie ? (
        <div className="hero">
          <img 
            src={getBackdropUrl(heroMovie.backdrop_path)} 
            alt={heroMovie.title || heroMovie.name} 
            className="banner-img" 
          />
          <div className="hero-caption">
            <h1 className="hero-title">{heroMovie.title || heroMovie.name}</h1>
            <p className="hero-overview">
              {heroMovie.overview?.length > 200 
                ? heroMovie.overview.slice(0, 200) + "..." 
                : heroMovie.overview}
            </p>

            <div className="hero-btns">
              <button className="btn" onClick={handlePlayClick}>
                <img src={play_icon} alt="Play" />
                Play
              </button>
              <button className="btn dark-btn" onClick={handleInfoClick}>
                <img src={info_icon} alt="Info" />
                More Info
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hero hero-skeleton">
          {/* Skeleton loading state could go here */}
        </div>
      )}

      <div className="more-cards">
        {/* Main Popular Section transferred from Hero for better visibility */}
        <TitleCards 
          title="Popular on Netflix" 
          category="now_playing" 
          onCardClick={handleMovieClick} 
        />

        {/* Continue Watching Section */}
        <ContinueWatching onMovieClick={handleMovieClick} />

        {/* Genre Filter */}
        <GenreFilter 
          selectedGenres={selectedGenres} 
          onGenreChange={handleGenreChange} 
        />

        {/* Filtered Content */}
        {selectedGenres.length > 0 ? (
          <TitleCards
            title="Filtered Movies"
            genreIds={selectedGenres}
            onCardClick={handleMovieClick}
          />
        ) : (
          <>
            <TitleCards 
              title="Blockbuster Movies" 
              category="top_rated" 
              onCardClick={handleMovieClick} 
            />
            <TitleCards 
              title="Only on Netflix" 
              category="popular" 
              onCardClick={handleMovieClick} 
            />
            <TitleCards 
              title="Upcoming" 
              category="upcoming" 
              onCardClick={handleMovieClick} 
            />
            <TitleCards 
              title="Top Picks for You" 
              category="now_playing" 
              onCardClick={handleMovieClick} 
            />
          </>
        )}

        {watchlist.length > 0 && (
          <div className="my-list-section">
            <h2>My List</h2>
            <div className="watchlist-grid">
              {watchlist.map((movie) => (
                <div 
                  key={movie.id} 
                  className="watchlist-card"
                  onClick={() => handleMovieClick(movie.id)}
                >
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
                    alt={movie.title}
                  />
                  <p>{movie.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* Modals */}
      <SearchModal 
        isOpen={showSearchModal} 
        onClose={handleCloseSearch}
        onMovieClick={handleMovieClick}
      />
      
      {selectedMovieId && (
        <MovieDetailModal 
          movieId={selectedMovieId} 
          onClose={handleCloseModal}
          onMovieClick={handleMovieClick}
        />
      )}
    </div>
  );
};

export default Home;
