export default function LoadingSpinner({ label = 'Loading' }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span className="spinner-wrap__label">{label}</span>
    </div>
  );
}
