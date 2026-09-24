import React, { useState } from 'react';
import { CheckCircleIcon } from './Icons';

export default function MyReservationsView({
  activeMember,
  reservations,
  onCancelReservation,
}) {
  const [cancelMsg, setCancelMsg] = useState('');
  const memberReservations = reservations.filter((r) => r.member?.id === activeMember?.id);

  const handleCancel = async (id) => {
    try {
      await onCancelReservation(id);
      setCancelMsg('Reservation successfully cancelled.');
      setTimeout(() => setCancelMsg(''), 4000);
    } catch (err) {
      setCancelMsg(err.message || 'Failed to cancel reservation.');
    }
  };

  return (
    <div>
      <div className="saas-page-header">
        <div className="page-title-group">
          <h1>
            My Waitlists & Reservations <span className="page-title-count">({memberReservations.length})</span>
          </h1>
          <p className="page-subtitle">
            Track real-time queue position for reserved out-of-stock titles and manage active bookings.
          </p>
        </div>
      </div>

      {cancelMsg && (
        <div style={{ padding: '12px 18px', backgroundColor: 'rgba(91, 75, 240, 0.1)', color: 'var(--primary)', borderRadius: 'var(--radius-sm)', fontWeight: 600, marginBottom: '20px' }}>
          {cancelMsg}
        </div>
      )}

      <div className="saas-table-container">
        <table className="saas-table">
          <thead>
            <tr>
              <th>Reservation Code</th>
              <th>Book Title & Category</th>
              <th>Reserved Date</th>
              <th>Queue Position</th>
              <th>Notification Status</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {memberReservations.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  You do not have any active book reservations.
                </td>
              </tr>
            ) : (
              memberReservations.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.reservationCode}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{r.book?.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.book?.category}</div>
                  </td>
                  <td>{r.reservationDate?.replace('T', ' ').slice(0, 16)}</td>
                  <td>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--primary-subtle)',
                        color: 'var(--primary)',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                      }}
                    >
                      Position #{r.waitingPosition}
                    </span>
                  </td>
                  <td>
                    {r.notificationSent ? (
                      <span style={{ color: '#059669', fontSize: '0.82rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircleIcon size={14} color="#059669" />
                        <span>Notification Sent</span>
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        In Waiting Queue
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
                        style={{ color: '#ef4444' }}
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
  );
}
