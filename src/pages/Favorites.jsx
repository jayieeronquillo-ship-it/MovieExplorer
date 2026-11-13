import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext.jsx';
import MovieGrid from '../components/MovieGrid.jsx';
import { HeartIcon } from '../components/Icons.jsx';

export default function Favorites() {
  const { favorites, clearFavorites } = useFavorites();

  const handleClear = () => {
    if (window.confirm('Remove all movies from your favorites?')) clearFavorites();
  };

  const emptyState = (
    <div className="state">
      <HeartIcon className="state__icon" width={40} height={40} />
      <h2 className="state__title">Your watchlist is empty</h2>
      <p className="state__text">Tap the heart on any movie to save it here. Your list stays on this device.</p>
      <div className="state__actions">
        <Link to="/discover" className="btn btn--primary">
          Discover movies
        </Link>
      </div>
    </div>
  );

  return (
    <div className="container page">
      <header className="page__head page__head--row">
        <div>
          <h1>Your favorites</h1>
          {favorites.length > 0 && (
            <p className="page__sub">
              {favorites.length} saved {favorites.length === 1 ? 'movie' : 'movies'}
            </p>
          )}
        </div>
        {favorites.length > 0 && (
          <button type="button" className="btn btn--ghost" onClick={handleClear}>
            Clear all
          </button>
        )}
      </header>
      <MovieGrid movies={favorites} emptyState={emptyState} />
    </div>
  );
}
