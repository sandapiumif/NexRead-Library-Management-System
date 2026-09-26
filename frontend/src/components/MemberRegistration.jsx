import React, { useMemo, useState } from 'react';
import { UsersIcon } from './Icons';

export default function MemberRegistration({
  members,
  onRegisterMember,
  onUpdateMemberStatus,
  onDeleteMember,
  onApproveMember,
  onRejectMember,
  onVerifyMemberDocument,
  onRejectMemberDocument,
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    idNumber: '',
    membershipType: 'STUDENT'
  });

  const [verificationDocument, setVerificationDocument] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

    // ==============================
    // MEMBERS DIRECTORY
    // ==============================

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [verificationFilter, setVerificationFilter] = useState('ALL');

    const [selectedMember, setSelectedMember] = useState(null);

    const filteredMembers = useMemo(() => {
      const search = searchTerm.trim().toLowerCase();

      return members.filter((member) => {
        const matchesSearch =
          !search ||
          member.memberCode?.toLowerCase().includes(search) ||
          member.fullName?.toLowerCase().includes(search) ||
          member.email?.toLowerCase().includes(search) ||
          member.idNumber?.toLowerCase().includes(search);

        const matchesStatus =
          statusFilter === 'ALL' ||
          member.status === statusFilter;

        const matchesType =
          typeFilter === 'ALL' ||
          member.membershipType === typeFilter;

        const matchesVerification =
          verificationFilter === 'ALL' ||
          (member.verificationStatus || 'PENDING') === verificationFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesType &&
          matchesVerification
        );
      });
    }, [
      members,
      searchTerm,
      statusFilter,
      typeFilter,
      verificationFilter,
    ]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setErrorMsg('');
  };

  // ==============================
  // MEMBER REGISTRATION
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.idNumber.trim()
    ) {
      setErrorMsg(
        'Please fill in all mandatory registration fields.'
      );
      return;
    }

    if (!verificationDocument) {
      setErrorMsg(
        'Please upload a verification document.'
      );
      return;
    }

    if (verificationDocument.size > 5 * 1024 * 1024) {
      setErrorMsg(
        'Verification document must not exceed 5 MB.'
      );
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Step 1: Register the member
      const registeredMember =
        await onRegisterMember(formData);

      // Step 2: Upload verification document
      if (registeredMember?.id) {
        const documentData = new FormData();

        documentData.append(
          'file',
          verificationDocument
        );

        const response = await fetch(
          `http://localhost:8080/api/members/${registeredMember.id}/verification-document`,
          {
            method: 'POST',
            body: documentData,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
            'Failed to upload verification document.'
          );
        }
      }

      setSuccessMsg(
        'Registration submitted successfully! Your verification document is pending review and your membership is awaiting admin approval.'
      );

      setFormData({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        idNumber: '',
        membershipType: 'STUDENT',
      });

      setVerificationDocument(null);

      // Reset file input
      const fileInput =
        document.getElementById(
          'verification-document'
        );

      if (fileInput) {
        fileInput.value = '';
      }

      setTimeout(
        () => setSuccessMsg(''),
        5000
      );

    } catch (err) {
      setErrorMsg(
        err.message ||
        'Failed to register member.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // MEMBERSHIP ACTION MESSAGES
  // ==============================

  const handleApprove = async (id) => {
    try {
      await onApproveMember(id);

      setErrorMsg('');
      setSuccessMsg(
        'Membership approved successfully! The member can now access library services.'
      );

      setTimeout(
        () => setSuccessMsg(''),
        4000
      );

    } catch (err) {
      setSuccessMsg('');
      setErrorMsg(
        err.message ||
        'Failed to approve membership.'
      );
    }
  };

  const handleReject = async (id) => {
    const rejectionReason = window.prompt(
      'Please enter the reason for rejecting this membership application:'
    );

    if (rejectionReason === null) {
      return;
    }

    const trimmedReason = rejectionReason.trim();

    if (!trimmedReason) {
      window.alert(
        'A rejection reason is required. The membership application was not rejected.'
      );
      return;
    }

    try {
      await onRejectMember(id, trimmedReason);

      setErrorMsg('');
      setSuccessMsg(
        'Membership application rejected successfully.'
      );

      setTimeout(
        () => setSuccessMsg(''),
        4000
      );

    } catch (err) {
      setSuccessMsg('');
      setErrorMsg(
        err.message ||
        'Failed to reject membership.'
      );
    }
  };

// ==============================
// VERIFICATION DOCUMENT ACTIONS
// ==============================

const handleVerifyDocument = async (id) => {
  try {
    await onVerifyMemberDocument(id);

    setErrorMsg('');
    setSuccessMsg(
      'Verification document verified successfully. The membership can now be approved.'
    );

    setTimeout(
      () => setSuccessMsg(''),
      4000
    );

  } catch (err) {
    setSuccessMsg('');
    setErrorMsg(
      err.message ||
      'Failed to verify verification document.'
    );
  }
};


const handleRejectDocument = async (id) => {
  const rejectionReason = window.prompt(
    'Please enter the reason for rejecting this verification document:'
  );

  if (rejectionReason === null) {
    return;
  }

  const trimmedReason = rejectionReason.trim();

  if (!trimmedReason) {
    window.alert(
      'A rejection reason is required. The verification document was not rejected.'
    );
    return;
  }

  try {
    await onRejectMemberDocument(
      id,
      trimmedReason
    );

    setErrorMsg('');
    setSuccessMsg(
      'Verification document rejected successfully.'
    );

    setTimeout(
      () => setSuccessMsg(''),
      4000
    );

  } catch (err) {
    setSuccessMsg('');
    setErrorMsg(
      err.message ||
      'Failed to reject verification document.'
    );
  }
};

  const handleStatusChange = async (id, status) => {
    try {
      await onUpdateMemberStatus(id, status);

      setErrorMsg('');

      if (status === 'SUSPENDED') {
        setSuccessMsg(
          'Member account suspended successfully. The member cannot borrow or reserve books while suspended.'
        );
      } else if (status === 'ACTIVE') {
        setSuccessMsg(
          'Member account reactivated successfully. Library services are available again.'
        );
      }

      setTimeout(
        () => setSuccessMsg(''),
        4000
      );

    } catch (err) {
      setSuccessMsg('');
      setErrorMsg(
        err.message ||
        'Failed to update member status.'
      );
    }
  };

  return (
    <div className="animate-fade-in">

      <div className="section-header">
        <div>
          <h2 className="section-title">
            <span>
              Membership Lifecycle Management
            </span>
          </h2>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.88rem'
            }}
          >
            Patron Registration, Institutional Validation & Account Status Administration
          </p>
        </div>
      </div>

      {/* Registration Layout: Form on Left, Live ID Card Preview on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}
      >

        {/* Registration Form */}
        <div className="card">

          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.2rem',
              marginBottom: '1.25rem'
            }}
          >
            Register New Library Member
          </h3>

          {errorMsg && (
            <div className="alert alert-danger">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label className="form-label">
                Full Name *
              </label>

              <input
                id="reg-fullname"
                type="text"
                name="fullName"
                className="form-input"
                placeholder="e.g. Fernando T.I.S."
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">

              <div className="form-group">
                <label className="form-label">
                  Email Address *
                </label>

                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="student@library.org"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Phone Number *
                </label>

                <input
                  id="reg-phone"
                  type="text"
                  name="phone"
                  className="form-input"
                  placeholder="0771234567"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="form-row">

              <div className="form-group">
                <label className="form-label">
                  National ID / Passport No *
                </label>

                <input
                  id="reg-idnumber"
                  type="text"
                  name="idNumber"
                  className="form-input"
                  placeholder="200115001234"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Verification Document *
                </label>

                <input
                  id="verification-document"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file =
                      e.target.files?.[0] || null;

                    setVerificationDocument(file);
                    setErrorMsg('');
                  }}
                  required
                />

                <small>
                  Upload a valid ID / Passport document.
                  PDF, JPG or PNG only. Maximum 5 MB.
                </small>

                {verificationDocument && (
                  <small
                    style={{
                      display: 'block',
                      marginTop: '0.4rem',
                      color: 'var(--success)',
                      fontWeight: 600
                    }}
                  >
                    ✓ Selected:{' '}
                    {verificationDocument.name}
                  </small>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Membership Category
                </label>

                <select
                  id="reg-type"
                  name="membershipType"
                  className="form-select"
                  value={formData.membershipType}
                  onChange={handleChange}
                >
                  <option value="STUDENT">
                    Student (3 Book Limit)
                  </option>

                  <option value="FACULTY">
                    Staff (6 Book Limit)
                  </option>

                  <option value="GENERAL">
                    Public (2 Book Limit)
                  </option>
                </select>
              </div>

            </div>

            <div className="form-group">
              <label className="form-label">
                Residential Address
              </label>

              <input
                id="reg-address"
                type="text"
                name="address"
                className="form-input"
                placeholder="Colombo 07, Sri Lanka"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <button
              id="submit-member-btn"
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                marginTop: '0.5rem'
              }}
              disabled={loading}
            >
              {loading
                ? 'Validating & Registering...'
                : 'Complete Member Registration'}
            </button>

          </form>
        </div>

        {/* Live Digital Membership Card Preview */}
        <div>

          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.2rem',
              marginBottom: '1.25rem'
            }}
          >
            Live Digital Member Pass
          </h3>

          <div className="member-id-card">

            <div className="id-card-pattern" />

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '2rem'
              }}
            >

              <div>

                <div
                  style={{
                    fontSize: '0.72rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    opacity: 0.8
                  }}
                >
                  NexRead Learning Commons
                </div>

                <div
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 800
                  }}
                >
                  MEMBER PASS
                </div>

              </div>

              <span
                style={{
                  background:
                    'rgba(255,255,255,0.2)',
                  padding: '0.25rem 0.65rem',
                  borderRadius:
                    'var(--radius-full)',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}
              >
                {formData.membershipType}
              </span>

            </div>

            <div
              style={{
                marginBottom: '1.75rem'
              }}
            >

              <div
                style={{
                  fontSize: '0.75rem',
                  opacity: 0.7
                }}
              >
                NAME
              </div>

              <div
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 700
                }}
              >
                {formData.fullName ||
                  'Student Name Here'}
              </div>

            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.82rem',
                borderTop:
                  '1px solid rgba(255,255,255,0.2)',
                paddingTop: '1rem'
              }}
            >

              <div>

                <div
                  style={{
                    opacity: 0.7,
                    fontSize: '0.7rem'
                  }}
                >
                  NIC / PASSPORT
                </div>

                <div>
                  {formData.idNumber ||
                    '— — — — — —'}
                </div>

              </div>

              <div>

                <div
                  style={{
                    opacity: 0.7,
                    fontSize: '0.7rem'
                  }}
                >
                  MAX LOAN QUOTA
                </div>

                <div>
                  {formData.membershipType ===
                  'FACULTY'
                    ? '6 Books'
                    : '3 Books'}
                </div>

              </div>

              <div>

                <div
                  style={{
                    opacity: 0.7,
                    fontSize: '0.7rem'
                  }}
                >
                  STATUS
                </div>

                <div
                  style={{
                    color: '#34D399',
                    fontWeight: 700
                  }}
                >
                  PREVIEW ACTIVE
                </div>

              </div>

            </div>

          </div>

          <div
            className="card"
            style={{
              marginTop: '1.25rem',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)'
            }}
          >

            <div
              style={{
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '0.35rem'
              }}
            >
              Membership Policy & Business Rules
            </div>

            <ul
              style={{
                paddingLeft: '1.25rem',
                lineHeight: '1.7'
              }}
            >
              <li>
                Unique <code>MEM-XXXX</code> member barcode automatically issued upon creation.
              </li>

              <li>
                Standard 1-year annual membership validity period applied.
              </li>

              <li>
                Undergraduates: Max 3 books, Faculty: Max 6 books simultaneously.
              </li>

              <li>
                Suspension applied automatically if overdue fines remain unsettled.
              </li>

              <li>
                Verification document must be reviewed before membership approval.
              </li>
            </ul>

          </div>

        </div>
      </div>

      {/* Existing Members Table */}
      <div
        className="section-header"
        style={{
          alignItems: 'flex-start',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <h3 className="section-title">
          <UsersIcon
            size={18}
            color="var(--accent-primary)"
          />

          <span>
            Registered Members Directory ({filteredMembers.length})
          </span>
        </h3>

        <span
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
          }}
        >
          Showing {filteredMembers.length} of {members.length} members
        </span>
      </div>

      {/* ==============================
          SEARCH & FILTERS
      ================================ */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'minmax(240px, 2fr) repeat(3, minmax(150px, 1fr)) auto',
          gap: '0.75rem',
          marginBottom: '1.25rem',
          alignItems: 'end',
        }}
      >
        {/* Search */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">
            Search Members
          </label>

          <input
            type="text"
            className="form-input"
            placeholder="Search name, code, email or NIC..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        {/* Status */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">
            Status
          </label>

          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="REJECTED">Rejected</option>
            <option value="INACTIVE">Inactive</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>

        {/* Membership Type */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">
            Membership Type
          </label>

          <select
            className="form-select"
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
          >
            <option value="ALL">All Types</option>
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Staff</option>
            <option value="GENERAL">Public</option>
          </select>
        </div>

        {/* Verification */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">
            Verification
          </label>

          <select
            className="form-select"
            value={verificationFilter}
            onChange={(e) =>
              setVerificationFilter(e.target.value)
            }
          >
            <option value="ALL">
              All Verification
            </option>
            <option value="VERIFIED">
              Verified
            </option>
            <option value="PENDING">
              Pending
            </option>
            <option value="REJECTED">
              Rejected
            </option>
          </select>
        </div>

        {/* Clear */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('ALL');
            setTypeFilter('ALL');
            setVerificationFilter('ALL');
          }}
        >
          Clear
        </button>
      </div>

        <div className="table-responsive">

          <table className="custom-table">

            <thead>
              <tr>
                <th>Member Code</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>NIC / ID</th>
                <th>Type</th>
                <th>Borrow Limit</th>
                <th>Verification</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredMembers.length === 0 ? (

                <tr>
                  <td colSpan="9"
                    style={{
                      textAlign: 'center',
                      padding: '2rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    No members found matching the selected
                    search and filters.
                  </td>
                </tr>

              ) : (

                filteredMembers.map((m) => (

                <tr key={m.id}>

                  <td>
                    <strong>
                      {m.memberCode}
                    </strong>
                  </td>

                  <td>
                    {m.fullName}
                  </td>

                  <td>
                    {m.email}
                  </td>

                  <td>
                    {m.idNumber}
                  </td>

                  <td>
                    <span className="badge badge-info">
                      {m.membershipType}
                    </span>
                  </td>

                  <td>
                    {m.maxBorrowLimit} Books
                  </td>

                  <td>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem'
                      }}
                    >

                      <span
                        className={`badge ${
                          m.verificationStatus === 'VERIFIED'
                            ? 'badge-success'
                            : m.verificationStatus === 'REJECTED'
                              ? 'badge-danger'
                              : 'badge-warning'
                        }`}
                      >
                        {m.verificationStatus || 'PENDING'}
                      </span>

                      {m.verificationDocument && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() =>
                            window.open(
                              `http://localhost:8080/api/members/${m.id}/verification-document`,
                              '_blank'
                            )
                          }
                        >
                          View Document
                        </button>
                      )}

                    </div>

                  </td>

                  <td>

                    <span
                      className={`badge ${
                        m.status === 'ACTIVE'
                          ? 'badge-success'
                          : m.status === 'PENDING'
                            ? 'badge-warning'
                            : m.status === 'SUSPENDED'
                              ? 'badge-danger'
                              : 'badge-danger'
                      }`}
                    >
                      {m.status}
                    </span>

                  </td>

                  <td>

                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedMember(m)}
                        style={{
                          marginBottom: '0.4rem',
                        }}
                      >
                        View Details
                      </button>

                    {m.status === 'PENDING' ? (

                      <div
                        style={{
                          display: 'flex',
                          gap: '0.35rem',
                          flexWrap: 'wrap'
                        }}
                      >

                      {m.verificationStatus === 'PENDING' &&
                        m.verificationDocument && (
                          <>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() =>
                                handleVerifyDocument(m.id)
                              }
                            >
                              Verify
                            </button>

                            <button
                              className="btn btn-secondary btn-sm"
                              style={{
                                color: 'var(--danger)',
                                borderColor: 'var(--danger)'
                              }}
                              onClick={() => {
                                if (
                                  window.confirm(
                                    'Reject this verification document?'
                                  )
                                ) {
                                  handleRejectDocument(m.id);
                                }
                              }}
                            >
                              Reject Document
                            </button>
                          </>
                      )}

                        <button
                          id={`approve-btn-${m.id}`}
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            handleApprove(m.id)
                          }
                        >
                          Approve
                        </button>

                        <button
                          id={`reject-btn-${m.id}`}
                          className="btn btn-secondary btn-sm"
                          style={{
                            color: 'var(--danger)',
                            borderColor:
                              'var(--danger)'
                          }}
                          onClick={() => {
                            if (
                              window.confirm(
                                'Reject this membership application?'
                              )
                            ) {
                              handleReject(m.id);
                            }
                          }}
                        >
                          Reject
                        </button>

                      </div>

                    ) : m.status === 'ACTIVE' ? (

                      <button
                        id={`suspend-btn-${m.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{
                          color: 'var(--danger)',
                          borderColor:
                            'var(--danger)'
                        }}
                        onClick={() =>
                          handleStatusChange(
                            m.id,
                            'SUSPENDED'
                          )
                        }
                      >
                        Suspend
                      </button>

                    ) : m.status === 'SUSPENDED' ? (

                      <button
                        id={`activate-btn-${m.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{
                          color: 'var(--success)',
                          borderColor:
                            'var(--success)'
                        }}
                        onClick={() =>
                          handleStatusChange(
                            m.id,
                            'ACTIVE'
                          )
                        }
                      >
                        Reactivate
                      </button>

                    ) : m.status === 'REJECTED' ? (

                      <span
                        style={{
                          color:
                            'var(--text-secondary)',
                          fontSize: '0.8rem'
                        }}
                      >
                        Application Rejected
                      </span>

                    ) : (

                      <span
                        style={{
                          color:
                            'var(--text-secondary)',
                          fontSize: '0.8rem'
                        }}
                      >
                        Deactivated
                      </span>

                    )}

                  </td>

                </tr>

              ))
          )}

            </tbody>
          </table>
        </div>

        {/* ==============================
            MEMBER DETAILS MODAL
        ============================== */}

        {selectedMember && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1rem',
            }}
            onClick={() => setSelectedMember(null)}
          >
            <div
              className="card"
              style={{
                width: '100%',
                maxWidth: '760px',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >

              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  gap: '1rem',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      marginBottom: '0.3rem',
                    }}
                  >
                    Member Details
                  </h3>

                  <span
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.85rem',
                    }}
                  >
                    {selectedMember.memberCode}
                  </span>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedMember(null)}
                >
                  ✕ Close
                </button>
              </div>

              {/* Personal Information */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.8rem' }}>
                  👤 Personal Information
                </h4>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <small>Name</small>
                    <div>{selectedMember.fullName || '—'}</div>
                  </div>

                  <div>
                    <small>Email</small>
                    <div>{selectedMember.email || '—'}</div>
                  </div>

                  <div>
                    <small>Phone</small>
                    <div>{selectedMember.phone || '—'}</div>
                  </div>

                  <div>
                    <small>NIC / ID</small>
                    <div>{selectedMember.idNumber || '—'}</div>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <small>Address</small>
                    <div>{selectedMember.address || '—'}</div>
                  </div>
                </div>
              </div>

              {/* Membership Information */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.8rem' }}>
                  📚 Membership Information
                </h4>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <small>Member Code</small>
                    <div>{selectedMember.memberCode || '—'}</div>
                  </div>

                  <div>
                    <small>Membership Type</small>
                    <div>{selectedMember.membershipType || '—'}</div>
                  </div>

                  <div>
                    <small>Borrow Limit</small>
                    <div>
                      {selectedMember.maxBorrowLimit ?? '—'} Books
                    </div>
                  </div>

                  <div>
                    <small>Join Date</small>
                    <div>{selectedMember.joinDate || '—'}</div>
                  </div>

                  <div>
                    <small>Expiry Date</small>
                    <div>{selectedMember.expiryDate || '—'}</div>
                  </div>

                  <div>
                    <small>Status</small>

                    <div style={{ marginTop: '0.2rem' }}>
                      <span
                        className={`badge ${
                          selectedMember.status === 'ACTIVE'
                            ? 'badge-success'
                            : selectedMember.status === 'PENDING'
                              ? 'badge-warning'
                              : 'badge-danger'
                        }`}
                      >
                        {selectedMember.status || 'UNKNOWN'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.8rem' }}>
                  📄 Verification
                </h4>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    className={`badge ${
                      selectedMember.verificationStatus === 'VERIFIED'
                        ? 'badge-success'
                        : selectedMember.verificationStatus === 'REJECTED'
                          ? 'badge-danger'
                          : 'badge-warning'
                    }`}
                  >
                    {selectedMember.verificationStatus || 'PENDING'}
                  </span>

                  {selectedMember.verificationDocument && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() =>
                        window.open(
                          `http://localhost:8080/api/members/${selectedMember.id}/verification-document`,
                          '_blank'
                        )
                      }
                    >
                      View Verification Document
                    </button>
                  )}
                </div>

                {selectedMember.verificationDocumentName && (
                  <small
                    style={{
                      display: 'block',
                      marginTop: '0.5rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    File: {selectedMember.verificationDocumentName}
                  </small>
                )}
              </div>

              {/* Quick Actions */}
              <div>
                <h4 style={{ marginBottom: '0.8rem' }}>
                  ⚙️ Account Actions
                </h4>

                <div
                  style={{
                    display: 'flex',
                    gap: '0.6rem',
                    flexWrap: 'wrap',
                  }}
                >
                  {selectedMember.status === 'ACTIVE' && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{
                        color: 'var(--danger)',
                        borderColor: 'var(--danger)',
                      }}
                      onClick={async () => {
                        await handleStatusChange(
                          selectedMember.id,
                          'SUSPENDED'
                        );

                        setSelectedMember(null);
                      }}
                    >
                      Suspend Member
                    </button>
                  )}

                  {selectedMember.status === 'SUSPENDED' && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{
                        color: 'var(--success)',
                        borderColor: 'var(--success)',
                      }}
                      onClick={async () => {
                        await handleStatusChange(
                          selectedMember.id,
                          'ACTIVE'
                        );

                        setSelectedMember(null);
                      }}
                    >
                      Reactivate Member
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

    </div>
  );
}