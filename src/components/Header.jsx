import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import SearchBar from './SearchBar.jsx';
import { MenuIcon, CloseIcon, HeartIcon } from './Icons.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/discover', label: 'Discover Movies' },
  { to: '/favorites', label: 'Favorites' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  useEffect(() => setOpen(false), [pathname]);

  const onDiscover = pathname === '/discover';
  const currentQuery = onDiscover ? params.get('q') || '' : '';

  const handleSearch = (value) => {
    const q = value.trim();
    navigate(q ? `/discover?q=${encodeURIComponent(q)}` : '/discover');
    setOpen(false);
  };

  const handleClear = () => {
    if (onDiscover) navigate('/discover');
  };

  return (
    <header className="header">
      <div className="header__inner container">
        <Link to="/" className="logo" aria-label="Movie Explorer home">
          <span className="logo__mark" aria-hidden="true" />
          Movie Explorer
        </Link>

        <button
          type="button"
          className="header__toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>

        <div id="site-menu" className={`header__panel ${open ? 'is-open' : ''}`}>
          <nav className="nav" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
              >
                {link.label}
                {link.to === '/favorites' && favorites.length > 0 && (
                  <span className="nav__badge" aria-label={`${favorites.length} saved`}>
                    <HeartIcon filled width={12} height={12} />
                    {favorites.length}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
          <SearchBar
            className="search-bar--header"
            initialValue={currentQuery}
            onSubmit={handleSearch}
            onClear={handleClear}
          />
        </div>
      </div>
    </header>
  );
}
