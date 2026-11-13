import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <p className="footer__brand">Movie Explorer</p>
          <p className="footer__note">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
        <nav className="footer__links" aria-label="Footer">
          <Link to="/discover">Discover Movies</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/about">About</Link>
          <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
            themoviedb.org
          </a>
        </nav>
      </div>
    </footer>
  );
}
