import React, { useState } from 'react';

export default function MyLoansView({
  activeMember,
  borrowings,
  onReturnBook,
}) {
  const [returnMsg, setReturnMsg] = useState('');

  const memberBorrowings = borrowings.filter(
    (b) =>
      b.member?.id === activeMember?.id &&
      (b.status === 'BORROWED' || b.status === 'OVERDUE')
  );

  const overdueCount = memberBorrowings.filter(
    (b) => b.status === 'OVERDUE'
  ).length;

  const handleReturn = async (id) => {
    try {
      const res = await onReturnBook(id);

      if (res.overdueFine) {
        setReturnMsg(
          `Book returned. An overdue fee of LKR ${res.overdueFine.amount} has been assessed.`
        );
      } else {
        setReturnMsg('Book successfully returned in good standing!');
      }

      setTimeout(() => setReturnMsg(''), 5000);
    } catch (err) {
      setReturnMsg(err.message || 'Failed to return book.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="saas-page-header">
        <div className="page-title-group">
          <h1>
            My Active Loans{' '}
            <span className="page-title-count">
              ({memberBorrowings.length})
            </span>
          </h1>
          <p className="page-subtitle">
            Track your currently borrowed books, due dates, and returns.
            Completed loans are available under Borrowing History.
          </p>
        </div>
      </div>

      {returnMsg && (
        <div
          style={{
            padding: '13px 18px',
            background:
              returnMsg.includes('fee')
                ? 'rgba(239, 68, 68, 0.08)'
                : 'rgba(16, 185, 129, 0.08)',
            color: returnMsg.includes('fee') ? '#dc2626' : '#059669',
            border: `1px solid ${
              returnMsg.includes('fee')
                ? 'rgba(239, 68, 68, 0.20)'
                : 'rgba(16, 185, 129, 0.20)'
            }`,
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            marginBottom: '20px',
          }}
        >
          {returnMsg}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        <div className="stat-card" style={{ minHeight: '92px' }}>
          <div>
            <div className="stat-val">{memberBorrowings.length}</div>
            <div className="stat-title">Active Loans</div>
          </div>
        </div>

        <div className="stat-card" style={{ minHeight: '92px' }}>
          <div>
            <div
              className="stat-val"
              style={{
                color: overdueCount > 0 ? '#ef4444' : 'var(--text-main)',
              }}
            >
              {overdueCount}
            </div>
            <div className="stat-title">Overdue</div>
          </div>
        </div>
      </div>

      <div className="saas-table-container">
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-heading)',
                fontSize: '1.05rem',
                fontWeight: 750,
              }}
            >
              Current Borrowings
            </h2>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
              }}
            >
              Return books before the due date to avoid overdue fines.
            </p>
          </div>

          <span
            style={{
              padding: '5px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-subtle)',
              color: 'var(--primary)',
              fontSize: '0.74rem',
              fontWeight: 700,
            }}
          >
            {memberBorrowings.length} active
          </span>
        </div>

        <div className="table-responsive">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Loan Reference</th>
                <th>Book</th>
                <th>Borrowed</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {memberBorrowings.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: 'center',
                      padding: '48px 24px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        color: 'var(--text-main)',
                        marginBottom: '5px',
                      }}
                    >
                      No active loans
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>
                      You currently have no books checked out.
                    </div>
                  </td>
                </tr>
              ) : (
                memberBorrowings.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 700 }}>
                      {b.borrowCode}
                    </td>

                    <td>
                      <div
                        style={{
                          fontWeight: 650,
                          color: 'var(--text-main)',
                        }}
                      >
                        {b.book?.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          marginTop: '3px',
                        }}
                      >
                        {b.book?.author}
                      </div>
                    </td>

                    <td>{b.borrowDate}</td>

                    <td
                      style={{
                        fontWeight: 650,
                        color:
                          b.status === 'OVERDUE'
                            ? '#ef4444'
                            : 'var(--text-main)',
                      }}
                    >
                      {b.dueDate}
                    </td>

                    <td>
                      <span
                        className={`status-pill ${
                          b.status === 'OVERDUE'
                            ? 'status-overdue'
                            : 'status-borrowed'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        type="button"
                        onClick={() => handleReturn(b.id)}
                      >
                        Return Now
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
