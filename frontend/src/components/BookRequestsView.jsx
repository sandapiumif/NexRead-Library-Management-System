import React, { useState } from 'react';

export default function BookRequestsView({
  members,
  books,
  requests,
  onSubmitRequest,
  onUpdateRequestStatus,
  onDeleteBookRequest,
  userRole,
}) {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    reason: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // real-time check if book already exists in catalog
  const existingBookMatch = formData.title.trim()
    ? books.find((b) => b.title.toLowerCase().includes(formData.title.trim().toLowerCase()))
    : null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMemberId || !formData.title.trim() || !formData.author.trim() || !formData.reason.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (existingBookMatch) {
      setErrorMsg(`Request rejected: "${existingBookMatch.title}" already exists in our library collection!`);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await onSubmitRequest(Number(selectedMemberId), formData);
      setSuccessMsg(`Acquisition request submitted successfully! Request ID: ${res.requestCode}.`);
      setFormData({ title: '', author: '', isbn: '', publisher: '', reason: '' });
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit book request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <span>Book Request Management</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Member Acquisition Requests, Collection Duplicate Check & Librarian Review
          </p>
        </div>
      </div>

      {/* Book Request Form */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.25rem' }}>
          Submit New Book Acquisition Request
        </h3>

        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        {/* Existing Book Warning Alert */}
        {existingBookMatch && (
          <div className="alert alert-danger" style={{ borderLeft: '5px solid var(--danger)' }}>
            <strong>Duplicate Warning:</strong> A book matching this title is already cataloged in the library collection!
            (Title: <em>{existingBookMatch.title}</em>, Code: <code>{existingBookMatch.bookCode}</code>).
            Requests for existing titles cannot be submitted.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Requesting Member *</label>
              <select
                id="req-member-select"
                className="form-select"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                required
              >
                <option value="">-- Choose Member --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.memberCode} - {m.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Book Title *</label>
              <input
                id="req-title"
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Designing Data-Intensive Applications"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Author Name *</label>
              <input
                id="req-author"
                type="text"
                name="author"
                className="form-input"
                placeholder="e.g. Martin Kleppmann"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">ISBN (if known)</label>
              <input
                id="req-isbn"
                type="text"
                name="isbn"
                className="form-input"
                placeholder="e.g. 978-1449373320"
                value={formData.isbn}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Publisher</label>
              <input
                id="req-publisher"
                type="text"
                name="publisher"
                className="form-input"
                placeholder="e.g. O'Reilly Media"
                value={formData.publisher}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reason / Academic Purpose *</label>
            <textarea
              id="req-reason"
              name="reason"
              className="form-textarea"
              rows={3}
              placeholder="Explain why this book should be added to the university library collection..."
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              id="submit-request-btn"
              type="submit"
              className="btn btn-primary"
              disabled={loading || !!existingBookMatch}
            >
              {loading ? 'Validating & Submitting...' : 'Submit Acquisition Request'}
            </button>
          </div>
        </form>
      </div>

      {/* Requests Table */}
      <div className="card">
        <div className="section-header">
          <h3 className="section-title">
            <span>Submitted Acquisition Requests ({requests.length})</span>
          </h3>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Member</th>
                <th>Requested Book</th>
                <th>Author</th>
                <th>Reason</th>
                <th>Status</th>
                {userRole === 'LIBRARIAN' && <th>Librarian Actions</th>}
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.requestCode}</strong></td>
                  <td>{r.member?.fullName}</td>
                  <td><strong>{r.title}</strong></td>
                  <td>{r.author}</td>
                 <td
                   style={{
                     width: '300px',
                     maxWidth: '300px',
                     minWidth: '300px',
                     fontSize: '0.8rem',
                     color: 'var(--text-secondary)',
                     whiteSpace: 'normal',
                     wordBreak: 'break-word',
                     overflowWrap: 'anywhere',
                     verticalAlign: 'middle',
                   }}
                 >
                   {r.reason || '—'}
                 </td>

                 <td
                   style={{
                     width: '130px',
                     minWidth: '130px',
                     maxWidth: '130px',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     whiteSpace: 'nowrap',
                   }}
                 >
                   <span
                     className={`badge ${
                       r.status === 'APPROVED'
                         ? 'badge-success'
                         : r.status === 'REJECTED'
                         ? 'badge-danger'
                         : 'badge-warning'
                     }`}
                     style={{
                       display: 'inline-flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       whiteSpace: 'nowrap',
                     }}
                   >
                     {r.status}
                   </span>
                 </td>
                  {userRole === 'LIBRARIAN' && (
                    <td>
                      {r.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          <button
                            id={`approve-req-btn-${r.id}`}
                            className="btn btn-success btn-sm"
                            onClick={() =>
                              onUpdateRequestStatus(
                                r.id,
                                'APPROVED',
                                'Approved for acquisition'
                              )
                            }
                          >
                            Approve
                          </button>

                          <button
                            id={`reject-req-btn-${r.id}`}
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              onUpdateRequestStatus(
                                r.id,
                                'REJECTED',
                                'Out of scope'
                              )
                            }
                          >
                            Reject
                          </button>

                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                            onClick={() => {
                              if (window.confirm('Cancel this pending book request?')) {
                                onDeleteBookRequest(r.id);
                              }
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {r.adminNotes || 'Processed'}
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
