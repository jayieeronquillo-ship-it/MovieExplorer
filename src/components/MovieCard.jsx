import { useState } from 'react';
import { Link } from 'react-router-dom';
import { imageUrl } from '../services/movieApi.js';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { HeartIcon, StarIcon, FilmIcon } from './Icons.jsx';

export default function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imageFailed, setImageFailed] = useState(false);

  const poster = imageUrl(movie.poster_path, 'w342');
  const favorite = isFavorite(movie.id);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'Release date TBA';
  const rating = movie.vote_average > 0 ? movie.vote_average.toFixed(1) : null;

  return (
    <article className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-card__link">
        <div className="movie-card__poster">
          {poster && !imageFailed ? (
            <img
              src={poster}
              alt={`Poster for ${movie.title}`}
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="poster-fallback">
              <FilmIcon width={32} height={32} />
              <span>{movie.title}</span>
              <small>No poster available</small>
            </div>
          )}
          {rating && (
            <span className="rating-badge">
              <StarIcon width={12} height={12} />
              {rating}
            </span>
          )}
          <div className="movie-card__overlay">
            <p>{movie.overview || 'No description available yet.'}</p>
          </div>
        </div>
        <div className="movie-card__info">
          <h3 title={movie.title}>{movie.title}</h3>
          <p>{year}</p>
        </div>
      </Link>
      <button
        type="button"
        className={`fav-btn ${favorite ? 'is-active' : ''}`}
        onClick={() => toggleFavorite(movie)}
        aria-pressed={favorite}
        aria-label={favorite ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
      >
        <HeartIcon filled={favorite} width={18} height={18} />
      </button>
    </article>
  );
}
