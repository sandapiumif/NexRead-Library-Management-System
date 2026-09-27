import React, { useState } from 'react';
import {
  CreditCardIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
} from './Icons';

export default function FinesPayment({
  fines,
  members,
  refunds,
  onOpenPaymentModal,
  onOpenReceiptModal,
  onUpdateFine,
  onDeleteFine,
  onCreateFine,
  onProcessRefund,
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);

  const [newFine, setNewFine] = useState({
    memberId: '',
    overdueDays: '',
    amount: '',
  });

  // ─────────────────────────────────────────────────────────────
  // CREATE FINE
  // ─────────────────────────────────────────────────────────────

  const handleCreateFine = async (e) => {
    e.preventDefault();

    if (!selectedMember) {
      alert('Please select a member first.');
      return;
    }

    if (!newFine.overdueDays || !newFine.amount) {
      alert('Please fill all fields.');
      return;
    }

    try {
      await onCreateFine({
        member: {
          id: Number(selectedMember.id),
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

      setMemberSearch('');
      setSelectedMember(null);
      setShowCreateForm(false);
    } catch (error) {
      alert(error.message || 'Failed to create fine.');
    }
  };

  // ─────────────────────────────────────────────────────────────
  // MEMBER SEARCH
  // ─────────────────────────────────────────────────────────────

  const memberSearchResults = (members || [])
    .filter((member) => {
      const search = memberSearch.toLowerCase().trim();

      if (!search) {
        return false;
      }

      return (
        member.fullName?.toLowerCase().includes(search) ||
        member.memberCode?.toLowerCase().includes(search) ||
        String(member.id).includes(search)
      );
    })
    .slice(0, 8);

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setMemberSearch(`${member.fullName} (${member.memberCode})`);
    setNewFine((prev) => ({
      ...prev,
      memberId: member.id,
    }));
  };

  const handleClearSelectedMember = () => {
    setSelectedMember(null);
    setMemberSearch('');
    setNewFine((prev) => ({
      ...prev,
      memberId: '',
    }));
  };

  // ─────────────────────────────────────────────────────────────
  // FILTERS
  // ─────────────────────────────────────────────────────────────

  const filteredFines = (fines || []).filter((f) => {
    if (filterStatus === 'ALL') {
      return true;
    }
    return f.status === filterStatus;
  });

  // ─────────────────────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────────────────────

  const totalOutstanding = (fines || [])
    .filter((f) => f.status === 'PENDING')
    .reduce((sum, f) => sum + Number(f.amount || 0), 0);

const totalCollected = (fines || [])
  .filter((f) => f.status === 'PAID')
  .reduce(
    (sum, f) =>
      sum + Number(f.amount || 0),
    0
  );

  // ─────────────────────────────────────────────────────────────
  // UPDATE FINE
  // ─────────────────────────────────────────────────────────────

  const handleEditFine = async (fine) => {
    const newAmount = window.prompt(
      `Enter new fine amount for ${fine.fineCode}:`,
      fine.amount
    );

    if (newAmount === null) {
      return;
    }

    const amount = Number(newAmount);

    if (isNaN(amount) || amount <= 0) {
      alert(
        'Please enter a valid amount greater than 0.'
      );
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
      alert(
        error.message ||
        'Failed to update fine.'
      );
    }
  };

  // ─────────────────────────────────────────────────────────────
  // DELETE / CANCEL FINE
  // ─────────────────────────────────────────────────────────────

  const handleDeleteFine = async (fine) => {
    if (fine.status === 'PAID') {
      alert(
        'A paid fine cannot be cancelled.'
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel fine ${fine.fineCode}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await onDeleteFine(fine.id);

      alert(
        'Fine cancelled successfully.'
      );
    } catch (error) {
      alert(
        error.message ||
        'Failed to cancel fine.'
      );
    }
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────

  return (
    <div className="animate-fade-in">

      {/* ═══════════════════════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════════════════════ */}

      <div className="section-header">

        <div>

          <h2 className="section-title">

            <CreditCardIcon
              size={22}
              color="var(--primary)"
            />

            <span>
              Finance & Fine Management
            </span>

          </h2>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
            }}
          >
            Overdue Assessment Settlement, Digital Receipts & Suspension Lifting
          </p>

        </div>

        <button
          className="btn btn-primary"
          onClick={() =>
            setShowCreateForm(true)
          }
        >
          + New Fine
        </button>

      </div>

      {/* ═══════════════════════════════════════════════════════════
          CREATE NEW FINE
      ═══════════════════════════════════════════════════════════ */}

      {showCreateForm && (

        <div
          className="card"
          style={{
            marginBottom: '2rem',
            padding: '24px',
          }}
        >

          <h3
            style={{
              marginBottom: '20px',
            }}
          >
            Create New Fine
          </h3>

          <form onSubmit={handleCreateFine}>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
              }}
            >

              {/* ─────────────────────────────────────────────
                  MEMBER AUTOCOMPLETE
              ───────────────────────────────────────────── */}

              <div
                style={{
                  position: 'relative',
                }}
              >

                <label
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontWeight: 600,
                  }}
                >
                  Member
                </label>

                <div
                  style={{
                    position: 'relative',
                  }}
                >

                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => {

                      const value =
                        e.target.value;

                      setMemberSearch(value);

                      if (selectedMember) {
                        setSelectedMember(null);
                      }

                      setNewFine((prev) => ({
                        ...prev,
                        memberId: '',
                      }));

                    }}
                    placeholder="Search by name or member ID..."
                    autoComplete="off"
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 12px',
                      borderRadius: '8px',
                      border:
                        '1px solid var(--border)',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />

                  {selectedMember && (

                    <button
                      type="button"
                      onClick={
                        handleClearSelectedMember
                      }
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform:
                          'translateY(-50%)',
                        border: 'none',
                        background:
                          'transparent',
                        cursor: 'pointer',
                        fontSize: '18px',
                        color:
                          'var(--text-muted)',
                      }}
                      title="Clear member"
                    >
                      ×
                    </button>

                  )}

                </div>

                {/* SEARCH RESULTS */}

                {!selectedMember &&
                  memberSearch.trim() !== '' && (

                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background:
                          'var(--bg-card)',
                        border:
                          '1px solid var(--border)',
                        borderRadius: '8px',
                        marginTop: '4px',
                        maxHeight: '220px',
                        overflowY: 'auto',
                        zIndex: 1000,
                        boxShadow:
                          '0 8px 20px rgba(0,0,0,0.12)',
                      }}
                    >

                      {memberSearchResults.length >
                      0 ? (

                        memberSearchResults.map(
                          (member) => (

                            <div
                              key={member.id}
                              onClick={() =>
                                handleSelectMember(
                                  member
                                )
                              }
                              style={{
                                padding:
                                  '12px 14px',
                                cursor: 'pointer',
                                borderBottom:
                                  '1px solid var(--border)',
                              }}
                              onMouseEnter={(
                                e
                              ) => {
                                e.currentTarget.style.backgroundColor =
                                  'var(--bg-secondary)';
                              }}
                              onMouseLeave={(
                                e
                              ) => {
                                e.currentTarget.style.backgroundColor =
                                  'transparent';
                              }}
                            >

                              <div
                                style={{
                                  fontWeight: 600,
                                }}
                              >
                                {member.fullName}
                              </div>

                              <div
                                style={{
                                  fontSize:
                                    '0.78rem',
                                  color:
                                    'var(--text-muted)',
                                  marginTop:
                                    '3px',
                                }}
                              >
                                {member.memberCode}
                                {' • '}
                                ID: {member.id}
                              </div>

                            </div>

                          )
                        )

                      ) : (

                        <div
                          style={{
                            padding: '14px',
                            color:
                              'var(--text-muted)',
                            fontSize:
                              '0.85rem',
                          }}
                        >
                          No members found.
                        </div>

                      )}

                    </div>

                  )}

                {/* SELECTED MEMBER */}

                {selectedMember && (

                  <div
                    style={{
                      marginTop: '6px',
                      fontSize: '0.78rem',
                      color: 'var(--success)',
                      fontWeight: 600,
                    }}
                  >
                    ✓ Member selected:{' '}
                    {selectedMember.fullName}
                  </div>

                )}

              </div>

              {/* ─────────────────────────────────────────────
                  OVERDUE DAYS
              ───────────────────────────────────────────── */}

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
                  value={
                    newFine.overdueDays
                  }
                  onChange={(e) =>
                    setNewFine({
                      ...newFine,
                      overdueDays:
                        e.target.value,
                    })
                  }
                  placeholder="e.g. 5"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border:
                      '1px solid var(--border)',
                    boxSizing: 'border-box',
                  }}
                />

              </div>

              {/* ─────────────────────────────────────────────
                  FINE AMOUNT
              ───────────────────────────────────────────── */}

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
                    border:
                      '1px solid var(--border)',
                    boxSizing: 'border-box',
                  }}
                />

              </div>

            </div>

            {/* FORM BUTTONS */}

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
                onClick={() => {

                  setShowCreateForm(false);

                  setMemberSearch('');

                  setSelectedMember(null);

                  setNewFine({
                    memberId: '',
                    overdueDays: '',
                    amount: '',
                  });

                }}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}

      {/* ═══════════════════════════════════════════════════════════
          SUMMARY CARDS
      ═══════════════════════════════════════════════════════════ */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >

        {/* OUTSTANDING */}

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
              backgroundColor:
                'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >

            <AlertTriangleIcon
              size={26}
              color="#ef4444"
            />

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
                fontFamily:
                  'var(--font-heading)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#ef4444',
                marginTop: '2px',
              }}
            >
              LKR{' '}
              {totalOutstanding.toFixed(2)}
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

        {/* COLLECTED */}

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
              backgroundColor:
                'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >

            <CheckCircleIcon
              size={26}
              color="#10b981"
            />

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
                fontFamily:
                  'var(--font-heading)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#10b981',
                marginTop: '2px',
              }}
            >
              LKR{' '}
              {totalCollected.toFixed(2)}
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

      {/* ═══════════════════════════════════════════════════════════
          FINES TABLE
      ═══════════════════════════════════════════════════════════ */}

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
              style={{
                fontSize: '1.2rem',
              }}
            >

              <CreditCardIcon
                size={18}
                color="var(--accent-primary)"
              />

              <span>
                Fine Assessment & Settlement Records
              </span>

            </h3>

            <div className="filter-pills">

              <button
                className={`pill-btn ${
                  filterStatus === 'ALL'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  setFilterStatus('ALL')
                }
              >
                All ({fines.length})
              </button>

              <button
                className={`pill-btn ${
                  filterStatus === 'PENDING'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  setFilterStatus('PENDING')
                }
              >
                Pending Dues
              </button>

              <button
                className={`pill-btn ${
                  filterStatus === 'PAID'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  setFilterStatus('PAID')
                }
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

                <th>
                  Fine Code
                </th>

                <th>
                  Member
                </th>

                <th>
                  Overdue Days
                </th>

                <th>
                  Calculated Fine
                </th>

                <th>
                  Fine Status
                </th>

                <th>
                  Receipt / Payment
                </th>

                <th>
                  Action
                </th>

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
                      color:
                        'var(--text-muted)',
                    }}
                  >
                    No fine records found.
                  </td>

                </tr>

              ) : (

                filteredFines.map((f) => {

                  const isPaid =
                    f.status === 'PAID';

                  // Find refund belonging to this fine
                  const refund =
                    (refunds || []).find(
                      (r) =>
                        Number(r.fineId) ===
                        Number(f.id)
                    );

                  const isRefunded =
                    refund &&
                    String(refund.status || '').toUpperCase() === 'PROCESSED';

                  return (

                    <tr key={f.id}>

                      {/* FINE CODE */}

                      <td>
                        <strong>
                          {f.fineCode}
                        </strong>
                      </td>

                      {/* MEMBER */}

                      <td>

                        <div>
                          {f.member?.fullName}
                        </div>

                        <div
                          style={{
                            fontSize:
                              '0.75rem',
                            color:
                              'var(--text-muted)',
                          }}
                        >
                          {f.member?.memberCode}
                          {' '}
                          ({f.member?.status})
                        </div>

                      </td>

                      {/* OVERDUE */}

                      <td>
                        {f.overdueDays}
                        {' '}
                        Days Past Due
                      </td>

                      {/* AMOUNT */}

                      <td>

                        <strong
                          style={{
                            fontSize:
                              '1.05rem',
                            color: isPaid
                              ? 'var(--text-primary)'
                              : 'var(--danger)',
                          }}
                        >
                          LKR{' '}
                          {Number(
                            f.amount || 0
                          ).toFixed(2)}
                        </strong>

                      </td>

                      {/* STATUS */}

                      <td>

                        <div
                          style={{
                            display: 'flex',
                            flexDirection:
                              'column',
                            gap: '5px',
                            alignItems:
                              'flex-start',
                          }}
                        >

                          <span
                            className={`badge ${
                              isPaid
                                ? 'badge-success'
                                : 'badge-danger'
                            }`}
                          >
                            {f.status}
                          </span>

                          {isRefunded && (

                            <span
                              className="badge"
                              style={{
                                backgroundColor:
                                  'rgba(245, 158, 11, 0.12)',
                                color:
                                  '#b45309',
                              }}
                            >
                              REFUNDED
                            </span>

                          )}

                        </div>

                      </td>

                      {/* RECEIPT / PAYMENT */}

                      <td>

                        {isPaid ? (

                          <div>

                            <div
                              style={{
                                fontWeight: 600,
                                fontSize:
                                  '0.8rem',
                                color:
                                  'var(--success)',
                              }}
                            >
                              {f.receiptNumber ||
                                'Payment Completed'}
                            </div>

                            <div
                              style={{
                                fontSize:
                                  '0.72rem',
                                color:
                                  'var(--text-muted)',
                              }}
                            >
                              Method:{' '}
                              {f.paymentMethod ||
                                'N/A'}
                            </div>

                            {isRefunded && (

                              <div
                                style={{
                                  marginTop:
                                    '6px',
                                  fontSize:
                                    '0.72rem',
                                  color:
                                    '#b45309',
                                  fontWeight: 600,
                                }}
                              >
                                Refund:{' '}
                                {refund.refundReference}
                              </div>

                            )}

                          </div>

                        ) : (

                          <span
                            style={{
                              color:
                                'var(--text-muted)',
                              fontSize:
                                '0.78rem',
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
                                  onOpenPaymentModal(
                                    f
                                  )
                                }
                              >
                                Pay Fine
                              </button>

                              {/* EDIT */}

                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() =>
                                  handleEditFine(
                                    f
                                  )
                                }
                              >
                                Edit
                              </button>

                              {/* CANCEL */}

                              <button
                                className="btn btn-secondary btn-sm"
                                style={{
                                  color:
                                    '#ef4444',
                                }}
                                onClick={() =>
                                  handleDeleteFine(
                                    f
                                  )
                                }
                              >
                                Cancel
                              </button>

                            </>

                          ) : (

                            <div
                              style={{
                                display:
                                  'flex',
                                gap: '6px',
                                flexWrap:
                                  'wrap',
                              }}
                            >

                              {/* RECEIPT */}

                              <button
                                id={`view-receipt-btn-${f.id}`}
                                className="btn btn-secondary btn-sm"
                                onClick={() =>
                                  onOpenReceiptModal(
                                    f
                                  )
                                }
                              >
                                Receipt
                              </button>

                              {/* REFUND */}

                              {isRefunded ? (

                                <button
                                  className="btn btn-secondary btn-sm"
                                  style={{
                                    color:
                                      '#b45309',
                                    cursor:
                                      'default',
                                    opacity:
                                      0.8,
                                  }}
                                  disabled
                                >
                                  Refunded
                                </button>

                              ) : (

                                <button
                                  id={`refund-fine-btn-${f.id}`}
                                  className="btn btn-secondary btn-sm"
                                  style={{
                                    color:
                                      '#b45309',
                                  }}
                                  onClick={() =>
                                    onProcessRefund(
                                      f
                                    )
                                  }
                                >
                                  Refund
                                </button>

                              )}

                            </div>

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
