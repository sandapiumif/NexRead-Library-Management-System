import React from 'react';
import {
  BookIcon,
  BookmarkIcon,
  ClockIcon,
  UsersIcon,
  CreditCardIcon,
  FileTextIcon,
} from './Icons';

export default function StatsOverview({
  stats,
  setActiveView,
  onOpenAddBookModal,
}) {
  const statCards = [
    {
      title: 'Total Catalog Volume',
      value: stats?.totalBooks || 0,
      desc: `${stats?.availableBooks || 0} currently available`,
      icon: <BookIcon size={23} color="var(--primary)" />,
      bg: 'rgba(91, 75, 240, 0.10)',
      color: 'var(--primary)',
      view: 'catalog',
    },
    {
      title: 'Active Borrowings',
      value: stats?.activeBorrowings || 0,
      desc: 'Currently issued to patrons',
      icon: <BookmarkIcon size={23} color="#0284c7" />,
      bg: 'rgba(2, 132, 199, 0.10)',
      color: '#0284c7',
      view: 'borrowings',
    },
    {
      title: 'Active Reservations',
      value: stats?.activeReservations || 0,
      desc: 'In waiting queue list',
      icon: <ClockIcon size={23} color="#d97706" />,
      bg: 'rgba(245, 158, 11, 0.10)',
      color: '#d97706',
      view: 'reservations',
    },
    {
      title: 'Registered Members',
      value: stats?.totalMembers || 0,
      desc: 'Enrolled students & faculty',
      icon: <UsersIcon size={23} color="#059669" />,
      bg: 'rgba(16, 185, 129, 0.10)',
      color: '#059669',
      view: 'members',
    },
    {
      title: 'Outstanding Fines',
      value: `LKR ${(stats?.pendingFinesAmount || 0).toFixed(0)}`,
      desc: 'Pending payment collection',
      icon: <CreditCardIcon size={23} color="#ef4444" />,
      bg: 'rgba(239, 68, 68, 0.10)',
      color: '#ef4444',
      view: 'fines',
    },
    {
      title: 'Acquisition Requests',
      value: stats?.pendingRequests || 0,
      desc: 'Awaiting librarian review',
      icon: <FileTextIcon size={23} color="#7c3aed" />,
      bg: 'rgba(124, 58, 237, 0.10)',
      color: '#7c3aed',
      view: 'requests',
    },
  ];

  const quickOperations = [
    {
      title: 'Queue Tracker',
      description:
        'Review live waitlist positions for titles currently with zero shelf stock.',
      view: 'reservations',
      action: 'Open reservations',
    },
    {
      title: 'Fine Collection Desk',
      description:
        'Collect overdue fines, print receipts, and auto-lift member suspensions.',
      view: 'fines',
      action: 'Open finance',
    },
    {
      title: 'Review Acquisitions',
      description:
        'Approve or reject member book suggestions with duplicate verification.',
      view: 'requests',
      action: 'Review requests',
    },
  ];

  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
      }}
    >
      {/* Admin Hero */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          background:
            'linear-gradient(135deg, #120e36 0%, #312e81 58%, #4338ca 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '30px 32px',
          color: '#ffffff',
          marginBottom: '24px',
          boxShadow: '0 10px 30px rgba(18, 14, 54, 0.16)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            right: '-70px',
            top: '-95px',
            background: 'rgba(255,255,255,0.07)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            minWidth: 0,
            flex: '1 1 520px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(255,255,255,0.14)',
              border: '1px solid rgba(255,255,255,0.12)',
              fontSize: '0.75rem',
              fontWeight: 650,
              marginBottom: '13px',
              letterSpacing: '0.01em',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#c4b5fd',
                display: 'inline-block',
                boxShadow: '0 0 0 4px rgba(196,181,253,0.10)',
              }}
            />
            Chief Librarian Administrative Studio
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.55rem, 2.4vw, 2rem)',
              lineHeight: 1.15,
              fontWeight: 800,
              letterSpacing: '-0.025em',
              marginBottom: '9px',
            }}
          >
            Library Operations & Analytics Console
          </h1>

          <p
            style={{
              opacity: 0.82,
              fontSize: '0.9rem',
              maxWidth: '650px',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Real-time telemetry and management controls for university catalog
            inventory, circulation desk loans, queue reservations, and fine
            revenues.
          </p>
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            flex: '0 0 auto',
          }}
        >
          <button
            className="btn"
            type="button"
            onClick={onOpenAddBookModal}
            style={{
              backgroundColor: '#ffffff',
              color: '#120e36',
              minHeight: '44px',
              padding: '0 18px',
              fontWeight: 700,
              border: '1px solid rgba(255,255,255,0.75)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
            }}
          >
            + Add New Book
          </button>
        </div>
      </section>

      {/* KPI Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.12rem',
              fontWeight: 750,
              color: 'var(--text-main)',
              letterSpacing: '-0.01em',
            }}
          >
            Operational Snapshot
          </div>
          <div
            style={{
              marginTop: '3px',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            A quick view of the library's current activity.
          </div>
        </div>

        <div
          style={{
            fontSize: '0.74rem',
            color: 'var(--text-light)',
            whiteSpace: 'nowrap',
          }}
        >
          {statCards.length} key indicators
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(245px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {statCards.map((card) => (
          <div
            key={card.title}
            className="stat-card"
            role="button"
            tabIndex={0}
            onClick={() => setActiveView(card.view)}
            onKeyDown={(event) =>
              handleKeyDown(event, () => setActiveView(card.view))
            }
            style={{
              cursor: 'pointer',
              minHeight: '118px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '20px',
              transition:
                'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
              border: '1px solid var(--border-color)',
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
            <div
              className="stat-icon-box"
              style={{
                backgroundColor: card.bg,
                color: card.color,
                width: '48px',
                height: '48px',
                minWidth: '48px',
                borderRadius: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {card.icon}
            </div>

            <div
              style={{
                minWidth: 0,
                flex: 1,
              }}
            >
              <div
                className="stat-val"
                style={{
                  fontSize: '1.45rem',
                  lineHeight: 1.1,
                  marginBottom: '4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {card.value}
              </div>

              <div
                className="stat-title"
                style={{
                  fontSize: '0.86rem',
                  fontWeight: 650,
                  marginBottom: '2px',
                }}
              >
                {card.title}
              </div>

              <div
                style={{
                  fontSize: '0.73rem',
                  color: 'var(--text-light)',
                  lineHeight: 1.4,
                }}
              >
                {card.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Operations */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '22px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.08rem',
                fontWeight: 750,
                color: 'var(--text-main)',
                margin: 0,
              }}
            >
              Quick Operations & Shortcuts
            </h2>
            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                margin: '4px 0 0',
              }}
            >
              Jump directly to the most common administrative tasks.
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '12px',
          }}
        >
          {quickOperations.map((operation) => (
            <div
              key={operation.title}
              role="button"
              tabIndex={0}
              onClick={() => setActiveView(operation.view)}
              onKeyDown={(event) =>
                handleKeyDown(event, () => setActiveView(operation.view))
              }
              style={{
                padding: '17px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface-subtle)',
                cursor: 'pointer',
                transition:
                  'transform 0.18s ease, border-color 0.18s ease, background-color 0.18s ease',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.transform = 'translateY(-2px)';
                event.currentTarget.style.borderColor = 'var(--primary)';
                event.currentTarget.style.backgroundColor =
                  'var(--bg-card-hover)';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform = 'translateY(0)';
                event.currentTarget.style.borderColor =
                  'var(--border-subtle)';
                event.currentTarget.style.backgroundColor =
                  'var(--bg-surface-subtle)';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  marginBottom: '7px',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                  }}
                >
                  {operation.title}
                </div>

                <span
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--primary)',
                    fontWeight: 700,
                  }}
                >
                  →
                </span>
              </div>

              <div
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.55,
                }}
              >
                {operation.description}
              </div>

              <div
                style={{
                  marginTop: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 650,
                  color: 'var(--primary)',
                }}
              >
                {operation.action}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
