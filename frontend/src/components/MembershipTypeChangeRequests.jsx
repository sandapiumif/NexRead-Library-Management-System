import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8080/api';

export default function MembershipTypeChangeRequests({
  members = [],
}) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // UI-only section state. No business logic/API behavior is changed.
  const [sectionOpen, setSectionOpen] = useState(false);

  useEffect(() => {
    const handleSectionChange = (event) => {
      setSectionOpen(event.detail === 'requests');
    };

    window.addEventListener(
      'membership-section-change',
      handleSectionChange
    );

    return () => {
      window.removeEventListener(
        'membership-section-change',
        handleSectionChange
      );
    };
  }, []);

  // ==============================
  // LOAD ALL MEMBERSHIP TYPE REQUESTS
  // ==============================

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');

      const allRequests = [];

      await Promise.all(
        members.map(async (member) => {
          try {
            const res = await fetch(
              `${API_BASE}/members/${member.id}/membership-type-change-requests`
            );

            if (!res.ok) return;

            const data = await res.json();

            if (Array.isArray(data)) {
              data.forEach((request) => {
                allRequests.push({
                  ...request,
                  memberName: member.fullName,
                  memberCode: member.memberCode,
                  memberEmail: member.email,
                });
              });
            }
          } catch (err) {
            console.error(
              `Failed to load requests for member ${member.id}:`,
              err
            );
          }
        })
      );

      allRequests.sort((a, b) => {
        const dateA = new Date(a.requestedAt || 0);
        const dateB = new Date(b.requestedAt || 0);

        return dateB - dateA;
      });

      setRequests(allRequests);
    } catch (err) {
      setError(
        err.message ||
          'Failed to load membership type requests.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (members.length > 0) {
      fetchRequests();
    } else {
      setRequests([]);
      setLoading(false);
    }
  }, [members]);

  // ==============================
  // APPROVE
  // ==============================

  const handleApprove = async (requestId) => {
    const confirmed = window.confirm(
      'Are you sure you want to approve this membership type change request?'
    );

    if (!confirmed) return;

    try {
      setProcessingId(requestId);
      setError('');
      setSuccess('');

      const res = await fetch(
        `${API_BASE}/members/membership-type-change-requests/${requestId}/approve`,
        {
          method: 'PUT',
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            'Failed to approve membership type change.'
        );
      }

      setSuccess(
        'Membership type change request approved successfully.'
      );

      await fetchRequests();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  // ==============================
  // REJECT WITH REASON
  // ==============================

  const handleReject = async (requestId) => {
    const rejectionReason = window.prompt(
      'Please enter the reason for rejecting this membership type change request:'
    );

    // User clicked Cancel
    if (rejectionReason === null) {
      return;
    }

    const trimmedReason = rejectionReason.trim();

    // Empty reason is not allowed
    if (!trimmedReason) {
      window.alert(
        'A rejection reason is required. The request was not rejected.'
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to reject this membership type change request?\n\nReason: ${trimmedReason}`
    );

    if (!confirmed) return;

    try {
      setProcessingId(requestId);
      setError('');
      setSuccess('');

      const res = await fetch(
        `${API_BASE}/members/membership-type-change-requests/${requestId}/reject`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reason: trimmedReason,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            'Failed to reject membership type change.'
        );
      }

      setSuccess(
        'Membership type change request rejected successfully.'
      );

      await fetchRequests();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  // ==============================
  // UI
  // ==============================

  return (
    <div
      id="membership-section-requests"
      className="card"
      style={{
        marginTop: '14px',
        overflow: 'hidden',
      }}
    >
      {/* COLLAPSED / EXPANDED SECTION HEADER */}
      <button
        type="button"
        onClick={() => {
          window.dispatchEvent(
            new CustomEvent(
              'membership-section-change',
              {
                  detail: sectionOpen
                    ? 'members'
                    : 'requests',
                }
            )
          );
        }}
        style={{
          width: '100%',
          border: 0,
          background: 'transparent',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--primary-subtle)',
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            flexShrink: 0,
          }}
        >
          ↔
        </span>

        <span style={{ flex: 1 }}>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem',
              fontWeight: 750,
              color: 'var(--text-main)',
            }}
          >
            Membership Change Requests
          </span>

          <span
            style={{
              display: 'block',
              marginTop: '3px',
              color: 'var(--text-muted)',
              fontSize: '0.76rem',
            }}
          >
            Review and process member membership-type change requests.
          </span>
        </span>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-muted)',
            fontSize: '0.76rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          <span>View requests</span>
          <span
            style={{
              fontSize: '18px',
              transform: sectionOpen
                ? 'rotate(180deg)'
                : 'rotate(0deg)',
              transition:
                'transform 0.2s ease',
            }}
          >
            ⌄
          </span>
        </span>
      </button>

      {sectionOpen && (
        <div className="animate-fade-in">
          <div
            style={{
              padding: '0 20px 20px',
            }}
          >
            <div className="section-header">
              <div>
                <h3 className="section-title">
                  Membership Type Change Requests
                </h3>

                <p
                  style={{
                    margin: '0.35rem 0 0',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                  }}
                >
                  Review and process membership type change requests
                  submitted by members.
                </p>
              </div>
            </div>

      {/* SUCCESS */}
      {success && (
        <div
          className="alert alert-success"
          style={{ marginBottom: '1rem' }}
        >
          {success}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div
          className="alert alert-danger"
          style={{ marginBottom: '1rem' }}
        >
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--text-secondary)',
          }}
        >
          Loading membership type requests...
        </div>
      ) : requests.length === 0 ? (
        <div
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
            textAlign: 'center',
          }}
        >
          No membership type change requests available.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Current Type</th>
                <th>Requested Type</th>
                <th>Reason</th>
                <th>Requested At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  {/* MEMBER */}
                  <td>
                    <strong>{request.memberName}</strong>

                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        marginTop: '0.2rem',
                      }}
                    >
                      {request.memberCode}
                    </div>

                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {request.memberEmail}
                    </div>
                  </td>

                  {/* CURRENT TYPE */}
                  <td>
                    <span className="badge badge-info">
                      {request.currentMembershipType}
                    </span>
                  </td>

                  {/* REQUESTED TYPE */}
                  <td>
                    <span className="badge badge-warning">
                      {request.requestedMembershipType}
                    </span>
                  </td>

                  {/* REASON */}
                  <td>{request.reason || '—'}</td>

                  {/* DATE */}
                  <td>
                    {request.requestedAt
                      ? new Date(
                          request.requestedAt
                        ).toLocaleString()
                      : '—'}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`badge ${
                        request.status === 'APPROVED'
                          ? 'badge-success'
                          : request.status === 'REJECTED'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td>
                    {request.status === 'PENDING' ? (
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={() =>
                            handleApprove(request.id)
                          }
                          disabled={
                            processingId === request.id
                          }
                        >
                          {processingId === request.id
                            ? 'Processing...'
                            : '✓ Approve'}
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleReject(request.id)
                          }
                          disabled={
                            processingId === request.id
                          }
                        >
                          {processingId === request.id
                            ? 'Processing...'
                            : '✕ Reject'}
                        </button>
                      </div>
                    ) : (
                      <span
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.8rem',
                        }}
                      >
                        Processed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
          </div>
        </div>
      )}
    </div>
  );
}