import React, { useEffect, useRef, useState } from 'react';

const API_BASE = 'http://localhost:8080/api';

function MemberProfile({ activeMember, onProfileUpdated }) {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageVersion, setImageVersion] = useState(Date.now());
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [renewalHistory, setRenewalHistory] = useState([]);
  const [renewing, setRenewing] = useState(false);
  const [membershipTypeRequests, setMembershipTypeRequests] = useState([]);
  const [membershipTypes, setMembershipTypes] = useState([]);
  const [membershipPayments, setMembershipPayments] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('ONLINE_CARD');
  const [creatingPayment, setCreatingPayment] = useState(false);
  const [payingMembership, setPayingMembership] = useState(false);
  const [activeMembershipPayment, setActiveMembershipPayment] = useState(null);
  const [requestedMembershipType, setRequestedMembershipType] = useState('');
  const [membershipTypeReason, setMembershipTypeReason] = useState('');
  const [requestingMembershipType, setRequestingMembershipType] = useState(false);

  const fileInputRef = useRef(null);

    // ==============================
    // LOAD MEMBER PROFILE
    // ==============================

    useEffect(() => {
      if (!activeMember?.id) {
        setLoading(false);
        return;
      }

      fetchProfile();
      fetchRenewalHistory();
      fetchMembershipTypeRequests();
      fetchMembershipTypes();
      fetchMembershipPayments();
    }, [activeMember]);


    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(
          `${API_BASE}/member-profile/${activeMember.id}`
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error || 'Failed to load member profile.'
          );
        }

        setProfile(data);

        setFormData({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  const fetchMembershipTypeRequests = async () => {
    if (!activeMember?.id) return;

    try {
      const res = await fetch(
        `${API_BASE}/members/${activeMember.id}/membership-type-change-requests`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'Failed to load membership type requests.'
        );
      }

      setMembershipTypeRequests(
        Array.isArray(data) ? data : []
      );

    } catch (err) {
      console.error(
        'Failed to load membership type requests:',
        err
      );

      setMembershipTypeRequests([]);
    }
  };

const handleMembershipTypeChangeRequest = async () => {
  if (!requestedMembershipType) {
    setError('Please select a membership type.');
    return;
  }

  const confirmed = window.confirm(
    `Are you sure you want to request a change to ${requestedMembershipType}?`
  );

  if (!confirmed) return;

  try {
    setRequestingMembershipType(true);
    setError('');
    setSuccess('');

    const res = await fetch(
      `${API_BASE}/members/${activeMember.id}/membership-type-change-request`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestedMembershipType,
          reason: membershipTypeReason,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.error ||
        'Failed to submit membership type change request.'
      );
    }

    setSuccess(
      'Membership type change request submitted successfully.'
    );

    setRequestedMembershipType('');
    setMembershipTypeReason('');

    await fetchMembershipTypeRequests();

  } catch (err) {
    setError(err.message);

  } finally {
    setRequestingMembershipType(false);
  }
};


    // ==============================
    // MEMBERSHIP RENEWAL
    // ==============================

    const fetchRenewalHistory = async () => {
      if (!activeMember?.id) return;

      try {
        const res = await fetch(
          `${API_BASE}/members/${activeMember.id}/renewal-history`
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error || 'Failed to load renewal history.'
          );
        }

        setRenewalHistory(
          Array.isArray(data) ? data : []
        );

      } catch (err) {
        console.error(
          'Failed to load renewal history:',
          err
        );

        setRenewalHistory([]);
      }
    };

    const fetchMembershipTypes = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/membership-types`
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error ||
              'Failed to load membership types.'
          );
        }

        setMembershipTypes(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.error(
          'Failed to load membership types:',
          err
        );
        setMembershipTypes([]);
      }
    };

    const fetchMembershipPayments = async () => {
      if (!activeMember?.id) return;

      try {
        const res = await fetch(
          `${API_BASE}/membership-payments/member/${activeMember.id}`
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error ||
              'Failed to load membership payments.'
          );
        }

        setMembershipPayments(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.error(
          'Failed to load membership payments:',
          err
        );

        setMembershipPayments([]);
      }
    };

    const getMembershipFee = () => {
      if (!profile?.membershipType) {
        return 0;
      }

      const membershipType =
        membershipTypes.find(
          (type) =>
            type.typeName?.toUpperCase() ===
            profile.membershipType?.toUpperCase()
        );

      return Number(
        membershipType?.feeAmount || 0
      );
    };

    const handleCreateMembershipPayment = async () => {
      const amount = getMembershipFee();

      if (amount <= 0) {
        setError(
          'Membership fee has not been configured for your membership type.'
        );
        return;
      }

      try {
        setCreatingPayment(true);
        setError('');
        setSuccess('');

        const res = await fetch(
          `${API_BASE}/membership-payments`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              memberId: activeMember.id,
              amount: amount,
              paymentType: 'RENEWAL',
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error ||
              'Failed to create membership payment.'
          );
        }

        setActiveMembershipPayment(data);

        setSuccess(
          'Membership payment created successfully. Please complete the payment.'
        );

        await fetchMembershipPayments();
      } catch (err) {
        setError(err.message);
      } finally {
        setCreatingPayment(false);
      }
    };

    const handlePayMembershipFee = async () => {
      if (!activeMembershipPayment?.id) {
        setError(
          'Please create a membership payment first.'
        );
        return;
      }

      try {
        setPayingMembership(true);
        setError('');
        setSuccess('');

        const res = await fetch(
          `${API_BASE}/membership-payments/${activeMembershipPayment.id}/pay`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentMethod:
                selectedPaymentMethod,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error ||
              'Failed to process membership payment.'
          );
        }

        setActiveMembershipPayment(data);

        setSuccess(
          'Membership payment completed successfully.'
        );

        await fetchMembershipPayments();
      } catch (err) {
        setError(err.message);
      } finally {
        setPayingMembership(false);
      }
    };


    const handleRenewMembership = async () => {
      const confirmed = window.confirm(
        'Are you sure you want to renew your library membership for another 12 months?'
      );

      if (!confirmed) return;

      try {
        setRenewing(true);
        setError('');
        setSuccess('');

        const res = await fetch(
          `${API_BASE}/members/${activeMember.id}/renew`,
          {
            method: 'POST',
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error || 'Failed to renew membership.'
          );
        }

        setSuccess(
          'Membership renewed successfully for another 12 months.'
        );

        // Refresh profile with new expiry date
        await fetchProfile();

        // Refresh renewal history
        await fetchRenewalHistory();

      } catch (err) {
        setError(err.message);

      } finally {
        setRenewing(false);
      }
    };


    const isMembershipExpired = () => {
      if (!profile?.expiryDate) return false;

      const expiryDate = new Date(
        `${profile.expiryDate}T23:59:59`
      );

      return expiryDate < new Date();
    };

  // ==============================
  // FORM HANDLER
  // ==============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ==============================
  // UPDATE PROFILE
  // ==============================

  const handleSave = async () => {
    setError('');
    setSuccess('');

    if (!formData.fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email address is required.');
      return;
    }

    if (!formData.phone.trim()) {
      setError('Phone number is required.');
      return;
    }

    if (!formData.address.trim()) {
      setError('Address is required.');
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(
        `${API_BASE}/member-profile/${activeMember.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'Failed to update profile.'
        );
      }

      setProfile(data);

      setFormData({
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
      });

      setIsEditing(false);
      setSuccess('Profile updated successfully.');

      if (onProfileUpdated) {
        onProfileUpdated(data);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };


  // ==============================
  // CANCEL EDIT
  // ==============================

  const handleCancel = () => {
    if (!profile) return;

    setFormData({
      fullName: profile.fullName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      address: profile.address || '',
    });

    setError('');
    setSuccess('');
    setIsEditing(false);
  };

  // ==============================
  // PROFILE IMAGE
  // ==============================

  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError('');
    setSuccess('');

    // Frontend validation
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG, and WEBP images are allowed.');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Profile image must be smaller than 5 MB.');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();

      formData.append('file', file);

      const res = await fetch(
        `${API_BASE}/member-profile/${activeMember.id}/profile-image`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'Failed to upload profile image.'
        );
      }

      setProfile(data);

      // Force browser to load the new image
      setImageVersion(Date.now());

      setSuccess('Profile picture updated successfully.');

    } catch (err) {
      setError(err.message);

    } finally {
      setUploadingImage(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };


  const handleRemoveProfileImage = async () => {

    if (!profile?.profileImage) {
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to remove your profile picture?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setUploadingImage(true);
      setError('');
      setSuccess('');

      const res = await fetch(
        `${API_BASE}/member-profile/${activeMember.id}/profile-image`,
        {
          method: 'DELETE',
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'Failed to remove profile image.'
        );
      }

      setProfile((prev) => ({
        ...prev,
        profileImage: null,
      }));

      setImageVersion(Date.now());

      setSuccess('Profile picture removed successfully.');

    } catch (err) {
      setError(err.message);

    } finally {
      setUploadingImage(false);
    }
  };


  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="member-profile-page">
        <div className="profile-loading">
          Loading profile...
        </div>
      </div>
    );
  }


  // ==============================
  // NO MEMBER
  // ==============================

  if (!activeMember) {
    return (
      <div className="member-profile-page">
        <div className="profile-empty">
          <h2>No Member Selected</h2>
          <p>Please log in as a member to view your profile.</p>
        </div>
      </div>
    );
  }


  // ==============================
  // ERROR / NO PROFILE
  // ==============================

  if (!profile) {
    return (
      <div className="member-profile-page">
        <div className="profile-empty">
          <h2>Unable to Load Profile</h2>

          {error && (
            <p className="profile-error">
              {error}
            </p>
          )}

          <button
            className="profile-primary-btn"
            onClick={fetchProfile}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }




  // ==============================
  // PROFILE PAGE
  // ==============================

  return (
    <div className="member-profile-page">

      {/* PAGE HEADER */}
      <div className="profile-page-header">
        <div>
          <h1>My Profile</h1>
          <p>
            Manage your personal information and membership details.
          </p>
        </div>

        {!isEditing && (
          <button
            className="profile-primary-btn"
            onClick={() => {
              setError('');
              setSuccess('');
              setIsEditing(true);
            }}
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>


      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="profile-success">
          ✓ {success}
        </div>
      )}


      {/* ERROR MESSAGE */}
      {error && (
        <div className="profile-error-box">
          ⚠ {error}
        </div>
      )}


      {/* PROFILE MAIN CARD */}
      <div className="profile-main-card">

        {/* PROFILE HEADER */}
        <div className="profile-cover">

          <div className="profile-avatar-wrapper">

            <div className="profile-avatar">
              {profile.profileImage ? (
                <img
                  src={`${API_BASE}/member-profile/${activeMember.id}/profile-image?v=${imageVersion}`}
                  alt={profile.fullName}
                  onClick={() => setShowPhotoViewer(true)}
                  style={{ cursor: 'zoom-in' }}
                />
              ) : (
                <span>
                  {profile.fullName
                    ?.charAt(0)
                    ?.toUpperCase() || 'M'}
                </span>
              )}

              {uploadingImage && (
                <div className="profile-avatar-loading">
                  Uploading...
                </div>
              )}

            </div>

            <div className="profile-photo-actions">

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleProfileImageChange}
                style={{ display: 'none' }}
              />

              <button
                type="button"
                className="profile-photo-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
              >
                📷 {profile.profileImage ? 'Change Photo' : 'Add Photo'}
              </button>

              {profile.profileImage && (
                <button
                  type="button"
                  className="profile-photo-remove-btn"
                  onClick={handleRemoveProfileImage}
                  disabled={uploadingImage}
                >
                  🗑 Remove
                </button>
              )}

            </div>

          </div>

          <div className="profile-header-info">

            <h2>
              {profile.fullName}
            </h2>

            <p>
              {profile.email}
            </p>

            <div className="profile-badges">

              <span className="profile-member-code">
                {profile.memberCode}
              </span>

              <span
                className={`profile-status ${
                  profile.status?.toLowerCase()
                }`}
              >
                {profile.status}
              </span>

            </div>

          </div>

          {/* EDIT PROFILE BUTTON */}
          {!isEditing && (
            <button
              className="profile-edit-btn"
              onClick={() => {
                setError('');
                setSuccess('');
                setIsEditing(true);
              }}
            >
              ✏️ Edit Profile
            </button>
          )}

        </div>


        {/* PERSONAL INFORMATION */}
        <div className="profile-section">

          <div className="profile-section-header">
            <div>
              <h3>Personal Information</h3>
              <p>
                Your basic contact information.
              </p>
            </div>
          </div>


          <div className="profile-form-grid">

            {/* FULL NAME */}
            <div className="profile-field">

              <label>Full Name</label>

              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="profile-value">
                  {profile.fullName || '—'}
                </div>
              )}

            </div>


            {/* EMAIL */}
            <div className="profile-field">

              <label>Email Address</label>

              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              ) : (
                <div className="profile-value">
                  {profile.email || '—'}
                </div>
              )}

            </div>


            {/* PHONE */}
            <div className="profile-field">

              <label>Phone Number</label>

              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="profile-value">
                  {profile.phone || '—'}
                </div>
              )}

            </div>


            {/* ADDRESS */}
            <div className="profile-field profile-field-full">

              <label>Residential Address</label>

              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your residential address"
                  rows="3"
                />
              ) : (
                <div className="profile-value">
                  {profile.address || '—'}
                </div>
              )}

            </div>

          </div>

        </div>


               {/* MEMBERSHIP INFORMATION */}
               <div className="profile-section">

                 <div className="profile-section-header">
                   <div>
                     <h3>Membership Information</h3>
                     <p>
                       Your library membership details.
                     </p>
                   </div>

                   {isMembershipExpired() && (
                     <button
                       type="button"
                       className="profile-primary-btn"
                       onClick={handleRenewMembership}
                       disabled={renewing}
                     >
                       {renewing
                         ? 'Renewing...'
                         : '🔄 Renew Membership'}
                     </button>
                   )}
                 </div>


                 <div className="profile-info-grid">

                   <div className="profile-info-item">
                     <span>Member Code</span>
                     <strong>
                       {profile.memberCode || '—'}
                     </strong>
                   </div>


                   <div className="profile-info-item">
                     <span>National ID / Student ID</span>
                     <strong>
                       {profile.idNumber || '—'}
                     </strong>
                   </div>


                   <div className="profile-info-item">
                     <span>Membership Type</span>
                     <strong>
                       {profile.membershipType || '—'}
                     </strong>
                   </div>


                   <div className="profile-info-item">
                     <span>Maximum Borrow Limit</span>
                     <strong>
                       {profile.maxBorrowLimit ?? '—'} books
                     </strong>
                   </div>


                   <div className="profile-info-item">
                     <span>Join Date</span>
                     <strong>
                       {profile.joinDate || '—'}
                     </strong>
                   </div>


                   <div className="profile-info-item">
                     <span>Membership Expiry</span>
                     <strong
                       style={{
                         color: isMembershipExpired()
                           ? 'var(--danger)'
                           : 'var(--text-primary)',
                       }}
                     >
                       {profile.expiryDate || '—'}

                       {isMembershipExpired() && (
                         <span
                           style={{
                             display: 'block',
                             fontSize: '0.75rem',
                             color: 'var(--danger)',
                             marginTop: '0.25rem',
                           }}
                         >
                           Membership Expired
                         </span>
                       )}
                     </strong>
                   </div>

                 </div>

                 {/* MEMBERSHIP PAYMENT */}

                 <div
                   style={{
                     marginTop: '2rem',
                     paddingTop: '1.5rem',
                     borderTop: '1px solid var(--border-color)',
                   }}
                 >
                   <div style={{ marginBottom: '1rem' }}>
                     <h4
                       style={{
                         margin: 0,
                         marginBottom: '0.25rem',
                       }}
                     >
                       💳 Membership Fee Payment
                     </h4>

                     <p
                       style={{
                         margin: 0,
                         color: 'var(--text-secondary)',
                         fontSize: '0.85rem',
                       }}
                     >
                       View your membership fee and complete your
                       renewal payment.
                     </p>
                   </div>

                   <div
                     style={{
                       display: 'grid',
                       gridTemplateColumns:
                         'repeat(auto-fit, minmax(180px, 1fr))',
                       gap: '1rem',
                       marginBottom: '1.25rem',
                     }}
                   >
                     <div className="profile-info-item">
                       <span>Membership Fee</span>

                       <strong>
                         LKR {getMembershipFee().toFixed(2)}
                       </strong>
                     </div>

                     <div className="profile-info-item">
                       <span>Payment Status</span>

                       <strong>
                         {activeMembershipPayment?.status ||
                           membershipPayments[0]?.status ||
                           'NOT PAID'}
                       </strong>
                     </div>
                   </div>

                   {/* Payment Form */}

                   {activeMembershipPayment?.status !== 'PAID' && (
                     <div
                       style={{
                         padding: '1.25rem',
                         border: '1px solid var(--border-color)',
                         borderRadius: 'var(--radius-md)',
                         background: 'var(--bg-secondary)',
                       }}
                     >
                       {!activeMembershipPayment ? (
                         <>
                           <div
                             style={{
                               marginBottom: '1rem',
                               color: 'var(--text-secondary)',
                               fontSize: '0.9rem',
                             }}
                           >
                             Membership renewal fee:
                             <strong
                               style={{
                                 marginLeft: '6px',
                                 color: 'var(--text-primary)',
                               }}
                             >
                               LKR {getMembershipFee().toFixed(2)}
                             </strong>
                           </div>

                           <button
                             type="button"
                             className="profile-primary-btn"
                             onClick={handleCreateMembershipPayment}
                             disabled={
                               creatingPayment ||
                               getMembershipFee() <= 0
                             }
                           >
                             {creatingPayment
                               ? 'Creating Payment...'
                               : '💳 Pay Membership Fee'}
                           </button>
                         </>
                       ) : (
                         <>
                           <div
                             style={{
                               marginBottom: '1rem',
                             }}
                           >
                             <strong>
                               Payment Code:
                             </strong>{' '}
                             {activeMembershipPayment.paymentCode}
                           </div>

                           <div
                             style={{
                               marginBottom: '1rem',
                               fontSize: '1.1rem',
                               fontWeight: 700,
                             }}
                           >
                             Amount: LKR{' '}
                             {Number(
                               activeMembershipPayment.amount || 0
                             ).toFixed(2)}
                           </div>

                           <div
                             className="profile-field"
                             style={{
                               marginBottom: '1rem',
                             }}
                           >
                             <label>
                               Payment Method
                             </label>

                             <select
                               value={selectedPaymentMethod}
                               onChange={(e) =>
                                 setSelectedPaymentMethod(
                                   e.target.value
                                 )
                               }
                               disabled={payingMembership}
                             >
                               <option value="ONLINE_CARD">
                                 Online Card
                               </option>

                               <option value="CASH">
                                 Cash
                               </option>

                               <option value="BANK_TRANSFER">
                                 Bank Transfer
                               </option>
                             </select>
                           </div>

                           <button
                             type="button"
                             className="profile-primary-btn"
                             onClick={handlePayMembershipFee}
                             disabled={payingMembership}
                           >
                             {payingMembership
                               ? 'Processing Payment...'
                               : '💳 Complete Payment'}
                           </button>
                         </>
                       )}
                     </div>
                   )}

                   {/* Successful Payment Details */}

                   {activeMembershipPayment?.status === 'PAID' && (
                     <div
                       style={{
                         padding: '1.25rem',
                         border: '1px solid var(--border-color)',
                         borderRadius: 'var(--radius-md)',
                         background: 'var(--bg-secondary)',
                       }}
                     >
                       <div
                         style={{
                           fontSize: '1rem',
                           fontWeight: 700,
                           marginBottom: '1rem',
                         }}
                       >
                         ✅ Membership Payment Successful
                       </div>

                       <div
                         style={{
                           display: 'grid',
                           gridTemplateColumns:
                             'repeat(auto-fit, minmax(180px, 1fr))',
                           gap: '1rem',
                         }}
                       >
                         <div>
                           <span
                             style={{
                               display: 'block',
                               fontSize: '0.75rem',
                               color: 'var(--text-secondary)',
                               marginBottom: '0.25rem',
                             }}
                           >
                             Payment Code
                           </span>

                           <strong>
                             {activeMembershipPayment.paymentCode ||
                               '—'}
                           </strong>
                         </div>

                         <div>
                           <span
                             style={{
                               display: 'block',
                               fontSize: '0.75rem',
                               color: 'var(--text-secondary)',
                               marginBottom: '0.25rem',
                             }}
                           >
                             Transaction Reference
                           </span>

                           <strong>
                             {activeMembershipPayment.transactionReference ||
                               '—'}
                           </strong>
                         </div>

                         <div>
                           <span
                             style={{
                               display: 'block',
                               fontSize: '0.75rem',
                               color: 'var(--text-secondary)',
                               marginBottom: '0.25rem',
                             }}
                           >
                             Receipt Number
                           </span>

                           <strong>
                             {activeMembershipPayment.receiptNumber ||
                               '—'}
                           </strong>
                         </div>

                         <div>
                           <span
                             style={{
                               display: 'block',
                               fontSize: '0.75rem',
                               color: 'var(--text-secondary)',
                               marginBottom: '0.25rem',
                             }}
                           >
                             Payment Method
                           </span>

                           <strong>
                             {activeMembershipPayment.paymentMethod ||
                               '—'}
                           </strong>
                         </div>

                         <div>
                           <span
                             style={{
                               display: 'block',
                               fontSize: '0.75rem',
                               color: 'var(--text-secondary)',
                               marginBottom: '0.25rem',
                             }}
                           >
                             Paid At
                           </span>

                           <strong>
                             {activeMembershipPayment.paidAt
                               ? new Date(
                                   activeMembershipPayment.paidAt
                                 ).toLocaleString()
                               : '—'}
                           </strong>
                         </div>
                       </div>
                     </div>
                   )}

                   {/* Payment History */}

                   {membershipPayments.length > 0 && (
                     <div
                       style={{
                         marginTop: '1.5rem',
                       }}
                     >
                       <h5
                         style={{
                           margin: '0 0 0.75rem',
                         }}
                       >
                         Payment History
                       </h5>

                       <div
                         style={{
                           display: 'flex',
                           flexDirection: 'column',
                           gap: '0.75rem',
                         }}
                       >
                         {membershipPayments.map((payment) => (
                           <div
                             key={payment.id}
                             style={{
                               padding: '1rem',
                               border:
                                 '1px solid var(--border-color)',
                               borderRadius:
                                 'var(--radius-md)',
                               background:
                                 'var(--bg-primary)',
                             }}
                           >
                             <div
                               style={{
                                 display: 'flex',
                                 justifyContent:
                                   'space-between',
                                 gap: '1rem',
                                 flexWrap: 'wrap',
                               }}
                             >
                               <strong>
                                 {payment.paymentCode}
                               </strong>

                               <span
                                 className={`badge ${
                                   payment.status === 'PAID'
                                     ? 'badge-success'
                                     : payment.status === 'FAILED'
                                       ? 'badge-danger'
                                       : 'badge-warning'
                                 }`}
                               >
                                 {payment.status}
                               </span>
                             </div>

                             <div
                               style={{
                                 marginTop: '0.5rem',
                                 fontSize: '0.85rem',
                                 color:
                                   'var(--text-secondary)',
                               }}
                             >
                               LKR{' '}
                               {Number(
                                 payment.amount || 0
                               ).toFixed(2)}{' '}
                               • {payment.paymentType}
                             </div>

                             {payment.receiptNumber && (
                               <div
                                 style={{
                                   marginTop: '0.35rem',
                                   fontSize: '0.8rem',
                                   color:
                                     'var(--text-secondary)',
                                 }}
                               >
                                 Receipt:{' '}
                                 {payment.receiptNumber}
                               </div>
                             )}
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>


                 {/* MEMBERSHIP TYPE CHANGE REQUEST */}

                 <div
                   style={{
                     marginTop: '2rem',
                     paddingTop: '1.5rem',
                     borderTop: '1px solid var(--border-color)',
                   }}
                 >
                   <div style={{ marginBottom: '1rem' }}>
                     <h4
                       style={{
                         margin: 0,
                         marginBottom: '0.25rem',
                       }}
                     >
                       🔁 Membership Type Change
                     </h4>

                     <p
                       style={{
                         margin: 0,
                         color: 'var(--text-secondary)',
                         fontSize: '0.85rem',
                       }}
                     >
                       Request a change to your library membership type.
                     </p>
                   </div>

                   <div
                     style={{
                       display: 'grid',
                       gridTemplateColumns:
                         'repeat(auto-fit, minmax(220px, 1fr))',
                       gap: '1rem',
                       alignItems: 'end',
                     }}
                   >

                     {/* MEMBERSHIP TYPE */}

                     <div className="profile-field">
                       <label>Requested Membership Type</label>

                       <select
                         value={requestedMembershipType}
                         onChange={(e) =>
                           setRequestedMembershipType(e.target.value)
                         }
                         disabled={requestingMembershipType}
                       >
                         <option value="">
                           Select membership type
                         </option>

                         {profile.membershipType !== 'STUDENT' && (
                           <option value="STUDENT">
                             Student
                           </option>
                         )}

                         {profile.membershipType !== 'FACULTY' && (
                           <option value="FACULTY">
                             Faculty / Staff
                           </option>
                         )}

                         {profile.membershipType !== 'GENERAL' && (
                           <option value="GENERAL">
                             General / Public
                           </option>
                         )}
                       </select>
                     </div>


                     {/* REASON */}

                     <div className="profile-field">
                       <label>Reason</label>

                       <input
                         type="text"
                         value={membershipTypeReason}
                         onChange={(e) =>
                           setMembershipTypeReason(e.target.value)
                         }
                         placeholder="Reason for request"
                         disabled={requestingMembershipType}
                       />
                     </div>


                     {/* BUTTON */}

                     <button
                       type="button"
                       className="profile-primary-btn"
                       onClick={handleMembershipTypeChangeRequest}
                       disabled={requestingMembershipType}
                     >
                       {requestingMembershipType
                         ? 'Submitting...'
                         : '📨 Request Change'}
                     </button>

                   </div>


                   {/* REQUEST HISTORY */}

                   {membershipTypeRequests.length > 0 && (
                     <div style={{ marginTop: '1.5rem' }}>

                       <h5
                         style={{
                           margin: '0 0 0.75rem',
                         }}
                       >
                         Request History
                       </h5>

                       <div
                         style={{
                           display: 'flex',
                           flexDirection: 'column',
                           gap: '0.75rem',
                         }}
                       >

                         {membershipTypeRequests.map((request) => (

                           <div
                             key={request.id}
                             style={{
                               padding: '1rem',
                               border: '1px solid var(--border-color)',
                               borderRadius: 'var(--radius-md)',
                               background: 'var(--bg-secondary)',
                             }}
                           >

                             <div
                               style={{
                                 display: 'flex',
                                 justifyContent: 'space-between',
                                 gap: '1rem',
                                 flexWrap: 'wrap',
                               }}
                             >

                               <strong>
                                 {request.currentMembershipType}
                                 {' → '}
                                 {request.requestedMembershipType}
                               </strong>

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

                             </div>

                             {request.reason && (
                               <p
                                 style={{
                                   margin: '0.5rem 0 0',
                                   fontSize: '0.85rem',
                                   color: 'var(--text-secondary)',
                                 }}
                               >
                                 Reason: {request.reason}
                               </p>
                             )}

                             {request.requestedAt && (
                               <small
                                 style={{
                                   display: 'block',
                                   marginTop: '0.4rem',
                                   color: 'var(--text-secondary)',
                                 }}
                               >
                                 Requested: {request.requestedAt}
                               </small>
                             )}

                           </div>

                         ))}

                       </div>

                     </div>
                   )}

                 </div>


                 {/* RENEWAL HISTORY */}
                 <div
                   style={{
                     marginTop: '2rem',
                     paddingTop: '1.5rem',
                     borderTop: '1px solid var(--border-color)',
                   }}
                 >

                   <div
                     style={{
                       marginBottom: '1rem',
                     }}
                   >
                     <h4
                       style={{
                         margin: 0,
                         marginBottom: '0.25rem',
                       }}
                     >
                       📜 Renewal History
                     </h4>

                     <p
                       style={{
                         margin: 0,
                         color: 'var(--text-secondary)',
                         fontSize: '0.85rem',
                       }}
                     >
                       Previous membership renewal records.
                     </p>
                   </div>


                   {renewalHistory.length === 0 ? (

                     <div
                       style={{
                         padding: '1rem',
                         borderRadius: 'var(--radius-md)',
                         background: 'var(--bg-secondary)',
                         color: 'var(--text-secondary)',
                         fontSize: '0.85rem',
                       }}
                     >
                       No membership renewal history available.
                     </div>

                   ) : (

                     <div
                       style={{
                         display: 'flex',
                         flexDirection: 'column',
                         gap: '0.75rem',
                       }}
                     >

                       {renewalHistory.map((renewal, index) => (

                         <div
                           key={
                             renewal.id ||
                             `${renewal.renewalDate}-${index}`
                           }
                           style={{
                             display: 'grid',
                             gridTemplateColumns:
                               'repeat(auto-fit, minmax(160px, 1fr))',
                             gap: '1rem',
                             padding: '1rem',
                             borderRadius: 'var(--radius-md)',
                             border:
                               '1px solid var(--border-color)',
                             background: 'var(--bg-primary)',
                           }}
                         >

                           <div>
                             <span
                               style={{
                                 display: 'block',
                                 fontSize: '0.75rem',
                                 color: 'var(--text-secondary)',
                                 marginBottom: '0.25rem',
                               }}
                             >
                               Previous Expiry
                             </span>

                             <strong>
                               {renewal.previousExpiryDate || '—'}
                             </strong>
                           </div>


                           <div>
                             <span
                               style={{
                                 display: 'block',
                                 fontSize: '0.75rem',
                                 color: 'var(--text-secondary)',
                                 marginBottom: '0.25rem',
                               }}
                             >
                               New Expiry
                             </span>

                             <strong>
                               {renewal.newExpiryDate || '—'}
                             </strong>
                           </div>


                           <div>
                             <span
                               style={{
                                 display: 'block',
                                 fontSize: '0.75rem',
                                 color: 'var(--text-secondary)',
                                 marginBottom: '0.25rem',
                               }}
                             >
                               Renewal Date
                             </span>

                             <strong>
                               {renewal.renewalDate || '—'}
                             </strong>
                           </div>

                         </div>

                       ))}

                     </div>

                   )}

                 </div>

               </div>


        {/* EDIT ACTIONS */}
        {isEditing && (
          <div className="profile-actions">

            <button
              className="profile-cancel-btn"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              className="profile-primary-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

          </div>
        )}

      </div>

    </div>
  );
}

export default MemberProfile;