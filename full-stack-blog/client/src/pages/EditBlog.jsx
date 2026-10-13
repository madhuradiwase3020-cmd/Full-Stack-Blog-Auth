import { ArrowLeft, Pencil } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import BlogForm from '../components/BlogForm';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../services/api';
import blogService from '../services/blogService';

export default function EditBlog() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadBlog = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await blogService.get(id);
      if (String(result.author?._id) !== String(user?.id)) {
        setError('You can only edit stories you wrote.');
        return;
      }
      setBlog(result);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [id, user?.id]);

  useEffect(() => { loadBlog(); }, [loadBlog]);

  async function handleSubmit(values) {
    setSubmitting(true);
    try {
      const updated = await blogService.update(id, values);
      toast.success('Your edits have been saved.');
      navigate(`/blogs/${updated._id}`);
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError));
      setSubmitting(false);
    }
  }

  return (
    <main className="container editor-page">
      <Link className="back-link" to={`/blogs/${id}`}><ArrowLeft size={15} /> Back to story</Link>
      {loading ? <LoadingSpinner label="Opening your draft" /> : error ? (
        <ErrorMessage message={error} onRetry={loadBlog} />
      ) : blog ? (
        <>
          <header className="editor-heading">
            <span className="eyebrow"><Pencil size={14} /> MAKE IT YOURS</span>
            <h1>Back to the <em>page.</em></h1>
            <p>Every story can grow into something new.</p>
          </header>
          <BlogForm key={blog._id} initialValues={blog} submitLabel="Save changes" onSubmit={handleSubmit} submitting={submitting} />
        </>
      ) : null}
    </main>
  );
}