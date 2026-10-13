import { ArrowLeft, ArrowRight, BookOpen, LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../services/api';

export default function Login() {
  const { user, loading, login } = useAuth();
  const [values, setValues] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const destination = location.state?.from?.pathname || '/dashboard';

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(values);
      toast.success('Welcome back. Your next page is waiting.');
      navigate(destination, { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-layout">
      <aside className="auth-aside">
        <Link to="/" className="auth-aside-brand"><BookOpen size={22} /> page<span>one</span></Link>
        <div className="auth-aside-quote">
          <span className="eyebrow">PICK UP WHERE YOU LEFT OFF</span>
          <blockquote>“There is no greater agony than bearing an untold story inside you.”</blockquote>
          <span className="quote-author">MAYA ANGELOU</span>
        </div>
        <span className="auth-aside-bottom">A LITTLE MORE ROOM FOR THE WORDS THAT MATTER.</span>
        <span className="auth-aside-shape shape-one" />
        <span className="auth-aside-shape shape-two" />
      </aside>
      <section className="auth-main">
        <div className="auth-card">
          <Link to="/" className="back-link"><ArrowLeft size={15} /> Back to stories</Link>
          <span className="eyebrow auth-eyebrow">WELCOME BACK</span>
          <h1>Let’s pick up<br />where you <em>left off.</em></h1>
          <p className="auth-intro">Your reading list and stories are right where you left them.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input id="email" type="email" autoComplete="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} placeholder="you@example.com" required />
            </div>
            <div className="form-field">
              <div className="label-row"><label htmlFor="password">Password</label><LockKeyhole size={14} /></div>
              <input id="password" type="password" autoComplete="current-password" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} placeholder="Your password" maxLength={128} required />
            </div>
            <button className="button button-primary auth-submit" type="submit" disabled={submitting}>
              {submitting ? 'Logging you in…' : 'Log in'} {!submitting && <ArrowRight size={16} />}
            </button>
          </form>
          <p className="auth-switch">New around here? <Link to="/register">Make yourself at home <ArrowRight size={14} /></Link></p>
        </div>
      </section>
    </main>
  );
}