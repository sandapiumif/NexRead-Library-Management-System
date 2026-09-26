import React, { useState } from 'react';

export default function MyLoansView({
  activeMember,
  borrowings,
  onReturnBook,
}) {
  const [returnMsg, setReturnMsg] = useState('');
  const memberBorrowings = borrowings.filter((b) => b.member?.id === activeMember?.id && (b.status === 'BORROWED' || b.status === 'OVERDUE'));

  const handleReturn = async (id) => {
    try {
      const res = await onReturnBook(id);
      if (res.overdueFine) {
        setReturnMsg(`Book returned. An overdue fee of LKR ${res.overdueFine.amount} has been assessed.`);
      } else {
        setReturnMsg('Book successfully returned in good standing!');
      }
      setTimeout(() => setReturnMsg(''), 5000);
    } catch (err) {
      setReturnMsg(err.message || 'Failed to return book.');
    }
  };

  return (
    <div>
      <div className="saas-page-header">
        <div className="page-title-group">
          <h1>
            My Active Loans <span className="page-title-count">({memberBorrowings.length})</span>
          </h1>
          <p className="page-subtitle">
            Track your currently borrowed books, due dates, and process returns. Your completed loans are available under Borrowing History.
          </p>
        </div>
      </div>

      {returnMsg && (
        <div style={{ padding: '12px 18px', backgroundColor: 'rgba(91, 75, 240, 0.1)', color: 'var(--primary)', borderRadius: 'var(--radius-sm)', fontWeight: 600, marginBottom: '20px' }}>
          {returnMsg}
        </div>
      )}

      <div className="saas-table-container">
        <table className="saas-table">
          <thead>
            <tr>
              <th>Loan Reference</th>
              <th>Book Title & Details</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {memberBorrowings.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  No borrowing records found for this account.
                </td>
              </tr>
            ) : (
              memberBorrowings.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{b.borrowCode}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{b.book?.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {b.book?.author} • ISBN: {b.book?.isbn}
                    </div>
                  </td>
                  <td>{b.borrowDate}</td>
                  <td style={{ fontWeight: 600, color: b.status === 'OVERDUE' ? '#ef4444' : 'var(--text-main)' }}>
                    {b.dueDate}
                  </td>
                  <td>{b.returnDate || '—'}</td>
                  <td>
                    <span
                      className={`status-pill ${
                        b.status === 'RETURNED'
                          ? 'status-available'
                          : b.status === 'OVERDUE'
                          ? 'status-overdue'
                          : 'status-borrowed'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status !== 'RETURNED' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleReturn(b.id)}
                      >
                        Return Now
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
