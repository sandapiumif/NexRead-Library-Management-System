import React, { useState } from 'react';
import { CreditCardIcon, AlertTriangleIcon, CheckCircleIcon } from './Icons';

export default function FinesPayment({
  fines,
  members,
  onOpenPayModal,
  onViewReceipt,
  onUpdateFine,
  onDeleteFine,
  onCreateFine,
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFine, setNewFine] = useState({
    memberId: '',
    overdueDays: '',
    amount: '',
  });

const handleCreateFine = async (e) => {
  e.preventDefault();

  if (!newFine.memberId || !newFine.overdueDays || !newFine.amount) {
    alert('Please fill all fields.');
    return;
  }

  try {
    await onCreateFine({
      member: {
        id: Number(newFine.memberId),
      },
      overdueDays: Number(newFine.overdueDays),
      amount: Number(newFine.amount),
      status: 'PENDING',
    });

    alert('Fine created successfully!');

    setNewFine({
      memberId: '',
      overdueDays: '',
      amount: '',
    });

    setShowCreateForm(false);
  } catch (error) {
    alert(error.message || 'Failed to create fine.');
  }
};

  const filteredFines = fines.filter((f) => {
    if (filterStatus === 'ALL') return true;
    return f.status === filterStatus;
  });

  const totalOutstanding = fines
    .filter((f) => f.status === 'PENDING')
    .reduce((sum, f) => sum + Number(f.amount || 0), 0);

  const totalCollected = fines
    .filter((f) => f.status === 'PAID')
    .reduce((sum, f) => sum + Number(f.amount || 0), 0);

  // UPDATE FINE
  const handleEditFine = async (fine) => {
    const newAmount = window.prompt(
      `Enter new fine amount for ${fine.fineCode}:`,
      fine.amount
    );

    if (newAmount === null) return;

    const amount = Number(newAmount);

    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount greater than 0.');
      return;
    }

    try {
      await onUpdateFine(fine.id, {
        amount: amount,
        overdueDays: fine.overdueDays,
        status: fine.status,
      });

      alert('Fine updated successfully.');
    } catch (error) {
      alert(error.message || 'Failed to update fine.');
    }
  };

  // DELETE / CANCEL FINE
  const handleDeleteFine = async (fine) => {
    if (fine.status === 'PAID') {
      alert('A paid fine cannot be cancelled.');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel fine ${fine.fineCode}?`
    );

    if (!confirmed) return;

    try {
      await onDeleteFine(fine.id);

      alert('Fine cancelled successfully.');
    } catch (error) {
      alert(error.message || 'Failed to cancel fine.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="section-header">
      <div>
        <h2 className="section-title">
          <CreditCardIcon size={22} color="var(--primary)" />
          <span>Finance & Fine Management</span>
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          Overdue Assessment Settlement, Digital Receipts & Suspension Lifting
        </p>
      </div>

      <button
        className="btn btn-primary"
        onClick={() => setShowCreateForm(true)}
      >
        + New Fine
      </button>
    </div>

      {/* Summary Cards */}
      {showCreateForm && (
        <div
          className="card"
          style={{
            marginBottom: '2rem',
            padding: '24px',
          }}
        >
          <h3 style={{ marginBottom: '20px' }}>
            Create New Fine
          </h3>

          <form onSubmit={handleCreateFine}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
              }}
            >

              {/* Member */}
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontWeight: 600,
                  }}
                >
                  Member
                </label>

                <select
                  value={newFine.memberId}
                  onChange={(e) =>
                    setNewFine({
                      ...newFine,
                      memberId: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <option value="">Select Member</option>

                  {(members || []).map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.fullName} ({member.memberCode})
                    </option>
                  ))}
                </select>
              </div>

              {/* Overdue Days */}
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontWeight: 600,
                  }}
                >
                  Overdue Days
                </label>

                <input
                  type="number"
                  min="1"
                  value={newFine.overdueDays}
                  onChange={(e) =>
                    setNewFine({
                      ...newFine,
                      overdueDays: e.target.value,
                    })
                  }
                  placeholder="e.g. 5"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                  }}
                />
              </div>

              {/* Amount */}
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontWeight: 600,
                  }}
                >
                  Fine Amount (LKR)
                </label>

                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={newFine.amount}
                  onChange={(e) =>
                    setNewFine({
                      ...newFine,
                      amount: e.target.value,
                    })
                  }
                  placeholder="e.g. 50"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                  }}
                />
              </div>

            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '20px',
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
              >
                Create Fine
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '24px',
            margin: 0,
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangleIcon size={26} color="#ef4444" />
          </div>

          <div>
            <div
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
              }}
            >
              Total Outstanding Fines
            </div>

            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#ef4444',
                marginTop: '2px',
              }}
            >
              LKR {totalOutstanding.toFixed(2)}
            </div>

            <div
              style={{
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                marginTop: '2px',
              }}
            >
              Unsettled balances blocking book loans
            </div>
          </div>
        </div>

        <div
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '24px',
            margin: 0,
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CheckCircleIcon size={26} color="#10b981" />
          </div>

          <div>
            <div
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
              }}
            >
              Total Collected Revenue
            </div>

            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#10b981',
                marginTop: '2px',
              }}
            >
              LKR {totalCollected.toFixed(2)}
            </div>

            <div
              style={{
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                marginTop: '2px',
              }}
            >
              Settled via online gateway & cashier desk
            </div>
          </div>
        </div>
      </div>

      {/* Fines Table */}
      <div className="card">
        <div className="section-header">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <h3
              className="section-title"
              style={{ fontSize: '1.2rem' }}
            >
              <CreditCardIcon
                size={18}
                color="var(--accent-primary)"
              />
              <span>Fine Assessment & Settlement Records</span>
            </h3>

            <div className="filter-pills">
              <button
                className={`pill-btn ${
                  filterStatus === 'ALL' ? 'active' : ''
                }`}
                onClick={() => setFilterStatus('ALL')}
              >
                All ({fines.length})
              </button>

              <button
                className={`pill-btn ${
                  filterStatus === 'PENDING' ? 'active' : ''
                }`}
                onClick={() => setFilterStatus('PENDING')}
              >
                Pending Dues
              </button>

              <button
                className={`pill-btn ${
                  filterStatus === 'PAID' ? 'active' : ''
                }`}
                onClick={() => setFilterStatus('PAID')}
              >
                Paid / Settled
              </button>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Fine Code</th>
                <th>Member</th>
                <th>Overdue Days</th>
                <th>Calculated Fine</th>
                <th>Fine Status</th>
                <th>Receipt / Payment</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredFines.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: 'center',
                      padding: '36px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    No fine records found.
                  </td>
                </tr>
              ) : (
                filteredFines.map((f) => {
                  const isPaid = f.status === 'PAID';

                  return (
                    <tr key={f.id}>
                      <td>
                        <strong>{f.fineCode}</strong>
                      </td>

                      <td>
                        <div>{f.member?.fullName}</div>

                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {f.member?.memberCode} ({f.member?.status})
                        </div>
                      </td>

                      <td>
                        {f.overdueDays} Days Past Due
                      </td>

                      <td>
                        <strong
                          style={{
                            fontSize: '1.05rem',
                            color: isPaid
                              ? 'var(--text-primary)'
                              : 'var(--danger)',
                          }}
                        >
                          LKR {Number(f.amount).toFixed(2)}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            isPaid
                              ? 'badge-success'
                              : 'badge-danger'
                          }`}
                        >
                          {f.status}
                        </span>
                      </td>

                      <td>
                        {isPaid ? (
                          <div>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                color: 'var(--success)',
                              }}
                            >
                              {f.receiptNumber}
                            </div>

                            <div
                              style={{
                                fontSize: '0.72rem',
                                color: 'var(--text-muted)',
                              }}
                            >
                              Method: {f.paymentMethod}
                            </div>
                          </div>
                        ) : (
                          <span
                            style={{
                              color: 'var(--text-muted)',
                              fontSize: '0.78rem',
                            }}
                          >
                            Awaiting Payment
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td>
                        <div
                          style={{
                            display: 'flex',
                            gap: '6px',
                            flexWrap: 'wrap',
                          }}
                        >
                          {!isPaid ? (
                            <>
                              {/* PAY */}
                              <button
                                id={`pay-fine-btn-${f.id}`}
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  onOpenPayModal(f)
                                }
                              >
                                Pay Fine
                              </button>

                              {/* UPDATE */}
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() =>
                                  handleEditFine(f)
                                }
                              >
                                Edit
                              </button>

                              {/* DELETE / CANCEL */}
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ color: '#ef4444' }}
                                onClick={() =>
                                  handleDeleteFine(f)
                                }
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            /* RECEIPT */
                            <button
                              id={`view-receipt-btn-${f.id}`}
                              className="btn btn-secondary btn-sm"
                              onClick={() =>
                                onViewReceipt(f)
                              }
                            >
                              Receipt
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}