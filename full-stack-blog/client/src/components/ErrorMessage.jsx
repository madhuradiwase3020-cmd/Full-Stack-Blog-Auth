import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <span className="error-icon"><AlertCircle size={20} /></span>
      <div>
        <strong>We hit a little snag</strong>
        <p>{message}</p>
      </div>
      {onRetry && (
        <button className="button button-outline error-retry" onClick={onRetry} type="button">
          <RefreshCw size={15} /> Try again
        </button>
      )}
    </div>
  );
}