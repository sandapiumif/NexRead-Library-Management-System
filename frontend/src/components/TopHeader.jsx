import React, { useState } from 'react';

export default function TopHeader({
  activeView,
  setActiveView,
  userRole,
  setUserRole,
  activeMember,
  reservations,
  openAddBookModal,
  openAuthModal,
  searchQuery,
  setSearchQuery,
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const [readNotifications, setReadNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const getInitials = (name) => {
    if (!name) return 'U';

    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // ---------------------------------------------------------
  // MEMBER NOTIFICATIONS
  // ---------------------------------------------------------

  const memberNotifications = (reservations || []).filter(
    (r) => r.member?.id === activeMember?.id
  );

  const unreadNotifications = memberNotifications.filter(
    (r) =>
      r.status === 'ACTIVE' &&
      !readNotifications.includes(r.id)
  );

  const notificationCount = unreadNotifications.length;

  const markNotificationAsRead = (id) => {
    setReadNotifications((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
  };

  const markAllAsRead = () => {
    setReadNotifications(
      memberNotifications.map((r) => r.id)
    );
  };

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <header className="top-header">

      {/* =====================================================
          LEFT NAVIGATION
      ===================================================== */}

      <div className="header-left">

        <div className="header-tabs">

          {/* Discover */}
          <div
            className={`header-tab-link ${
              activeView === 'landing' ? 'active' : ''
            }`}
            onClick={() => setActiveView('landing')}
          >
            Discover
          </div>

          {/* Dashboard */}
          <div
            className={`header-tab-link ${
              ['overview', 'user-dashboard'].includes(activeView)
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActiveView(
                userRole === 'ADMIN'
                  ? 'overview'
                  : 'user-dashboard'
              )
            }
          >
            Dashboard
          </div>

          {/* Catalog */}
          <div
            className={`header-tab-link ${
              activeView === 'catalog' ? 'active' : ''
            }`}
            onClick={() => setActiveView('catalog')}
          >
            Catalog
          </div>

          {/* Financials */}
          <div
            className={`header-tab-link ${
              ['fines', 'my-fines'].includes(activeView)
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActiveView(
                userRole === 'ADMIN'
                  ? 'fines'
                  : 'my-fines'
              )
            }
          >
            Financials
          </div>

        </div>
      </div>


      {/* =====================================================
          RIGHT HEADER CONTROLS
      ===================================================== */}

      <div className="header-right">



               {/* ===================================================
                   HELP BUTTON
               =================================================== */}

               <button
                 className="icon-btn"
                 title="Help & Documentation"
                 onClick={() => {
                   setShowHelp(true);
                   setShowNotifications(false);
                   setShowProfileMenu(false);
                 }}
               >
                 <svg
                   width="18"
                   height="18"
                   viewBox="0 0 24 24"
                   fill="none"
                   stroke="currentColor"
                   strokeWidth="2"
                 >
                   <circle cx="12" cy="12" r="10" />
                   <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                   <line x1="12" y1="17" x2="12.01" y2="17" />
                 </svg>
               </button>


        {/* ===================================================
            NOTIFICATION BELL
        =================================================== */}

        {userRole === 'MEMBER' && (

          <div style={{ position: 'relative' }}>

            {/* Bell Button */}

            <button
              className="icon-btn"
              title="Notifications"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              style={{ position: 'relative' }}
            >

              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>


              {/* Unread Badge */}

              {notificationCount > 0 && (

                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    minWidth: '16px',
                    height: '16px',
                    padding: '0 4px',
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    borderRadius: '999px',
                    fontSize: '10px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {notificationCount}
                </span>

              )}

            </button>


            {/* =================================================
                NOTIFICATION DROPDOWN
            ================================================= */}

            {showNotifications && (

              <div
                style={{
                  position: 'absolute',
                  top: '46px',
                  right: '0',
                  width: '360px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-dropdown)',
                  zIndex: 100,
                  overflow: 'hidden',
                }}
              >

                {/* Notification Header */}

                <div
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >

                  <div>

                    <div
                      style={{
                        fontWeight: 700,
                        color: 'var(--text-main)',
                        fontSize: '0.95rem',
                      }}
                    >
                      🔔 Notifications
                    </div>

                    {notificationCount > 0 && (

                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)',
                          marginTop: '3px',
                        }}
                      >
                        {notificationCount} unread notification
                        {notificationCount !== 1 ? 's' : ''}
                      </div>

                    )}

                  </div>


                  {/* Mark All As Read */}

                  {notificationCount > 0 && (

                    <button
                      onClick={markAllAsRead}
                      style={{
                        border: 'none',
                        background: 'none',
                        color: 'var(--primary)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Mark all as read
                    </button>

                  )}

                </div>


                {/* =================================================
                    NOTIFICATION LIST
                ================================================= */}

                {memberNotifications.length === 0 ? (

                  <div
                    style={{
                      padding: '30px 16px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                    }}
                  >

                    <div
                      style={{
                        fontSize: '28px',
                        marginBottom: '8px',
                      }}
                    >
                      🔕
                    </div>

                    <div style={{ fontWeight: 600 }}>
                      No notifications
                    </div>

                    <div
                      style={{
                        fontSize: '0.75rem',
                        marginTop: '4px',
                      }}
                    >
                      You're all caught up!
                    </div>

                  </div>

                ) : (

                  <div
                    style={{
                      maxHeight: '350px',
                      overflowY: 'auto',
                    }}
                  >

                    {memberNotifications.map((r) => {

                      const isUnread =
                        r.status === 'ACTIVE' &&
                        !readNotifications.includes(r.id);

                      return (

                        <div
                          key={r.id}
                          onClick={() =>
                            markNotificationAsRead(r.id)
                          }
                          style={{
                            padding: '14px 16px',
                            borderBottom:
                              '1px solid var(--border-subtle)',
                            backgroundColor: isUnread
                              ? 'rgba(99, 102, 241, 0.05)'
                              : 'transparent',
                            cursor: 'pointer',
                            position: 'relative',
                          }}
                        >

                          {/* Unread Dot */}

                          {isUnread && (

                            <span
                              style={{
                                position: 'absolute',
                                left: '6px',
                                top: '18px',
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                backgroundColor: '#ef4444',
                              }}
                            />

                          )}


                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              gap: '10px',
                            }}
                          >

                            <div style={{ flex: 1 }}>

                              <div
                                style={{
                                  fontWeight: 700,
                                  color: 'var(--text-main)',
                                  fontSize: '0.84rem',
                                  marginBottom: '5px',
                                }}
                              >
                                📚 Reservation Update
                              </div>

                              <div
                                style={{
                                  fontSize: '0.82rem',
                                  color: 'var(--text-main)',
                                  marginBottom: '4px',
                                }}
                              >
                                <strong>
                                  {r.book?.title ||
                                    'Reserved Book'}
                                </strong>
                              </div>

                              <div
                                style={{
                                  fontSize: '0.74rem',
                                  color: 'var(--text-muted)',
                                  lineHeight: 1.5,
                                }}
                              >
                                Reservation: {r.reservationCode}
                                <br />
                                Queue Position: #{r.waitingPosition}
                                <br />
                                Status: {r.status}
                              </div>

                            </div>


                            {/* NEW Label */}

                            {isUnread && (

                              <span
                                style={{
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                  color: '#ef4444',
                                }}
                              >
                                NEW
                              </span>

                            )}

                          </div>


                          {/* View Full Notification */}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              markNotificationAsRead(r.id);

                              setSelectedNotification(r);
                            }}
                            style={{
                              marginTop: '10px',
                              border: 'none',
                              background: 'none',
                              padding: 0,
                              color: 'var(--primary)',
                              fontSize: '0.74rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            View full notification →
                          </button>

                        </div>

                      );

                    })}

                  </div>

                )}


                {/* =================================================
                    SEE ALL
                ================================================= */}

                {memberNotifications.length > 0 && (

                  <div
                    style={{
                      padding: '12px 16px',
                      borderTop:
                        '1px solid var(--border-subtle)',
                      textAlign: 'center',
                    }}
                  >

                    <button
                      onClick={() => {
                        setShowNotifications(false);

                        setSelectedNotification({
                          type: 'ALL',
                          notifications: memberNotifications,
                        });
                      }}
                      style={{
                        border: 'none',
                        background: 'none',
                        color: 'var(--primary)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      See all notifications →
                    </button>

                  </div>

                )}

              </div>

            )}

          </div>

        )}


        {/* =====================================================
            PROFILE AVATAR / DROPDOWN
        ===================================================== */}

        <div style={{ position: 'relative' }}>

          <div
            className="user-profile-menu"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
          >

            <div className="user-avatar-initials">

              {userRole === 'ADMIN'
                ? 'AD'
                : getInitials(activeMember?.fullName)}

            </div>


            <span
              style={{
                fontSize: '0.84rem',
                fontWeight: 600,
                paddingRight: '4px',
              }}
            >
              {userRole === 'ADMIN'
                ? 'Chief Librarian'
                : activeMember?.fullName?.split(' ')[0] ||
                  'Member'}
            </span>


            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>

          </div>


          {/* =================================================
              PROFILE DROPDOWN
          ================================================= */}

          {showProfileMenu && (

            <div
              style={{
                position: 'absolute',
                top: '46px',
                right: '0',
                width: '230px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-dropdown)',
                padding: '8px',
                zIndex: 50,
              }}
            >

              <div
                style={{
                  padding: '8px 12px',
                  borderBottom:
                    '1px solid var(--border-subtle)',
                }}
              >

                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    color: 'var(--text-main)',
                  }}
                >
                  {userRole === 'ADMIN'
                    ? 'Administrator'
                    : activeMember?.fullName}
                </div>


                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  {userRole === 'ADMIN'
                    ? 'admin@library.org'
                    : activeMember?.email}
                </div>

              </div>


              <div style={{ padding: '6px 0' }}>

                {userRole === 'MEMBER' && (
                  <button
                    className="sidebar-nav-item"
                    style={{ padding: '8px 12px' }}
                    onClick={() => {
                      setActiveView('my-profile');
                      setShowProfileMenu(false);
                    }}
                  >

                    <svg
                      className="nav-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
                    </svg>

                    <span>My Profile</span>

                  </button>
                )}

                <button
                  className="sidebar-nav-item"
                  style={{ padding: '8px 12px' }}
                  onClick={() => {
                    openAuthModal();
                    setShowProfileMenu(false);
                  }}
                >

                  <svg
                    className="nav-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>

                  <span>Switch User Account</span>

                </button>

              </div>

            </div>

          )}

        </div>

              {/* =====================================================
                  HELP & DOCUMENTATION MODAL
              ===================================================== */}

              {showHelp && (
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1100,
                    padding: '20px',
                  }}
                  onClick={() => setShowHelp(false)}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: '100%',
                      maxWidth: '620px',
                      maxHeight: '82vh',
                      overflowY: 'auto',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '16px',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                    }}
                  >

                    {/* Header */}
                    <div
                      style={{
                        padding: '20px 24px',
                        borderBottom: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '1.15rem',
                            fontWeight: 700,
                            color: 'var(--text-main)',
                          }}
                        >
                          ❓ Help & Documentation
                        </div>

                        <div
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--text-muted)',
                            marginTop: '4px',
                          }}
                        >
                          NexRead Central Library
                        </div>
                      </div>

                      <button
                        onClick={() => setShowHelp(false)}
                        style={{
                          border: 'none',
                          background: 'none',
                          fontSize: '22px',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                        }}
                      >
                        ×
                      </button>
                    </div>


                    {/* Help Content */}
                    <div style={{ padding: '22px 24px' }}>

                      {/* Getting Started */}
                      <div style={{ marginBottom: '22px' }}>
                        <div
                          style={{
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            marginBottom: '8px',
                          }}
                        >
                          🚀 Getting Started
                        </div>

                        <div
                          style={{
                            fontSize: '0.84rem',
                            color: 'var(--text-muted)',
                            lineHeight: 1.6,
                          }}
                        >
                          Use the navigation menu to explore the library,
                          browse books, manage your account, and access
                          available library services.
                        </div>
                      </div>


                      {/* Books */}
                      <div style={{ marginBottom: '22px' }}>
                        <div
                          style={{
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            marginBottom: '8px',
                          }}
                        >
                          📚 Books & Catalog
                        </div>

                        <div
                          style={{
                            fontSize: '0.84rem',
                            color: 'var(--text-muted)',
                            lineHeight: 1.7,
                          }}
                        >
                          • Use the Catalog to search and explore available books.
                          <br />
                          • Open a book to view its details and availability.
                          <br />
                          • Members can reserve available or currently unavailable
                          books when applicable.
                        </div>
                      </div>


                      {/* Borrowing & Reservations */}
                      <div style={{ marginBottom: '22px' }}>
                        <div
                          style={{
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            marginBottom: '8px',
                          }}
                        >
                          🔖 Borrowing & Reservations
                        </div>

                        <div
                          style={{
                            fontSize: '0.84rem',
                            color: 'var(--text-muted)',
                            lineHeight: 1.7,
                          }}
                        >
                          • Members can view their borrowed books from My Loans.
                          <br />
                          • Reservations can be monitored from My Reservations.
                          <br />
                          • Reservation status and queue information are shown
                          in the notification area.
                        </div>
                      </div>


                      {/* Fines */}
                      <div style={{ marginBottom: '22px' }}>
                        <div
                          style={{
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            marginBottom: '8px',
                          }}
                        >
                          💳 Fines & Payments
                        </div>

                        <div
                          style={{
                            fontSize: '0.84rem',
                            color: 'var(--text-muted)',
                            lineHeight: 1.7,
                          }}
                        >
                          Members can view outstanding fines and payment
                          information through the Financials section.
                        </div>
                      </div>


                      {/* Profile */}
                      {userRole === 'MEMBER' && (
                        <div style={{ marginBottom: '22px' }}>
                          <div
                            style={{
                              fontWeight: 700,
                              color: 'var(--text-main)',
                              marginBottom: '8px',
                            }}
                          >
                            👤 Profile & Account
                          </div>

                          <div
                            style={{
                              fontSize: '0.84rem',
                              color: 'var(--text-muted)',
                              lineHeight: 1.7,
                            }}
                          >
                            • Open My Profile from the profile menu.
                            <br />
                            • Update your personal information.
                            <br />
                            • Change or remove your profile picture.
                          </div>
                        </div>
                      )}


                      {/* Admin */}
                      {userRole === 'ADMIN' && (
                        <div style={{ marginBottom: '22px' }}>
                          <div
                            style={{
                              fontWeight: 700,
                              color: 'var(--text-main)',
                              marginBottom: '8px',
                            }}
                          >
                            🛠️ Administration
                          </div>

                          <div
                            style={{
                              fontSize: '0.84rem',
                              color: 'var(--text-muted)',
                              lineHeight: 1.7,
                            }}
                          >
                            • Manage the book catalog.
                            <br />
                            • Manage members and circulation.
                            <br />
                            • Manage reservations, requests, and fines.
                          </div>
                        </div>
                      )}


{/* Library Contact */}
<div
  style={{
    padding: '16px',
    backgroundColor: 'var(--bg-subtle)',
    borderRadius: '10px',
    lineHeight: 1.8,
  }}
>
  <div
    style={{
      fontWeight: 700,
      color: 'var(--text-main)',
      marginBottom: '8px',
    }}
  >
    📍 Contact NexRead Library
  </div>

  <div
    style={{
      fontSize: '0.82rem',
      color: 'var(--text-muted)',
    }}
  >
    📧 library@nexread.lk
    <br />
    📞 +94 11 234 5678
    <br />
    📍 123, Main Street, Colombo 07
  </div>
</div>
                    </div>


                    {/* Footer */}
                    <div
                      style={{
                        padding: '14px 24px',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <button
                        onClick={() => setShowHelp(false)}
                        className="btn-primary-action"
                      >
                        Close
                      </button>
                    </div>

                  </div>
                </div>
              )}

        {/* =====================================================
            FULL NOTIFICATION MODAL
        ===================================================== */}

        {selectedNotification && (

          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
            onClick={() => setSelectedNotification(null)}
          >

            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '520px',
                maxHeight: '80vh',
                overflowY: 'auto',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '16px',
                boxShadow:
                  '0 20px 50px rgba(0,0,0,0.2)',
                padding: '24px',
              }}
            >

              {/* Modal Header */}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >

                <div
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                  }}
                >
                  🔔 Notifications
                </div>


                <button
                  onClick={() =>
                    setSelectedNotification(null)
                  }
                  style={{
                    border: 'none',
                    background: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                  }}
                >
                  ×
                </button>

              </div>


              {/* ALL NOTIFICATIONS */}

              {selectedNotification.type === 'ALL' ? (

                selectedNotification.notifications.map((r) => (

                  <div
                    key={r.id}
                    style={{
                      padding: '16px 0',
                      borderBottom:
                        '1px solid var(--border-subtle)',
                    }}
                  >

                    <div
                      style={{
                        fontWeight: 700,
                        color: 'var(--text-main)',
                        marginBottom: '6px',
                      }}
                    >
                      📚 Reservation Update
                    </div>


                    <div
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-main)',
                      }}
                    >
                      <strong>
                        {r.book?.title || 'Reserved Book'}
                      </strong>
                    </div>


                    <div
                      style={{
                        marginTop: '6px',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.6,
                      }}
                    >
                      Reservation: {r.reservationCode}
                      <br />

                      Queue Position: #{r.waitingPosition}
                      <br />

                      Status: {r.status}
                      <br />

                      Notification:{' '}
                      {r.notificationSent
                        ? 'Sent'
                        : 'Pending'}
                    </div>

                  </div>

                ))

              ) : (

                /* SINGLE NOTIFICATION */

                <div>

                  <div
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      marginBottom: '12px',
                    }}
                  >
                    📚 Reservation Update
                  </div>


                  <div
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      marginBottom: '14px',
                    }}
                  >
                    {selectedNotification.book?.title ||
                      'Reserved Book'}
                  </div>


                  <div
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: '10px',
                      padding: '16px',
                      fontSize: '0.85rem',
                      lineHeight: 1.7,
                      color: 'var(--text-main)',
                    }}
                  >

                    Reservation Code:

                    <strong>
                      {' '}
                      {selectedNotification.reservationCode}
                    </strong>

                    <br />

                    Queue Position:

                    <strong>
                      {' '}
                      #{selectedNotification.waitingPosition}
                    </strong>

                    <br />

                    Current Status:

                    <strong>
                      {' '}
                      {selectedNotification.status}
                    </strong>

                    <br />

                    Notification:

                    <strong>
                      {selectedNotification.notificationSent
                        ? ' Sent'
                        : ' Pending'}
                    </strong>

                  </div>

                </div>

                         )}

                          </div>

                        </div>

                      )}

                    </div>

                  </header>
                );
              }