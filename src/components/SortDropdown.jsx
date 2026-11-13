import { SORT_OPTIONS } from '../services/movieApi.js';

export default function SortDropdown({ value, onChange, allowRelevance = false }) {
  return (
    <label className="select">
      <span className="select__label">Sort by</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {allowRelevance && <option value="">Best match</option>}
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
