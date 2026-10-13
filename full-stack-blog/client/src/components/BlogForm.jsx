import { ImagePlus, Save } from 'lucide-react';
import { useState } from 'react';

const categories = ['Culture', 'Design', 'Ideas', 'Lifestyle', 'Technology', 'Travel', 'Wellbeing', 'Writing'];

export default function BlogForm({ initialValues, submitLabel, onSubmit, submitting }) {
  const [values, setValues] = useState({
    title: initialValues?.title || '',
    excerpt: initialValues?.excerpt || '',
    category: initialValues?.category || 'Ideas',
    coverImage: initialValues?.coverImage || '',
    content: initialValues?.content || '',
  });

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form className="editor-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="title">Story title <span className="required-mark">*</span></label>
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={(event) => update('title', event.target.value)}
          placeholder="Give your story a thoughtful title"
          minLength={3}
          maxLength={120}
          required
        />
        <small className="field-hint">Make it memorable. Up to 120 characters.</small>
      </div>

      <div className="form-field">
        <label htmlFor="excerpt">Short introduction <span className="required-mark">*</span></label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={values.excerpt}
          onChange={(event) => update('excerpt', event.target.value)}
          placeholder="What is this story about? This appears on your story card."
          rows={3}
          minLength={10}
          maxLength={240}
          required
        />
        <small className="field-hint">{values.excerpt.length}/240 characters</small>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="category">Category <span className="required-mark">*</span></label>
          <select id="category" name="category" value={values.category} onChange={(event) => update('category', event.target.value)}>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="coverImage">Cover image URL <span className="optional-mark">OPTIONAL</span></label>
          <div className="input-with-icon">
            <ImagePlus size={17} />
            <input
              id="coverImage"
              name="coverImage"
              type="url"
              value={values.coverImage}
              onChange={(event) => update('coverImage', event.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="content">Your story <span className="required-mark">*</span></label>
        <textarea
          id="content"
          name="content"
          className="story-textarea"
          value={values.content}
          onChange={(event) => update('content', event.target.value)}
          placeholder="Start writing here… Take your time, find your voice, and share something worth reading."
          rows={16}
          minLength={50}
          maxLength={50000}
          required
        />
        <small className="field-hint">{values.content.trim().split(/\s+/).filter(Boolean).length} words · At least 50 characters</small>
      </div>

      <div className="editor-actions">
        <span className="editor-note">Your story is saved to your page one profile.</span>
        <button className="button button-primary" type="submit" disabled={submitting}>
          <Save size={16} /> {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
