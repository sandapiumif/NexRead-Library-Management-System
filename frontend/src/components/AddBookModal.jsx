import React, { useState } from 'react';
import { AlertTriangleIcon, BookIcon, CheckCircleIcon } from './Icons';

const BOOK_CATEGORIES = [
  'Fiction',
  'Science',
  'Technology',
  'Mathematics',
  'Business',
  'History',
  'Literature',
  'Psychology',
  'Education',
  'Medicine',
  'Law',
  'Biography',
  'Self-Help',
  "Children's",
  'Reference',
  'Arts',
  'Sports',
  'Religion',
  'Travel',
  'Languages',
  'Engineering',
  'Economics & Finance',
  'Geography',
  'Philosophy',
  'Politics',
  'Music',
  'Poetry',
  'Cooking & Food',
  'Nature & Environment',
  'Agriculture',
  'Architecture',
  'Communication & Media',
  'Computer Science',
  'Software Engineering',
  'Database Systems',
  'Web Development',
  'Artificial Intelligence',
  'Mystery & Thriller',
  'Fantasy & Science Fiction',
  'Modern Classics',
  'Novel'
];

export default function AddBookModal({ isOpen, onClose, onAddBook }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    category: 'Software Engineering',
    totalCopies: 3,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim() || !formData.isbn.trim() || !formData.publisher.trim()) {
      setErrorMsg('Please fill in all required fields (Title, Author, ISBN, Publisher).');
      return;
    }

    setLoading(true);
    try {
      await onAddBook(formData);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to add book to catalog.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookIcon size={20} color="#ffffff" />
            </div>
            <div>
              <h3 className="modal-title" style={{ color: '#ffffff', fontSize: '1.2rem', margin: 0 }}>Add New Book to Collection</h3>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', margin: '2px 0 0 0' }}>Chief Librarian Catalog Management Console</p>
            </div>
          </div>
          <button className="close-btn" style={{ color: '#ffffff', opacity: 0.8 }} onClick={onClose}>&times;</button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '24px' }}>
          {errorMsg && (
            <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <AlertTriangleIcon size={16} color="#ef4444" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form id="add-book-modal-form" onSubmit={handleSubmit}>
            {/* Book Title */}
            <div className="form-group" style={{ marginBottom: '18px' }}>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
                Book Title *
              </label>
              <input
                id="new-book-title"
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Modern Software Engineering Architecture"
                value={formData.title}
                onChange={handleChange}
                required
                style={{ width: '100%', height: '42px' }}
              />
            </div>

            {/* Row 1: Author & ISBN */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
                  Author(s) *
                </label>
                <input
                  id="new-book-author"
                  type="text"
                  name="author"
                  className="form-input"
                  placeholder="e.g. David Farley"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', height: '42px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
                  ISBN-13 *
                </label>
                <input
                  id="new-book-isbn"
                  type="text"
                  name="isbn"
                  className="form-input"
                  placeholder="e.g. 978-0137314942"
                  value={formData.isbn}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', height: '42px' }}
                />
              </div>
            </div>

            {/* Row 2: Publisher & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
                  Publisher *
                </label>
                <input
                  id="new-book-publisher"
                  type="text"
                  name="publisher"
                  className="form-input"
                  placeholder="e.g. Addison-Wesley"
                  value={formData.publisher}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', height: '42px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
                  Category / Genre
                </label>
                <select
                  id="new-book-category"
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  style={{ width: '100%', height: '42px' }}
                >
                  {BOOK_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Total Copies & Cover Image URL */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
                  Total Copies Available
                </label>
                <input
                  id="new-book-copies"
                  type="number"
                  name="totalCopies"
                  min="1"
                  max="50"
                  className="form-input"
                  value={formData.totalCopies}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', height: '42px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
                  Cover Image URL
                </label>
                <input
                  id="new-book-cover"
                  type="url"
                  name="coverImage"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.coverImage}
                  onChange={handleChange}
                  style={{ width: '100%', height: '42px' }}
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
                Brief Plot / Description
              </label>
              <textarea
                id="new-book-desc"
                name="description"
                className="form-textarea"
                rows={3}
                placeholder="Comprehensive summary of key concepts, chapters, and academic audience..."
                value={formData.description}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px' }}
              />
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ padding: '16px 24px', backgroundColor: 'var(--bg-surface-subtle)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button id="save-book-btn" form="add-book-modal-form" type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding Book...' : 'Save Book to Catalog'}
          </button>
        </div>
      </div>
    </div>
  );
}
