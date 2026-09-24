import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import LandingPage from './components/LandingPage';
import AuthPortalModal from './components/AuthPortalModal';
import StatsOverview from './components/StatsOverview';
import BookCatalogSaaS from './components/BookCatalogSaaS';
import BorrowingDesk from './components/BorrowingDesk';
import ReservationsView from './components/ReservationsView';
import FinesPayment from './components/FinesPayment';
import BookRequestsView from './components/BookRequestsView';
import MemberRegistration from './components/MemberRegistration';
import MembershipTypeManagement from './components/MembershipTypeManagement';
import MembershipTypeChangeRequests from './components/MembershipTypeChangeRequests';

// Member Specific Views
import MemberDashboard from './components/MemberDashboard';
import MyLoansView from './components/MyLoansView';
import MyReservationsView from './components/MyReservationsView';
import MyFinesView from './components/MyFinesView';
import SubmitRequestView from './components/SubmitRequestView';
import DigitalCardView from './components/DigitalCardView';
import MemberProfile from './components/MemberProfile';

// Modals
import AddBookModal from './components/AddBookModal';
import PaymentModal from './components/PaymentModal';
import ReceiptModal from './components/ReceiptModal';

const API_BASE = 'http://localhost:8080/api';

// ─── Preloader Component ──────────────────────────────────────────────────────
function Preloader() {
  return (
    <div className="preloader-overlay">
      <div className="preloader-content">
        <div className="preloader-logo-ring">
          <div className="preloader-spinner"></div>
          <div className="preloader-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              <circle cx="12" cy="10" r="2.5"></circle>
            </svg>
          </div>
        </div>
        <div className="preloader-brand">NexRead</div>
        <div className="preloader-tagline">Loading your library experience...</div>
        <div className="preloader-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // Preloader
  const [isPreloading, setIsPreloading] = useState(true);

  // Navigation & Role State (Landing Page by default)
  const [userRole, setUserRole] = useState('MEMBER'); // 'ADMIN' or 'MEMBER'
  const [activeView, setActiveView] = useState('landing'); // 'landing' default matching reference
  const [theme, setTheme] = useState('light'); // default light matching screenshot
  const [searchQuery, setSearchQuery] = useState('');

  // Active User / Member (null when guest browsing landing page)
  const [activeMember, setActiveMember] = useState(null);

  // App Data Cache
  const [stats, setStats] = useState(null);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [fines, setFines] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [activeFineForPay, setActiveFineForPay] = useState(null);
  const [activeFineForReceipt, setActiveFineForReceipt] = useState(null);

  // Show preloader for 2.4 seconds
  useEffect(() => {
    const timer = setTimeout(() => setIsPreloading(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  // Sync Theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Fetch all initial data from Spring Boot API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, booksRes, membersRes, borrowingsRes, reservationsRes, finesRes, requestsRes] =
        await Promise.all([
          fetch(`${API_BASE}/dashboard/stats`).then((r) => r.json()),
          fetch(`${API_BASE}/books`).then((r) => r.json()),
          fetch(`${API_BASE}/members`).then((r) => r.json()),
          fetch(`${API_BASE}/borrowings`).then((r) => r.json()),
          fetch(`${API_BASE}/reservations`).then((r) => r.json()),
          fetch(`${API_BASE}/fines`).then((r) => r.json()),
          fetch(`${API_BASE}/requests`).then((r) => r.json()),
        ]);

      setStats(statsRes);
      setBooks(booksRes);
      setMembers(membersRes);
      setBorrowings(borrowingsRes);
      setReservations(reservationsRes);
      setFines(finesRes);
      setRequests(requestsRes);

      // Keep activeMember null until user explicitly selects a member or logs in
    } catch (err) {
      console.error('API fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update active member when members list refreshes
  useEffect(() => {
    if (activeMember && members.length > 0) {
      const refreshed = members.find((m) => m.id === activeMember.id);
      if (refreshed) setActiveMember(refreshed);
    }
  }, [members]);

  // Show preloader
  if (isPreloading) return <Preloader />;

  // --- API Action Handlers ---

  // Register New Member
const handleRegisterMember = async (memberData) => {
  try {
    const res = await fetch(`${API_BASE}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.error || 'Failed to register member'
      );
    }

    setMembers(prev => [...prev, data]);

    return data;

  } catch (err) {
    console.error('Registration error:', err);

    throw err;
  }
};

  // Update Member Status (Active / Suspended)
  const handleUpdateMemberStatus = async (id, status) => {
    const res = await fetch(`${API_BASE}/members/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update member status');
    await fetchData();
    return data;
  };

  // Approve Member
  const handleApproveMember = async (id) => {
    const res = await fetch(`${API_BASE}/members/${id}/approve`, {
      method: 'PUT',
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to approve member');
    }

    await fetchData();
    return data;
  };


  // Reject Member
  const handleRejectMember = async (id) => {
    const res = await fetch(`${API_BASE}/members/${id}/reject`, {
      method: 'PUT',
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to reject member');
    }

    await fetchData();
    return data;
  };

  // Verify Member Document
  const handleVerifyMemberDocument = async (id) => {
    const res = await fetch(
      `${API_BASE}/members/${id}/verification-status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationStatus: 'VERIFIED',
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.error || 'Failed to verify document'
      );
    }

    await fetchData();
    return data;
  };


  // Reject Member Document
  const handleRejectMemberDocument = async (id) => {
    const res = await fetch(
      `${API_BASE}/members/${id}/verification-status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationStatus: 'REJECTED',
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.error || 'Failed to reject document'
      );
    }

    await fetchData();
    return data;
  };

  // Add Book
  const handleAddBook = async (bookData) => {
    const res = await fetch(`${API_BASE}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add book');
    await fetchData();
    return data;
  };

// Update Book
const handleUpdateBook = async (id, bookData) => {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to update book');
  }

  await fetchData();
  return data;
};

// Archive Book
const handleDeleteBook = async (id) => {
  const book = books.find((b) => b.id === id);

  const confirmed = window.confirm(
    `Are you sure you want to archive "${book?.title || 'this book'}"?`
  );

  if (!confirmed) return;

  const res = await fetch(`${API_BASE}/books/${id}`, {
    method: 'DELETE',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to archive book');
  }

  await fetchData();
  return data;
};



// Adjust Book Stock
const handleAdjustStock = async (bookId, delta) => {
  const book = books.find((b) => b.id === bookId);

  if (!book) return;

  const newTotal = (book.totalCopies || 1) + delta;
  const newAvailable = (book.availableCopies || 0) + delta;

  // Prevent invalid stock values
  if (newTotal < 1 || newAvailable < 0 || newAvailable > newTotal) {
    throw new Error('Invalid stock adjustment');
  }

  const updatedBook = {
    ...book,
    totalCopies: newTotal,
    availableCopies: newAvailable,
    status: newAvailable > 0 ? 'AVAILABLE' : 'BORROWED',
  };

  const res = await fetch(`${API_BASE}/books/${bookId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedBook),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to adjust book stock');
  }

  await fetchData();
  return data;
};

  // Issue Book Loan
  const handleIssueBorrowing = async (memberId, bookId, notes) => {
    const res = await fetch(`${API_BASE}/borrowings/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, bookId, notes }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to issue book');
    await fetchData();
    return data;
  };

  // Return Book
  const handleReturnBook = async (borrowingId) => {
    const res = await fetch(`${API_BASE}/borrowings/${borrowingId}/return`, {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to return book');
    await fetchData();
    return data;
  };

  // Update Borrowing Record
  const handleUpdateBorrowing = async (id, borrowingData) => {
    const res = await fetch(`${API_BASE}/borrowings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(borrowingData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to update borrowing record');
    }

    await fetchData();
    return data;
  };

  // Cancel / Archive Borrowing Record
  const handleDeleteBorrowing = async (id) => {
    const res = await fetch(`${API_BASE}/borrowings/${id}`, {
      method: 'DELETE',
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to cancel borrowing record');
    }

    await fetchData();
    return data;
  };

  // Reserve Book
  const handleCreateReservation = async (memberId, bookId) => {
    const res = await fetch(`${API_BASE}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, bookId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to place reservation');
    await fetchData();
    return data;
  };

  // Cancel Reservation
  const handleCancelReservation = async (reservationId) => {
    const res = await fetch(`${API_BASE}/reservations/${reservationId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to cancel reservation');
    await fetchData();
    return data;
  };

 // Update Reservation
 const handleUpdateReservation = async (id, status) => {
   const res = await fetch(`${API_BASE}/reservations/${id}`, {
     method: 'PUT',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ status }),
   });

   const data = await res.json();

   if (!res.ok) {
     throw new Error(data.error || 'Failed to update reservation');
   }

   await fetchData();
   return data;
 };

 // Delete / Cancel Book Request
 const handleDeleteBookRequest = async (id) => {
   const res = await fetch(`${API_BASE}/requests/${id}`, {
     method: 'DELETE',
   });

   const data = await res.json();

   if (!res.ok) {
     throw new Error(data.error || 'Failed to cancel book request');
   }

   await fetchData();
   return data;
 };

 // Delete / Deactivate Member
 const handleDeleteMember = async (id) => {
  const res = await fetch(`${API_BASE}/members/${id}`, {
    method: 'DELETE',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to deactivate member');
  }

  await fetchData();
  return data;
 };

  // Settle Fine
  const handlePayFine = async (fineId, paymentMethod) => {
    const res = await fetch(`${API_BASE}/fines/${fineId}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethod }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to process payment');
    await fetchData();
    setActiveFineForPay(null);
    setActiveFineForReceipt(data);
    return data;
  };

 // Update Fine
 const handleUpdateFine = async (id, fineData) => {
   const res = await fetch(`${API_BASE}/fines/${id}`, {
     method: 'PUT',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(fineData),
   });

   const data = await res.json();

   if (!res.ok) {
     throw new Error(data.error || 'Failed to update fine');
   }

   await fetchData();
   return data;
 };

 // Delete / Cancel Fine
 const handleDeleteFine = async (id) => {
   const res = await fetch(`${API_BASE}/fines/${id}`, {
     method: 'DELETE',
   });

   const data = await res.json();

   if (!res.ok) {
     throw new Error(data.error || 'Failed to cancel fine');
   }

   await fetchData();
   return data;
 };

// Create Fine
const handleCreateFine = async (fineData) => {
  const res = await fetch(`${API_BASE}/fines`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fineData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to create fine');
  }

  await fetchData();
  return data;
};


  // Submit Book Request
  const handleSubmitBookRequest = async (requestData) => {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit book request');
    await fetchData();
    return data;
  };

  // Update Request Status (Approve / Reject)
  const handleUpdateRequestStatus = async (requestId, status, adminNotes) => {
    const res = await fetch(`${API_BASE}/requests/${requestId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNotes }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update request');
    await fetchData();
    return data;
  };

  if (activeView === 'landing') {
    return (
      <div className="landing-page-root">
        <LandingPage
          books={books}
          activeMember={activeMember}
          userRole={userRole}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onEnterDashboard={(role) => {
            if (role === 'ADMIN') {
              setUserRole('ADMIN');
              setActiveView('overview');
            } else {
              setUserRole('MEMBER');
              setActiveView('user-dashboard');
            }
          }}
          onBorrowBook={(memberId, bookId) =>
            handleIssueBorrowing(memberId, bookId, 'Direct checkout from Discovery Landing Page')
          }
          onReserveBook={handleCreateReservation}
        />

        {/* Auth & Registration Portal Modal */}
        <AuthPortalModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          members={members}
          onSelectMember={(member) => {
            setActiveMember(member);
            setUserRole('MEMBER');
            setActiveView('user-dashboard');
          }}
          onSelectAdmin={() => {
            setUserRole('ADMIN');
            setActiveView('overview');
          }}
          onRegisterMember={handleRegisterMember}
        />

        {/* Add Book Modal */}
        <AddBookModal
          isOpen={isAddBookOpen}
          onClose={() => setIsAddBookOpen(false)}
          onAddBook={handleAddBook}
        />

        {/* Payment Gateway Modal */}
        <PaymentModal
          isOpen={!!activeFineForPay}
          fine={activeFineForPay}
          onClose={() => setActiveFineForPay(null)}
          onProcessPayment={handlePayFine}
        />

        {/* Digital Receipt Modal */}
        <ReceiptModal
          isOpen={!!activeFineForReceipt}
          fine={activeFineForReceipt}
          onClose={() => setActiveFineForReceipt(null)}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* SaaS Sidebar matching reference layout */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        userRole={userRole}
        activeMember={activeMember}
        openAuthModal={() => setIsAuthModalOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main App Content */}
      <div className="app-main-content">
      <TopHeader
        activeView={activeView}
        setActiveView={setActiveView}
        userRole={userRole}
        setUserRole={setUserRole}
        activeMember={activeMember}
        reservations={reservations}
        openAddBookModal={() => setIsAddBookOpen(true)}
        openAuthModal={() => setIsAuthModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

        <main className="app-page-body">
          {/* ================= ADMIN VIEWS ================= */}
          {userRole === 'ADMIN' && (
            <>
              {activeView === 'overview' && (
                <StatsOverview
                  stats={stats}
                  setActiveView={setActiveView}
                  onOpenAddBookModal={() => setIsAddBookOpen(true)}
                />
              )}

              {activeView === 'catalog' && (
                <BookCatalogSaaS
                  books={books}
                  userRole="ADMIN"
                  onOpenAddModal={() => setIsAddBookOpen(true)}
                  onAdjustStock={handleAdjustStock}
                  onUpdateBook={handleUpdateBook}
                  onDeleteBook={handleDeleteBook}
                />
              )}

              {activeView === 'borrowings' && (
                <BorrowingDesk
                  members={members}
                  books={books}
                  borrowings={borrowings}
                  onIssueBook={handleIssueBorrowing}
                  onReturnBook={handleReturnBook}
                  onUpdateBorrowing={handleUpdateBorrowing}
                  onDeleteBorrowing={handleDeleteBorrowing}
                />
              )}

              {activeView === 'reservations' && (
                <ReservationsView
                  members={members}
                  books={books}
                  reservations={reservations}
                  onReserveBook={handleCreateReservation}
                  onCancelReservation={handleCancelReservation}
                  onUpdateReservation={handleUpdateReservation}
                />
              )}

              {activeView === 'fines' && (
                <FinesPayment
                  fines={fines}
                  members={members}
                  onOpenPaymentModal={(fine) => setActiveFineForPay(fine)}
                  onOpenReceiptModal={(fine) => setActiveFineForReceipt(fine)}
                  onUpdateFine={handleUpdateFine}
                  onDeleteFine={handleDeleteFine}
                  onCreateFine={handleCreateFine}
                />
              )}

              {activeView === 'requests' && (
                <BookRequestsView
                  members={members}
                  books={books}
                  requests={requests}
                  onSubmitRequest={handleSubmitBookRequest}
                  onUpdateRequestStatus={handleUpdateRequestStatus}
                  onDeleteBookRequest={handleDeleteBookRequest}
                />
              )}

              {activeView === 'members' && (
                <>
                  <MemberRegistration
                    members={members}
                    onRegisterMember={handleRegisterMember}
                    onUpdateMemberStatus={handleUpdateMemberStatus}
                    onDeleteMember={handleDeleteMember}
                    onApproveMember={handleApproveMember}
                    onRejectMember={handleRejectMember}
                    onVerifyMemberDocument={handleVerifyMemberDocument}
                    onRejectMemberDocument={handleRejectMemberDocument}
                  />

                  <MembershipTypeManagement />

                  <MembershipTypeChangeRequests
                    members={members}
                  />
                </>
              )}
            </>
          )}

          {/* ================= MEMBER VIEWS ================= */}
          {userRole === 'MEMBER' && (
            <>
              {activeView === 'user-dashboard' && (
                <MemberDashboard
                  activeMember={activeMember}
                  borrowings={borrowings}
                  reservations={reservations}
                  fines={fines}
                  books={books}
                  setActiveView={setActiveView}
                  onReturnBook={handleReturnBook}
                />
              )}

              {activeView === 'catalog' && (
                <BookCatalogSaaS
                  books={books}
                  userRole="MEMBER"
                  activeMember={activeMember}
                  onBorrowBook={(memberId, bookId) => handleIssueBorrowing(memberId, bookId, 'Self checkout by member')}
                  onReserveBook={handleCreateReservation}
                />
              )}

              {activeView === 'my-loans' && (
                <MyLoansView
                  activeMember={activeMember}
                  borrowings={borrowings}
                  onReturnBook={handleReturnBook}
                />
              )}


              {activeView === 'my-reservations' && (
                <MyReservationsView
                  activeMember={activeMember}
                  reservations={reservations}
                  onCancelReservation={handleCancelReservation}
                />
              )}

              {activeView === 'my-fines' && (
                <MyFinesView
                  activeMember={activeMember}
                  fines={fines}
                  onOpenPaymentModal={(fine) => setActiveFineForPay(fine)}
                  onOpenReceiptModal={(fine) => setActiveFineForReceipt(fine)}
                />
              )}

              {activeView === 'submit-request' && (
                <SubmitRequestView
                  activeMember={activeMember}
                  books={books}
                  requests={requests}
                  onSubmitRequest={handleSubmitBookRequest}
                />
              )}

              {activeView === 'my-card' && (
                <DigitalCardView activeMember={activeMember} />
              )}

              {activeView === 'my-profile' && (
                <MemberProfile
                  activeMember={activeMember}
                  onProfileUpdated={(updatedMember) => {
                    setActiveMember(updatedMember);
                  }}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Auth & Registration Portal Modal */}
      <AuthPortalModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        members={members}
        onSelectMember={(member) => {
          setActiveMember(member);
          setUserRole('MEMBER');
          setActiveView('user-dashboard');
        }}
        onSelectAdmin={() => {
          setUserRole('ADMIN');
          setActiveView('overview');
        }}
        onRegisterMember={handleRegisterMember}
      />

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        onAddBook={handleAddBook}
      />

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={!!activeFineForPay}
        fine={activeFineForPay}
        onClose={() => setActiveFineForPay(null)}
        onProcessPayment={handlePayFine}
      />

      {/* Digital Receipt Modal */}
      <ReceiptModal
        isOpen={!!activeFineForReceipt}
        fine={activeFineForReceipt}
        onClose={() => setActiveFineForReceipt(null)}
      />
    </div>
  );
}
