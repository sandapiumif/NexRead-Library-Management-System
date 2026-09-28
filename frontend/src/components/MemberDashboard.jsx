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

  const accountStatus = activeMember?.status || 'ACTIVE';
  const isGoodStanding = totalFineAmount <= 0 && accountStatus === 'ACTIVE';

  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const statCards = [
    {
      title: 'Books on Loan',
      value: activeLoans.length,
      description: 'Currently borrowed',
      icon: <BookIcon size={22} color="#6366f1" />,
      background: 'rgba(99, 102, 241, 0.10)',
      color: '#6366f1',
      view: 'my-loans',
    },
    {
      title: 'Active Waitlists',
      value: memberReservations.length,
      description: 'Books you are waiting for',
      icon: <ClockIcon size={22} color="#0284c7" />,
      background: 'rgba(2, 132, 199, 0.10)',
      color: '#0284c7',
      view: 'my-reservations',
    },
    {
      title: 'Fines Due',
      value: `LKR ${totalFineAmount.toFixed(0)}`,
      description: totalFineAmount > 0 ? 'Payment required' : 'No outstanding fines',
      icon: <CreditCardIcon size={22} color="#ef4444" />,
      background: 'rgba(239, 68, 68, 0.10)',
      color: '#ef4444',
      view: 'my-fines',
    },
    {
      title: 'Account Status',
      value: accountStatus,
      description: isGoodStanding ? 'Account is in good standing' : 'View your membership details',
      icon: <ShieldCheckIcon size={22} color="#10b981" />,
      background: 'rgba(16, 185, 129, 0.10)',
      color: '#10b981',
      view: 'my-card',
    },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '100%' }}>
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #120e36 0%, #312e81 58%, #4338ca 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '30px 32px',
          color: '#ffffff',
          marginBottom: '24px',
          boxShadow: '0 10px 30px rgba(18, 14, 54, 0.16)',
        }}
      >
        <div aria-hidden="true" style={{
          position: 'absolute', width: '230px', height: '230px', borderRadius: '50%',
          right: '-85px', top: '-105px', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '760px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 12px', borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(255,255,255,0.14)',
            border: '1px solid rgba(255,255,255,0.12)',
            fontSize: '0.75rem', fontWeight: 650, marginBottom: '13px'
          }}>
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: isGoodStanding ? '#86efac' : '#fca5a5', display: 'inline-block'
            }} />
            Member Workspace • {activeMember?.memberCode || 'MEM-1001'}
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.55rem, 2.4vw, 2rem)',
            lineHeight: 1.15, fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 9px'
          }}>
            Welcome back, {activeMember?.fullName || 'Library Member'}
          </h1>

          <p style={{ opacity: 0.84, fontSize: '0.9rem', maxWidth: '650px', lineHeight: 1.65, margin: 0 }}>
            You currently have <strong>{activeLoans.length}</strong> active book{activeLoans.length === 1 ? '' : 's'} and <strong>{memberReservations.length}</strong> active waitlist{memberReservations.length === 1 ? '' : 's'}.
            {totalFineAmount > 0 ? (
              <span style={{ color: '#fca5a5', fontWeight: 700, marginLeft: '6px' }}>
                Outstanding dues: LKR {totalFineAmount.toFixed(2)}.
              </span>
            ) : (
              <span style={{ color: '#86efac', fontWeight: 650, marginLeft: '6px' }}>
                No outstanding fines.
              </span>
            )}
          </p>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
            <button
              className="btn"
              type="button"
              onClick={() => setActiveView('catalog')}
              style={{
                backgroundColor: '#ffffff', color: '#120e36',
                minHeight: '42px', padding: '0 17px', fontWeight: 700,
                border: '1px solid rgba(255,255,255,0.75)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Explore Catalog</span>
            </button>

            <button
              className="btn"
              type="button"
              onClick={() => setActiveView('my-card')}
              style={{
                backgroundColor: 'rgba(255,255,255,0.14)', color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.24)',
                minHeight: '42px', padding: '0 17px', fontWeight: 650
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <circle cx="7" cy="12" r="2" />
              </svg>
              <span>View Digital Pass</span>
            </button>
          </div>
        </div>
      </section>

      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: '16px', marginBottom: '12px', flexWrap: 'wrap'
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-heading)', fontSize: '1.12rem',
            fontWeight: 750, color: 'var(--text-main)', letterSpacing: '-0.01em'
          }}>
            Your Library Snapshot
          </div>
          <div style={{ marginTop: '3px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            A quick overview of your current library activity.
          </div>
        </div>

        <button className="btn btn-secondary btn-sm" type="button" onClick={() => setActiveView('my-card')}>
          View Membership
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {statCards.map((card) => (
          <div
            key={card.title}
            className="stat-card"
            role="button"
            tabIndex={0}
            onClick={() => setActiveView(card.view)}
            onKeyDown={(event) => handleKeyDown(event, () => setActiveView(card.view))}
            style={{
              cursor: 'pointer', minHeight: '116px', padding: '19px',
              display: 'flex', alignItems: 'center', gap: '14px',
              border: '1px solid var(--border-color)',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease'
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.transform = 'translateY(-2px)';
              event.currentTarget.style.boxShadow = 'var(--shadow-hover)';
              event.currentTarget.style.borderColor = 'var(--border-focus)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform = 'translateY(0)';
              event.currentTarget.style.boxShadow = 'var(--shadow-card)';
              event.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <div className="stat-icon-box" style={{
              backgroundColor: card.background, color: card.color,
              width: '48px', height: '48px', minWidth: '48px',
              borderRadius: '13px', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>
              {card.icon}
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="stat-val" style={{
                fontSize: card.title === 'Account Status' ? '1.22rem' : '1.42rem',
                lineHeight: 1.1, marginBottom: '4px',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }}>
                {card.value}
              </div>
              <div className="stat-title" style={{ fontSize: '0.86rem', fontWeight: 650, marginBottom: '2px' }}>
                {card.title}
              </div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-light)', lineHeight: 1.4 }}>
                {card.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="saas-table-container">
        <div style={{
          padding: '20px 22px', borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '16px', flexWrap: 'wrap'
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: '1.08rem',
              fontWeight: 750, color: 'var(--text-main)', margin: 0
            }}>
              Currently Checked Out Books
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Keep track of due dates and return books on time.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" type="button" onClick={() => setActiveView('my-loans')}>
              Active Loans →
            </button>
            <button className="btn btn-secondary btn-sm" type="button" onClick={() => setActiveView('borrowing-history')}>
              History →
            </button>
          </div>
        </div>

        {activeLoans.length === 0 ? (
          <div style={{ padding: '46px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: 'rgba(99, 102, 241, 0.08)', color: '#6366f1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px'
            }}>
              <BookIcon size={24} color="#6366f1" />
            </div>

            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '5px' }}>
              No active loans
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem' }}>
              You currently do not have any books checked out.
            </p>
            <button className="btn btn-primary btn-sm" type="button" style={{ marginTop: '15px' }} onClick={() => setActiveView('catalog')}>
              Browse Catalog
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%' }}>
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
                    <td style={{ fontWeight: 650 }}>{b.borrowCode}</td>
                    <td>
                      <div style={{ fontWeight: 650, color: 'var(--text-main)' }}>{b.book?.title}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '3px' }}>{b.book?.author}</div>
                    </td>
                    <td>{b.borrowDate}</td>
                    <td style={{
                      fontWeight: 650,
                      color: b.status === 'OVERDUE' ? '#ef4444' : 'var(--text-main)'
                    }}>
                      {b.dueDate}
                    </td>
                    <td>
                      <span className={`status-pill ${b.status === 'OVERDUE' ? 'status-overdue' : 'status-borrowed'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-sm" type="button" onClick={() => onReturnBook(b.id)}>
                        Return Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
