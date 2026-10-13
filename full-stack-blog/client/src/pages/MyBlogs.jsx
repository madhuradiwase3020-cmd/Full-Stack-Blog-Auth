import { ArrowUpRight, BookOpen, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import BlogCard from '../components/BlogCard';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { getApiErrorMessage } from '../services/api';
import blogService from '../services/blogService';

export default function MyBlogs() {
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

  async function handleDelete(id) {
    if (!window.confirm('Delete this story? This cannot be undone.')) return;
    try {
      await blogService.remove(id);
      setBlogs((current) => current.filter((blog) => blog._id !== id));
      toast.success('Your story has been deleted.');
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError));
    }
  }

  return (
    <main className="container my-blogs-page">
      <header className="list-page-heading">
        <div><span className="eyebrow">THE THINGS YOU’VE SAID</span><h1>Your <em>stories.</em></h1><p>A shelf for every idea you’ve put into words.</p></div>
        <Link className="button button-primary" to="/create"><Plus size={16} /> New story</Link>
      </header>

      {loading ? <LoadingSpinner label="Collecting your stories" /> : error ? (
        <ErrorMessage message={error} onRetry={loadBlogs} />
      ) : blogs.length ? (
        <>
          <div className="my-blogs-summary"><span><BookOpen size={16} /> {blogs.length} {blogs.length === 1 ? 'story' : 'stories'}</span><span>Only you can edit or delete your stories.</span></div>
          <div className="blog-grid my-blogs-grid">
            {blogs.map((blog, index) => (
              <div className="owned-blog-card" key={blog._id}>
                <BlogCard blog={blog} index={index} />
                <div className="owned-blog-actions">
                  <Link to={`/blogs/${blog._id}/edit`}>Edit story <ArrowUpRight size={14} /></Link>
                  <button type="button" onClick={() => handleDelete(blog._id)} aria-label={`Delete ${blog.title}`}><Trash2 size={15} /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <span className="empty-icon"><BookOpen size={23} /></span>
          <h3>A shelf waiting for stories.</h3>
          <p>Your writing will find a home here.</p>
          <Link className="button button-primary" to="/create"><Plus size={16} /> Write your first story</Link>
        </div>
      )}
    </main>
  );
}