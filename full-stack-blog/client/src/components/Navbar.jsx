import { useState } from 'react';
import { BookOpen, Menu, PenLine, UserRound, X } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../services/api';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      setMenuOpen(false);
      toast.success('You are logged out.');
      navigate('/');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <nav className="nav container" aria-label="Main navigation">
        <Link className="brand" to="/" onClick={closeMenu} aria-label="Open page one home">
          <span className="brand-mark"><BookOpen size={21} strokeWidth={2.2} /></span>
          <span>page<span className="brand-accent">one</span><small>STORIES THAT STAY</small></span>
        </Link>

        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`nav-links${menuOpen ? ' nav-links-open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu}>Discover</NavLink>
          {user && <NavLink to="/my-blogs" onClick={closeMenu}>My stories</NavLink>}
          {!loading && user && (
            <NavLink to="/dashboard" onClick={closeMenu}>
              <UserRound size={16} /> Dashboard
            </NavLink>
          )}
          {!loading && user ? (
            <div className="nav-account">
              <Link className="nav-write" to="/create" onClick={closeMenu}>
                <PenLine size={15} /> Write a story
              </Link>
              <button className="nav-signout" type="button" onClick={handleLogout}>Sign out</button>
            </div>
          ) : !loading ? (
            <div className="nav-account">
              <NavLink to="/login" className="nav-login" onClick={closeMenu}>Log in</NavLink>
              <Link to="/register" className="button button-primary nav-join" onClick={closeMenu}>Join page one</Link>
            </div>
          ) : null}
        </div>
      </nav>
    </header>
  );
}