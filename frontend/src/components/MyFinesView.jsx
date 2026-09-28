import React from 'react';
import { CheckCircleIcon } from './Icons';

export default function MyFinesView({
  activeMember,
  fines,
  onOpenPaymentModal,
  onOpenReceiptModal,
  onOpenInvoice,
}) {
  const memberFines = fines.filter(
    (f) => f.member?.id === activeMember?.id
  );

  const pendingFines = memberFines.filter(
    (f) => f.status === 'PENDING'
  );

  const paidFines = memberFines.filter(
    (f) => f.status === 'PAID'
  );

  const totalPending = pendingFines.reduce(
    (acc, f) => acc + (f.amount || 0),
    0
  );

  const totalPaid = paidFines.reduce(
    (acc, f) => acc + (f.amount || 0),
    0
  );

  return (
    <div className="animate-fade-in">
      <div className="saas-page-header">
        <div className="page-title-group">
          <h1>
            My Fines & Billing{' '}
            <span className="page-title-count">
              ({memberFines.length})
            </span>
          </h1>
          <p className="page-subtitle">
            Review overdue assessments, settle outstanding dues,
            and access official payment documents.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        <div className="stat-card" style={{ minHeight: '96px' }}>
          <div>
            <div
              className="stat-val"
              style={{
                color:
                  totalPending > 0
                    ? '#ef4444'
                    : 'var(--text-main)',
              }}
            >
              LKR {totalPending.toFixed(2)}
            </div>
            <div className="stat-title">Outstanding</div>
          </div>
        </div>

        <div className="stat-card" style={{ minHeight: '96px' }}>
          <div>
            <div className="stat-val">{pendingFines.length}</div>
            <div className="stat-title">Pending Assessments</div>
          </div>
        </div>

        <div className="stat-card" style={{ minHeight: '96px' }}>
          <div>
            <div className="stat-val">
              LKR {totalPaid.toFixed(2)}
            </div>
            <div className="stat-title">Paid History</div>
          </div>
        </div>
      </div>

      {totalPending > 0 ? (
        <div
          style={{
            padding: '18px 20px',
            backgroundColor: 'rgba(239, 68, 68, 0.07)',
            border: '1px solid rgba(239, 68, 68, 0.20)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div>
            <div
              style={{
                color: '#dc2626',
                fontWeight: 750,
                fontSize: '1rem',
              }}
            >
              Outstanding Balance: LKR{' '}
              {totalPending.toFixed(2)}
            </div>
            <div
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                marginTop: '3px',
              }}
            >
              Settle pending fines to maintain full borrowing
              privileges.
            </div>
          </div>

          <button
            className="btn btn-primary"
            type="button"
            onClick={() =>
              onOpenPaymentModal(pendingFines[0])
            }
          >
            Pay Now • LKR{' '}
            {pendingFines[0].amount.toFixed(2)}
          </button>
        </div>
      ) : (
        <div
          style={{
            padding: '15px 18px',
            backgroundColor: 'rgba(16, 185, 129, 0.07)',
            border: '1px solid rgba(16, 185, 129, 0.20)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            color: '#059669',
            fontWeight: 650,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircleIcon size={18} color="#059669" />
          <span>
            No outstanding fines. Your account is in good
            standing.
          </span>
        </div>
      )}

      <div className="saas-table-container">
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-heading)',
              fontSize: '1.05rem',
              fontWeight: 750,
            }}
          >
            Fine & Payment History
          </h2>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
            }}
          >
            All assessments and completed payments for your
            account.
          </p>
        </div>

        <div className="table-responsive">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Fine ID</th>
                <th>Assessment / Loan</th>
                <th>Overdue</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {memberFines.length === 0 ? (
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
                      No fine records
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>
                      Your account currently has no fine
                      assessments.
                    </div>
                  </td>
                </tr>
              ) : (
                memberFines.map((f) => (
                  <tr key={f.id}>
                    <td style={{ fontWeight: 700 }}>
                      {f.fineCode}
                    </td>

                    <td>
                      {f.borrowing ? (
                        <div>
                          <div
                            style={{
                              fontWeight: 650,
                              color: 'var(--text-main)',
                            }}
                          >
                            {f.borrowing.book?.title}
                          </div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              marginTop: '3px',
                            }}
                          >
                            Loan: {f.borrowing.borrowCode}
                          </div>
                        </div>
                      ) : (
                        <span
                          style={{
                            color: 'var(--text-muted)',
                          }}
                        >
                          Library Administrative Assessment
                        </span>
                      )}
                    </td>

                    <td>{f.overdueDays} days</td>

                    <td
                      style={{
                        fontWeight: 750,
                        color:
                          f.status === 'PENDING'
                            ? '#ef4444'
                            : 'var(--text-main)',
                      }}
                    >
                      LKR {f.amount.toFixed(2)}
                    </td>

                    <td>{f.paymentMethod || '—'}</td>

                    <td>
                      <span
                        className={`status-pill ${
                          f.status === 'PAID'
                            ? 'status-paid'
                            : 'status-overdue'
                        }`}
                      >
                        {f.status}
                      </span>
                    </td>

                    <td>
                      {f.status === 'PENDING' ? (
                        <button
                          className="btn btn-primary btn-sm"
                          type="button"
                          onClick={() =>
                            onOpenPaymentModal(f)
                          }
                        >
                          Pay Online
                        </button>
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            gap: '7px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <button
                            className="btn btn-secondary btn-sm"
                            type="button"
                            onClick={() =>
                              onOpenReceiptModal(f)
                            }
                          >
                            Receipt
                          </button>

                          <button
                            className="btn btn-primary btn-sm"
                            type="button"
                            onClick={() => onOpenInvoice(f)}
                          >
                            Invoice
                          </button>
                        </div>
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
