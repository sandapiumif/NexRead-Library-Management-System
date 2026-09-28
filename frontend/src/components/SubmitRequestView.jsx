import React, { useState } from 'react';
import { AlertTriangleIcon, CheckCircleIcon } from './Icons';

export default function SubmitRequestView({
  activeMember,
  books,
  requests,
  onSubmitRequest,
}) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    reason: '',
  });

  const [loading, setLoading] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Live duplicate checking against collection
  const checkDuplicate = (titleInput, isbnInput) => {
    if (!titleInput && !isbnInput) {
      setDuplicateWarning(null);
      return;
    }

    const t = titleInput.trim().toLowerCase();
    const i = isbnInput ? isbnInput.trim().replace(/[-\s]/g, '').toLowerCase() : '';

    const foundInCatalog = books.find((b) => {
      const matchTitle = t && b.title.toLowerCase().includes(t);
      const matchIsbn = i && b.isbn.replace(/[-\s]/g, '').toLowerCase() === i;
      return matchTitle || matchIsbn;
    });

    if (foundInCatalog) {
      setDuplicateWarning(foundInCatalog);
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, title: val });
    checkDuplicate(val, formData.isbn);
  };

  const handleIsbnChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, isbn: val });
    checkDuplicate(formData.title, val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.reason) {
      setErrorMsg('Please provide the book title, author, and academic purpose.');
      return;
    }

    if (duplicateWarning) {
      setErrorMsg('Cannot submit request: this book is already present in the library catalog.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await onSubmitRequest({
        memberId: activeMember?.id,
        ...formData,
      });

      setSuccessMsg(`Acquisition request submitted successfully! Request ID: ${res.requestCode}`);
      setFormData({ title: '', author: '', isbn: '', publisher: '', reason: '' });
      setTimeout(() => setSuccessMsg(''), 6000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit request.');
    } finally {
      setLoading(false);
    }
  };

  const memberRequests = requests.filter((r) => r.member?.id === activeMember?.id);

  return (
    <div>
      <div className="saas-page-header">
        <div className="page-title-group">
          <h1>Request a New Book Acquisition</h1>
          <p className="page-subtitle">
            Recommend textbooks, research volumes, or monographs for addition to the library collection.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', alignItems: 'start' }}>
        {/* Form Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '28px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
            Book Acquisition Form
          </h3>

          {successMsg && (
            <div style={{ padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.86rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircleIcon size={16} color="#059669" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div style={{ padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.86rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangleIcon size={16} color="#ef4444" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Real-Time Duplicate Warning Alert */}
          {duplicateWarning && (
            <div
              style={{
                padding: '14px 18px',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <AlertTriangleIcon size={20} color="#d97706" />
              <div>
                <div style={{ fontWeight: 700, color: '#b45309', fontSize: '0.88rem' }}>
                  Duplicate Book Detected in Catalog
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-body)', marginTop: '3px' }}>
                  <strong>"{duplicateWarning.title}"</strong> by {duplicateWarning.author} already exists in our collection ({duplicateWarning.availableCopies} copies currently available). You can borrow or reserve it directly from the Catalog.
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Book Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Distributed Systems: Principles and Paradigms"
                required
                value={formData.title}
                onChange={handleTitleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Author *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Andrew S. Tanenbaum"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">ISBN (10 or 13 digits)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 978-0132143011"
                  value={formData.isbn}
                  onChange={handleIsbnChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Publisher (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Pearson / Prentice Hall"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Academic Purpose & Justification *</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Describe why this book is recommended for learning, research, or course curriculum..."
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
              disabled={loading || Boolean(duplicateWarning)}
            >
              {loading ? 'Validating & Submitting...' : 'Submit Acquisition Request'}
            </button>
          </form>
        </div>

        {/* History of My Requests */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px' }}>
            My Submitted Requests ({memberRequests.length})
          </h3>

          {memberRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              You have not submitted any book acquisition requests yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {memberRequests.map((req) => (
                <div
                  key={req.id}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--primary)' }}>
                      {req.requestCode}
                    </span>
                    <span
                      className={`status-pill ${
                        req.status === 'APPROVED'
                          ? 'status-available'
                          : req.status === 'REJECTED'
                          ? 'status-overdue'
                          : 'status-pending'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    {req.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    by {req.author}
                  </div>
                  {req.adminNotes && (
                    <div style={{ marginTop: '6px', fontSize: '0.76rem', color: 'var(--text-body)', fontStyle: 'italic' }}>
                      Librarian: "{req.adminNotes}"
                    </div>
                  )}

              {req.purchaseRecommendation && (
                <div
                  style={{
                    marginTop: '10px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.18)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      marginBottom: '4px',
                    }}
                  >
                    📚 Purchase Recommendation
                  </div>

                  <div
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-body)',
                      lineHeight: 1.45,
                    }}
                  >
                    {req.purchaseRecommendation}
                  </div>
                </div>
              )}

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
