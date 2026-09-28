import React from 'react';

export default function MyBorrowingRequestsView({
  activeMember,
  borrowingRequests = [],
  onCancelRequest,
}) {
  const safeRequests = Array.isArray(borrowingRequests)
    ? borrowingRequests
    : [];

  const memberRequests = safeRequests.filter(
    (request) =>
      request.member?.id === activeMember?.id ||
      request.memberId === activeMember?.id
  );

  const pendingCount = memberRequests.filter(
    (r) => r.status === 'PENDING'
  ).length;

  const approvedCount = memberRequests.filter(
    (r) => r.status === 'APPROVED'
  ).length;

  const getStatusClass = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'status-paid';
      case 'REJECTED':
      case 'CANCELLED':
        return 'status-overdue';
      case 'PENDING':
      default:
        return 'status-pending';
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return '—';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString('en-LK', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleCancel = async (request) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel your borrowing request for "${
        request.book?.title || 'this book'
      }"?`
    );

    if (!confirmed) return;

    try {
      await onCancelRequest(
        request.id,
        activeMember?.id
      );
    } catch (error) {
      window.alert(
        error?.message ||
          'Failed to cancel borrowing request.'
      );
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="saas-page-header">
        <div className="page-title-group">
          <h1>
            My Borrowing Requests{' '}
            <span className="page-title-count">
              ({memberRequests.length})
            </span>
          </h1>
          <p className="page-subtitle">
            Track submitted borrowing requests and their current
            status.
          </p>
        </div>
      </div>

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
            <div className="stat-val">
              {memberRequests.length}
            </div>
            <div className="stat-title">Total Requests</div>
          </div>
        </div>

        <div className="stat-card" style={{ minHeight: '92px' }}>
          <div>
            <div className="stat-val">{pendingCount}</div>
            <div className="stat-title">Pending</div>
          </div>
        </div>

        <div className="stat-card" style={{ minHeight: '92px' }}>
          <div>
            <div className="stat-val">{approvedCount}</div>
            <div className="stat-title">Approved</div>
          </div>
        </div>
      </div>

      <div className="saas-table-container">
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
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
              Request History
            </h2>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
              }}
            >
              Review request status, notes, and administrator
              responses.
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
            {pendingCount} pending
          </span>
        </div>

        <div className="table-responsive">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Request</th>
                <th>Book</th>
                <th>Requested</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Admin Response</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {memberRequests.length === 0 ? (
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
                      No borrowing requests found
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>
                      You have not submitted any borrowing
                      requests yet.
                    </div>
                  </td>
                </tr>
              ) : (
                memberRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <strong>
                        {request.requestCode ||
                          request.borrowingRequestCode ||
                          `REQ-${request.id}`}
                      </strong>
                    </td>

                    <td>
                      {request.book ? (
                        <div>
                          <div
                            style={{
                              fontWeight: 650,
                              color: 'var(--text-main)',
                            }}
                          >
                            {request.book.title}
                          </div>

                          {request.book.bookCode && (
                            <div
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                                marginTop: '3px',
                              }}
                            >
                              {request.book.bookCode}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span
                          style={{
                            color: 'var(--text-muted)',
                          }}
                        >
                          Book information unavailable
                        </span>
                      )}
                    </td>

                    <td>
                      {formatDate(
                        request.requestDate ||
                          request.requestedAt ||
                          request.createdAt
                      )}
                    </td>

                    <td>
                      <span
                        className={`status-pill ${getStatusClass(
                          request.status
                        )}`}
                      >
                        {request.status || 'PENDING'}
                      </span>
                    </td>

                    <td>
                      <div
                        style={{
                          maxWidth: '190px',
                          fontSize: '0.8rem',
                          color: 'var(--text-secondary)',
                          whiteSpace: 'normal',
                          lineHeight: 1.45,
                        }}
                      >
                        {request.notes || '—'}
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          maxWidth: '190px',
                          fontSize: '0.8rem',
                          color:
                            request.status === 'REJECTED'
                              ? '#ef4444'
                              : 'var(--text-secondary)',
                          whiteSpace: 'normal',
                          lineHeight: 1.45,
                        }}
                      >
                        {request.adminNotes ||
                          request.rejectionReason ||
                          '—'}
                      </div>
                    </td>

                    <td>
                      {request.status === 'PENDING' ? (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{
                            color: 'var(--danger)',
                            borderColor: 'var(--danger)',
                          }}
                          onClick={() =>
                            handleCancel(request)
                          }
                        >
                          Cancel
                        </button>
                      ) : request.status === 'APPROVED' ? (
                        <span
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--success)',
                            fontWeight: 650,
                          }}
                        >
                          ✓ Approved
                        </span>
                      ) : request.status === 'REJECTED' ? (
                        <span
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--danger)',
                            fontWeight: 650,
                          }}
                        >
                          Rejected
                        </span>
                      ) : request.status === 'CANCELLED' ? (
                        <span
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--text-muted)',
                            fontWeight: 650,
                          }}
                        >
                          Cancelled
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          —
                        </span>
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
