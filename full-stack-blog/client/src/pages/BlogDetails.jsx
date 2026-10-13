import { ArrowLeft, ArrowUpRight, Clock3, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { estimateReadingTime, formatDate } from '../components/BlogCard';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../services/api';
import blogService from '../services/blogService';

export default function BlogDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const loadBlog = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setBlog(await blogService.get(id));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadBlog(); }, [loadBlog]);

  async function handleDelete() {
    if (!window.confirm('Delete this story? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await blogService.remove(id);
      toast.success('Your story has been deleted.');
      navigate('/my-blogs', { replace: true });
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError));
      setDeleting(false);
    }
  }

  if (loading) return <main className="container content-page"><LoadingSpinner label="Opening the story" /></main>;
  if (error) return <main className="container content-page"><ErrorMessage message={error} onRetry={loadBlog} /></main>;
  if (!blog) return null;

  const isOwner = user && String(user.id) === String(blog.author?._id);

  return (
    <main className="article-page">
      <div className="container article-container">
        <Link className="back-link article-back" to="/"><ArrowLeft size={15} /> All stories</Link>
        <header className="article-header">
          <span className="category-label">{blog.category}</span>
          <h1>{blog.title}</h1>
          <p className="article-excerpt">{blog.excerpt}</p>
          <div className="article-byline">
            <div className="author-avatar">{(blog.author?.name || 'W').charAt(0).toUpperCase()}</div>
            <div><strong>{blog.author?.name || 'A page one writer'}</strong><span>{formatDate(blog.createdAt)}</span></div>
            <span className="byline-divider" />
            <span className="reading-time"><Clock3 size={14} /> {estimateReadingTime(blog.content)} min read</span>
            {isOwner && (
              <div className="article-actions">
                <Link className="button button-outline button-small" to={`/blogs/${blog._id}/edit`}><Pencil size={14} /> Edit</Link>
                <button className="button button-danger button-small" type="button" onClick={handleDelete} disabled={deleting}>
                  <Trash2 size={14} /> {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </header>
        <div className={`article-cover${blog.coverImage ? ' article-cover-image' : ''}`}>
          {blog.coverImage
            ? <img src={blog.coverImage} alt="" />
            : <div className="article-cover-art"><span>{blog.category}</span><i>✳</i></div>}
        </div>
        <article className="article-body">
          {blog.content.split(/\n{2,}/).map((paragraph, index) => (
            <p key={`${blog._id}-${index}`}>{paragraph}</p>
          ))}
          <div className="article-endmark">✳</div>
        </article>
        <div className="article-end">
          <div>
            <span className="eyebrow">THE END, FOR NOW</span>
            <p>Thanks for spending a little time with this story.</p>
          </div>
          <Link className="button button-outline" to="/">More stories <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </main>
  );
}