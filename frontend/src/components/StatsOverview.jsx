import React from 'react';
import { BookIcon, BookmarkIcon, ClockIcon, UsersIcon, CreditCardIcon, FileTextIcon } from './Icons';

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
      icon: <BookIcon size={24} color="var(--primary)" />,
      bg: 'rgba(91, 75, 240, 0.1)',
      color: 'var(--primary)',
      view: 'catalog',
    },
    {
      title: 'Active Borrowings',
      value: stats?.activeBorrowings || 0,
      desc: 'Currently issued to patrons',
      icon: <BookmarkIcon size={24} color="#0284c7" />,
      bg: 'rgba(2, 132, 199, 0.1)',
      color: '#0284c7',
      view: 'borrowings',
    },
    {
      title: 'Active Reservations',
      value: stats?.activeReservations || 0,
      desc: 'In waiting queue list',
      icon: <ClockIcon size={24} color="#d97706" />,
      bg: 'rgba(245, 158, 11, 0.1)',
      color: '#d97706',
      view: 'reservations',
    },
    {
      title: 'Registered Members',
      value: stats?.totalMembers || 0,
      desc: 'Enrolled students & faculty',
      icon: <UsersIcon size={24} color="#059669" />,
      bg: 'rgba(16, 185, 129, 0.1)',
      color: '#059669',
      view: 'members',
    },
    {
      title: 'Outstanding Fines',
      value: `LKR ${(stats?.pendingFinesAmount || 0).toFixed(0)}`,
      desc: 'Pending payment collection',
      icon: <CreditCardIcon size={24} color="#ef4444" />,
      bg: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
      view: 'fines',
    },
    {
      title: 'Acquisition Requests',
      value: stats?.pendingRequests || 0,
      desc: 'Awaiting librarian review',
      icon: <FileTextIcon size={24} color="#7c3aed" />,
      bg: 'rgba(124, 58, 237, 0.1)',
      color: '#7c3aed',
      view: 'requests',
    },
  ];

  return (
    <div>
      {/* SaaS Admin Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #120e36 0%, #312e81 60%, #4338ca 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          color: 'white',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(255,255,255,0.18)', fontSize: '0.78rem', fontWeight: 600, marginBottom: '12px' }}>
            <span>●</span> Chief Librarian Administrative Studio
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', fontWeight: 800, marginBottom: '8px' }}>
            Library Operations & Analytics Console
          </h1>
          <p style={{ opacity: 0.85, fontSize: '0.92rem', maxWidth: '620px', lineHeight: 1.6 }}>
            Real-time telemetry and management controls for university catalog inventory, circulation desk loans, queue reservations, and fine revenues.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="btn"
            style={{ backgroundColor: '#ffffff', color: '#120e36' }}
            onClick={onOpenAddBookModal}
          >
            Add New Book
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveView(card.view)}
          >
            <div className="stat-icon-box" style={{ backgroundColor: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div>
              <div className="stat-val">{card.value}</div>
              <div className="stat-title">{card.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '2px' }}>
                {card.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Launch Operations */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
          Quick Operations & Shortcuts
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface-subtle)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onClick={() => setActiveView('reservations')}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
          >
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
              Queue Tracker
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Review live waitlist positions for titles currently with zero shelf stock.
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface-subtle)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onClick={() => setActiveView('fines')}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
          >
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
              Fine Collection Desk
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Collect overdue fines, print receipts, and auto-lift member suspensions.
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface-subtle)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onClick={() => setActiveView('requests')}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
          >
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
              Review Acquisitions
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Approve or reject member book suggestions with duplicate verification.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
