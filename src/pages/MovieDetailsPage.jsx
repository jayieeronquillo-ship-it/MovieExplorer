import { Link, useParams } from 'react-router-dom';
import { useMovieDetails } from '../hooks/useMovies.js';
import MovieDetails from '../components/MovieDetails.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const { data: movie, loading, error, retry } = useMovieDetails(id);

  if (loading) {
    return (
      <div className="container page">
        <LoadingSpinner label="Loading movie details" />
      </div>
    );
  }

  if (error) {
    const notFound = error.kind === 'notfound';
    return (
      <div className="container page">
        <ErrorMessage
          title={notFound ? 'Movie not found' : 'We could not load this movie'}
          message={notFound ? 'This movie does not exist or the link is not valid.' : error.message}
          onRetry={notFound ? undefined : retry}
        >
          <Link to="/discover" className={`btn ${notFound ? 'btn--primary' : 'btn--ghost'}`}>
            Browse movies
          </Link>
        </ErrorMessage>
      </div>
    );
  }

  return <MovieDetails movie={movie} />;
}
