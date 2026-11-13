import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { imageUrl } from '../services/movieApi.js';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { HeartIcon, StarIcon, ClockIcon, CalendarIcon, FilmIcon, ChevronLeftIcon } from './Icons.jsx';

function formatRuntime(minutes) {
  if (!minutes) return 'Runtime not listed';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

function formatDate(value) {
  if (!value) return 'Release date TBA';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatMoney(value) {
  return value > 0 ? `$${value.toLocaleString('en-US')}` : null;
}

export default function MovieDetails({ movie }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [posterFailed, setPosterFailed] = useState(false);

  const favorite = isFavorite(movie.id);
  const poster = imageUrl(movie.poster_path, 'w500');
  const backdrop = imageUrl(movie.backdrop_path, 'w1280');
  const companies = movie.production_companies || [];
  const countries = movie.production_countries || [];
  const cast = (movie.credits?.cast || []).slice(0, 8);
  const budget = formatMoney(movie.budget);
  const revenue = formatMoney(movie.revenue);

  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) navigate(-1);
    else navigate('/discover');
  };

  return (
    <article className="details">
      <div
        className="details__backdrop"
        style={backdrop ? { backgroundImage: `url(${backdrop})` } : undefined}
        aria-hidden="true"
      />

      <div className="container details__body">
        <button type="button" className="btn btn--ghost details__back" onClick={goBack}>
          <ChevronLeftIcon width={18} height={18} />
          Back
        </button>

        <div className="details__layout">
          <div className="details__poster">
            {poster && !posterFailed ? (
              <img src={poster} alt={`Poster for ${movie.title}`} onError={() => setPosterFailed(true)} />
            ) : (
              <div className="poster-fallback">
                <FilmIcon width={40} height={40} />
                <span>{movie.title}</span>
                <small>No poster available</small>
              </div>
            )}
          </div>

          <div className="details__info">
            <h1>{movie.title}</h1>
            {movie.tagline && <p className="details__tagline">{movie.tagline}</p>}

            <ul className="details__meta">
              <li className="details__rating">
                <StarIcon width={16} height={16} />
                {movie.vote_average > 0 ? movie.vote_average.toFixed(1) : 'Not rated'}
                {movie.vote_count > 0 && <small>{movie.vote_count.toLocaleString('en-US')} votes</small>}
              </li>
              <li><CalendarIcon width={16} height={16} />{formatDate(movie.release_date)}</li>
              <li><ClockIcon width={16} height={16} />{formatRuntime(movie.runtime)}</li>
            </ul>

            {movie.genres?.length > 0 && (
              <div className="details__genres">
                {movie.genres.map((g) => (
                  <Link key={g.id} to={`/discover?genre=${g.id}`} className="chip">
                    {g.name}
                  </Link>
                ))}
              </div>
            )}

            <h2 className="details__heading">Overview</h2>
            <p className="details__overview">{movie.overview || 'No description is available for this movie yet.'}</p>

            <button
              type="button"
              className={`btn ${favorite ? 'btn--saved' : 'btn--primary'}`}
              onClick={() => toggleFavorite(movie)}
              aria-pressed={favorite}
            >
              <HeartIcon filled={favorite} width={18} height={18} />
              {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
        </div>

        <div className="details__extra">
          <section>
            <h2 className="details__heading">Production</h2>
            <dl className="facts">
              <div>
                <dt>Status</dt>
                <dd>{movie.status || 'Unknown'}</dd>
              </div>
              {movie.original_language && (
                <div>
                  <dt>Original language</dt>
                  <dd>{movie.original_language.toUpperCase()}</dd>
                </div>
              )}
              {companies.length > 0 && (
                <div>
                  <dt>Companies</dt>
                  <dd>{companies.map((c) => c.name).join(', ')}</dd>
                </div>
              )}
              {countries.length > 0 && (
                <div>
                  <dt>Countries</dt>
                  <dd>{countries.map((c) => c.name).join(', ')}</dd>
                </div>
              )}
              {budget && (
                <div>
                  <dt>Budget</dt>
                  <dd>{budget}</dd>
                </div>
              )}
              {revenue && (
                <div>
                  <dt>Revenue</dt>
                  <dd>{revenue}</dd>
                </div>
              )}
            </dl>
          </section>

          {cast.length > 0 && (
            <section>
              <h2 className="details__heading">Top cast</h2>
              <ul className="cast">
                {cast.map((person) => {
                  const photo = imageUrl(person.profile_path, 'w185');
                  return (
                    <li key={person.cast_id ?? person.credit_id} className="cast__item">
                      {photo ? (
                        <img src={photo} alt="" loading="lazy" />
                      ) : (
                        <span className="cast__initial" aria-hidden="true">{person.name.charAt(0)}</span>
                      )}
                      <span className="cast__name">{person.name}</span>
                      <span className="cast__role">{person.character}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
