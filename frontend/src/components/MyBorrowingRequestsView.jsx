import React from 'react';

export default function MyBorrowingRequestsView({
  activeMember,
  borrowingRequests = [],
  onCancelRequest,
}) {
  const safeRequests = Array.isArray(borrowingRequests)
    ? borrowingRequests
    : [];

  // Show only requests belonging to the currently logged-in member
  const memberRequests = safeRequests.filter(
    (request) =>
      request.member?.id === activeMember?.id ||
      request.memberId === activeMember?.id
  );

  const getStatusClass = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'status-paid';

      case 'REJECTED':
        return 'status-overdue';

      case 'CANCELLED':
        return 'status-overdue';

      case 'PENDING':
        return 'status-pending';

      default:
        return 'status-pending';
    }
  };

  const getStatusLabel = (status) => {
    if (!status) {
      return 'PENDING';
    }

    return status;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return '—';
    }

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
      `Are you sure you want to cancel your borrowing request for "${request.book?.title || 'this book'}"?`
    );

    if (!confirmed) {
      return;
    }

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

      {/* ===================================================== */}
      {/* PAGE HEADER */}
      {/* ===================================================== */}

      <div className="saas-page-header">
        <div className="page-title-group">
          <h1>
            My Borrowing Requests{' '}
            <span className="page-title-count">
              ({memberRequests.length})
            </span>
          </h1>

          <p className="page-subtitle">
            Track your submitted borrowing requests and their current status.
          </p>
        </div>
      </div>


      {/* ===================================================== */}
      {/* REQUEST TABLE */}
      {/* ===================================================== */}

      <div className="saas-table-container">

        <table className="saas-table">

          <thead>
            <tr>
              <th>Request ID</th>
              <th>Book</th>
              <th>Requested Date</th>
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
                    padding: '40px',
                    color: 'var(--text-muted)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '2rem',
                      marginBottom: '10px',
                    }}
                  >
                    📚
                  </div>

                  <div
                    style={{
                      fontWeight: 600,
                      marginBottom: '5px',
                      color: 'var(--text-main)',
                    }}
                  >
                    No borrowing requests found
                  </div>

                  <div
                    style={{
                      fontSize: '0.85rem',
                    }}
                  >
                    You have not submitted any borrowing requests yet.
                  </div>
                </td>
              </tr>

            ) : (

              memberRequests.map((request) => (

                <tr key={request.id}>

                  {/* REQUEST ID */}
                  <td>
                    <strong>
                      {request.requestCode ||
                        request.borrowingRequestCode ||
                        `REQ-${request.id}`}
                    </strong>
                  </td>


                  {/* BOOK */}
                  <td>
                    {request.book ? (

                      <div>

                        <div
                          style={{
                            fontWeight: 600,
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


                  {/* REQUEST DATE */}
                  <td>
                    {formatDate(
                      request.requestDate ||
                      request.requestedAt ||
                      request.createdAt
                    )}
                  </td>


                  {/* STATUS */}
                  <td>

                    <span
                      className={`status-pill ${getStatusClass(
                        request.status
                      )}`}
                    >
                      {getStatusLabel(request.status)}
                    </span>

                  </td>


                  {/* MEMBER NOTES */}
                  <td>
                    <div
                      style={{
                        maxWidth: '220px',
                        fontSize: '0.82rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {request.notes || '—'}
                    </div>
                  </td>


                  {/* ADMIN RESPONSE */}
                  <td>
                    <div
                      style={{
                        maxWidth: '220px',
                        fontSize: '0.82rem',
                        color:
                          request.status === 'REJECTED'
                            ? '#ef4444'
                            : 'var(--text-secondary)',
                      }}
                    >
                      {request.adminNotes ||
                        request.rejectionReason ||
                        '—'}
                    </div>
                  </td>


                  {/* ACTION */}
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
                        Cancel Request
                      </button>

                    ) : request.status === 'APPROVED' ? (

                      <span
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--success)',
                          fontWeight: 600,
                        }}
                      >
                        ✓ Approved
                      </span>

                    ) : request.status === 'REJECTED' ? (

                      <span
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--danger)',
                          fontWeight: 600,
                        }}
                      >
                        Request Rejected
                      </span>

                    ) : request.status === 'CANCELLED' ? (

                      <span
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          fontWeight: 600,
                        }}
                      >
                        Cancelled
                      </span>

                    ) : (

                      <span
                        style={{
                          fontSize: '0.8rem',
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
  );
}