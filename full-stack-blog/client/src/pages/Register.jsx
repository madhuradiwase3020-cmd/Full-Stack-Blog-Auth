import { ArrowLeft, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../services/api';

export default function Register() {
  const { user, loading, register } = useAuth();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(values);
      toast.success('You’re in. We can’t wait to read your story.');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-layout">
      <aside className="auth-aside register-aside">
        <Link to="/" className="auth-aside-brand"><BookOpen size={22} /> page<span>one</span></Link>
        <div className="auth-aside-quote">
          <span className="eyebrow"><Sparkles size={14} /> MAKE YOURSELF AT HOME</span>
          <blockquote>Your perspective is the one thing only you can bring to the page.</blockquote>
          <span className="quote-author">YOUR FIRST PAGE STARTS HERE</span>
        </div>
        <span className="auth-aside-bottom">READ A LITTLE. WRITE A LITTLE. STAY A WHILE.</span>
        <span className="auth-aside-shape shape-one" />
        <span className="auth-aside-shape shape-two" />
      </aside>
      <section className="auth-main">
        <div className="auth-card">
          <Link to="/" className="back-link"><ArrowLeft size={15} /> Back to stories</Link>
          <span className="eyebrow auth-eyebrow">A NEW CHAPTER</span>
          <h1>There’s a place<br />for <em>your words.</em></h1>
          <p className="auth-intro">Create your free account and make page one yours.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="name">Your name</label>
              <input id="name" type="text" autoComplete="name" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} placeholder="How should we call you?" minLength={2} maxLength={60} required />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input id="email" type="email" autoComplete="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} placeholder="you@example.com" maxLength={254} required />
            </div>
            <div className="form-field">
              <label htmlFor="password">Create a password</label>
              <input id="password" type="password" autoComplete="new-password" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} placeholder="At least 8 characters" minLength={8} maxLength={128} required />
              <small className="field-hint">Use at least 8 characters.</small>
            </div>
            <button className="button button-primary auth-submit" type="submit" disabled={submitting}>
              {submitting ? 'Creating your account…' : 'Create your account'} {!submitting && <ArrowRight size={16} />}
            </button>
          </form>
          <p className="auth-terms">By joining, you agree to treat this little corner kindly.</p>
          <p className="auth-switch">Already a member? <Link to="/login">Welcome back <ArrowRight size={14} /></Link></p>
        </div>
      </section>
    </main>
  );
}