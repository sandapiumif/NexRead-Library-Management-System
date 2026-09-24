import React from 'react';

export default function Sidebar({
  activeView,
  setActiveView,
  userRole,
  activeMember,
  unreadCount,
  openAuthModal,
  theme,
  toggleTheme,
  onLogout,
}) {
  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon-wrapper">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            <line x1="12" y1="6" x2="12" y2="12"></line>
            <line x1="9" y1="9" x2="15" y2="9"></line>
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span className="brand-name">NexRead</span>
          <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.04em' }}>
            Central Library
          </span>
        </div>
        <span className="brand-badge">{userRole === 'ADMIN' ? 'ADMIN' : 'MEMBER'}</span>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {userRole === 'ADMIN' ? (
          <>
            <div className="sidebar-section-label">Discovery & General</div>
            <button
              className={`sidebar-nav-item ${activeView === 'landing' ? 'active' : ''}`}
              onClick={() => setActiveView('landing')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>
              <span>Explore Landing</span>
            </button>

            <button
              className={`sidebar-nav-item ${activeView === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveView('overview')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Dashboard</span>
            </button>

            <button
              className={`sidebar-nav-item ${activeView === 'catalog' ? 'active' : ''}`}
              onClick={() => setActiveView('catalog')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span>Book Catalog</span>
            </button>

            <div className="sidebar-section-label">Operations & Management</div>
            <button
              className={`sidebar-nav-item ${activeView === 'reservations' ? 'active' : ''}`}
              onClick={() => setActiveView('reservations')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Reservations Queue</span>
            </button>

            <button
              className={`sidebar-nav-item ${activeView === 'fines' ? 'active' : ''}`}
              onClick={() => setActiveView('fines')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
              <span>Fines & Revenue</span>
            </button>

            <button
              className={`sidebar-nav-item ${activeView === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveView('requests')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              <span>Purchase Requests</span>
            </button>

            <div className="sidebar-section-label">Management</div>
            <button
              className={`sidebar-nav-item ${activeView === 'members' ? 'active' : ''}`}
              onClick={() => setActiveView('members')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>Members Directory</span>
            </button>
          </>
        ) : (
          <>
            <div className="sidebar-section-label">Discovery & Workspace</div>
            <button
              className={`sidebar-nav-item ${activeView === 'landing' ? 'active' : ''}`}
              onClick={() => setActiveView('landing')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>
              <span>Explore Landing</span>
            </button>

            <button
              className={`sidebar-nav-item ${activeView === 'user-dashboard' ? 'active' : ''}`}
              onClick={() => setActiveView('user-dashboard')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>My Dashboard</span>
            </button>

            <button
              className={`sidebar-nav-item ${activeView === 'catalog' ? 'active' : ''}`}
              onClick={() => setActiveView('catalog')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span>Explore Catalog</span>
            </button>

            <div className="sidebar-section-label">My Circulation</div>
            <button
              className={`sidebar-nav-item ${activeView === 'my-loans' ? 'active' : ''}`}
              onClick={() => setActiveView('my-loans')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <span>Borrowed Books</span>
            </button>

            <button
              className={`sidebar-nav-item ${activeView === 'my-reservations' ? 'active' : ''}`}
              onClick={() => setActiveView('my-reservations')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>My Reservations</span>
            </button>

            <button
              className={`sidebar-nav-item ${activeView === 'my-fines' ? 'active' : ''}`}
              onClick={() => setActiveView('my-fines')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
              <span>My Fines & Dues</span>
            </button>

            <div className="sidebar-section-label">Services</div>
            <button
              className={`sidebar-nav-item ${activeView === 'submit-request' ? 'active' : ''}`}
              onClick={() => setActiveView('submit-request')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              <span>Request New Book</span>
            </button>

            <button
              className={`sidebar-nav-item ${activeView === 'my-card' ? 'active' : ''}`}
              onClick={() => setActiveView('my-card')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <circle cx="7" cy="12" r="2"></circle>
                <path d="M16 10h2"></path>
                <path d="M16 14h2"></path>
              </svg>
              <span>Digital Member Pass</span>
            </button>

          </>
        )}
      </nav>

      {/* Footer Controls */}
      <div className="sidebar-footer">
        <button
          className="sidebar-nav-item"
          onClick={toggleTheme}
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? (
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button
          className="sidebar-nav-item"
          onClick={openAuthModal}
          style={{ color: '#ef4444' }}
        >
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Switch / Sign In</span>
        </button>
      </div>
    </aside>
  );
}
