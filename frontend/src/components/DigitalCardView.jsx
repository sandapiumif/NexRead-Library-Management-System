import React from 'react';
import { BookIcon } from './Icons';

export default function DigitalCardView({ activeMember }) {
  if (!activeMember) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Please sign in as a member to view your digital pass.
      </div>
    );
  }

  return (
    <div>
      <div className="saas-page-header">
        <div className="page-title-group">
          <h1>Digital Membership Pass</h1>
          <p className="page-subtitle">
            Your verified institutional digital identity credential for circulation access and library entry.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={() => window.print()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          <span>Print Pass</span>
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '30px 0' }}>
        <div className="digital-id-card">
          {/* Top Header of Card */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookIcon size={18} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em' }}>NexRead</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.8, letterSpacing: '0.08em' }}>ACADEMIC LEARNING COMMONS</div>
              </div>
            </div>

            <span
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: activeMember.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                color: activeMember.status === 'ACTIVE' ? '#6ee7b7' : '#fca5a5',
                fontSize: '0.72rem',
                fontWeight: 700,
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              ● {activeMember.status}
            </span>
          </div>

          {/* Member Name and Identity */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.72rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Member Name
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800 }}>
              {activeMember.fullName}
            </div>
            <div style={{ fontSize: '0.82rem', opacity: 0.85, marginTop: '2px' }}>
              {activeMember.membershipType} Tier • {activeMember.maxBorrowLimit} Books Quota
            </div>
          </div>

          {/* Grid details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
            <div>
              <div style={{ fontSize: '0.68rem', opacity: 0.7 }}>MEMBER ID</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{activeMember.memberCode}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', opacity: 0.7 }}>NIC / ID NO</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{activeMember.idNumber}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', opacity: 0.7 }}>EXPIRES</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{activeMember.expiryDate || '2027-01-10'}</div>
            </div>
          </div>

          {/* Barcode Simulation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ fontFamily: 'monospace', letterSpacing: '3px', fontSize: '0.85rem', opacity: 0.9 }}>
              ||||| | |||| || ||||| |||| |||
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, fontFamily: 'monospace' }}>
              {activeMember.memberCode}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
