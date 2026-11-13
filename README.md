# Movie Explorer

A modern, responsive movie discovery app built with React and Vite. Browse trending films, search by title, filter by genre, sort results, page through everything TMDB has to offer, and save movies to a watchlist that survives a refresh.

Final Project for **Web Systems and Technologies**.

## Project overview

Movie Explorer is a client-side single page application. All movie data (titles, descriptions, posters, release dates, ratings, genres, runtime and cast) is loaded live from the TMDB REST API. Nothing is hardcoded as a data source. The only static list is a small genre fallback that is used if the genre request itself fails.

## Main features

- **Search**: find movies by title with debounced live results, a clear button and a "no movies found" state.
- **Genre filter and sorting**: filter by Action, Comedy, Horror, Romance, Adventure and every other TMDB genre. Sort by popularity, rating, release date or title.
- **Pagination**: Previous/Next buttons, page numbers, a current page indicator, invalid pages blocked, and a new API request for each page.
- **Favorites**: a heart button on every card and on the details page. Saved with `localStorage`, shown on a dedicated Favorites page.
- **Movie details**: poster and backdrop, overview, release date, rating, genres, runtime, production companies and countries, budget, revenue and top cast.
- **Loading and error handling**: skeleton cards, a details spinner, friendly errors with a Retry button, missing poster fallbacks, invalid ID handling and rate-limit messages.
- **Responsive dark UI** with a mobile navigation menu.
- Search, genre, sort and page are stored in the URL, so results can be shared and the back button works.

Note: TMDB's search endpoint cannot filter or sort, so while a search is active the genre filter and sort apply to the results on the current page. Without a search term, they are applied by the API across all pages.

## Technologies used

React 18, JavaScript (ES6+), HTML5, CSS3, React Router DOM 6, Fetch API with async/await, React Hooks (`useState`, `useEffect`, `useContext`, plus `useMemo`, `useCallback`, `useRef`), `localStorage`, TMDB REST API, Vite, Git and GitHub.

## External API

- TMDB API: https://developer.themoviedb.org/
- Create a free account and request an API key: https://www.themoviedb.org/settings/api

This product uses the TMDB API but is not endorsed or certified by TMDB.

## Installation

```bash
git clone https://github.com/<your-username>/movie-explorer.git
cd movie-explorer
npm install
```

## Configure the `.env` file

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```
   On Windows PowerShell: `Copy-Item .env.example .env`
2. Open `.env` and paste your TMDB **API Key** (the v3 key, not the long "Read Access Token"):
   ```
   VITE_TMDB_API_KEY=your_api_key_here
   ```
3. Restart the dev server after changing `.env`.

`.env` is listed in `.gitignore`, so your key is never committed. Only `.env.example` (with a placeholder) is in the repository. Vite embeds `VITE_` variables in the browser bundle, so treat the key as a free, low-risk key meant for this kind of project.

## Run the application

```bash
npm run dev       # start the dev server at http://localhost:5173
npm run build     # production build in /dist
npm run preview   # preview the production build
```

## Project structure

```
src/
  components/   Header, Footer, SearchBar, MovieCard, MovieGrid, MovieRow, GenreFilter,
                SortDropdown, Pagination, LoadingSpinner, ErrorMessage, MovieDetails, Icons
  pages/        Home, Discover, MovieDetailsPage, Favorites, About, NotFound
  services/     movieApi.js        all TMDB requests and error handling
  hooks/        useMovies.js       useAsync, useMovies, useMovieDetails, useGenres
  context/      FavoritesContext.jsx
  App.jsx  main.jsx  index.css
```

Routes: `/` Home, `/discover` search and filters, `/movie/:id` details, `/favorites`, `/about`.

## Git branching and collaboration workflow

Nobody commits directly to `main`. Every feature lives on its own branch and is merged through a Pull Request that the other member reviews.

Suggested branches:

| Branch | Purpose |
| --- | --- |
| `feature/homepage` | Home page, hero, movie rows |
| `feature/api-integration` | `movieApi.js`, hooks, env setup |
| `feature/search-filter` | Search, genre filter, sorting |
| `feature/pagination` | Pagination component and logic |
| `feature/movie-details` | Details page |
| `feature/favorites` | Favorites context, page, localStorage |
| `feature/responsive-design` | Mobile menu, responsive layout |

Typical flow:

```bash
git checkout main
git pull origin main
git checkout -b feature/search-filter

# work, then commit in small steps
git add .
git commit -m "feat: implement movie search"

git push -u origin feature/search-filter
# open a Pull Request on GitHub, get a review, then "Merge pull request"

git checkout main
git pull origin main
```

Commit message style: `feat:` new feature, `fix:` bug fix, `style:` visual changes, `docs:` documentation, `refactor:` code cleanup. Examples:

- `feat: create movie homepage`
- `feat: integrate TMDB API`
- `feat: add favorites functionality`
- `fix: resolve API fetching error`
- `style: improve responsive layout`
- `docs: update README documentation`

Tip: protect `main` in GitHub under Settings, Branches, Add rule, and require a pull request before merging.

## Team member contributions

Replace the placeholders with your real names before submitting.

| Member | Contributions |
| --- | --- |
| Member 1 (@github-username) | Project setup, API integration, Home page, Movie details |
| Member 2 (@github-username) | Search and filters, pagination, Favorites, responsive design, README |

## Troubleshooting

- **"No TMDB API key found"**: create `.env` from `.env.example`, add your key, restart `npm run dev`.
- **"TMDB rejected the API key"**: make sure you used the v3 API Key and there are no quotes or spaces around it.
- **Posters missing**: some movies have no poster in TMDB. A placeholder is shown instead.
