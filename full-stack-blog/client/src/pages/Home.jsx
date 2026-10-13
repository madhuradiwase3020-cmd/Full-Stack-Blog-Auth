import { ArrowDown, ArrowUpRight, BookOpen, Search, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import blogService from '../services/blogService';
import { getApiErrorMessage } from '../services/api';

const featureStories = ['Ideas worth keeping', 'A slower kind of Sunday', 'The art of beginning again'];

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  async function loadBlogs() {
    setLoading(true);
    setError('');
    try {
      setBlogs(await blogService.list());
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBlogs();
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set(blogs.map((blog) => blog.category))],
    [blogs]
  );
  const visibleBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return blogs.filter((blog) => {
      const matchesCategory = category === 'All' || blog.category === category;
      const matchesSearch = !query || `${blog.title} ${blog.excerpt} ${blog.author?.name || ''}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [blogs, category, search]);

  return (
    <main>
      <section className="hero container">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={14} /> A home for your next good read</span>
          <h1>Stories make<br />room for <em>more.</em></h1>
          <p>Thoughtful words from curious people. Find a new perspective, or share one of your own.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#latest-stories">Explore stories <ArrowDown size={16} /></a>
            <Link className="button button-text" to="/register">Start writing <ArrowUpRight size={16} /></Link>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true"><span>J</span><span>M</span><span>A</span><span>+</span></div>
            <span>Made by readers, for readers</span>
          </div>
        </div>
        <div className="hero-art" aria-label="A quiet still life of books and a cup of tea">
          <div className="hero-art-orbit orbit-one" />
          <div className="hero-art-orbit orbit-two" />
          <div className="hero-sun" />
          <div className="hero-book hero-book-back" />
          <div className="hero-book hero-book-front"><BookOpen size={35} strokeWidth={1.25} /><span>A good story<br />stays with you.</span></div>
          <div className="hero-vase"><span /></div>
          <span className="hero-caption">ISSUE NO. 01 &nbsp;·&nbsp; OPEN A NEW PAGE</span>
          <span className="hero-art-star star-a">✳</span>
          <span className="hero-art-star star-b">✳</span>
        </div>
      </section>

      <section className="feature-strip">
        <div className="container feature-strip-inner">
          <span className="feature-label">A FEW THINGS YOU’LL FIND HERE</span>
          <div>{featureStories.map((story, index) => <span key={story}><i>0{index + 1}</i>{story}</span>)}</div>
        </div>
      </section>

      <section className="stories-section container" id="latest-stories">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FRESH OFF THE PAGE</span>
            <h2>Stories to settle into<span className="heading-period">.</span></h2>
            <p>A handpicked corner of the internet, written by people like you.</p>
          </div>
          <label className="search-box">
            <Search size={17} />
            <input aria-label="Search stories" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a story…" />
          </label>
        </div>

        {!loading && !error && blogs.length > 0 && (
          <div className="category-tabs" aria-label="Filter stories by category">
            {categories.map((item) => (
              <button key={item} type="button" className={category === item ? 'category-tab active' : 'category-tab'} onClick={() => setCategory(item)}>
                {item}
              </button>
            ))}
          </div>
        )}

        {loading ? <LoadingSpinner label="Finding your next read" /> : error ? (
          <ErrorMessage message={error} onRetry={loadBlogs} />
        ) : visibleBlogs.length ? (
          <div className="blog-grid">
            {visibleBlogs.map((blog, index) => <BlogCard key={blog._id} blog={blog} index={index} />)}
          </div>
        ) : blogs.length ? (
          <div className="empty-state">
            <span className="empty-icon"><Search size={23} /></span>
            <h3>No stories found</h3>
            <p>Try a different search or category.</p>
            <button className="button button-outline" onClick={() => { setSearch(''); setCategory('All'); }} type="button">Clear filters</button>
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon"><BookOpen size={23} /></span>
            <h3>The first page is still blank.</h3>
            <p>Be the first to share a story with this community.</p>
            <Link className="button button-primary" to="/register">Write the first story <ArrowUpRight size={16} /></Link>
          </div>
        )}
      </section>

      <section className="write-cta">
        <div className="container write-cta-content">
          <span className="eyebrow">YOUR WORDS BELONG HERE</span>
          <h2>Every good story<br />starts <em>somewhere.</em></h2>
          <p>Make this the place you begin.</p>
          <Link className="button button-light" to="/register">Share your first story <ArrowUpRight size={16} /></Link>
          <span className="cta-decoration cta-decoration-one">✳</span>
          <span className="cta-decoration cta-decoration-two">✳</span>
        </div>
      </section>
    </main>
  );
}