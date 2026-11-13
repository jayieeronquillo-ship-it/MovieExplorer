import { AlertIcon } from './Icons.jsx';

export default function ErrorMessage({ title = 'Something went wrong', message, onRetry, children }) {
  return (
    <div className="state state--error" role="alert">
      <AlertIcon className="state__icon" width={40} height={40} />
      <h2 className="state__title">{title}</h2>
      {message && <p className="state__text">{message}</p>}
      <div className="state__actions">
        {onRetry && (
          <button type="button" className="btn btn--primary" onClick={onRetry}>
            Retry
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
