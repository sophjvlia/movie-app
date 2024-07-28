import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('https://booking-system-api-sophjvlias-projects.vercel.app/movies');
        setMovies(response.data);
      } catch (error) {
        setError('Error fetching movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1 className="text-center text-white fw-bold my-3">Latest Movies</h1>
      <div className="movies-container">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img src={movie.thumbnail_url} />
            <div className="movie-details">
              <div class="d-flex flex-column justify-content-between h-100">
                <div className="p-4 w-100">
                  <h1 className="fw-bold w-100">{movie.title}</h1>
                  <div className="mx-4">
                    <span><i className="bi bi-film me-2"></i> {movie.genre}</span>
                    <span><i className="bi bi-clock me-2"></i> {movie.duration}</span>
                    <span><i className="bi bi-calendar me-2"></i>{movie.release_date}</span>
                    <span><i className="bi bi-megaphone me-2"></i>{movie.director}</span>
                  </div>
                </div>
                <div className="px-5 w-100">
                  <Link to={`/movies/${movie.movie_id}`} className="w-100">
                    <button type="button" className="btn btn-primary w-100">Buy Now</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;
