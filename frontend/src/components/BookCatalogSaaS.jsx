import React, { useState } from 'react';
import { CodeIcon, BookIcon, DatabaseIcon, GlobeIcon, CpuIcon } from './Icons';

export default function BookCatalogSaaS({
  books,
  userRole,
  activeMember,
  onOpenAddModal,
  onBorrowBook,
  onReserveBook,
  onAdjustStock,
  onUpdateBook,
  onDeleteBook,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [featuredBookId, setFeaturedBookId] = useState(2); // BK-2002 as default highlighted
  const [actionMessage, setActionMessage] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);

  const categories = [
    'ALL',
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
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' || book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Software Engineering':
        return <CodeIcon size={14} />;
      case 'Computer Science':
        return <BookIcon size={14} />;
      case 'Database Systems':
        return <DatabaseIcon size={14} />;
      case 'Web Development':
        return <GlobeIcon size={14} />;
      case 'Artificial Intelligence':
        return <CpuIcon size={14} />;
      default:
        return <BookIcon size={14} />;
    }
  };

  const getCategoryClass = (category) => {
    switch (category) {
      case 'Software Engineering':
        return 'badge-se';
      case 'Computer Science':
        return 'badge-cs';
      case 'Database Systems':
        return 'badge-db';
      case 'Web Development':
        return 'badge-web';
      case 'Artificial Intelligence':
        return 'badge-ai';
      default:
        return 'badge-se';
    }
  };

  const handleMemberAction = async (book) => {
    if (!activeMember) {
      setActionMessage('Please select or register a member account to borrow or reserve.');
      setTimeout(() => setActionMessage(''), 4000);
      return;
    }

    try {
      if (book.availableCopies > 0) {
        await onBorrowBook(activeMember.id, book.id);
        setActionMessage(`Successfully borrowed "${book.title}"! Due in 14 days.`);
      } else {
        const res = await onReserveBook(activeMember.id, book.id);
        setActionMessage(`Book reserved! Queue Position: #${res.waitingPosition}.`);
      }
      setTimeout(() => setActionMessage(''), 5000);
    } catch (err) {
      setActionMessage(`Notice: ${err.message || 'Action failed'}`);
      setTimeout(() => setActionMessage(''), 5000);
    }
  };
// Admin: Edit Book
const handleEditBook = async (book) => {
  const title = window.prompt("Book Title:", book.title);
  if (title === null) return;

  const author = window.prompt("Author:", book.author || "");
  if (author === null) return;

  const publisher = window.prompt("Publisher:", book.publisher || "");
  if (publisher === null) return;

  const category = window.prompt("Category:", book.category || "");
  if (category === null) return;

  const totalCopiesInput = window.prompt(
    "Total Copies:",
    book.totalCopies
  );
  if (totalCopiesInput === null) return;

  const totalCopies = Number(totalCopiesInput);

  if (!Number.isInteger(totalCopies) || totalCopies <= 0) {
    alert("Total copies must be a positive whole number.");
    return;
  }

  const coverImage = window.prompt(
  "Book Cover Image URL:",
  book.coverImage || ""
  );
  if (coverImage === null) return;

  try {
    await onUpdateBook(book.id, {
      title: title.trim(),
      author: author.trim(),
      publisher: publisher.trim(),
      category: category.trim(),
      isbn: book.isbn,
      totalCopies: totalCopies,
      description: book.description || "",
      coverImage: coverImage.trim(),
    });

    alert("Book updated successfully!");
  } catch (error) {
    alert(error.message || "Failed to update book.");
  }
};

  return (
    <div>
      {/* SaaS Page Header matching reference */}
      <div className="saas-page-header">
        <div className="page-title-group">
          <h1>
            Book Catalog Collection <span className="page-title-count">({books.length})</span>
          </h1>
          <p className="page-subtitle">
            Browse and manage enterprise learning literature, track stock availability, and issue loans.
          </p>
        </div>

        {userRole === 'ADMIN' && (
          <button className="btn-primary-action" onClick={onOpenAddModal}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span> Add New Book</span>
          </button>
        )}
      </div>

      {actionMessage && (
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: 'rgba(91, 75, 240, 0.12)',
            color: 'var(--primary)',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: '0.88rem',
            marginBottom: '20px',
            border: '1px solid rgba(91, 75, 240, 0.25)',
          }}
        >
          {actionMessage}
        </div>
      )}

      {/* Filter & Search Bar matching screenshot */}
      <div className="saas-filter-bar">
        <div className="search-input-wrapper">
          <svg className="search-icon-inside" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search catalog by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-actions-group">
          <select
            className="select-dropdown"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'All Categories' : c}
              </option>
            ))}
          </select>

          <div className="view-toggle-group">
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout matching screenshot */}
      {viewMode === 'grid' ? (
        <div className="saas-card-grid">
          {filteredBooks.map((book) => {
            const isFeatured = book.id === featuredBookId;

            return (
              <div
                key={book.id}
                className={`saas-card ${isFeatured ? 'featured-card' : ''}`}
                onClick={() => setSelectedBook(book)}
              >
                {/* Top Row: Category pill + action button */}
                <div className="card-top-row">
                  <div className={`card-type-badge ${!isFeatured ? getCategoryClass(book.category) : ''}`}>
                    <span>{getCategoryIcon(book.category)}</span>
                    <span>{book.category}</span>
                  </div>

                  {userRole === 'MEMBER' ? (
                    <button
                      className="btn-card-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMemberAction(book);
                      }}
                    >
                      {book.availableCopies > 0 ? 'Borrow' : 'Reserve'}
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn-card-action"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditBook(book);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="btn-card-action"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteBook(book.id);
                        }}
                      >
                        Archive
                      </button>
                    </div>
                  )}
                </div>

                {/* Book Cover and Information Layout */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', margin: '10px 0' }}>
                  <div style={{
                    width: '68px',
                    height: '96px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    boxShadow: '0 6px 14px rgba(0,0,0,0.12)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                  }}>
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80';
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 className="card-title" style={{ fontSize: '0.98rem', lineHeight: 1.3 }}>{book.title}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 500 }}>
                      by {book.author}
                    </div>
                    <p className="card-desc" style={{ marginTop: '6px' }}>
                      {book.description || 'Comprehensive resource on modern engineering, algorithms and systems design.'}
                    </p>
                  </div>
                </div>

                {/* Footer matching reference layout */}
                <div className="card-footer">
                  <div className="card-meta-item">
                    {book.availableCopies > 0 ? (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="2" y1="12" x2="22" y2="12"></line>
                        </svg>
                        <span>{book.availableCopies} Available</span>
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <span>Out of Stock</span>
                      </>
                    )}
                  </div>

                  <div className="card-meta-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>{book.totalCopies} Total Copies</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table List View */
        <div className="saas-table-container">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Code / ISBN</th>
                <th>Title & Author</th>
                <th>Category</th>
                <th>Publisher</th>
                <th>Availability</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{book.bookCode}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{book.isbn}</div>
                  </td>
                  <td
                    onClick={() => setSelectedBook(book)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {book.title}
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {book.author}
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill ${getCategoryClass(book.category)}`}>
                      {book.category}
                    </span>
                  </td>
                  <td>{book.publisher}</td>
                  <td>
                    <span
                      className={`status-pill ${book.availableCopies > 0 ? 'status-available' : 'status-overdue'}`}
                    >
                      {book.availableCopies > 0 ? `${book.availableCopies} of ${book.totalCopies} In Stock` : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    {userRole === 'MEMBER' ? (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleMemberAction(book)}
                      >
                        {book.availableCopies > 0 ? 'Borrow' : 'Reserve'}
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleEditBook(book)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onDeleteBook(book.id)}
                        >
                          Archive
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

        {/* Book Details Modal */}
        {selectedBook && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px',
            }}
            onClick={() => setSelectedBook(null)}
          >
            <div
              className="card"
              style={{
                width: 'min(700px, 95vw)',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                padding: '28px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedBook(null)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>

              {/* Book Details */}
              <div
                style={{
                  display: 'flex',
                  gap: '25px',
                  alignItems: 'flex-start',
                }}
              >
                <img
                  src={selectedBook.coverImage}
                  alt={selectedBook.title}
                  style={{
                    width: '160px',
                    height: '230px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                  }}
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80';
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h2>{selectedBook.title}</h2>

                  <p style={{ color: 'var(--text-muted)' }}>
                    by {selectedBook.author}
                  </p>

                  <div style={{ display: 'grid', gap: '10px' }}>
                    <div>
                      <strong>Book Code:</strong> {selectedBook.bookCode}
                    </div>

                    <div>
                      <strong>ISBN:</strong> {selectedBook.isbn}
                    </div>

                    <div>
                      <strong>Publisher:</strong> {selectedBook.publisher}
                    </div>

                    <div>
                      <strong>Category:</strong> {selectedBook.category}
                    </div>

                    <div>
                      <strong>Total Copies:</strong> {selectedBook.totalCopies}
                    </div>

                    <div>
                      <strong>Available Copies:</strong>{' '}
                      {selectedBook.availableCopies}
                    </div>

                    <div>
                      <strong>Status:</strong>{' '}
                      {selectedBook.availableCopies > 0
                        ? 'Available'
                        : 'Out of Stock'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginTop: '25px' }}>
                <h3>Description</h3>

                <p
                  style={{
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                  }}
                >
                  {selectedBook.description ||
                    'No description available for this book.'}
                </p>
              </div>

              {/* Member Action */}
              {userRole === 'MEMBER' && (
                <div
                  style={{
                    marginTop: '25px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSelectedBook(null);
                      handleMemberAction(selectedBook);
                    }}
                  >
                    {selectedBook.availableCopies > 0
                      ? 'Borrow Book'
                      : 'Reserve Book'}
                  </button>
                </div>
              )}

              {/* Admin Actions */}
              {userRole === 'ADMIN' && (
                <div
                  style={{
                    marginTop: '25px',
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'flex-end',
                  }}
                >
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setSelectedBook(null);
                      handleEditBook(selectedBook);
                    }}
                  >
                    Edit Book
                  </button>

                  <button
                    className="btn btn-secondary"
                    style={{
                      color: 'var(--danger)',
                      borderColor: 'var(--danger)',
                    }}
                    onClick={() => {
                      setSelectedBook(null);
                      onDeleteBook(selectedBook.id);
                    }}
                  >
                    Archive Book
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}

