import { BookOpen, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <Link className="footer-brand" to="/">
          <BookOpen size={19} /> page<span>one</span>
        </Link>
        <p>A little corner of the internet for big ideas.</p>
        <span className="footer-credit">Made for readers <Heart size={13} fill="currentColor" /></span>
        <small>© {new Date().getFullYear()} Page One. All stories belong to their authors.</small>
      </div>
    </footer>
  );
}