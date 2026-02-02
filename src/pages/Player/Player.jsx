import React, { useEffect, useState } from "react";
import "./Player.css";
import back_arrow_icon from "../../assets/back_arrow_icon.png";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieVideos, getMovieDetails } from "../../services/tmdbService";
import { useContinueWatching } from "../../context/ContinueWatchingContext";

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToContinueWatching } = useContinueWatching();

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    type: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch video and movie details
        const [videoData, movieDetails] = await Promise.all([
          getMovieVideos(id),
          getMovieDetails(id)
        ]);
        
        if (videoData.results && videoData.results.length > 0) {
          setApiData(videoData.results[0]);
        }

        // Add to continue watching with random progress for demo
        if (movieDetails) {
          addToContinueWatching({
            id: movieDetails.id,
            title: movieDetails.title,
            backdrop_path: movieDetails.backdrop_path,
            poster_path: movieDetails.poster_path,
            progress: Math.floor(Math.random() * 70) + 10, // Random 10-80% for demo
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id, addToContinueWatching]);

  return (
    <div className="player">
      <img 
        src={back_arrow_icon} 
        alt="Back" 
        onClick={() => navigate(-1)} 
      />
      <iframe
        width="90%"
        height="90%"
        src={`https://www.youtube.com/embed/${apiData.key}`}
        frameBorder="0"
        title="trailer"
        allowFullScreen
      ></iframe>
      <div className="player-info">
        <p>{apiData.published_at?.slice(0, 10)}</p>
        <p>{apiData.name}</p>
        <p>{apiData.type}</p>
      </div>
    </div>
  );
};

export default Player;
