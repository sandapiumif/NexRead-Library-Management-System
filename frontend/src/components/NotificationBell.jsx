import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8080/api';

export default function NotificationBell({
  userRole,
  activeMember,
  setActiveView,
}) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  // =========================================================
  // LOAD NOTIFICATIONS
  // =========================================================

  const loadNotifications = async () => {
    try {
      let listUrl = '';
      let countUrl = '';

      if (userRole === 'MEMBER' && activeMember?.id) {
        listUrl =
          `${API_BASE}/notifications/member/${activeMember.id}`;

        countUrl =
          `${API_BASE}/notifications/member/${activeMember.id}/unread-count`;

      } else if (userRole === 'ADMIN') {
        listUrl =
          `${API_BASE}/notifications/admin`;

        countUrl =
          `${API_BASE}/notifications/admin/unread-count`;
      } else {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      setLoading(true);

      const [notificationsResponse, countResponse] =
        await Promise.all([
          fetch(listUrl),
          fetch(countUrl),
        ]);

      if (!notificationsResponse.ok) {
        throw new Error('Failed to load notifications.');
      }

      if (!countResponse.ok) {
        throw new Error('Failed to load notification count.');
      }

      const notificationData =
        await notificationsResponse.json();

      const countData =
        await countResponse.json();

      setNotifications(
        Array.isArray(notificationData)
          ? notificationData
          : []
      );

      setUnreadCount(
        Number(countData?.count || 0)
      );

    } catch (error) {
      console.error(
        'Failed to load notifications:',
        error
      );

      setNotifications([]);
      setUnreadCount(0);

    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // INITIAL LOAD + AUTO REFRESH
  // =========================================================

  useEffect(() => {

    loadNotifications();

    /*
     * Refresh every 10 seconds.
     *
     * This means if an admin approves/rejects something
     * while the member is already logged in, the notification
     * can appear without manually refreshing the page.
     */
    const interval = setInterval(() => {
      loadNotifications();
    }, 10000);

    return () => clearInterval(interval);

  }, [
    userRole,
    activeMember?.id,
  ]);


  // =========================================================
  // FORMAT DATE + TIME
  // =========================================================

  const formatDateTime = (dateValue) => {

    if (!dateValue) {
      return '';
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


  // =========================================================
  // NOTIFICATION ICON
  // =========================================================

  const getNotificationIcon = (type) => {

    switch (type) {

      case 'BORROWING_APPROVED':
      case 'BORROWING_ISSUED':
        return '📚';

      case 'BORROWING_REJECTED':
        return '❌';

      case 'BORROWING_RETURNED':
      case 'BORROWING_UPDATED':
      case 'BORROWING_CANCELLED':
        return '📚';

      case 'OVERDUE':
        return '⏰';

      case 'FINE':
        return '💰';

      case 'RESERVATION':
      case 'RESERVATION_CANCELLED':
      case 'RESERVATION_BOOK_AVAILABLE':
      case 'RESERVATION_FULFILLED':
      case 'RESERVATION_EXPIRED':
        return '🔖';

      case 'BOOK_REQUEST':
      case 'BOOK_REQUEST_CANCELLED':
        return '📖';

      case 'MEMBERSHIP':
      case 'MEMBERSHIP_APPROVED':
      case 'MEMBERSHIP_REJECTED':
      case 'MEMBERSHIP_TYPE_APPROVED':
      case 'MEMBERSHIP_TYPE_REJECTED':
        return '👤';

      default:
        return '🔔';
    }
  };


  // =========================================================
  // NAVIGATE TO RELATED PAGE
  // =========================================================

  const navigateToNotification = (notification) => {

    const referenceType =
      notification.referenceType;

    if (!setActiveView) {
      return;
    }

    switch (referenceType) {

      case 'BORROWING':
      case 'BORROWING_REQUEST':
        setActiveView(
          userRole === 'ADMIN'
            ? 'borrowings'
            : 'my-loans'
        );
        break;

      case 'RESERVATION':
        setActiveView(
          userRole === 'ADMIN'
            ? 'reservations'
            : 'my-reservations'
        );
        break;

      case 'BOOK_REQUEST':
        setActiveView(
          userRole === 'ADMIN'
            ? 'requests'
            : 'submit-request'
        );
        break;

      case 'FINE':
        setActiveView(
          userRole === 'ADMIN'
            ? 'fines'
            : 'my-fines'
        );
        break;

      case 'MEMBERSHIP':
        setActiveView(
          userRole === 'ADMIN'
            ? 'members'
            : 'my-profile'
        );
        break;

      default:
        break;
    }

    setShowNotifications(false);
    setSelectedNotification(null);
  };


  // =========================================================
  // MARK ONE AS READ
  // =========================================================

  const markAsRead = async (notification) => {

    try {

      if (!notification.read) {

        await fetch(
          `${API_BASE}/notifications/${notification.id}/read`,
          {
            method: 'PUT',
          }
        );

        setNotifications((previous) =>
          previous.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  read: true,
                }
              : item
          )
        );

        setUnreadCount((previous) =>
          Math.max(0, previous - 1)
        );
      }

    } catch (error) {

      console.error(
        'Failed to mark notification as read:',
        error
      );
    }
  };


  // =========================================================
  // MARK ALL AS READ
  // =========================================================

  const markAllAsRead = async () => {

    try {

      let url = '';

      if (
        userRole === 'MEMBER' &&
        activeMember?.id
      ) {

        url =
          `${API_BASE}/notifications/member/` +
          `${activeMember.id}/read-all`;

      } else if (userRole === 'ADMIN') {

        url =
          `${API_BASE}/notifications/admin/read-all`;

      } else {
        return;
      }

      const response = await fetch(
        url,
        {
          method: 'PUT',
        }
      );

      if (!response.ok) {
        throw new Error(
          'Failed to mark all notifications as read.'
        );
      }

      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          read: true,
        }))
      );

      setUnreadCount(0);

    } catch (error) {

      console.error(
        'Failed to mark all notifications as read:',
        error
      );
    }
  };


  // =========================================================
  // NOTIFICATION BELL
  // =========================================================

  if (
    userRole !== 'MEMBER' &&
    userRole !== 'ADMIN'
  ) {
    return null;
  }


  return (
    <div
      style={{
        position: 'relative',
      }}
    >

      {/* =====================================================
          BELL BUTTON
      ===================================================== */}

      <button
        className="icon-btn"
        title="Notifications"
        onClick={() => {
          setShowNotifications(
            (previous) => !previous
          );
        }}
        style={{
          position: 'relative',
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
          <path
            d="M18 8a6 6 0 0 0-12 0
               c0 7-3 7-3 9h18
               c0-2-3-2-3-9"
          />

          <path
            d="M13.73 21
               a2 2 0 0 1-3.46 0"
          />
        </svg>


        {/* =================================================
            UNREAD COUNT
        ================================================= */}

        {unreadCount > 0 && (

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
            {unreadCount > 99
              ? '99+'
              : unreadCount}
          </span>

        )}

      </button>


      {/* =====================================================
          NOTIFICATION DROPDOWN
      ===================================================== */}

      {showNotifications && (

        <div
          style={{
            position: 'absolute',
            top: '46px',
            right: '0',
            width: '380px',
            maxWidth: 'calc(100vw - 30px)',
            backgroundColor:
              'var(--bg-surface)',
            border:
              '1px solid var(--border-color)',
            borderRadius:
              'var(--radius-md)',
            boxShadow:
              'var(--shadow-dropdown)',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <div
            style={{
              padding: '14px 16px',
              borderBottom:
                '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent:
                'space-between',
            }}
          >

            <div>

              <div
                style={{
                  fontWeight: 700,
                  color:
                    'var(--text-main)',
                  fontSize: '0.95rem',
                }}
              >
                🔔 Notifications
              </div>

              <div
                style={{
                  fontSize: '0.72rem',
                  color:
                    'var(--text-muted)',
                  marginTop: '3px',
                }}
              >
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount !== 1
                        ? 's'
                        : ''
                    }`
                  : 'You are all caught up'}
              </div>

            </div>


            {/* MARK ALL */}

            {unreadCount > 0 && (

              <button
                onClick={markAllAsRead}
                style={{
                  border: 'none',
                  background: 'none',
                  color:
                    'var(--primary)',
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
              LOADING
          ================================================= */}

          {loading &&
            notifications.length === 0 && (

              <div
                style={{
                  padding: '30px',
                  textAlign: 'center',
                  color:
                    'var(--text-muted)',
                }}
              >
                Loading notifications...
              </div>

            )}


          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading &&
            notifications.length === 0 && (

              <div
                style={{
                  padding: '35px 16px',
                  textAlign: 'center',
                  color:
                    'var(--text-muted)',
                }}
              >

                <div
                  style={{
                    fontSize: '30px',
                    marginBottom: '8px',
                  }}
                >
                  🔕
                </div>

                <div
                  style={{
                    fontWeight: 600,
                  }}
                >
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

            )}


          {/* =================================================
              NOTIFICATION LIST
          ================================================= */}

          {notifications.length > 0 && (

            <div
              style={{
                maxHeight: '430px',
                overflowY: 'auto',
              }}
            >

              {notifications.map(
                (notification) => {

                  const isUnread =
                    !notification.read;

                  return (

                    <div
                      key={notification.id}
                      onClick={async () => {

                        await markAsRead(
                          notification
                        );

                        setSelectedNotification(
                          notification
                        );

                      }}
                      style={{
                        padding:
                          '14px 16px',
                        borderBottom:
                          '1px solid var(--border-subtle)',
                        backgroundColor:
                          isUnread
                            ? 'rgba(99, 102, 241, 0.06)'
                            : 'transparent',
                        cursor: 'pointer',
                        position:
                          'relative',
                        transition:
                          'background-color 0.2s',
                      }}
                    >

                      {/* UNREAD DOT */}

                      {isUnread && (

                        <span
                          style={{
                            position:
                              'absolute',
                            left: '7px',
                            top: '19px',
                            width: '7px',
                            height: '7px',
                            borderRadius:
                              '50%',
                            backgroundColor:
                              '#ef4444',
                          }}
                        />

                      )}


                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                        }}
                      >

                        {/* ICON */}

                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            minWidth: '34px',
                            borderRadius:
                              '10px',
                            backgroundColor:
                              isUnread
                                ? 'rgba(99, 102, 241, 0.12)'
                                : 'var(--bg-subtle)',
                            display: 'flex',
                            alignItems:
                              'center',
                            justifyContent:
                              'center',
                            fontSize: '17px',
                          }}
                        >
                          {getNotificationIcon(
                            notification.type
                          )}
                        </div>


                        {/* CONTENT */}

                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                          }}
                        >

                          <div
                            style={{
                              display: 'flex',
                              justifyContent:
                                'space-between',
                              gap: '8px',
                            }}
                          >

                            <div
                              style={{
                                fontWeight: 700,
                                color:
                                  'var(--text-main)',
                                fontSize:
                                  '0.84rem',
                              }}
                            >
                              {notification.title}
                            </div>

                            {isUnread && (

                              <span
                                style={{
                                  fontSize:
                                    '0.62rem',
                                  fontWeight: 700,
                                  color:
                                    '#ef4444',
                                }}
                              >
                                NEW
                              </span>

                            )}

                          </div>


                          <div
                            style={{
                              fontSize:
                                '0.79rem',
                              color:
                                'var(--text-main)',
                              lineHeight: 1.5,
                              marginTop: '4px',
                            }}
                          >
                            {notification.message}
                          </div>


                          {/* EXACT DATE + TIME */}

                          <div
                            style={{
                              fontSize:
                                '0.68rem',
                              color:
                                'var(--text-muted)',
                              marginTop: '7px',
                            }}
                          >
                            🕐{' '}
                            {formatDateTime(
                              notification.createdAt
                            )}
                          </div>

                        </div>

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          )}

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
            backgroundColor:
              'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: '20px',
          }}
          onClick={() =>
            setSelectedNotification(null)
          }
        >

          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              width: '100%',
              maxWidth: '500px',
              backgroundColor:
                'var(--bg-surface)',
              borderRadius: '16px',
              boxShadow:
                '0 20px 50px rgba(0,0,0,0.25)',
              padding: '24px',
            }}
          >

            {/* MODAL HEADER */}

            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >

              <div
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color:
                    'var(--text-main)',
                }}
              >
                {getNotificationIcon(
                  selectedNotification.type
                )}{' '}
                {selectedNotification.title}
              </div>

              <button
                onClick={() =>
                  setSelectedNotification(null)
                }
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '22px',
                  color:
                    'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>

            </div>


            {/* MESSAGE */}

            <div
              style={{
                padding: '16px',
                backgroundColor:
                  'var(--bg-subtle)',
                borderRadius: '10px',
                color:
                  'var(--text-main)',
                fontSize: '0.88rem',
                lineHeight: 1.7,
              }}
            >
              {selectedNotification.message}
            </div>


            {/* DATE + TIME */}

            <div
              style={{
                marginTop: '14px',
                fontSize: '0.75rem',
                color:
                  'var(--text-muted)',
              }}
            >
              📅{' '}
              {formatDateTime(
                selectedNotification.createdAt
              )}
            </div>


            {/* ACTION */}

            {selectedNotification.referenceType && (

              <button
                className="btn btn-primary"
                style={{
                  marginTop: '18px',
                  width: '100%',
                }}
                onClick={() =>
                  navigateToNotification(
                    selectedNotification
                  )
                }
              >
                View Related Section →
              </button>

            )}

          </div>

        </div>

      )}

    </div>
  );
}