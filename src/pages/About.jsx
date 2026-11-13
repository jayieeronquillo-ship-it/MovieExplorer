import { Link } from 'react-router-dom';

const FEATURES = [
  'Search movies by title with live results and a clear button',
  'Filter by genre and sort by popularity, rating, release date or title',
  'Paginated results fetched from the API for every page',
  'Favorites saved in localStorage, kept after a refresh',
  'Detail pages with runtime, genres, production info and cast',
  'Skeleton loading, friendly errors with retry, and empty states',
];

const TECH = [
  'React 18 with functional components and hooks',
  'React Router DOM for client-side routing',
  'Vite for development and builds',
  'Fetch API with async/await',
  'TMDB REST API',
  'Plain CSS with custom properties',
];

export default function About() {
  return (
    <div className="container page prose">
      <header className="page__head">
        <h1>About Movie Explorer</h1>
        <p className="page__sub">
          A single page application for finding movies and keeping a personal watchlist.
        </p>
      </header>

      <section>
        <h2>The project</h2>
        <p>
          Movie Explorer is the final project for Web Systems and Technologies. Every title, poster, rating and
          description on the site is loaded live from The Movie Database (TMDB) API.
        </p>
        <p>
          Start on the <Link to="/">home page</Link> for trending films, use{' '}
          <Link to="/discover">Discover Movies</Link> to search and filter, and open{' '}
          <Link to="/favorites">Favorites</Link> to see what you saved.
        </p>
      </section>

      <div className="two-col">
        <section>
          <h2>What you can do</h2>
          <ul>
            {FEATURES.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Built with</h2>
          <ul>
            {TECH.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      </div>

      <section>
        <h2>Team</h2>
        <p>Replace these names with your own before submitting.</p>
        <ul>
          <li>Member 1: homepage, API integration, movie details</li>
          <li>Member 2: search and filters, favorites, responsive design</li>
        </ul>
      </section>

      <section>
        <h2>Data source</h2>
        <p>
          This product uses the TMDB API but is not endorsed or certified by TMDB. Learn more at{' '}
          <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">themoviedb.org</a>.
        </p>
      </section>
    </div>
  );
}
