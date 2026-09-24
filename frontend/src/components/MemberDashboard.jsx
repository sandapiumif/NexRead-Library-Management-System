import React from 'react';
import { BookIcon, ClockIcon, CreditCardIcon, ShieldCheckIcon } from './Icons';

export default function MemberDashboard({
  activeMember,
  borrowings,
  reservations,
  fines,
  books,
  setActiveView,
  onReturnBook,
}) {
  const memberBorrowings = borrowings.filter((b) => b.member?.id === activeMember?.id);
  const activeLoans = memberBorrowings.filter((b) => b.status === 'BORROWED' || b.status === 'OVERDUE');
  const memberReservations = reservations.filter((r) => r.member?.id === activeMember?.id && r.status === 'ACTIVE');
  const memberFines = fines.filter((f) => f.member?.id === activeMember?.id && f.status === 'PENDING');
  const totalFineAmount = memberFines.reduce((acc, f) => acc + (f.amount || 0), 0);

  return (
    <div>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #120e36 0%, #312e81 60%, #4338ca 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          color: 'white',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(255,255,255,0.18)', fontSize: '0.78rem', fontWeight: 600, marginBottom: '12px' }}>
            Member Workspace • {activeMember?.memberCode || 'MEM-1001'}
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', fontWeight: 800, marginBottom: '8px' }}>
            Welcome back, {activeMember?.fullName || 'Library Member'}
          </h1>
          <p style={{ opacity: 0.85, fontSize: '0.92rem', maxWidth: '560px', lineHeight: 1.6 }}>
            You have <strong>{activeLoans.length}</strong> active book loan{activeLoans.length === 1 ? '' : 's'} and <strong>{memberReservations.length}</strong> pending reservation{memberReservations.length === 1 ? '' : 's'}. 
            {totalFineAmount > 0 ? (
              <span style={{ color: '#fca5a5', fontWeight: 700, marginLeft: '6px' }}>
                Outstanding dues: LKR {totalFineAmount.toFixed(2)}.
              </span>
            ) : (
              <span style={{ color: '#86efac', fontWeight: 600, marginLeft: '6px' }}>
                Your account is in good standing!
              </span>
            )}
          </p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
            <button
              className="btn"
              style={{ backgroundColor: '#ffffff', color: '#120e36' }}
              onClick={() => setActiveView('catalog')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>Explore Catalog</span>
            </button>

            <button
              className="btn"
              style={{ backgroundColor: 'rgba(255,255,255,0.18)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.25)' }}
              onClick={() => setActiveView('my-card')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <circle cx="7" cy="12" r="2"></circle>
              </svg>
              <span>View Digital Pass</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="stats-row">
        <div className="stat-card" onClick={() => setActiveView('my-loans')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-box" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
            <BookIcon size={22} color="#6366f1" />
          </div>
          <div>
            <div className="stat-val">{activeLoans.length}</div>
            <div className="stat-title">Books on Loan</div>
          </div>
        </div>

        <div className="stat-card" onClick={() => setActiveView('my-reservations')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-box" style={{ backgroundColor: 'rgba(2, 132, 199, 0.1)', color: '#0284c7' }}>
            <ClockIcon size={22} color="#0284c7" />
          </div>
          <div>
            <div className="stat-val">{memberReservations.length}</div>
            <div className="stat-title">Active Waitlists</div>
          </div>
        </div>

        <div className="stat-card" onClick={() => setActiveView('my-fines')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-box" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <CreditCardIcon size={22} color="#ef4444" />
          </div>
          <div>
            <div className="stat-val">LKR {totalFineAmount.toFixed(0)}</div>
            <div className="stat-title">Fines Due</div>
          </div>
        </div>

        <div className="stat-card" onClick={() => setActiveView('my-card')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-box" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <ShieldCheckIcon size={22} color="#10b981" />
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: '1.25rem' }}>{activeMember?.status || 'ACTIVE'}</div>
            <div className="stat-title">Account Status</div>
          </div>
        </div>
      </div>

      {/* Current Active Loans Table */}
      <div className="saas-table-container">
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Currently Checked Out Books
            </h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Return books before due dates to avoid overdue fee assessments
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveView('my-loans')}>
            View All Loans →
          </button>
        </div>

        {activeLoans.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>You currently do not have any books checked out.</p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: '12px' }} onClick={() => setActiveView('catalog')}>
              Browse Catalog
            </button>
          </div>
        ) : (
          <table className="saas-table">
            <thead>
              <tr>
                <th>Loan Code</th>
                <th>Book Title</th>
                <th>Issued Date</th>
                <th>Return Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {activeLoans.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{b.borrowCode}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{b.book?.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.book?.author}</div>
                  </td>
                  <td>{b.borrowDate}</td>
                  <td style={{ fontWeight: 600, color: b.status === 'OVERDUE' ? '#ef4444' : 'var(--text-main)' }}>
                    {b.dueDate}
                  </td>
                  <td>
                    <span className={`status-pill ${b.status === 'OVERDUE' ? 'status-overdue' : 'status-borrowed'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onReturnBook(b.id)}
                    >
                      Return Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
