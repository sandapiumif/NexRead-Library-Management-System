import React, { useState } from 'react';
import { FileTextIcon } from './Icons';

export default function BorrowingDesk({
  members,
  books,
  borrowings,
  onIssueBook,
  onReturnBook,
  onUpdateBorrowing,
  onDeleteBorrowing,
  userRole,
}) {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const selectedMember = members.find((m) => m.id === Number(selectedMemberId));
  const selectedBook = books.find((b) => b.id === Number(selectedBookId));

  // calculate active loans for selected member
  const memberActiveLoans = selectedMember
    ? borrowings.filter((b) => b.member?.id === selectedMember.id && b.status !== 'RETURNED').length
    : 0;

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMemberId || !selectedBookId) {
      setErrorMsg('Please select both a library member and a book.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await onIssueBook(Number(selectedMemberId), Number(selectedBookId));
      setSuccessMsg(`Book successfully issued to ${selectedMember.fullName}! Due date set for 14 days.`);
      setSelectedBookId('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to issue book.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <span>Borrowing Lifecycle Management</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Eligibility Validation, Loan Checkout & Book Return Processing
          </p>
        </div>
      </div>

      {/* Checkout Desk Form */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.25rem' }}>
          Issue Book Transaction Desk
        </h3>

        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <form onSubmit={handleIssueSubmit}>
          <div className="form-row">
            {/* Member Selection */}
            <div className="form-group">
              <label className="form-label">1. Select Registered Member *</label>
              <select
                id="issue-member-select"
                className="form-select"
                value={selectedMemberId}
                onChange={(e) => {
                  setSelectedMemberId(e.target.value);
                  setErrorMsg('');
                }}
                required
              >
                <option value="">-- Choose Member --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.memberCode} - {m.fullName} ({m.status})
                  </option>
                ))}
              </select>

              {/* Eligibility Check Live Card */}
              {selectedMember && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    borderLeft: `4px solid ${
                      selectedMember.status === 'ACTIVE' && memberActiveLoans < selectedMember.maxBorrowLimit
                        ? 'var(--success)'
                        : 'var(--danger)'
                    }`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span>Account Status:</span>
                    <strong style={{ color: selectedMember.status === 'ACTIVE' ? 'var(--success)' : 'var(--danger)' }}>
                      {selectedMember.status}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Active Loans:</span>
                    <span>
                      <strong>{memberActiveLoans}</strong> / {selectedMember.maxBorrowLimit} allowed
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Book Selection */}
            <div className="form-group">
              <label className="form-label">2. Select Book to Issue *</label>
              <select
                id="issue-book-select"
                className="form-select"
                value={selectedBookId}
                onChange={(e) => {
                  setSelectedBookId(e.target.value);
                  setErrorMsg('');
                }}
                required
              >
                <option value="">-- Choose Book from Shelf --</option>
                {books.map((b) => (
                  <option key={b.id} value={b.id} disabled={b.availableCopies <= 0}>
                    {b.bookCode} - {b.title} ({b.availableCopies > 0 ? `${b.availableCopies} available` : 'Out of Stock'})
                  </option>
                ))}
              </select>

              {selectedBook && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <img
                    src={selectedBook.coverImage}
                    alt=""
                    style={{ width: '36px', height: '48px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{selectedBook.title}</div>
                    <div style={{ color: 'var(--text-muted)' }}>ISBN: {selectedBook.isbn}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Standard loan period: <strong>14 days</strong> • Overdue rate: <strong>10.00 LKR/day</strong>
            </div>

            <button
              id="confirm-issue-btn"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Processing Transaction...' : 'Confirm Loan & Issue Book'}
            </button>
          </div>
        </form>
      </div>

      {/* Borrowing Transactions Table */}
      <div className="card">
        <div className="section-header">
          <h3 className="section-title">
            <FileTextIcon size={18} color="var(--accent-primary)" />
            <span>Borrowing Transaction Log ({borrowings.length})</span>
          </h3>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Loan Code</th>
                <th>Member</th>
                <th>Book Title</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {borrowings.map((b) => {
                const isOverdue = b.status === 'OVERDUE';
                const isReturned = b.status === 'RETURNED';

                return (
                  <tr key={b.id}>
                    <td><strong>{b.borrowCode}</strong></td>
                    <td>
                      <div>{b.member?.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.member?.memberCode}</div>
                    </td>
                    <td>{b.book?.title}</td>
                    <td>{b.borrowDate}</td>
                    <td>
                      <strong style={{ color: isOverdue ? 'var(--danger)' : 'inherit' }}>
                        {b.dueDate}
                      </strong>
                    </td>
                    <td>{b.returnDate || '—'}</td>
                    <td>
                      <span
                        className={`badge ${
                          isReturned
                            ? 'badge-success'
                            : isOverdue
                            ? 'badge-danger'
                            : 'badge-info'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {!isReturned && (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>

                          {/* Update Due Date */}
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={async () => {
                              const newDueDate = window.prompt(
                                'Enter new due date (YYYY-MM-DD):',
                                b.dueDate
                              );

                              if (!newDueDate || newDueDate === b.dueDate) return;

                              try {
                                await onUpdateBorrowing(b.id, {
                                  dueDate: newDueDate,
                                  notes: b.notes || ''
                                });
                              } catch (err) {
                                window.alert(err.message || 'Failed to update borrowing.');
                              }
                            }}
                          >
                            Edit Due Date
                          </button>

                          {/* Cancel Borrowing */}
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={async () => {
                              const confirmed = window.confirm(
                                `Cancel borrowing ${b.borrowCode}?`
                              );

                              if (!confirmed) return;

                              try {
                                await onDeleteBorrowing(b.id);
                              } catch (err) {
                                window.alert(err.message || 'Failed to cancel borrowing.');
                              }
                            }}
                          >
                            Cancel
                          </button>

                          {/* Return Book */}
                          <button
                            id={`return-btn-${b.id}`}
                            className="btn btn-secondary btn-sm"
                            style={{
                              borderColor: 'var(--accent-primary)',
                              color: 'var(--accent-primary)'
                            }}
                            onClick={() => onReturnBook(b.id)}
                          >
                            Process Return
                          </button>

                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
