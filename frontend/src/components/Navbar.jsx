import React from 'react';
import { BookIcon, UsersIcon, FileTextIcon, CreditCardIcon } from './Icons';

export default function Navbar({ activeTab, setActiveTab, userRole, setUserRole, theme, toggleTheme }) {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'catalog', label: 'Books Catalog' },
    { id: 'members', label: 'Members' },
    { id: 'borrow', label: 'Borrow & Loans' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'fines', label: 'Fines & Finance' },
    { id: 'requests', label: 'Book Requests' },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand" onClick={() => setActiveTab('overview')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <div className="brand-info">
            <h1>NexRead Central</h1>
            <p>Integrated Library Management System</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav>
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  id={`nav-${item.id}`}
                  className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Role Switcher & Theme */}
        <div className="nav-actions">
          <div className="role-badge" title="Switch active perspective">
            <button
              id="role-member-btn"
              className={`role-pill ${userRole === 'MEMBER' ? 'active' : ''}`}
              onClick={() => setUserRole('MEMBER')}
            >
              Member
            </button>
            <button
              id="role-librarian-btn"
              className={`role-pill ${userRole === 'LIBRARIAN' ? 'active' : ''}`}
              onClick={() => setUserRole('LIBRARIAN')}
            >
              Librarian
            </button>
          </div>

          <button
            id="theme-toggle-btn"
            className="icon-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
