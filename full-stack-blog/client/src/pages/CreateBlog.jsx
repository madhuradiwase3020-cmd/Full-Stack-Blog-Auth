import { ArrowLeft, PenLine } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import BlogForm from '../components/BlogForm';
import { getApiErrorMessage } from '../services/api';
import blogService from '../services/blogService';

export default function CreateBlog() {
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const navigate = useNavigate();

  async function handleSubmit(values) {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const blog = await blogService.create(values);
      toast.success('Your story is out in the world.');
      navigate(`/blogs/${blog._id}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error), { id: 'create-story-error' });
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <main className="container editor-page">
      <Link className="back-link" to="/dashboard"><ArrowLeft size={15} /> Back to your page</Link>
      <header className="editor-heading">
        <span className="eyebrow"><PenLine size={14} /> MAKE A LITTLE SPACE</span>
        <h1>Start a <em>new story.</em></h1>
        <p>There’s no rush. Find the words, shape the thought, and put it out there.</p>
      </header>
      <BlogForm submitLabel="Publish story" onSubmit={handleSubmit} submitting={submitting} />
    </main>
  );
}