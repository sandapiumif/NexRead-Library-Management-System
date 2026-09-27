import React from 'react';
import { CheckCircleIcon } from './Icons';

export default function MyFinesView({
  activeMember,
  fines,
  onOpenPaymentModal,
  onOpenReceiptModal,
  onOpenInvoice,
}) {
  const memberFines = fines.filter((f) => f.member?.id === activeMember?.id);
  const pendingFines = memberFines.filter((f) => f.status === 'PENDING');
  const totalPending = pendingFines.reduce((acc, f) => acc + (f.amount || 0), 0);

  return (
    <div>
      <div className="saas-page-header">
        <div className="page-title-group">
          <h1>
            My Fines & Billing <span className="page-title-count">({memberFines.length})</span>
          </h1>
          <p className="page-subtitle">
            View overdue assessments, settle dues online, and download official payment receipts.
          </p>
        </div>
      </div>

      {totalPending > 0 ? (
        <div
          style={{
            padding: '20px 24px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '1.1rem' }}>
              Outstanding Balance: LKR {totalPending.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Settling your fines will immediately restore full borrowing privileges.
            </div>
          </div>
          {pendingFines.length > 0 && (
            <button
              className="btn btn-primary"
              onClick={() => onOpenPaymentModal(pendingFines[0])}
            >
              Pay Now (LKR {pendingFines[0].amount.toFixed(2)})
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            color: '#059669',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircleIcon size={18} color="#059669" />
          <span>You have no outstanding fines! Your account is in good standing.</span>
        </div>
      )}

      <div className="saas-table-container">
        <table className="saas-table">
          <thead>
            <tr>
              <th>Fine ID</th>
              <th>Assessment Reason / Loan</th>
              <th>Days Overdue</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {memberFines.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  No fine records on this account.
                </td>
              </tr>
            ) : (
              memberFines.map((f) => (
                <tr key={f.id}>
                  <td style={{ fontWeight: 600 }}>{f.fineCode}</td>
                  <td>
                    {f.borrowing ? (
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{f.borrowing.book?.title}</span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Loan: {f.borrowing.borrowCode}
                        </div>
                      </div>
                    ) : (
                      'Library Administrative Assessment'
                    )}
                  </td>
                  <td>{f.overdueDays} days</td>
                  <td style={{ fontWeight: 700, fontSize: '0.95rem', color: f.status === 'PENDING' ? '#ef4444' : 'var(--text-main)' }}>
                    LKR {f.amount.toFixed(2)}
                  </td>
                  <td>{f.paymentMethod || '—'}</td>
                  <td>
                    <span className={`status-pill ${f.status === 'PAID' ? 'status-paid' : 'status-overdue'}`}>
                      {f.status}
                    </span>
                  </td>
                  <td>
                    {f.status === 'PENDING' ? (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onOpenPaymentModal(f)}
                      >
                        Pay Online
                      </button>
                   ) : (
                     <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                       <button
                         className="btn btn-secondary btn-sm"
                         onClick={() => onOpenReceiptModal(f)}
                       >
                         View Receipt
                       </button>

                       <button
                         className="btn btn-primary btn-sm"
                         onClick={() => onOpenInvoice(f)}
                       >
                         View Invoice
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
  );
}
