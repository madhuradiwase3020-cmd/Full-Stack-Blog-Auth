import { ArrowUpRight, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const fallbackCovers = [
  'cover-olive',
  'cover-peach',
  'cover-blue',
  'cover-lilac',
];

export function formatDate(date) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' })
    .format(new Date(date));
}

export function estimateReadingTime(content = '') {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 220));
}

export default function BlogCard({ blog, index = 0 }) {
  const coverClass = fallbackCovers[index % fallbackCovers.length];
  return (
    <article className="blog-card">
      <Link className={`blog-card-cover ${blog.coverImage ? 'has-cover-image' : coverClass}`} to={`/blogs/${blog._id}`}>
        {blog.coverImage
          ? <img src={blog.coverImage} alt="" loading="lazy" />
          : <span className="cover-decoration" aria-hidden="true" />}
        <span className="category-pill">{blog.category}</span>
        <span className="cover-arrow"><ArrowUpRight size={18} /></span>
      </Link>
      <div className="blog-card-body">
        <div className="blog-meta">
          <span>{blog.author?.name || 'A page one writer'}</span>
          <span className="meta-dot" />
          <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
        </div>
        <h2><Link to={`/blogs/${blog._id}`}>{blog.title}</Link></h2>
        <p>{blog.excerpt}</p>
        <div className="blog-card-bottom">
          <span className="reading-time"><Clock3 size={14} /> {estimateReadingTime(blog.content)} min read</span>
          <Link className="read-link" to={`/blogs/${blog._id}`} aria-label={`Read ${blog.title}`}>
            Read story <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}