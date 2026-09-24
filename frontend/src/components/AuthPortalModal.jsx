import React, { useState } from 'react';

const API_BASE = 'http://localhost:8080/api';

export default function AuthPortalModal({
  isOpen,
  onClose,
  members,
  onSelectMember,
  onSelectAdmin,
  onRegisterMember,
}) {
  const [tab, setTab] = useState('customer-login');

  // =========================================================
  // CUSTOMER LOGIN
  // =========================================================
  const [custUser, setCustUser] = useState('');
  const [custPass, setCustPass] = useState('');
  const [custLoading, setCustLoading] = useState(false);
  const [custError, setCustError] = useState('');

  // =========================================================
  // FORGOT / RESET PASSWORD
  // =========================================================
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // request | reset | success
  const [resetStep, setResetStep] = useState('request');

  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  // =========================================================
  // ADMIN LOGIN
  // =========================================================
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');

  // =========================================================
  // REGISTER
  // =========================================================
  const [regData, setRegData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    idNumber: '',
    membershipType: 'STUDENT',
    username: '',
    password: '',
  });

  const [regLoading, setRegLoading] = useState(false);
  const [verificationDocument, setVerificationDocument] = useState(null);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regFieldErrors, setRegFieldErrors] = useState({});

  // =========================================================
  // CUSTOMER LOGIN
  // =========================================================
  const handleCustomerLogin = async (e) => {
    e.preventDefault();

    if (!custUser.trim() || !custPass.trim()) {
      setCustError('Please enter both username and password.');
      return;
    }

    setCustLoading(true);
    setCustError('');

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: custUser.trim(),
          password: custPass.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      if (data.role !== 'CUSTOMER') {
        setCustError(
          'This account is not a customer account. Please use Admin Login.'
        );
        return;
      }

      if (data.member) {
        onSelectMember(data.member);
      } else if (data.memberId) {
        const found = members?.find(
          (m) => m.id === data.memberId
        );

        if (found) {
          onSelectMember(found);
        }
      }

      onClose();

    } catch (err) {
      setCustError(
        err.message || 'Login failed. Please try again.'
      );
    } finally {
      setCustLoading(false);
    }
  };

  // =========================================================
  // ADMIN LOGIN
  // =========================================================
  const handleAdminLogin = async (e) => {
    e.preventDefault();

    if (!adminUser.trim() || !adminPass.trim()) {
      setAdminError('Please enter both username and password.');
      return;
    }

    setAdminLoading(true);
    setAdminError('');

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: adminUser.trim(),
          password: adminPass.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      if (data.role !== 'ADMIN') {
        setAdminError(
          'This account does not have admin privileges. Please use Customer Login.'
        );
        return;
      }

      onSelectAdmin();
      onClose();

    } catch (err) {
      setAdminError(
        err.message || 'Login failed. Please try again.'
      );
    } finally {
      setAdminLoading(false);
    }
  };

  // =========================================================
  // REGISTER NEW CUSTOMER
  // =========================================================
  const handleRegister = async (e) => {
    e.preventDefault();

    const errors = {};

    const fullName = regData.fullName.trim();
    const email = regData.email.trim().toLowerCase();
    const phone = regData.phone.trim();
    const idNumber = regData.idNumber.trim();
    const username = regData.username.trim();
    const password = regData.password;

    // Required field validation
    if (!fullName) {
      errors.fullName = 'Full name is required.';
    }

    if (!email) {
      errors.email = 'Email address is required.';
    }

    if (!phone) {
      errors.phone = 'Phone number is required.';
    }

    if (!idNumber) {
      errors.idNumber = 'National ID / Student ID is required.';
    }

    if (!verificationDocument) {
     errors.verificationDocument = 'Verification document is required.';
     }

    if (!username) {
      errors.username = 'Username is required.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    }

    // Password validation
    if (password && password.length < 6) {
      errors.password = 'Password must contain at least 6 characters.';
    }

    // Check duplicate member details
    if (email && members.some(
      (m) => m.email?.trim().toLowerCase() === email
    )) {
      errors.email = 'This email is already registered.';
    }

    if (phone && members.some(
      (m) => m.phone?.trim() === phone
    )) {
      errors.phone = 'This phone number is already registered.';
    }

    if (idNumber && members.some(
      (m) => m.idNumber?.trim() === idNumber
    )) {
      errors.idNumber = 'This National ID / Student ID is already registered.';
    }

    // If there are ANY validation errors,
    // show ALL of them at once and stop registration.
    if (Object.keys(errors).length > 0) {
      setRegFieldErrors(errors);
      setRegError('Please correct the highlighted fields before registering.');
      return;
    }

    setRegFieldErrors({});
    setRegError('');
    setRegLoading(true);

    try {
      const newMember = await onRegisterMember({
        fullName,
        email,
        phone,
        address: regData.address,
        idNumber,
        membershipType: regData.membershipType,
        status: 'ACTIVE',
        maxBorrowLimit:
          regData.membershipType === 'STAFF'
            ? 6
            : regData.membershipType === 'PUBLIC'
              ? 2
              : 3,
      });

          // Upload verification document
          if (newMember?.id && verificationDocument) {
            const documentData = new FormData();

            documentData.append(
              'file',
              verificationDocument
            );

            const documentRes = await fetch(
              `${API_BASE}/members/${newMember.id}/verification-document`,
              {
                method: 'POST',
                body: documentData,
              }
            );

            const documentResult =
              await documentRes.json();

            if (!documentRes.ok) {
              throw new Error(
                documentResult.error ||
                  'Failed to upload verification document.'
              );
            }
          }

      // Create User authentication record
      const authRes = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          memberId: newMember.id,
          fullName: newMember.fullName,
          email: newMember.email,
        }),
      });

      const authData = await authRes.json();

      if (!authRes.ok) {
        throw new Error(authData.error || 'Account creation failed.');
      }

      setRegSuccess(
        `Registration submitted successfully! Your verification document is pending review and your membership is awaiting admin approval. Member Code: ${newMember.memberCode}`
      );

      setVerificationDocument(null);

      setTimeout(() => {
        onSelectMember(newMember);
        onClose();
      }, 1500);

    } catch (err) {
      setRegError(err.message || 'Registration failed.');
    } finally {
      setRegLoading(false);
    }
  };

  // =========================================================
  // REQUEST PASSWORD RESET
  // =========================================================
  const handleForgotPassword = async () => {
    if (!resetIdentifier.trim()) {
      setResetError(
        'Please enter your username or email.'
      );
      return;
    }

    setResetLoading(true);
    setResetError('');
    setResetMessage('');

    try {
      const res = await fetch(
        `${API_BASE}/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identifier: resetIdentifier.trim(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
          'Password reset request failed.'
        );
      }

      // Academic/demo project:
      // backend returns token directly
      setResetToken(data.token);

      setResetMessage(
        'Reset request created successfully. Use the reset token below to create a new password.'
      );

      setResetStep('reset');

    } catch (err) {
      setResetError(
        err.message ||
        'Unable to process password reset request.'
      );
    } finally {
      setResetLoading(false);
    }
  };

  // =========================================================
  // RESET PASSWORD
  // =========================================================
  const handleResetPassword = async () => {
    if (!resetToken.trim()) {
      setResetError(
        'Please enter the reset token.'
      );
      return;
    }

    if (!newPassword || !confirmPassword) {
      setResetError(
        'Please enter and confirm your new password.'
      );
      return;
    }

    if (newPassword.length < 6) {
      setResetError(
        'Password must contain at least 6 characters.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError(
        'Passwords do not match.'
      );
      return;
    }

    setResetLoading(true);
    setResetError('');
    setResetMessage('');

    try {
      const res = await fetch(
        `${API_BASE}/auth/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: resetToken.trim(),
            newPassword: newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
          'Password reset failed.'
        );
      }

      setResetMessage(
        'Password reset successfully! You can now sign in using your new password.'
      );

      setResetStep('success');

      setResetToken('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err) {
      setResetError(
        err.message ||
        'Unable to reset password.'
      );
    } finally {
      setResetLoading(false);
    }
  };

  // =========================================================
  // OPEN FORGOT PASSWORD MODAL
  // =========================================================
  const openForgotPassword = () => {
    setShowForgotPassword(true);

    setResetStep('request');
    setResetIdentifier('');
    setResetToken('');
    setNewPassword('');
    setConfirmPassword('');
    setResetMessage('');
    setResetError('');
  };

  // =========================================================
  // CLOSE FORGOT PASSWORD MODAL
  // =========================================================
  const closeForgotPassword = () => {
    setShowForgotPassword(false);

    setResetStep('request');
    setResetIdentifier('');
    setResetToken('');
    setNewPassword('');
    setConfirmPassword('');
    setResetMessage('');
    setResetError('');
  };

  // =========================================================
  // TABS
  // =========================================================
  const tabs = [
    {
      id: 'customer-login',
      label: '👤 Customer Login',
    },
    {
      id: 'admin-login',
      label: '🛡️ Admin Login',
    },
    {
      id: 'register',
      label: '✨ Register',
    },
  ];

  // =========================================================
  // MODAL CLOSED
  // =========================================================
  if (!isOpen) return null;

  // =========================================================
  // MAIN JSX
  // =========================================================
  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="modal-content auth-portal-modal"
        style={{
          maxWidth: '520px',
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="modal-header">

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              className="brand-icon-wrapper"
              style={{
                width: '32px',
                height: '32px',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>

            <h2 className="modal-title">
              NexRead Portal Access
            </h2>
          </div>

          <button
            className="icon-btn"
            onClick={onClose}
            type="button"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line
                x1="18"
                y1="6"
                x2="6"
                y2="18"
              />
              <line
                x1="6"
                y1="6"
                x2="18"
                y2="18"
              />
            </svg>
          </button>
        </div>

        {/* =====================================================
            TAB SWITCHER
        ====================================================== */}
        <div
          style={{
            display: 'flex',
            borderBottom:
              '1px solid var(--border-color)',
            backgroundColor:
              'var(--bg-surface-subtle)',
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              style={{
                flex: 1,
                padding: '11px 6px',
                border: 'none',
                background:
                  tab === t.id
                    ? 'var(--bg-surface)'
                    : 'transparent',
                fontWeight: 600,
                fontSize: '0.78rem',
                color:
                  tab === t.id
                    ? 'var(--primary)'
                    : 'var(--text-muted)',
                borderBottom:
                  tab === t.id
                    ? '2px solid var(--primary)'
                    : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onClick={() => {
                setTab(t.id);
                setCustError('');
                setAdminError('');
                setRegError('');
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* =====================================================
            MODAL BODY
        ====================================================== */}
        <div className="modal-body">

          {/* ===================================================
              CUSTOMER LOGIN
          ==================================================== */}
          {tab === 'customer-login' && (
            <div>

              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '20px',
                }}
              >

                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg, #0284c7, #0369a1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    boxShadow:
                      '0 4px 16px rgba(2,132,199,0.3)',
                  }}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                    />
                  </svg>
                </div>

                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  Sign in with your library account
                  credentials
                </p>
              </div>

              <form onSubmit={handleCustomerLogin}>

                <div className="form-group">
                  <label className="form-label">
                    Username or Email
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. kasun.p or kasun.p@library.org"
                    value={custUser}
                    onChange={(e) =>
                      setCustUser(e.target.value)
                    }
                    autoComplete="username"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={custPass}
                    onChange={(e) =>
                      setCustPass(e.target.value)
                    }
                    autoComplete="current-password"
                  />
                </div>

                {/* Forgot Password */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '-6px',
                    marginBottom: '14px',
                  }}
                >
                  <button
                    type="button"
                    onClick={openForgotPassword}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '2px 0',
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>

                {custError && (
                  <div
                    style={{
                      color: '#ef4444',
                      fontSize: '0.82rem',
                      marginBottom: '12px',
                      padding: '8px',
                      background:
                        'rgba(239,68,68,0.08)',
                      borderRadius: '8px',
                    }}
                  >
                    {custError}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '11px',
                  }}
                  disabled={custLoading}
                >
                  {custLoading
                    ? 'Signing in...'
                    : 'Sign In as Customer'}
                </button>
              </form>

              {/* Demo Account */}
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  background:
                    'var(--bg-surface-subtle)',
                  borderRadius: '8px',
                  border:
                    '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    marginBottom: '6px',
                  }}
                >
                  Demo Accounts:
                </div>

                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  Username:{' '}
                  <strong>kasun.p</strong>
                  &nbsp;|&nbsp;
                  Password:{' '}
                  <strong>password123</strong>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              ADMIN LOGIN
          ==================================================== */}
          {tab === 'admin-login' && (
            <div>

              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '20px',
                }}
              >

                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg, #5b4bf0, #7c3aed)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    boxShadow:
                      '0 4px 16px rgba(91,75,240,0.3)',
                  }}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>

                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    marginBottom: '4px',
                  }}
                >
                  Librarian Administrative Studio
                </h3>

                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  Access catalog management,
                  circulation desk, and financial
                  controls
                </p>
              </div>

              <form onSubmit={handleAdminLogin}>

                <div className="form-group">
                  <label className="form-label">
                    Admin Username
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. admin"
                    value={adminUser}
                    onChange={(e) =>
                      setAdminUser(e.target.value)
                    }
                    autoComplete="username"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Admin Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter admin password"
                    value={adminPass}
                    onChange={(e) =>
                      setAdminPass(e.target.value)
                    }
                    autoComplete="current-password"
                  />
                </div>

                {adminError && (
                  <div
                    style={{
                      color: '#ef4444',
                      fontSize: '0.82rem',
                      marginBottom: '12px',
                      padding: '8px',
                      background:
                        'rgba(239,68,68,0.08)',
                      borderRadius: '8px',
                    }}
                  >
                    {adminError}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '11px',
                  }}
                  disabled={adminLoading}
                >
                  {adminLoading
                    ? 'Authenticating...'
                    : '🔐 Launch Admin Studio'}
                </button>
              </form>

              {/* Default Admin */}
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  background:
                    'rgba(91,75,240,0.06)',
                  borderRadius: '8px',
                  border:
                    '1px solid rgba(91,75,240,0.15)',
                }}
              >
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    marginBottom: '6px',
                  }}
                >
                  Default Admin Credentials:
                </div>

                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  Username: <strong>admin</strong>
                  &nbsp;|&nbsp;
                  Password: <strong>admin123</strong>
                </div>
              </div>

            </div>
          )}

       {/* ===================================================
           REGISTER
       ==================================================== */}
       {tab === 'register' && (
         <form onSubmit={handleRegister}>

           {/* General Error */}
           {regError && (
             <div
               style={{
                 padding: '10px',
                 backgroundColor: 'rgba(239,68,68,0.1)',
                 color: '#ef4444',
                 borderRadius: 'var(--radius-sm)',
                 fontSize: '0.82rem',
                 marginBottom: '14px',
               }}
             >
               {regError}
             </div>
           )}

           {/* Success Message */}
           {regSuccess && (
             <div
               style={{
                 padding: '10px',
                 backgroundColor: 'rgba(16,185,129,0.1)',
                 color: '#059669',
                 borderRadius: 'var(--radius-sm)',
                 fontSize: '0.82rem',
                 marginBottom: '14px',
               }}
             >
               {regSuccess}
             </div>
           )}

           {/* =================================================
               FULL NAME + EMAIL
           ================================================== */}
           <div
             style={{
               display: 'grid',
               gridTemplateColumns: '1fr 1fr',
               gap: '12px',
             }}
           >

             {/* Full Name */}
             <div className="form-group">
               <label className="form-label">
                 Full Name *
               </label>

               <input
                 type="text"
                 className={`form-control ${
                   regFieldErrors.fullName ? 'input-error' : ''
                 }`}
                 placeholder="e.g. Kasun Perera"
                 required
                 value={regData.fullName}
                 onChange={(e) => {
                   setRegData({
                     ...regData,
                     fullName: e.target.value,
                   });

                   setRegFieldErrors((prev) => ({
                     ...prev,
                     fullName: '',
                   }));
                 }}
               />

               {regFieldErrors.fullName && (
                 <div className="field-error">
                   {regFieldErrors.fullName}
                 </div>
               )}
             </div>

             {/* Email */}
             <div className="form-group">
               <label className="form-label">
                 Email Address *
               </label>

               <input
                 type="email"
                 className={`form-control ${
                   regFieldErrors.email ? 'input-error' : ''
                 }`}
                 placeholder="e.g. kasun@example.com"
                 required
                 value={regData.email}
                 onChange={(e) => {
                   setRegData({
                     ...regData,
                     email: e.target.value,
                   });

                   setRegFieldErrors((prev) => ({
                     ...prev,
                     email: '',
                   }));
                 }}
               />

               {regFieldErrors.email && (
                 <div className="field-error">
                   {regFieldErrors.email}
                 </div>
               )}
             </div>

           </div>


           {/* =================================================
               PHONE + NATIONAL ID
           ================================================== */}
           <div
             style={{
               display: 'grid',
               gridTemplateColumns: '1fr 1fr',
               gap: '12px',
             }}
           >

             {/* Phone Number */}
             <div className="form-group">
               <label className="form-label">
                 Phone Number *
               </label>

               <input
                 type="tel"
                 className={`form-control ${
                   regFieldErrors.phone ? 'input-error' : ''
                 }`}
                 placeholder="e.g. 0771234567"
                 required
                 value={regData.phone}
                 onChange={(e) => {
                   setRegData({
                     ...regData,
                     phone: e.target.value,
                   });

                   setRegFieldErrors((prev) => ({
                     ...prev,
                     phone: '',
                   }));
                 }}
               />

               {regFieldErrors.phone && (
                 <div className="field-error">
                   {regFieldErrors.phone}
                 </div>
               )}
             </div>

             {/* National ID */}
             <div className="form-group">
               <label className="form-label">
                 National ID / Student ID *
               </label>

               <input
                 type="text"
                 className={`form-control ${
                   regFieldErrors.idNumber ? 'input-error' : ''
                 }`}
                 placeholder="e.g. 200115001234"
                 required
                 value={regData.idNumber}
                 onChange={(e) => {
                   setRegData({
                     ...regData,
                     idNumber: e.target.value,
                   });

                   setRegFieldErrors((prev) => ({
                     ...prev,
                     idNumber: '',
                   }));
                 }}
               />

               {regFieldErrors.idNumber && (
                 <div className="field-error">
                   {regFieldErrors.idNumber}
                 </div>
               )}
             </div>

           </div>


                       {/* =================================================
                           VERIFICATION DOCUMENT
                       ================================================== */}
                       <div className="form-group">
                         <label className="form-label">
                           Verification Document *
                         </label>

                         <input
                           type="file"
                           className={`form-control ${
                             regFieldErrors.verificationDocument
                               ? 'input-error'
                               : ''
                           }`}
                           accept=".pdf,.jpg,.jpeg,.png"
                           required
                           onChange={(e) => {
                             const file = e.target.files?.[0] || null;

                             if (file && file.size > 5 * 1024 * 1024) {
                               setVerificationDocument(null);
                               setRegFieldErrors((prev) => ({
                                 ...prev,
                                 verificationDocument:
                                   'File size must not exceed 5 MB.',
                               }));
                               return;
                             }

                             setVerificationDocument(file);

                             setRegFieldErrors((prev) => ({
                               ...prev,
                               verificationDocument: '',
                             }));
                           }}
                         />

                         <div
                           style={{
                             fontSize: '0.72rem',
                             color: 'var(--text-muted)',
                             marginTop: '5px',
                           }}
                         >
                           Upload your National ID, Student ID or Passport.
                           PDF, JPG or PNG. Maximum 5 MB.
                         </div>

                         {verificationDocument && (
                           <div
                             style={{
                               fontSize: '0.75rem',
                               color: '#059669',
                               marginTop: '5px',
                               fontWeight: 600,
                             }}
                           >
                             ✓ {verificationDocument.name}
                           </div>
                         )}

                         {regFieldErrors.verificationDocument && (
                           <div className="field-error">
                             {regFieldErrors.verificationDocument}
                           </div>
                         )}
                       </div>


           {/* =================================================
               RESIDENTIAL ADDRESS
           ================================================== */}
           <div className="form-group">
             <label className="form-label">
               Residential Address
             </label>

             <input
               type="text"
               className="form-control"
               placeholder="e.g. Colombo 07"
               value={regData.address}
               onChange={(e) =>
                 setRegData({
                   ...regData,
                   address: e.target.value,
                 })
               }
             />
           </div>


           {/* =================================================
               USERNAME + PASSWORD
           ================================================== */}
           <div
             style={{
               display: 'grid',
               gridTemplateColumns: '1fr 1fr',
               gap: '12px',
             }}
           >

             {/* Username */}
             <div className="form-group">
               <label className="form-label">
                 Choose Username *
               </label>

               <input
                 type="text"
                 className={`form-control ${
                   regFieldErrors.username ? 'input-error' : ''
                 }`}
                 placeholder="e.g. kasun.p"
                 required
                 value={regData.username}
                 onChange={(e) => {
                   setRegData({
                     ...regData,
                     username: e.target.value,
                   });

                   setRegFieldErrors((prev) => ({
                     ...prev,
                     username: '',
                   }));
                 }}
               />

               {regFieldErrors.username && (
                 <div className="field-error">
                   {regFieldErrors.username}
                 </div>
               )}
             </div>


             {/* Password */}
             <div className="form-group">
               <label className="form-label">
                 Create Password *
               </label>

               <input
                 type="password"
                 className={`form-control ${
                   regFieldErrors.password ? 'input-error' : ''
                 }`}
                 placeholder="Min 6 characters"
                 required
                 value={regData.password}
                 onChange={(e) => {
                   setRegData({
                     ...regData,
                     password: e.target.value,
                   });

                   setRegFieldErrors((prev) => ({
                     ...prev,
                     password: '',
                   }));
                 }}
               />

               {regFieldErrors.password && (
                 <div className="field-error">
                   {regFieldErrors.password}
                 </div>
               )}
             </div>

           </div>


           {/* =================================================
               MEMBERSHIP TYPE
           ================================================== */}
           <div className="form-group">
             <label className="form-label">
               Membership Type
             </label>

             <select
               className="form-control"
               value={regData.membershipType}
               onChange={(e) =>
                 setRegData({
                   ...regData,
                   membershipType: e.target.value,
                 })
               }
             >
               <option value="STUDENT">
                 Student (3 Books)
               </option>

               <option value="STAFF">
                 Staff (6 Books)
               </option>

               <option value="PUBLIC">
                 Public (2 Books)
               </option>
             </select>
           </div>


           {/* =================================================
               REGISTER BUTTON
           ================================================== */}
           <button
             type="submit"
             className="btn btn-primary"
             style={{
               width: '100%',
               marginTop: '6px',
               padding: '12px',
             }}
             disabled={regLoading}
           >
             {regLoading
               ? 'Creating Account...'
               : '✨ Complete Registration & Sign In'}
           </button>

         </form>
       )}

      {/* =====================================================
          FORGOT PASSWORD MODAL
      ====================================================== */}
      {showForgotPassword && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background:
              'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={closeForgotPassword}
        >

          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              background:
                'var(--bg-surface)',
              borderRadius: '16px',
              padding: '28px',
              boxShadow:
                '0 20px 50px rgba(0,0,0,0.25)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Reset Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >

              <div>
                <h3
                  style={{
                    margin: 0,
                    color:
                      'var(--text-main)',
                    fontSize: '1.15rem',
                  }}
                >
                  Reset Your Password
                </h3>

                <p
                  style={{
                    margin: '5px 0 0',
                    color:
                      'var(--text-muted)',
                    fontSize: '0.78rem',
                  }}
                >
                  NexRead Account Recovery
                </p>
              </div>

              <button
                type="button"
                className="icon-btn"
                onClick={closeForgotPassword}
              >
                ×
              </button>

            </div>

            {/* =================================================
                REQUEST STEP
            ================================================== */}
            {resetStep === 'request' && (
              <>
                <p
                  style={{
                    color:
                      'var(--text-muted)',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    marginBottom: '20px',
                  }}
                >
                  Enter your registered username
                  or email address to request a
                  password reset.
                </p>

                <div className="form-group">

                  <label className="form-label">
                    Username or Email
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. kasun.p or kasun@example.com"
                    value={resetIdentifier}
                    onChange={(e) => {
                      setResetIdentifier(
                        e.target.value
                      );
                      setResetError('');
                    }}
                  />

                </div>

                {resetError && (
                  <div
                    style={{
                      padding: '10px',
                      background:
                        'rgba(239,68,68,0.1)',
                      color: '#ef4444',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      marginBottom: '14px',
                    }}
                  >
                    {resetError}
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '11px',
                  }}
                  onClick={
                    handleForgotPassword
                  }
                  disabled={resetLoading}
                >
                  {resetLoading
                    ? 'Creating Reset Request...'
                    : 'Request Password Reset'}
                </button>
              </>
            )}

            {/* =================================================
                RESET STEP
            ================================================== */}
            {resetStep === 'reset' && (
              <>
                {/* Message */}
                <div
                  style={{
                    padding: '12px',
                    background:
                      'rgba(59,130,246,0.1)',
                    color: '#2563eb',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                  }}
                >
                  ✓ {resetMessage}
                </div>

                {/* Token */}
                <div
                  style={{
                    padding: '14px',
                    background:
                      'var(--bg-surface-subtle)',
                    border:
                      '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    marginBottom: '18px',
                  }}
                >

                  <div
                    style={{
                      fontSize: '0.75rem',
                      color:
                        'var(--text-muted)',
                      marginBottom: '6px',
                    }}
                  >
                    Password Reset Token
                  </div>

                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color:
                        'var(--primary)',
                      wordBreak:
                        'break-all',
                    }}
                  >
                    {resetToken}
                  </div>

                  <div
                    style={{
                      marginTop: '6px',
                      fontSize: '0.7rem',
                      color:
                        'var(--text-muted)',
                    }}
                  >
                    Demo token — valid for
                    15 minutes
                  </div>

                </div>

                {/* Token Input */}
                <div className="form-group">

                  <label className="form-label">
                    Reset Token
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Paste your reset token"
                    value={resetToken}
                    onChange={(e) => {
                      setResetToken(
                        e.target.value
                      );
                      setResetError('');
                    }}
                  />

                </div>

                {/* New Password */}
                <div className="form-group">

                  <label className="form-label">
                    New Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(
                        e.target.value
                      );
                      setResetError('');
                    }}
                  />

                </div>

                {/* Confirm Password */}
                <div className="form-group">

                  <label className="form-label">
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(
                        e.target.value
                      );
                      setResetError('');
                    }}
                  />

                </div>

                {resetError && (
                  <div
                    style={{
                      padding: '10px',
                      background:
                        'rgba(239,68,68,0.1)',
                      color: '#ef4444',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      marginBottom: '14px',
                    }}
                  >
                    {resetError}
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '11px',
                  }}
                  onClick={
                    handleResetPassword
                  }
                  disabled={resetLoading}
                >
                  {resetLoading
                    ? 'Resetting Password...'
                    : 'Reset Password'}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginTop: '8px',
                  }}
                  onClick={() => {
                    setResetStep(
                      'request'
                    );
                    setResetMessage('');
                    setResetError('');
                  }}
                >
                  Back
                </button>

              </>
            )}

            {/* =================================================
                SUCCESS STEP
            ================================================== */}
            {resetStep === 'success' && (
              <div
                style={{
                  textAlign: 'center',
                }}
              >

                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background:
                      'rgba(16,185,129,0.12)',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin:
                      '0 auto 14px',
                    fontSize: '28px',
                  }}
                >
                  ✓
                </div>

                <h4
                  style={{
                    margin:
                      '0 0 8px',
                    color:
                      'var(--text-main)',
                  }}
                >
                  Password Reset Successful
                </h4>

                <p
                  style={{
                    color:
                      'var(--text-muted)',
                    fontSize: '0.84rem',
                    lineHeight: 1.5,
                    marginBottom:
                      '20px',
                  }}
                >
                  Your password has been
                  changed successfully.
                  You can now sign in with
                  your new password.
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '11px',
                  }}
                  onClick={() => {
                    setShowForgotPassword(
                      false
                    );

                    setResetStep(
                      'request'
                    );

                    setResetIdentifier(
                      ''
                    );

                    setResetMessage(
                      ''
                    );

                    setResetError('');

                    setCustPass('');
                  }}
                >
                  Back to Login
                                </button>

                              </div>
                            )}

                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
                  );
                }