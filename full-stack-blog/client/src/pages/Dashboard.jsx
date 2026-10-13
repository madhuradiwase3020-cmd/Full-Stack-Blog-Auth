import { ArrowUpRight, BookOpen, CalendarDays, PenLine, Plus, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../services/api';
import blogService from '../services/blogService';

export default function Dashboard() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadBlogs() {
    setLoading(true);
    setError('');
    try {
      setBlogs(await blogService.listMine());
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBlogs(); }, []);

  return (
    <main className="container dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <span className="eyebrow"><Sparkles size={14} /> YOUR LITTLE CORNER</span>
          <h1>Good to see you,<br /><em>{user?.name.split(' ')[0]}.</em></h1>
          <p>This is your space. Make it yours, one story at a time.</p>
        </div>
        <Link className="button button-primary" to="/create"><Plus size={17} /> Write a story</Link>
        <span className="welcome-decoration">✳</span>
      </section>

      <section className="dashboard-stats" aria-label="Your writing at a glance">
        <div className="stat-card"><span className="stat-icon"><BookOpen size={18} /></span><span className="stat-value">{loading ? '—' : blogs.length}</span><span className="stat-label">Stories written</span></div>
        <div className="stat-card"><span className="stat-icon"><CalendarDays size={18} /></span><span className="stat-value">{new Date().toLocaleDateString('en', { month: 'long' })}</span><span className="stat-label">A fresh month to write</span></div>
        <Link className="stat-card stat-link" to="/my-blogs"><span className="stat-icon"><PenLine size={18} /></span><span className="stat-value">Your stories</span><span className="stat-label">Edit or revisit <ArrowUpRight size={13} /></span></Link>
      </section>

      <section className="dashboard-stories">
        <div className="section-heading compact-heading">
          <div><span className="eyebrow">YOUR LATEST</span><h2>Pages you’ve filled<span className="heading-period">.</span></h2></div>
          {blogs.length > 0 && <Link className="text-link" to="/my-blogs">See all <ArrowUpRight size={15} /></Link>}
        </div>
        {loading ? <LoadingSpinner label="Gathering your stories" /> : error ? (
          <ErrorMessage message={error} onRetry={loadBlogs} />
        ) : blogs.length ? (
          <div className="blog-grid">
            {blogs.slice(0, 3).map((blog, index) => <BlogCard key={blog._id} blog={blog} index={index} />)}
          </div>
        ) : (
          <div className="empty-state dashboard-empty">
            <span className="empty-icon"><BookOpen size={23} /></span>
            <h3>Every writer starts with one.</h3>
            <p>Start a story, follow an idea, and see where it takes you.</p>
            <Link className="button button-primary" to="/create"><PenLine size={15} /> Write your first story</Link>
          </div>
        )}
      </section>
    </main>
  );
}