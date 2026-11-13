import { Link } from 'react-router-dom';
import { FilmIcon } from '../components/Icons.jsx';

export default function NotFound() {
  return (
    <div className="container page">
      <div className="state">
        <FilmIcon className="state__icon" width={40} height={40} />
        <h1 className="state__title">Page not found</h1>
        <p className="state__text">The page you are looking for does not exist.</p>
        <div className="state__actions">
          <Link to="/" className="btn btn--primary">Go home</Link>
          <Link to="/discover" className="btn btn--ghost">Discover movies</Link>
        </div>
      </div>
    </div>
  );
}
