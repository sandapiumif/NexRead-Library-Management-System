import React, { useState } from 'react';
import { SearchIcon, ClockIcon, BookIcon } from './Icons';

export default function BookCatalog({
  books,
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  onOpenBorrowModal,
  onOpenReserveModal,
  userRole,
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    'ALL',
    'Software Engineering',
    'Computer Science',
    'Database Systems',
    'Web Development',
    'Artificial Intelligence',
  ];

  const filteredBooks = books.filter((book) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      book.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.bookCode?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      {/* Header bar */}
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <span>Book Collection & Catalog</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Collection Management, Categorization & Availability Tracking
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div className="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="book-search-input"
              type="text"
              placeholder="Search title, author, ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {userRole === 'LIBRARIAN' && (
            <button
              id="add-book-btn"
              className="btn btn-primary"
              onClick={onOpenAddModal}
            >
              <BookIcon size={14} color="#ffffff" />
              <span>Add New Book</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="filter-pills" style={{ marginBottom: '1.75rem' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <SearchIcon size={36} color="var(--text-muted)" />
          </div>
          <h3>No matching books found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Try adjusting your search keywords or filter category.
          </p>
        </div>
      ) : (
        <div className="book-grid">
          {filteredBooks.map((book) => {
            const isAvailable = book.availableCopies > 0;
            return (
              <div key={book.id} className="book-card">
                {/* Book Cover Image */}
                <div className="book-cover-wrap">
                  <img
                    src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'}
                    alt={book.title}
                    className="book-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=400&q=80';
                    }}
                  />
                  <div className="book-badge-pos">
                    <span
                      className={`badge ${
                        isAvailable
                          ? 'badge-success'
                          : book.status === 'RESERVED'
                          ? 'badge-info'
                          : 'badge-warning'
                      }`}
                    >
                      {isAvailable ? 'AVAILABLE' : book.status}
                    </span>
                  </div>
                  <div className="book-category-pill">{book.category}</div>
                </div>

                {/* Details */}
                <div className="book-details">
                  <div className="book-code-text">{book.bookCode} • ISBN: {book.isbn}</div>
                  <h3 className="book-title" title={book.title}>{book.title}</h3>
                  <div className="book-author">By {book.author}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                    Publisher: {book.publisher}
                  </div>

                  <div className="book-copies-row">
                    <div>
                      <strong>{book.availableCopies}</strong> of {book.totalCopies} copies in library
                    </div>
                    <div style={{ fontWeight: 600, color: isAvailable ? 'var(--success)' : 'var(--danger)' }}>
                      {isAvailable ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="book-actions">
                    {isAvailable ? (
                      <button
                        id={`borrow-btn-${book.id}`}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        onClick={() => onOpenBorrowModal(book)}
                      >
                        <BookIcon size={14} color="#ffffff" />
                        <span>{userRole === 'LIBRARIAN' ? 'Issue Book' : 'Borrow Book'}</span>
                      </button>
                    ) : (
                      <button
                        id={`reserve-btn-${book.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ flex: 1, borderColor: 'var(--info)', color: 'var(--info)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        onClick={() => onOpenReserveModal(book)}
                      >
                        <ClockIcon size={14} color="var(--info)" />
                        <span>Place Reservation</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
