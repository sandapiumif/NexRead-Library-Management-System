import React, { useState } from 'react';
import { CheckCircleIcon } from './Icons';

export default function MyReservationsView({
  activeMember,
  reservations,
  onCancelReservation,
}) {
  const [cancelMsg, setCancelMsg] = useState('');

  const memberReservations = reservations.filter(
    (r) => r.member?.id === activeMember?.id
  );

  const activeCount = memberReservations.filter(
    (r) => r.status === 'ACTIVE'
  ).length;

  const notifiedCount = memberReservations.filter(
    (r) => r.notificationSent
  ).length;

  const handleCancel = async (id) => {
    try {
      await onCancelReservation(id);
      setCancelMsg('Reservation successfully cancelled.');
      setTimeout(() => setCancelMsg(''), 4000);
    } catch (err) {
      setCancelMsg(
        err.message || 'Failed to cancel reservation.'
      );
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="saas-page-header">
        <div className="page-title-group">
          <h1>
            My Waitlists & Reservations{' '}
            <span className="page-title-count">
              ({memberReservations.length})
            </span>
          </h1>
          <p className="page-subtitle">
            Track queue positions for reserved titles and manage
            your active reservations.
          </p>
        </div>
      </div>

      {cancelMsg && (
        <div
          style={{
            padding: '13px 18px',
            backgroundColor: 'rgba(91, 75, 240, 0.08)',
            color: 'var(--primary)',
            border: '1px solid rgba(91, 75, 240, 0.16)',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            marginBottom: '20px',
          }}
        >
          {cancelMsg}
        </div>
      )}

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
            <div className="stat-val">{activeCount}</div>
            <div className="stat-title">Active Reservations</div>
          </div>
        </div>

        <div className="stat-card" style={{ minHeight: '92px' }}>
          <div>
            <div className="stat-val">{notifiedCount}</div>
            <div className="stat-title">Notifications Sent</div>
          </div>
        </div>
      </div>

      <div className="saas-table-container">
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
              Reservation Queue
            </h2>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
              }}
            >
              Your position updates automatically as books become
              available.
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
            {activeCount} active
          </span>
        </div>

        <div className="table-responsive">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Reservation</th>
                <th>Book</th>
                <th>Reserved</th>
                <th>Queue Position</th>
                <th>Notification</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {memberReservations.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
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
                      No reservations yet
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>
                      Reserved books will appear here with their
                      queue positions.
                    </div>
                  </td>
                </tr>
              ) : (
                memberReservations.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 700 }}>
                      {r.reservationCode}
                    </td>

                    <td>
                      <div
                        style={{
                          fontWeight: 650,
                          color: 'var(--text-main)',
                        }}
                      >
                        {r.book?.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          marginTop: '3px',
                        }}
                      >
                        {r.book?.category}
                      </div>
                    </td>

                    <td>
                      {r.reservationDate
                        ?.replace('T', ' ')
                        .slice(0, 16)}
                    </td>

                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          padding: '5px 10px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--primary-subtle)',
                          color: 'var(--primary)',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        #{r.waitingPosition}
                      </span>
                    </td>

                    <td>
                      {r.notificationSent ? (
                        <span
                          style={{
                            color: '#059669',
                            fontSize: '0.78rem',
                            fontWeight: 650,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <CheckCircleIcon
                            size={14}
                            color="#059669"
                          />
                          Sent
                        </span>
                      ) : (
                        <span
                          style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.78rem',
                          }}
                        >
                          Waiting
                        </span>
                      )}
                    </td>

                    <td>
                      <span
                        className={`status-pill ${
                          r.status === 'ACTIVE'
                            ? 'status-reserved'
                            : r.status === 'FULFILLED'
                            ? 'status-available'
                            : 'status-overdue'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td>
                      {r.status === 'ACTIVE' && (
                        <button
                          className="btn btn-secondary btn-sm"
                          type="button"
                          style={{
                            color: '#ef4444',
                          }}
                          onClick={() => handleCancel(r.id)}
                        >
                          Cancel
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
    </div>
  );
}
