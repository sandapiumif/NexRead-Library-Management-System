import React, { useState } from 'react';
import { FileTextIcon, CheckCircleIcon } from './Icons';

export default function ReservationsView({
  members,
  books,
  reservations,
  onReserveBook,
  onCancelReservation,
  onUpdateReservation,
}) {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // filter only out-of-stock books or books with reservations
  const outOfStockBooks = books.filter((b) => b.availableCopies <= 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMemberId || !selectedBookId) {
      setErrorMsg('Please select both a member and an out-of-stock book.');
      return;
    }

const handleUpdateStatus = async (id, status) => {
  try {
    await onUpdateReservation(id, status);
    setSuccessMsg(`Reservation status updated to ${status}.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  } catch (err) {
    setErrorMsg(err.message || 'Failed to update reservation status.');
  }
};

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await onReserveBook(Number(selectedMemberId), Number(selectedBookId));
      setSuccessMsg(`Reservation confirmed! Reservation Code: ${res.reservationCode}, Queue Position: #${res.waitingPosition}.`);
      setSelectedBookId('');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to place reservation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <span>Reservation & Notification Management</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Out-of-Stock Waiting Queue & Reservation Tracking
          </p>
        </div>
      </div>

      {/* Reservation Form */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.25rem' }}>
          Reserve Currently Unavailable Book
        </h3>

        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Select Library Member *</label>
              <select
                id="reserve-member-select"
                className="form-select"
                value={selectedMemberId}
                onChange={(e) => {
                  setSelectedMemberId(e.target.value);
                  setErrorMsg('');
                }}
                required
              >
                <option value="">-- Choose Member --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.memberCode} - {m.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Unavailable Book *</label>
              <select
                id="reserve-book-select"
                className="form-select"
                value={selectedBookId}
                onChange={(e) => {
                  setSelectedBookId(e.target.value);
                  setErrorMsg('');
                }}
                required
              >
                <option value="">-- Select Book (Out of Stock) --</option>
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bookCode} - {b.title} ({b.availableCopies} available)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Members are automatically assigned the next available waiting list position and notified upon book return.
            </div>

            <button
              id="submit-reservation-btn"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Confirming Reservation...' : 'Place Official Reservation'}
            </button>
          </div>
        </form>
      </div>

      {/* Active Reservations Queue Table */}
      <div className="card">
        <div className="section-header">
          <h3 className="section-title">
            <FileTextIcon size={18} color="var(--accent-primary)" />
            <span>Active Reservations & Queue Tracker ({reservations.length})</span>
          </h3>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Reservation Code</th>
                <th>Member Name</th>
                <th>Book Title</th>
                <th>Queue Position</th>
                <th>Status</th>
                <th>Notification</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.reservationCode}</strong></td>
                  <td>{r.member?.fullName}</td>
                  <td>{r.book?.title}</td>
                  <td>
                    <span
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--accent-glow)',
                        color: 'var(--accent-primary)',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                      }}
                    >
                      Position #{r.waitingPosition}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        r.status === 'ACTIVE'
                          ? 'badge-warning'
                          : r.status === 'FULFILLED'
                          ? 'badge-success'
                          : 'badge-danger'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>
                    {r.notificationSent ? (
                      <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircleIcon size={14} color="var(--success)" />
                        <span>SMS / Email Sent</span>
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        Pending Book Return
                      </span>
                    )}
                  </td>
               <td>
                 {r.status === 'ACTIVE' && (
                   <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                     <button
                       className="btn btn-secondary btn-sm"
                       onClick={() => handleUpdateStatus(r.id, 'FULFILLED')}
                     >
                       Fulfill
                     </button>

                     <button
                       id={`cancel-res-btn-${r.id}`}
                       className="btn btn-secondary btn-sm"
                       style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                       onClick={() => onCancelReservation(r.id)}
                     >
                       Cancel
                     </button>
                   </div>
                 )}
               </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );
}