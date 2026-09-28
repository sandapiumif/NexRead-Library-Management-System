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
import MyBorrowingRequestsView from './components/MyBorrowingRequestsView';

// Member Specific Views
import MemberDashboard from './components/MemberDashboard';
import MyLoansView from './components/MyLoansView';
import MyBorrowingHistoryView from './components/MyBorrowingHistoryView';
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

// ─── Preloader Component ────────────────────────────────────────────────

function Preloader() {
  return (
    <div className="preloader-overlay">
      <div className="preloader-content">

        <div className="preloader-logo-ring">
          <div className="preloader-spinner"></div>

          <div className="preloader-icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>

              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>

              <circle
                cx="12"
                cy="10"
                r="2.5"
              ></circle>
            </svg>
          </div>
        </div>

        <div className="preloader-brand">
          NexRead
        </div>

        <div className="preloader-tagline">
          Loading your library experience...
        </div>

        <div className="preloader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────

export default function App() {

  // Preloader
  const [isPreloading, setIsPreloading] = useState(true);

  // Navigation & Role State
  const [userRole, setUserRole] = useState('MEMBER');
  const [activeView, setActiveView] = useState('landing');
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');

  // Active User / Member
  const [activeMember, setActiveMember] = useState(null);

  // App Data Cache
  const [stats, setStats] = useState(null);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [borrowingRequests, setBorrowingRequests] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [fines, setFines] = useState([]);
  const [requests, setRequests] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [membershipPayments, setMembershipPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [activeFineForPay, setActiveFineForPay] = useState(null);
  const [activeFineForReceipt, setActiveFineForReceipt] = useState(null);
  const [activeInvoice, setActiveInvoice] = useState(null);

  // ─────────────────────────────────────────────────────────────────────
  // PRELOADER
  // ─────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(
      () => setIsPreloading(false),
      2400
    );

    return () => clearTimeout(timer);
  }, []);

  // ─────────────────────────────────────────────────────────────────────
  // THEME
  // ─────────────────────────────────────────────────────────────────────

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      theme
    );
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === 'light'
        ? 'dark'
        : 'light'
    );
  };

  // ─────────────────────────────────────────────────────────────────────
  // FETCH ALL DATA
  // ─────────────────────────────────────────────────────────────────────

   const fetchData = async () => {
     try {
       setLoading(true);

       const fetchJson = async (url, fallback = []) => {
         try {
           const response = await fetch(url);

           if (!response.ok) {
             console.error(
               `API error ${response.status}: ${url}`
             );
             return fallback;
           }

           return await response.json();

         } catch (error) {
           console.error(
             `Failed to fetch ${url}:`,
             error
           );

           return fallback;
         }
       };

       const [
         statsRes,
         booksRes,
         membersRes,
         borrowingsRes,
         reservationsRes,
         finesRes,
         requestsRes,
         borrowingRequestsRes,
         refundsRes,
         membershipPaymentsRes,
       ] = await Promise.all([

         fetchJson(
           `${API_BASE}/dashboard/stats`,
           null
         ),

         fetchJson(
           `${API_BASE}/books`,
           []
         ),

         fetchJson(
           `${API_BASE}/members`,
           []
         ),

         fetchJson(
           `${API_BASE}/borrowings`,
           []
         ),

         fetchJson(
           `${API_BASE}/reservations`,
           []
         ),

         fetchJson(
           `${API_BASE}/fines`,
           []
         ),

         fetchJson(
           `${API_BASE}/requests`,
           []
         ),

         fetchJson(
           `${API_BASE}/borrowing-requests`,
           []
         ),

         fetchJson(
           `${API_BASE}/refunds`,
           []
         ),

         fetchJson(
           `${API_BASE}/membership-payments`,
           []
         ),

       ]);

       // Update application data
       setStats(statsRes);

       setBooks(
         Array.isArray(booksRes)
           ? booksRes
           : []
       );

       setMembers(
         Array.isArray(membersRes)
           ? membersRes
           : []
       );

       setBorrowings(
         Array.isArray(borrowingsRes)
           ? borrowingsRes
           : []
       );

       setReservations(
         Array.isArray(reservationsRes)
           ? reservationsRes
           : []
       );

       setFines(
         Array.isArray(finesRes)
           ? finesRes
           : []
       );

       setRequests(
         Array.isArray(requestsRes)
           ? requestsRes
           : []
       );

       setBorrowingRequests(
         Array.isArray(borrowingRequestsRes)
           ? borrowingRequestsRes
           : []
       );

       setRefunds(
         Array.isArray(refundsRes)
           ? refundsRes
           : []
       );

       setMembershipPayments(
         Array.isArray(membershipPaymentsRes)
           ? membershipPaymentsRes
           : []
       );

     } catch (err) {

       console.error(
         'API fetch error:',
         err
       );

     } finally {

       setLoading(false);

     }
   };

      useEffect(() => {
        fetchData();
      }, []);

  // ─────────────────────────────────────────────────────────────────────
  // UPDATE ACTIVE MEMBER AFTER DATA REFRESH
  // ─────────────────────────────────────────────────────────────────────

  useEffect(() => {

    if (
      activeMember &&
      members.length > 0
    ) {

      const refreshed =
        members.find(
          (m) =>
            m.id === activeMember.id
        );

      if (refreshed) {
        setActiveMember(refreshed);
      }
    }

  }, [members]);

  // ─────────────────────────────────────────────────────────────────────
  // PRELOADER
  // ─────────────────────────────────────────────────────────────────────

  if (isPreloading) {
    return <Preloader />;
  }

  // ═════════════════════════════════════════════════════════════════════
  // API ACTION HANDLERS
  // ═════════════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────────────
  // REGISTER MEMBER
  // ─────────────────────────────────────────────────────────────────────

  const handleRegisterMember = async (
    memberData
  ) => {

    try {

      const res = await fetch(
        `${API_BASE}/members`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify(
            memberData
          ),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to register member'
        );
      }

      setMembers(
        (prev) => [
          ...prev,
          data,
        ]
      );

      return data;

    } catch (err) {

      console.error(
        'Registration error:',
        err
      );

      throw err;
    }
  };

  // ─────────────────────────────────────────────────────────────────────
  // UPDATE MEMBER STATUS
  // ─────────────────────────────────────────────────────────────────────

  const handleUpdateMemberStatus =
    async (
      id,
      status
    ) => {

      const res =
        await fetch(
          `${API_BASE}/members/${id}/status`,
          {
            method: 'PUT',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              status,
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to update member status'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // APPROVE MEMBER
  // ─────────────────────────────────────────────────────────────────────

  const handleApproveMember =
    async (id) => {

      const res =
        await fetch(
          `${API_BASE}/members/${id}/approve`,
          {
            method: 'PUT',
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to approve member'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // REJECT MEMBER
  // ─────────────────────────────────────────────────────────────────────

  const handleRejectMember =
    async (id, reason) => {

      const res =
        await fetch(
          `${API_BASE}/members/${id}/reject`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              reason,
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to reject member'
        );
      }

      await fetchData();

      return data;
    };
  // ─────────────────────────────────────────────────────────────────────
  // VERIFY MEMBER DOCUMENT
  // ─────────────────────────────────────────────────────────────────────

  const handleVerifyMemberDocument =
    async (id) => {

      const res =
        await fetch(
          `${API_BASE}/members/${id}/verification-status`,
          {
            method: 'PUT',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              verificationStatus:
                'VERIFIED',
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to verify document'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // REJECT MEMBER DOCUMENT
  // ─────────────────────────────────────────────────────────────────────

const handleRejectMemberDocument =
  async (id, reason) => {

    const res =
      await fetch(
        `${API_BASE}/members/${id}/verification-status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            verificationStatus: 'REJECTED',
            reason,
          }),
        }
      );

    const data =
      await res.json();

    if (!res.ok) {

      throw new Error(
        data.error ||
        'Failed to reject document'
      );
    }

    await fetchData();

    return data;
  };

  // ─────────────────────────────────────────────────────────────────────
  // ADD BOOK
  // ─────────────────────────────────────────────────────────────────────

  const handleAddBook =
    async (bookData) => {

      const res =
        await fetch(
          `${API_BASE}/books`,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify(
              bookData
            ),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to add book'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // UPDATE BOOK
  // ─────────────────────────────────────────────────────────────────────

  const handleUpdateBook =
    async (
      id,
      bookData
    ) => {

      const res =
        await fetch(
          `${API_BASE}/books/${id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify(
              bookData
            ),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to update book'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // ARCHIVE BOOK
  // ─────────────────────────────────────────────────────────────────────

  const handleDeleteBook =
    async (id) => {

      const book =
        books.find(
          (b) => b.id === id
        );

      const confirmed =
        window.confirm(
          `Are you sure you want to archive "${book?.title || 'this book'}"?`
        );

      if (!confirmed) {
        return;
      }

      const res =
        await fetch(
          `${API_BASE}/books/${id}`,
          {
            method: 'DELETE',
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to archive book'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // GET ARCHIVED BOOKS
  // ─────────────────────────────────────────────────────────────────────

  const handleGetArchivedBooks =
    async () => {

      const res =
        await fetch(
          `${API_BASE}/books/archived`
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to load archived books'
        );
      }

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // RESTORE BOOK
  // ─────────────────────────────────────────────────────────────────────

  const handleRestoreBook =
    async (id) => {

      const res =
        await fetch(
          `${API_BASE}/books/${id}/restore`,
          {
            method: 'PUT',
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to restore book'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // ADJUST BOOK STOCK
  // ─────────────────────────────────────────────────────────────────────

  const handleAdjustStock =
    async (
      bookId,
      delta
    ) => {

      const book =
        books.find(
          (b) =>
            b.id === bookId
        );

      if (!book) {
        return;
      }

      const newTotal =
        (book.totalCopies || 1) +
        delta;

      const newAvailable =
        (book.availableCopies || 0) +
        delta;

      if (
        newTotal < 1 ||
        newAvailable < 0 ||
        newAvailable > newTotal
      ) {

        throw new Error(
          'Invalid stock adjustment'
        );
      }

      const updatedBook = {
        ...book,
        totalCopies:
          newTotal,
        availableCopies:
          newAvailable,
        status:
          newAvailable > 0
            ? 'AVAILABLE'
            : 'BORROWED',
      };

      const res =
        await fetch(
          `${API_BASE}/books/${bookId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify(
              updatedBook
            ),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to adjust book stock'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // ISSUE BOOK LOAN
  // ─────────────────────────────────────────────────────────────────────

  const handleIssueBorrowing =
    async (
      memberId,
      bookId,
      notes
    ) => {

      const res =
        await fetch(
          `${API_BASE}/borrowings/issue`,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              memberId,
              bookId,
              notes,
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to issue book'
        );
      }

      await fetchData();

      return data;
    };

  // ═════════════════════════════════════════════════════════════════════
  // BORROWING REQUESTS
  // ═════════════════════════════════════════════════════════════════════

  // Create Borrowing Request
  const handleCreateBorrowingRequest =
    async (
      memberId,
      bookId,
      notes = ''
    ) => {

      const res =
        await fetch(
          `${API_BASE}/borrowing-requests`,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              memberId,
              bookId,
              notes,
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to create borrowing request'
        );
      }

      await fetchData();

      return data;
    };

  // Cancel Borrowing Request
  const handleCancelBorrowingRequest =
    async (
      requestId,
      memberId
    ) => {

      const res =
        await fetch(
          `${API_BASE}/borrowing-requests/${requestId}/cancel`,
          {
            method: 'PUT',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              memberId,
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to cancel borrowing request'
        );
      }

      await fetchData();

      return data;
    };

  // Approve Borrowing Request
  const handleApproveBorrowingRequest =
    async (requestId) => {

      const res =
        await fetch(
          `${API_BASE}/borrowing-requests/${requestId}/approve`,
          {
            method: 'PUT',
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to approve borrowing request'
        );
      }

      await fetchData();

      return data;
    };

  // Reject Borrowing Request
  const handleRejectBorrowingRequest =
    async (
      requestId,
      reason
    ) => {

      const res =
        await fetch(
          `${API_BASE}/borrowing-requests/${requestId}/reject`,
          {
            method: 'PUT',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              reason,
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to reject borrowing request'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // RETURN BOOK
  // ─────────────────────────────────────────────────────────────────────

  const handleReturnBook =
    async (borrowingId) => {

      const res =
        await fetch(
          `${API_BASE}/borrowings/${borrowingId}/return`,
          {
            method: 'POST',
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to return book'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // UPDATE BORROWING RECORD
  // ─────────────────────────────────────────────────────────────────────

  const handleUpdateBorrowing =
    async (
      id,
      borrowingData
    ) => {

      const res =
        await fetch(
          `${API_BASE}/borrowings/${id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify(
              borrowingData
            ),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to update borrowing record'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // DELETE / CANCEL BORROWING
  // ─────────────────────────────────────────────────────────────────────

  const handleDeleteBorrowing =
    async (id) => {

      const res =
        await fetch(
          `${API_BASE}/borrowings/${id}`,
          {
            method: 'DELETE',
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to cancel borrowing record'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // RESERVE BOOK
  // ─────────────────────────────────────────────────────────────────────

  const handleCreateReservation =
    async (
      memberId,
      bookId
    ) => {

      const res =
        await fetch(
          `${API_BASE}/reservations`,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              memberId,
              bookId,
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to place reservation'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // CANCEL RESERVATION
  // ─────────────────────────────────────────────────────────────────────

  const handleCancelReservation =
    async (
      reservationId
    ) => {

      const res =
        await fetch(
          `${API_BASE}/reservations/${reservationId}`,
          {
            method: 'DELETE',
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to cancel reservation'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // UPDATE RESERVATION
  // ─────────────────────────────────────────────────────────────────────

  const handleUpdateReservation =
    async (
      id,
      status
    ) => {

      const res =
        await fetch(
          `${API_BASE}/reservations/${id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              status,
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to update reservation'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // DELETE / CANCEL BOOK REQUEST
  // ─────────────────────────────────────────────────────────────────────

  const handleDeleteBookRequest =
    async (id) => {

      const res =
        await fetch(
          `${API_BASE}/requests/${id}`,
          {
            method: 'DELETE',
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to cancel book request'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // DELETE / DEACTIVATE MEMBER
  // ─────────────────────────────────────────────────────────────────────

  const handleDeleteMember =
    async (id) => {

      const res =
        await fetch(
          `${API_BASE}/members/${id}`,
          {
            method: 'DELETE',
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to deactivate member'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // PAY FINE
  // ─────────────────────────────────────────────────────────────────────

  const handlePayFine =
    async (
      fineId,
      paymentMethod
    ) => {

      const res =
        await fetch(
          `${API_BASE}/fines/${fineId}/pay`,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              paymentMethod,
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to process payment'
        );
      }

      await fetchData();

      setActiveFineForPay(
        null
      );

      setActiveFineForReceipt(
        data
      );

      return data;
    };


  // ─────────────────────────────────────────────────────────────────────
  // GENERATE / GET INVOICE
  // ─────────────────────────────────────────────────────────────────────

  const handleOpenInvoice = async (fine) => {
    try {
      // First try to get an existing invoice
      const existingRes = await fetch(
        `${API_BASE}/invoices/fine/${fine.id}`
      );

      if (existingRes.ok) {
        const invoice = await existingRes.json();
        setActiveInvoice({
          ...invoice,
          fine: fine,
        });
        return;
      }

      // If invoice does not exist, generate it using the fine code
      const generateRes = await fetch(
        `${API_BASE}/invoices/generate-by-code/${encodeURIComponent(
          fine.fineCode
        )}`,
        {
          method: 'POST',
        }
      );

      const data = await generateRes.json();

      if (!generateRes.ok) {
        throw new Error(
          data.error || 'Failed to generate invoice'
        );
      }

     setActiveInvoice({
       ...data,
       fine: fine,
     });
    } catch (err) {
      console.error('Invoice error:', err);
      alert(err.message || 'Failed to open invoice');
    }
  };

// ─────────────────────────────────────────────────────────────────────
// PROCESS REFUND
// ─────────────────────────────────────────────────────────────────────

const handleProcessRefund = async (fine) => {
  try {
    // Check whether a refund already exists
    const existingRes = await fetch(
      `${API_BASE}/refunds/fine/${fine.id}`
    );

    if (existingRes.ok) {
      const existingRefund = await existingRes.json();

      alert(
        `A refund has already been processed for this fine.\n\n` +
        `Reference: ${existingRefund.refundReference}\n` +
        `Amount: LKR ${Number(existingRefund.amount || 0).toFixed(2)}\n` +
        `Status: ${existingRefund.status}`
      );

      return;
    }

    const reason = window.prompt(
      `Enter refund reason for ${fine.fineCode}:`
    );

    if (reason === null) {
      return;
    }

    if (!reason.trim()) {
      alert('Refund reason is required.');
      return;
    }

    const res = await fetch(
      `${API_BASE}/refunds/process/${fine.id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: reason.trim(),
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.error || 'Failed to process refund'
      );
    }

    alert(
      `Refund processed successfully!\n\n` +
      `Reference: ${data.refundReference}\n` +
      `Amount: LKR ${Number(data.amount || 0).toFixed(2)}\n` +
      `Status: ${data.status}`
    );

    await fetchData();

    return data;

  } catch (err) {
    console.error('Refund error:', err);
    alert(err.message || 'Failed to process refund');
  }
};

  // ─────────────────────────────────────────────────────────────────────
  // UPDATE FINE
  // ─────────────────────────────────────────────────────────────────────

  const handleUpdateFine =
    async (
      id,
      fineData
    ) => {

      const res =
        await fetch(
          `${API_BASE}/fines/${id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify(
              fineData
            ),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to update fine'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // DELETE / CANCEL FINE
  // ─────────────────────────────────────────────────────────────────────

  const handleDeleteFine =
    async (id) => {

      const res =
        await fetch(
          `${API_BASE}/fines/${id}`,
          {
            method: 'DELETE',
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to cancel fine'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // CREATE FINE
  // ─────────────────────────────────────────────────────────────────────

  const handleCreateFine =
    async (fineData) => {

      const res =
        await fetch(
          `${API_BASE}/fines`,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify(
              fineData
            ),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to create fine'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // SUBMIT BOOK REQUEST
  // ─────────────────────────────────────────────────────────────────────

  const handleSubmitBookRequest =
    async (requestData) => {

      const res =
        await fetch(
          `${API_BASE}/requests`,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify(
              requestData
            ),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to submit book request'
        );
      }

      await fetchData();

      return data;
    };

  // ─────────────────────────────────────────────────────────────────────
  // UPDATE BOOK REQUEST STATUS
  // ─────────────────────────────────────────────────────────────────────

  const handleUpdateRequestStatus =
    async (
      requestId,
      status,
      adminNotes
    ) => {

      const res =
        await fetch(
          `${API_BASE}/requests/${requestId}/status`,
          {
            method: 'PUT',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              status,
              adminNotes,
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
          'Failed to update request'
        );
      }

      await fetchData();

      return data;
    };

    // ─────────────────────────────────────────────────────────────────────
    // UPDATE BOOK REQUEST PRIORITY
    // ─────────────────────────────────────────────────────────────────────

    const handleUpdateRequestPriority = async (requestId, priority) => {
      const res = await fetch(
        `${API_BASE}/requests/${requestId}/priority`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ priority }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'Failed to update request priority'
        );
      }

      await fetchData();

      return data;
    };

   // UPDATE BOOK REQUEST PURCHASE RECOMMENDATION
   const handleUpdatePurchaseRecommendation = async (
     requestId,
     recommendation
   ) => {
     try {
       const res = await fetch(
         `${API_BASE}/requests/${requestId}/purchase-recommendation`,
         {
           method: 'PUT',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
             recommendation,
           }),
         }
       );

       const data = await res.json();

       if (!res.ok) {
         throw new Error(
           data.error ||
             'Failed to update purchase recommendation'
         );
       }

       // Refresh requests so the new recommendation appears immediately
       await fetchData();

       return data;
     } catch (err) {
       console.error(
         'Purchase recommendation error:',
         err
       );

       alert(
         err.message ||
           'Failed to update purchase recommendation'
       );

       throw err;
     }
   };

  // ═════════════════════════════════════════════════════════════════════
  // LANDING PAGE
  // ═════════════════════════════════════════════════════════════════════

  if (activeView === 'landing') {

    return (
      <div className="landing-page-root">

        <LandingPage
          books={books}
          activeMember={activeMember}
          userRole={userRole}

          onOpenAuthModal={() =>
            setIsAuthModalOpen(true)
          }

          onEnterDashboard={(role) => {

            if (role === 'ADMIN') {

              setUserRole('ADMIN');
              setActiveView('overview');

            } else {

              setUserRole('MEMBER');
              setActiveView(
                'user-dashboard'
              );
            }
          }}

          onBorrowBook={(
            memberId,
            bookId
          ) =>
            handleCreateBorrowingRequest(
              memberId,
              bookId,
              'Member borrowing request from Discovery Landing Page'
            )
          }

          onReserveBook={
            handleCreateReservation
          }
        />

        {/* Auth & Registration Portal Modal */}

        <AuthPortalModal
          isOpen={
            isAuthModalOpen
          }

          onClose={() =>
            setIsAuthModalOpen(false)
          }

          members={members}

          onSelectMember={(member) => {

            setActiveMember(member);

            setUserRole(
              'MEMBER'
            );

            setActiveView(
              'user-dashboard'
            );
          }}

          onSelectAdmin={() => {

            setUserRole(
              'ADMIN'
            );

            setActiveView(
              'overview'
            );
          }}

          onRegisterMember={
            handleRegisterMember
          }
        />

        {/* Add Book Modal */}

        <AddBookModal
          isOpen={
            isAddBookOpen
          }

          onClose={() =>
            setIsAddBookOpen(false)
          }

          onAddBook={
            handleAddBook
          }
        />

        {/* Payment Gateway Modal */}

        <PaymentModal
          isOpen={
            !!activeFineForPay
          }

          fine={
            activeFineForPay
          }

          onClose={() =>
            setActiveFineForPay(null)
          }

          onProcessPayment={
            handlePayFine
          }
        />

        {/* Digital Receipt Modal */}

        <ReceiptModal
          isOpen={
            !!activeFineForReceipt
          }

          fine={
            activeFineForReceipt
          }

          onClose={() =>
            setActiveFineForReceipt(null)
          }
        />

      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════
  // MAIN APPLICATION
  // ═════════════════════════════════════════════════════════════════════

  return (

    <div className="app-container">

      {/* Sidebar */}

      <Sidebar
        activeView={
          activeView
        }

        setActiveView={
          setActiveView
        }

        userRole={
          userRole
        }

        activeMember={
          activeMember
        }

        openAuthModal={() =>
          setIsAuthModalOpen(true)
        }

        theme={
          theme
        }

        toggleTheme={
          toggleTheme
        }
      />

      {/* Main App Content */}

      <div className="app-main-content">

        <TopHeader
          activeView={
            activeView
          }

          setActiveView={
            setActiveView
          }

          userRole={
            userRole
          }

          setUserRole={
            setUserRole
          }

          activeMember={
            activeMember
          }

          reservations={
            reservations
          }

          openAddBookModal={() =>
            setIsAddBookOpen(true)
          }

          openAuthModal={() =>
            setIsAuthModalOpen(true)
          }

          searchQuery={
            searchQuery
          }

          setSearchQuery={
            setSearchQuery
          }
        />

        <main className="app-page-body">

          {/* ═══════════════════════════════════════════════════════════
              ADMIN VIEWS
          ═══════════════════════════════════════════════════════════ */}

          {userRole === 'ADMIN' && (

            <>

              {/* Overview */}

              {activeView === 'overview' && (

                <StatsOverview
                  stats={stats}
                  setActiveView={
                    setActiveView
                  }
                  onOpenAddBookModal={() =>
                    setIsAddBookOpen(true)
                  }
                />

              )}

              {/* Catalog */}

              {activeView === 'catalog' && (

                <BookCatalogSaaS
                  books={books}
                  userRole="ADMIN"

                  onOpenAddModal={() =>
                    setIsAddBookOpen(true)
                  }

                  onAdjustStock={
                    handleAdjustStock
                  }

                  onUpdateBook={
                    handleUpdateBook
                  }

                  onDeleteBook={
                    handleDeleteBook
                  }

                  onRestoreBook={
                    handleRestoreBook
                  }
                />

              )}

              {/* Borrowings */}

              {activeView === 'borrowings' && (

                <BorrowingDesk
                  members={
                    members
                  }

                  books={
                    books
                  }

                  borrowings={
                    borrowings
                  }

                  borrowingRequests={
                    borrowingRequests
                  }

                  onIssueBook={
                    handleIssueBorrowing
                  }

                  onReturnBook={
                    handleReturnBook
                  }

                  onUpdateBorrowing={
                    handleUpdateBorrowing
                  }

                  onDeleteBorrowing={
                    handleDeleteBorrowing
                  }

                  onApproveBorrowingRequest={
                    handleApproveBorrowingRequest
                  }

                  onRejectBorrowingRequest={
                    handleRejectBorrowingRequest
                  }
                />

              )}

              {/* Reservations */}

              {activeView === 'reservations' && (

                <ReservationsView
                  members={
                    members
                  }

                  books={
                    books
                  }

                  reservations={
                    reservations
                  }

                  onReserveBook={
                    handleCreateReservation
                  }

                  onCancelReservation={
                    handleCancelReservation
                  }

                  onUpdateReservation={
                    handleUpdateReservation
                  }
                />

              )}

              {/* Fines */}

              {activeView === 'fines' && (

                <FinesPayment
                  fines={fines}
                  members={members}
                  refunds={refunds}



                  onOpenPaymentModal={ (fine) =>
                    setActiveFineForPay(
                      fine
                    )
                  }

                  onOpenReceiptModal={(
                    fine
                  ) =>
                    setActiveFineForReceipt(fine)
                  }


                  onProcessRefund={
                    handleProcessRefund
                  }

                  onUpdateFine={
                    handleUpdateFine
                  }

                  onDeleteFine={
                    handleDeleteFine
                  }

                  onCreateFine={
                    handleCreateFine
                  }
                />

              )}



              {activeView === 'fines' && (
<section
                              style={{
                  marginTop: '24px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '18px',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <h2 style={{ margin: 0 }}>
                      Membership Payment Records
                    </h2>

                    <div
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.85rem',
                        marginTop: '5px',
                      }}
                    >
                      Membership registration and renewal payment history
                    </div>
                  </div>

                  <span className="status-pill">
                    {membershipPayments.length} Records
                  </span>
                </div>

                <div
                  style={{
                    overflowX: 'auto',
                    width: '100%',
                  }}
                >
                  <table
                    className="data-table"
                    style={{
                      width: '100%',
                      minWidth: '1250px',
                      borderCollapse: 'separate',
                      borderSpacing: '0',
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            minWidth: '150px',
                            padding: '14px 16px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Payment Code
                        </th>

                        <th
                          style={{
                            minWidth: '200px',
                            padding: '14px 16px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Member
                        </th>

                        <th
                          style={{
                            minWidth: '150px',
                            padding: '14px 16px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Membership Type
                        </th>

                        <th
                          style={{
                            minWidth: '130px',
                            padding: '14px 16px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Payment Type
                        </th>

                        <th
                          style={{
                            minWidth: '130px',
                            padding: '14px 16px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Amount
                        </th>

                        <th
                          style={{
                            minWidth: '150px',
                            padding: '14px 16px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Method
                        </th>

                        <th
                          style={{
                            minWidth: '100px',
                            padding: '14px 16px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Status
                        </th>

                        <th
                          style={{
                            minWidth: '200px',
                            padding: '14px 16px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Receipt
                        </th>

                        <th
                          style={{
                            minWidth: '130px',
                            padding: '14px 16px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Payment Date
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {membershipPayments.length === 0 ? (
                        <tr>
                          <td
                            colSpan="9"
                            style={{
                              textAlign: 'center',
                              padding: '28px',
                              color: 'var(--text-muted)',
                            }}
                          >
                            No membership payment records found.
                          </td>
                        </tr>
                      ) : (
                        [...membershipPayments]
                          .sort(
                            (a, b) =>
                              new Date(b.paidAt || b.createdAt || 0) -
                              new Date(a.paidAt || a.createdAt || 0)
                          )
                          .map((payment) => (
                            <tr key={payment.id}>

                              {/* Payment Code */}
                              <td
                                style={{
                                  padding: '16px',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <strong>
                                  {payment.paymentCode || '—'}
                                </strong>
                              </td>

                              {/* Member */}
                              <td
                                style={{
                                  padding: '16px',
                                  minWidth: '200px',
                                }}
                              >
                                <div
                                  style={{
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {payment.member?.fullName || '—'}
                                </div>

                                <div
                                  style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.78rem',
                                    marginTop: '4px',
                                  }}
                                >
                                  {payment.member?.memberCode || '—'}
                                </div>
                              </td>

                              {/* Membership Type */}
                              <td
                                style={{
                                  padding: '16px',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {payment.membershipType || '—'}
                              </td>

                              {/* Payment Type */}
                              <td
                                style={{
                                  padding: '16px',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {payment.paymentType || '—'}
                              </td>

                              {/* Amount */}
                              <td
                                style={{
                                  padding: '16px',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <strong>
                                  LKR{' '}
                                  {Number(payment.amount || 0).toFixed(2)}
                                </strong>
                              </td>

                              {/* Method */}
                              <td
                                style={{
                                  padding: '16px',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {payment.paymentMethod
                                  ? payment.paymentMethod.replaceAll(
                                      '_',
                                      ' '
                                    )
                                  : '—'}
                              </td>

                              {/* Status */}
                              <td
                                style={{
                                  padding: '16px',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <span
                                  className={
                                    String(payment.status).toUpperCase() ===
                                    'PAID'
                                      ? 'status-pill status-paid'
                                      : 'status-pill'
                                  }
                                >
                                  {payment.status || '—'}
                                </span>
                              </td>

                              {/* Receipt */}
                              <td
                                style={{
                                  padding: '16px',
                                  whiteSpace: 'nowrap',
                                  fontSize: '0.88rem',
                                }}
                              >
                                {payment.receiptNumber || '—'}
                              </td>

                              {/* Payment Date */}
                              <td
                                style={{
                                  padding: '16px',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {payment.paidAt
                                  ? new Date(
                                      payment.paidAt
                                    ).toLocaleDateString()
                                  : payment.createdAt
                                    ? new Date(
                                        payment.createdAt
                                      ).toLocaleDateString()
                                    : '—'}
                              </td>

                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
              )}



              {/* Book Requests */}

              {activeView === 'requests' && (

                <BookRequestsView
                  members={members}
                  books={books}
                  requests={requests}
                  userRole={userRole}
                  onSubmitRequest={handleSubmitBookRequest}
                  onUpdateRequestStatus={handleUpdateRequestStatus}
                  onDeleteBookRequest={handleDeleteBookRequest}
                  onUpdateRequestPriority={handleUpdateRequestPriority}
                  onUpdatePurchaseRecommendation={handleUpdatePurchaseRecommendation}
                />

              )}


              {/* Members */}

              {activeView === 'members' && (

                <>

                  <MemberRegistration
                    members={
                      members
                    }

                    onRegisterMember={
                      handleRegisterMember
                    }

                    onUpdateMemberStatus={
                      handleUpdateMemberStatus
                    }

                    onDeleteMember={
                      handleDeleteMember
                    }

                    onApproveMember={
                      handleApproveMember
                    }

                    onRejectMember={
                      handleRejectMember
                    }

                    onVerifyMemberDocument={
                      handleVerifyMemberDocument
                    }

                    onRejectMemberDocument={
                      handleRejectMemberDocument
                    }
                  />

                  <MembershipTypeManagement />

                  <MembershipTypeChangeRequests
                    members={
                      members
                    }
                  />

                </>

              )}

            </>

          )}

          {/* ═══════════════════════════════════════════════════════════
              MEMBER VIEWS
          ═══════════════════════════════════════════════════════════ */}

          {userRole === 'MEMBER' && (

            <>

              {/* Member Dashboard */}

              {activeView === 'user-dashboard' && (

                <MemberDashboard
                  activeMember={
                    activeMember
                  }

                  borrowings={
                    borrowings
                  }

                  reservations={
                    reservations
                  }

                  fines={
                    fines
                  }

                  books={
                    books
                  }

                  setActiveView={
                    setActiveView
                  }

                  onReturnBook={
                    handleReturnBook
                  }
                />

              )}

              {/* Member Catalog */}

              {activeView === 'catalog' && (

                <BookCatalogSaaS
                  books={
                    books
                  }

                  userRole="MEMBER"

                  activeMember={
                    activeMember
                  }

                  onBorrowBook={(
                    memberId,
                    bookId
                  ) =>
                    handleCreateBorrowingRequest(
                      memberId,
                      bookId,
                      'Member borrowing request from catalog'
                    )
                  }

                  onReserveBook={
                    handleCreateReservation
                  }
                />

              )}

              {/* My Loans */}

              {activeView === 'my-loans' && (

                <MyLoansView
                  activeMember={
                    activeMember
                  }

                  borrowings={
                    borrowings
                  }

                  onReturnBook={
                    handleReturnBook
                  }
                />

              )}

              {/* Borrowing History */}

              {activeView === 'borrowing-history' && (

                <MyBorrowingHistoryView
                  activeMember={
                    activeMember
                  }

                  borrowings={
                    borrowings
                  }
                />

              )}

              {/* My Borrowing Requests */}

              {activeView === 'my-borrowing-requests' && (

                <MyBorrowingRequestsView
                  activeMember={
                    activeMember
                  }

                  borrowingRequests={
                    borrowingRequests
                  }

                  onCancelRequest={
                    handleCancelBorrowingRequest
                  }
                />

              )}

              {/* My Reservations */}

              {activeView === 'my-reservations' && (

                <MyReservationsView
                  activeMember={
                    activeMember
                  }

                  reservations={
                    reservations
                  }

                  onCancelReservation={
                    handleCancelReservation
                  }
                />

              )}

              {/* My Fines */}

              {activeView === 'my-fines' && (

                <MyFinesView
                  activeMember={
                    activeMember
                  }

                  fines={
                    fines
                  }

                  onOpenPaymentModal={(
                    fine
                  ) =>
                    setActiveFineForPay(
                      fine
                    )
                  }

                  onOpenReceiptModal={(
                    fine
                  ) =>
                    setActiveFineForReceipt(
                      fine
                    )
                  }

                 onOpenInvoice={
                     handleOpenInvoice
                     }
                 />
              )}

              {/* Submit Book Request */}

              {activeView === 'submit-request' && (

                <SubmitRequestView
                  activeMember={
                    activeMember
                  }

                  books={
                    books
                  }

                  requests={
                    requests
                  }

                  onSubmitRequest={
                    handleSubmitBookRequest
                  }
                />

              )}

              {/* Digital Card */}

              {activeView === 'my-card' && (

                <DigitalCardView
                  activeMember={
                    activeMember
                  }
                />

              )}

              {/* Member Profile */}

              {activeView === 'my-profile' && (

                <MemberProfile
                  activeMember={
                    activeMember
                  }

                  onProfileUpdated={(
                    updatedMember
                  ) => {
                    setActiveMember(
                      updatedMember
                    );
                  }}
                />

              )}

            </>

          )}

        </main>

      </div>

      {/* ═══════════════════════════════════════════════════════════════
          GLOBAL MODALS
      ═══════════════════════════════════════════════════════════════ */}

      {/* Auth & Registration Portal */}

      <AuthPortalModal
        isOpen={
          isAuthModalOpen
        }

        onClose={() =>
          setIsAuthModalOpen(false)
        }

        members={
          members
        }

        onSelectMember={(member) => {

          setActiveMember(
            member
          );

          setUserRole(
            'MEMBER'
          );

          setActiveView(
            'user-dashboard'
          );
        }}

        onSelectAdmin={() => {

          setUserRole(
            'ADMIN'
          );

          setActiveView(
            'overview'
          );
        }}

        onRegisterMember={
          handleRegisterMember
        }
      />


      {/* Add Book Modal */}

      <AddBookModal
        isOpen={
          isAddBookOpen
        }

        onClose={() =>
          setIsAddBookOpen(false)
        }

        onAddBook={
          handleAddBook
        }
      />

      {/* Payment Gateway Modal */}

      <PaymentModal
        isOpen={
          !!activeFineForPay
        }

        fine={
          activeFineForPay
        }

        onClose={() =>
          setActiveFineForPay(null)
        }

        onProcessPayment={
          handlePayFine
        }
      />

            {/* Digital Receipt Modal */}

            <ReceiptModal
              isOpen={!!activeFineForReceipt}
              fine={activeFineForReceipt}
              onClose={() => setActiveFineForReceipt(null)}
            />

            {/* Invoice Modal */}

            {activeInvoice && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.55)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999,
                  padding: '20px',
                }}
              >
                <div
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '620px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: '32px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '24px',
                    }}
                  >
                    <div>
                      <h2 style={{ margin: 0 }}>
                        Invoice
                      </h2>

                      <div
                        style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.85rem',
                          marginTop: '4px',
                        }}
                      >
                        {activeInvoice.invoiceNumber}
                      </div>
                    </div>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() =>
                        setActiveInvoice(null)
                      }
                    >
                      Close
                    </button>
                  </div>

                  <div
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '24px',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: '1.4rem',
                        marginBottom: '4px',
                      }}
                    >
                      NexRead
                    </div>

                    <div
                      style={{
                        color: 'var(--text-muted)',
                        marginBottom: '24px',
                      }}
                    >
                      Library Management System
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '18px',
                        marginBottom: '24px',
                      }}
                    >
                      <div>
                        <div className="text-muted">
                          Invoice Number
                        </div>

                        <strong>
                          {activeInvoice.invoiceNumber}
                        </strong>
                      </div>

                      <div>
                        <div className="text-muted">
                          Invoice Date
                        </div>

                        <strong>
                          {new Date(
                            activeInvoice.invoiceDate
                          ).toLocaleDateString()}
                        </strong>
                      </div>

                      <div>
                        <div className="text-muted">
                          Fine Reference
                        </div>

                        <strong>
                          {activeInvoice.fine?.fineCode || '—'}
                        </strong>
                      </div>

                      <div>
                        <div className="text-muted">
                          Status
                        </div>

                        <span className="status-pill status-paid">
                          {activeInvoice.status}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        borderTop:
                          '1px solid var(--border-color)',
                        paddingTop: '20px',
                      }}
                    >
                      <div
                        style={{
                          color: 'var(--text-muted)',
                          marginBottom: '6px',
                        }}
                      >
                        Description
                      </div>

                      <div style={{ marginBottom: '24px' }}>
                        {activeInvoice.description}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '1.2rem',
                          fontWeight: 800,
                        }}
                      >
                        <span>Total</span>

                        <span>
                          LKR{' '}
                          {Number(
                            activeInvoice.amount || 0
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '10px',
                      marginTop: '20px',
                    }}
                  >
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        window.print()
                      }
                    >
                      Print / Save PDF
                    </button>

                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        setActiveInvoice(null)
                      }
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        );
  }