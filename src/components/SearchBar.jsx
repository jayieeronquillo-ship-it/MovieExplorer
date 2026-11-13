import { useEffect, useRef, useState } from 'react';
import { SearchIcon, CloseIcon } from './Icons.jsx';

/**
 * Controlled-ish search box.
 * - onSubmit(value): called on Enter, or while typing when `live` is true (debounced)
 * - onClear(): optional; defaults to onSubmit('')
 * - initialValue: external value (e.g. from the URL); kept in sync without
 *   overwriting what the user is currently typing.
 */
export default function SearchBar({
  initialValue = '',
  onSubmit,
  onClear,
  live = false,
  placeholder = 'Search movies by title',
  className = '',
}) {
  const [value, setValue] = useState(initialValue);
  const lastSubmitted = useRef(initialValue);

  useEffect(() => {
    if (initialValue !== lastSubmitted.current) {
      lastSubmitted.current = initialValue;
      setValue(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    if (!live) return undefined;
    const timer = setTimeout(() => {
      if (value.trim() !== lastSubmitted.current.trim()) {
        lastSubmitted.current = value;
        onSubmit(value);
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [value, live, onSubmit]);

  const submit = (event) => {
    event.preventDefault();
    lastSubmitted.current = value;
    onSubmit(value);
  };

  const clear = () => {
    setValue('');
    lastSubmitted.current = '';
    if (onClear) onClear();
    else onSubmit('');
  };

  return (
    <form className={`search-bar ${className}`} role="search" onSubmit={submit}>
      <SearchIcon className="search-bar__icon" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search movies"
      />
      {value && (
        <button type="button" className="search-bar__clear" onClick={clear} aria-label="Clear search">
          <CloseIcon width={16} height={16} />
        </button>
      )}
    </form>
  );
}
