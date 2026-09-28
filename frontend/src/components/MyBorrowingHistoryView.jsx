import React, { useMemo, useState } from 'react';

export default function MyBorrowingHistoryView({
  activeMember,
  borrowings,
}) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const ownBorrowings = useMemo(
    () =>
      borrowings.filter(
        (b) => b.member?.id === activeMember?.id
      ),
    [borrowings, activeMember]
  );

  const memberBorrowings = useMemo(() => {
    return ownBorrowings.filter((b) => {
      const matchesStatus =
        statusFilter === 'ALL' ||
        b.status === statusFilter;

      const q = search.trim().toLowerCase();

      const matchesSearch =
        !q ||
        b.borrowCode?.toLowerCase().includes(q) ||
        b.book?.title?.toLowerCase().includes(q) ||
        b.book?.author?.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [ownBorrowings, statusFilter, search]);

  const returnedCount = ownBorrowings.filter(
    (b) => b.status === 'RETURNED'
  ).length;

  const overdueCount = ownBorrowings.filter(
    (b) => b.status === 'OVERDUE'
  ).length;

  return (
    <div className="animate-fade-in">
      <div className="saas-page-header">
        <div className="page-title-group">
          <h1>
            Borrowing History{' '}
            <span className="page-title-count">
              ({memberBorrowings.length})
            </span>
          </h1>
          <p className="page-subtitle">
            View your complete borrowing and return history,
            including due dates and loan status.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        <div className="stat-card" style={{ minHeight: '92px' }}>
          <div>
            <div className="stat-val">{ownBorrowings.length}</div>
            <div className="stat-title">Total Loans</div>
          </div>
        </div>

        <div className="stat-card" style={{ minHeight: '92px' }}>
          <div>
            <div className="stat-val">{returnedCount}</div>
            <div className="stat-title">Returned</div>
          </div>
        </div>

        <div className="stat-card" style={{ minHeight: '92px' }}>
          <div>
            <div
              className="stat-val"
              style={{
                color:
                  overdueCount > 0
                    ? '#ef4444'
                    : 'var(--text-main)',
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
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          <input
            className="form-input"
            style={{ flex: '1 1 280px', minWidth: 0 }}
            placeholder="Search loan code, title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="form-select"
            style={{ width: '180px' }}
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="ALL">All statuses</option>
            <option value="BORROWED">Borrowed</option>
            <option value="OVERDUE">Overdue</option>
            <option value="RETURNED">Returned</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Loan Code</th>
                <th>Book</th>
                <th>Borrowed</th>
                <th>Due</th>
                <th>Returned</th>
                <th>Status</th>
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
                      No borrowing history found
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>
                      Try changing your search or status filter.
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
                        {b.book?.author} • {b.book?.isbn}
                      </div>
                    </td>

                    <td>{b.borrowDate || '—'}</td>
                    <td>{b.dueDate || '—'}</td>
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
