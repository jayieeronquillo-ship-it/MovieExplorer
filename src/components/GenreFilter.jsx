export default function GenreFilter({ genres, selected, onChange, loading }) {
  if (loading && genres.length === 0) {
    return (
      <div className="genre-filter" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className="skeleton skeleton--chip" />
        ))}
      </div>
    );
  }

  return (
    <div className="genre-filter" role="group" aria-label="Filter by genre">
      <button
        type="button"
        className={`chip ${selected === '' ? 'is-active' : ''}`}
        aria-pressed={selected === ''}
        onClick={() => onChange('')}
      >
        All genres
      </button>
      {genres.map((genre) => {
        const active = String(genre.id) === String(selected);
        return (
          <button
            key={genre.id}
            type="button"
            className={`chip ${active ? 'is-active' : ''}`}
            aria-pressed={active}
            onClick={() => onChange(active ? '' : String(genre.id))}
          >
            {genre.name}
          </button>
        );
      })}
    </div>
  );
}
