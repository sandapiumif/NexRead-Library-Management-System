import React, { useState } from 'react';
import {
  SearchIcon,
  ArrowRightIcon,
  BookIcon,
  CheckCircleIcon,
  ClockIcon,
  HeadphonesIcon,
  BuildingIcon,
  MapPinIcon,
  SparklesIcon,
  StarIcon,
  ExternalLinkIcon,
  UsersIcon,
  ShieldCheckIcon,
} from './Icons';
import {
  BurroughsNovaCover,
  BurroughsSoftCover,
  BurroughsTicketCover,
  GinsbergCover,
  FoucaultCover,
  GenetCover,
} from './ClassicCovers';

const CLASSIC_BOOKS = [
  {
    id: 'classic-1',
    title: 'The Cut-Up Trilogy.',
    subtitle: 'Nova Express',
    displayTitle: 'The Cut-Up Trilogy. Nova Express',
    author: 'William Burroughs',
    pages: 195,
    reviews: 104,
    ratings: 945,
    plot: "While Naked Lunch was an initial shock to the literary community, Nova Express was considered the culmination of Burroughs's stylistic experiment and of the legendary Nova Trilogy.",
    CoverComponent: BurroughsNovaCover,
    availableCopies: 2,
    totalCopies: 3,
    category: 'Modern Classics',
  },
  {
    id: 'classic-2',
    title: 'The Cut-Up Trilogy.',
    subtitle: 'The Soft Machine',
    displayTitle: 'The Cut-Up Trilogy. The Soft Machine',
    author: 'William Burroughs',
    pages: 182,
    reviews: 76,
    ratings: 620,
    plot: 'The Soft Machine reconstructs a surreal space-age odyssey through Mayan mythology, telepathic warfare, and language experiments using the revolutionary cut-up methodology.',
    CoverComponent: BurroughsSoftCover,
    availableCopies: 1,
    totalCopies: 2,
    category: 'Modern Classics',
  },
  {
    id: 'classic-3',
    title: 'The Cut-Up Trilogy.',
    subtitle: 'The Ticket That Exploded',
    displayTitle: 'The Cut-Up Trilogy. The Ticket That Exploded',
    author: 'William Burroughs',
    pages: 210,
    reviews: 92,
    ratings: 810,
    plot: 'In The Ticket That Exploded, Burroughs develops the concept of language as an alien virus from outer space, unleashing speculative science fiction across fragmented reality.',
    CoverComponent: BurroughsTicketCover,
    availableCopies: 3,
    totalCopies: 3,
    category: 'Modern Classics',
  },
  {
    id: 'classic-4',
    title: 'Howl, Kaddish,',
    subtitle: 'and Other Poems',
    displayTitle: 'Howl, Kaddish, and Other Poems',
    author: 'Allen Ginsberg',
    pages: 160,
    reviews: 340,
    ratings: 1250,
    plot: 'Howl is one of the principal works of the Beat Generation, an impassioned lament for non-conformists destroyed by madness and postwar conformity in America.',
    CoverComponent: GinsbergCover,
    availableCopies: 4,
    totalCopies: 4,
    category: 'Modern Classics',
  },
];

const FOR_YOU_BOOKS = [
  {
    id: 'foryou-1',
    title: 'The Birth of the Clinic',
    displayTitle: 'The Birth of the Clinic',
    author: 'Michel Foucault',
    pages: 290,
    reviews: 80,
    ratings: 450,
    plot: 'An archaeology of medical perception exploring how clinical medicine developed its modern diagnostic gaze, spatialization of disease, and anatomical-clinical method in 18th-century Europe.',
    CoverComponent: FoucaultCover,
    splashClass: 'bg-splash-blue',
    availableCopies: 2,
    totalCopies: 3,
    category: 'Philosophy & Medicine',
  },
  {
    id: 'foryou-2',
    title: 'Our Lady of the Flowers',
    displayTitle: 'Our Lady of the Flowers',
    author: 'Jean Genet',
    pages: 200,
    reviews: 24,
    ratings: 150,
    plot: "Written on wrapping paper while imprisoned in Fresnes Prison, Genet's poetic debut explores the transgressive underworld of Montmartre with lyrical, intoxicating intensity.",
    CoverComponent: GenetCover,
    splashClass: 'bg-splash-peach',
    availableCopies: 3,
    totalCopies: 3,
    category: 'French Literature',
  },
];

const AUDIOBOOKS_DATA = [
  {
    id: 'audio-1',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    narrator: 'Scott Brick',
    duration: '9h 15m',
    category: 'Software Engineering',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80',
    rating: '4.9',
    listeners: '3,840',
  },
  {
    id: 'audio-2',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    narrator: 'Patrick Egan',
    duration: '14h 32m',
    category: 'Cognitive Science',
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&q=80',
    rating: '4.8',
    listeners: '8,120',
  },
  {
    id: 'audio-3',
    title: 'Algorithms to Live By: The Computer Science of Human Decisions',
    author: 'Brian Christian & Tom Griffiths',
    narrator: 'Brian Christian',
    duration: '11h 48m',
    category: 'Data Science & Logic',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&q=80',
    rating: '4.9',
    listeners: '4,650',
  },
  {
    id: 'audio-4',
    title: 'The Pragmatic Programmer: 20th Anniversary Edition',
    author: 'David Thomas & Andrew Hunt',
    narrator: 'Anna Fields',
    duration: '10h 20m',
    category: 'Architecture & Design',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80',
    rating: '5.0',
    listeners: '5,290',
  },
];

const CAMPUS_SERVICES = [
  {
    title: 'Private Study Pods & Suites',
    description: 'Acoustically insulated private carrels and group conference pods equipped with 4K interactive whiteboards and gigabit fiber.',
    badge: 'Instant Reservation',
    cta: 'Book a Study Space',
  },
  {
    title: 'Faculty & Scholar Research Desk',
    description: 'Dedicated one-on-one appointments with subject-matter research librarians for literature reviews, citation management, and thesis indexing.',
    badge: 'Academic Support',
    cta: 'Schedule Consultation',
  },
  {
    title: 'Inter-Library Loan & Document Delivery',
    description: 'Instant borrowing access across a worldwide consortium of over 15 million academic volumes, delivered physically or digitally in 48 hours.',
    badge: 'Worldwide Network',
    cta: 'Submit Request',
  },
  {
    title: 'Rare Manuscripts & Special Collections',
    description: 'Climate-controlled historical reading room housing early engineering manuscripts, computing archives, and rare 20th-century literature.',
    badge: 'Preservation Lab',
    cta: 'Explore Archive',
  },
];

export default function LandingPage({
  books = [],
  activeMember,
  userRole,
  onOpenAuthModal,
  onEnterDashboard,
  onBorrowBook,
  onReserveBook,
}) {
  const [activeTab, setActiveTab] = useState('Books');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(CLASSIC_BOOKS[0]);
  const [actionNotice, setActionNotice] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');

  // Handle Search Filtering across Classics and Database Books
  const isSearching = searchQuery.trim().length > 0;
  const q = searchQuery.toLowerCase().trim();

  const filteredClassics = CLASSIC_BOOKS.filter(
    (b) =>
      b.displayTitle.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q)
  );

  const filteredDbBooks = books.filter((b) => {
    const matchesQuery =
      !isSearching ||
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q);

    const matchesCategory =
      activeCategoryFilter === 'ALL' ||
      (b.category && b.category.toLowerCase().includes(activeCategoryFilter.toLowerCase()));

    return matchesQuery && matchesCategory;
  });

  const resolveTargetBook = (target) => {
    if (!target) return null;
    if (typeof target.id === 'number') return target;
    const match = books.find(
      (b) =>
        (target.title && b.title.toLowerCase().includes(target.title.toLowerCase())) ||
        (target.displayTitle && b.title.toLowerCase().includes(target.displayTitle.toLowerCase())) ||
        (target.isbn && b.isbn === target.isbn)
    );
    return match || (books.length > 0 ? books[0] : target);
  };

  const handleActionClick = async (bookToBorrow) => {
    const rawTarget = bookToBorrow || selectedBook;
    if (!rawTarget) return;

    if (!activeMember) {
      onOpenAuthModal();
      return;
    }

    const target = resolveTargetBook(rawTarget);
    if (!target || typeof target.id !== 'number') {
      setActionNotice('Please select a valid catalog book.');
      return;
    }

    try {
      if (target.availableCopies > 0) {
        await onBorrowBook(activeMember.id, target.id);
        setActionNotice(`Successfully checked out "${target.title}". Due date set for 14 days.`);
      } else {
        const res = await onReserveBook(activeMember.id, target.id);
        setActionNotice(`Added to waitlist for "${target.title}"! Queue position: #${res.waitingPosition}.`);
      }
      setTimeout(() => setActionNotice(''), 6000);
    } catch (err) {
      setActionNotice(err.message || 'Action could not be processed.');
      setTimeout(() => setActionNotice(''), 6000);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-fullpage">
      {/* 1. Full-Width Persistent Top Header */}
      <header className="landing-nav-full">
        <div className="landing-nav-inner">
          <div className="landing-nav-brand">
            <div className="brand-logo-icon">
              <BookIcon size={22} color="#ffffff" />
            </div>
            <div className="brand-text-block">
              <span className="brand-name">NexRead</span>
              <span className="brand-sub">Central Library</span>
            </div>
          </div>

          <nav className="landing-nav-links">
            <button className="nav-anchor-btn" onClick={() => scrollToSection('section-modern-classics')}>
              Modern Classics
            </button>
            <button className="nav-anchor-btn" onClick={() => scrollToSection('section-academic-core')}>
              Academic Core
            </button>
            <button className="nav-anchor-btn" onClick={() => scrollToSection('section-audiobooks')}>
              Audiobooks
            </button>
            <button className="nav-anchor-btn" onClick={() => scrollToSection('section-hours')}>
              Hours & Locations
            </button>
          </nav>

          <div className="landing-nav-actions">
            {activeMember ? (
              <button
                className="btn-nav-member"
                onClick={() => onEnterDashboard('MEMBER')}
                title="Access your borrower account & active loans"
              >
                <span>Patron: {activeMember.fullName.split(' ')[0]}</span>
                <ArrowRightIcon size={14} color="#ffffff" />
              </button>
            ) : (
              <button className="btn-nav-signin" onClick={onOpenAuthModal}>
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Circulation Notification Alert Banner */}
      {actionNotice && (
        <div className="landing-floating-notice">
          <CheckCircleIcon size={18} color="#059669" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 2. Majestic Library Hero Banner */}
      <section className="landing-hero-banner">
        <div className="hero-banner-overlay" />
        <div className="hero-banner-content">
          <div className="hero-badge">
            <SparklesIcon size={14} color="#60a5fa" />
            <span>CENTRAL ACADEMIC & RESEARCH COMMONS</span>
          </div>

          <h1 className="hero-headline">
            Where Human Curiosity Meets Boundless Knowledge
          </h1>

          <p className="hero-subhead">
            Explore over 50,000+ academic textbooks, peer-reviewed computing volumes, rare modern classics, and high-fidelity audiobooks across our campus library network.
          </p>

          {/* Central Search Bar in Hero */}
          <div className="hero-search-wrapper">
            <div className="hero-search-input-box">
              <SearchIcon size={20} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search by title, author, topic (e.g., Algorithms, Burroughs, Clean Architecture)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    scrollToSection(isSearching ? 'section-academic-core' : 'section-modern-classics');
                  }
                }}
              />
              {searchQuery && (
                <button className="hero-search-clear" onClick={() => setSearchQuery('')}>
                  Clear
                </button>
              )}
            </div>

            {/* Quick Filter Presets */}
            <div className="hero-filter-chips">
              <span className="chips-label">Browse Stacks:</span>
              {[
                { label: 'All Stacks', value: 'ALL' },
                { label: 'Software Architecture', value: 'Software' },
                { label: 'Algorithms & Data', value: 'Algorithms' },
                { label: 'Artificial Intelligence', value: 'Artificial' },
                { label: 'Database Systems', value: 'Database' },
              ].map((chip) => (
                <button
                  key={chip.value}
                  className={`filter-chip ${activeCategoryFilter === chip.value ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategoryFilter(chip.value);
                    scrollToSection('section-academic-core');
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Live Stat Counters */}
          <div className="hero-stats-row">
            <div className="hero-stat-card">
              <span className="hero-stat-number">50,000+</span>
              <span className="hero-stat-desc">Volumes in Physical Stacks</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat-card">
              <span className="hero-stat-number">12,500+</span>
              <span className="hero-stat-desc">Active Campus Scholars</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat-card">
              <span className="hero-stat-number">100% Free</span>
              <span className="hero-stat-desc">Patron Lending & Reservation</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat-card">
              <span className="hero-stat-number">24/7 Access</span>
              <span className="hero-stat-desc">Digital Commons & Study Pods</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="landing-content-body">
        {/* 3. Section: Featured Curations & Modern Classics (with Dark Live Inspector) */}
        <section id="section-modern-classics" className="landing-container-block">
          <div className="section-header-row">
            <div>
              <div className="section-eyebrow">CURATED LITERARY SPOTLIGHT</div>
              <h2 className="section-main-heading">Modern Classics & Literary Showcase</h2>
              <p className="section-subtext">
                Select any edition below to inspect its critical plot analysis, physical copies on shelf, and checkout status in real-time.
              </p>
            </div>

            {/* Category Tabs */}
            <div className="landing-tabs-pill">
              {['Books', 'Audiobooks', 'Podcasts'].map((tab) => (
                <button
                  key={tab}
                  className={`landing-tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab === 'Audiobooks') scrollToSection('section-audiobooks');
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="classics-explorer-wrapper">
            {/* Left Shelves */}
            <div className="explorer-left-shelves">
              {/* "For you" Shelf */}
              <div className="shelf-group">
                <h3 className="shelf-heading">For you</h3>
                <div className="for-you-grid">
                  {FOR_YOU_BOOKS.map((item) => {
                    const isSelected = selectedBook?.id === item.id;
                    const Cover = item.CoverComponent;

                    return (
                      <div
                        key={item.id}
                        className={`for-you-card ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => setSelectedBook(item)}
                      >
                        <div className={`for-you-cover-wrapper ${item.splashClass}`}>
                          <div className="for-you-cover-box">
                            <Cover />
                          </div>
                        </div>

                        <div className="for-you-info">
                          <h4 className="for-you-title" title={item.title}>{item.title}</h4>
                          <div className="for-you-author">{item.author}</div>

                          <div className="for-you-stats">
                            <div className="for-you-stat-col">
                              <span className="stat-number">{item.pages}</span>
                              <span className="stat-label">pages</span>
                            </div>
                            <div className="for-you-stat-col">
                              <span className="stat-number">{item.reviews}</span>
                              <span className="stat-label">reviews</span>
                            </div>
                            <div className="for-you-stat-col">
                              <span className="stat-number">{item.ratings}</span>
                              <span className="stat-label">ratings</span>
                            </div>
                          </div>
                        </div>

                        <button
                          className="for-you-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBook(item);
                          }}
                          title="Inspect edition metrics"
                        >
                          <ArrowRightIcon size={16} color="#ffffff" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* "Week of Modern Classics" Shelf */}
              <div className="shelf-group">
                <h3 className="shelf-heading">
                  {isSearching ? `Matching Literary Editions (${filteredClassics.length})` : 'Week of Modern Classics'}
                </h3>
                <div className="classics-grid">
                  {filteredClassics.map((classic) => {
                    const isSelected = selectedBook?.id === classic.id;
                    const Cover = classic.CoverComponent;

                    return (
                      <div
                        key={classic.id}
                        className={`classic-book-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedBook(classic)}
                      >
                        <div className="classic-cover-container">
                          <div className="classic-cover-box">
                            <Cover />
                          </div>
                        </div>

                        <div className="classic-info-bottom">
                          <div className="classic-title">{classic.title}</div>
                          <div className="classic-subtitle">{classic.subtitle}</div>
                          <div className="classic-author">{classic.author}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Live Dark Inspector */}
            <aside className="about-book-panel">
              <h3 className="about-book-header">About the book</h3>

              {selectedBook ? (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Cover */}
                  <div className="about-cover-box">
                    {selectedBook.CoverComponent ? (
                      <selectedBook.CoverComponent />
                    ) : (
                      <img
                        src={selectedBook.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'}
                        alt={selectedBook.title}
                        className="about-cover-img"
                      />
                    )}
                  </div>

                  {/* Title & Author & Category */}
                  <div className="about-title-group">
                    <div style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                      {selectedBook.category || 'Academic Literature'}
                    </div>
                    <h4 className="about-title">
                      {selectedBook.displayTitle || selectedBook.title}
                    </h4>
                    <div className="about-author">by {selectedBook.author}</div>
                  </div>

                  {/* Specific Publication Metadata */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '10px 12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', margin: '10px 0 14px 0', fontSize: '0.78rem' }}>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>ISBN</span>
                      <strong style={{ color: '#f8fafc' }}>{selectedBook.isbn || '978-0132350884'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>Publisher</span>
                      <strong style={{ color: '#f8fafc' }}>{selectedBook.publisher || 'Academic Press'}</strong>
                    </div>
                  </div>

                  {/* Metrics Bar */}
                  <div className="about-metrics-bar">
                    <div className="about-metric-col">
                      <span className="metric-val">{selectedBook.pages || 280}</span>
                      <span className="metric-lbl">pages</span>
                    </div>
                    <div className="metric-divider" />
                    <div className="about-metric-col">
                      <span className="metric-val">{selectedBook.reviews || 104}</span>
                      <span className="metric-lbl">reviews</span>
                    </div>
                    <div className="metric-divider" />
                    <div className="about-metric-col">
                      <span className="metric-val">{selectedBook.ratings || 945}</span>
                      <span className="metric-lbl">ratings</span>
                    </div>
                  </div>

                  {/* Plot / Synopsis */}
                  <div className="about-plot-section">
                    <h5 className="about-plot-heading">Book Overview & Synopsis</h5>
                    <p className="about-plot-text">
                      {selectedBook.plot || selectedBook.description ||
                        'Masterful academic work exploring philosophical inquiry, critical human perception, and modern narrative architecture.'}
                    </p>
                  </div>

                  {/* Availability */}
                  <div className="about-stock-tag">
                    {(selectedBook.availableCopies ?? 2) > 0 ? (
                      <span className="tag-in-stock">
                        <CheckCircleIcon size={14} color="#34d399" />
                        In Stock ({(selectedBook.availableCopies ?? 2)} of {(selectedBook.totalCopies ?? 3)} copies available)
                      </span>
                    ) : (
                      <span className="tag-out-of-stock">
                        <ClockIcon size={14} color="#fbbf24" />
                        Currently On Loan (Waitlist Open)
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <button className="about-action-btn" onClick={() => handleActionClick(selectedBook)}>
                    {(selectedBook.availableCopies ?? 2) > 0 ? 'Borrow Book' : 'Reserve / Waitlist'}
                  </button>
                </div>
              ) : (
                <div className="about-empty-state">
                  <BookIcon size={36} color="#64748b" />
                  <p>Select any book to inspect its full synopsis, edition metrics, and circulation options.</p>
                </div>
              )}
            </aside>
          </div>
        </section>

        {/* 4. Section: University Academic & Engineering Core (SQL Database Books) */}
        <section id="section-academic-core" className="landing-container-block bg-subtle-section">
          <div className="section-header-row">
            <div>
              <div className="section-eyebrow">DEPARTMENTAL PHYSICAL STACKS</div>
              <h2 className="section-main-heading">Academic & Computer Science Core</h2>
              <p className="section-subtext">
                Authoritative reference manuals and prescribed texts available for immediate lending to registered faculty and students.
              </p>
            </div>

            <div className="academic-count-badge">
              <span>{filteredDbBooks.length} Editions Available</span>
            </div>
          </div>

          {filteredDbBooks.length === 0 ? (
            <div className="empty-filter-state">
              <BookIcon size={40} color="#94a3b8" />
              <h4>No matching textbooks found</h4>
              <p>Try resetting the search query or changing the filter chip.</p>
              <button
                className="btn-reset-filters"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategoryFilter('ALL');
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="academic-grid">
              {filteredDbBooks.map((book) => {
                const isSelected = selectedBook?.id === book.id;
                const isAvailable = (book.availableCopies ?? 1) > 0;

                return (
                  <div
                    key={book.id}
                    className={`academic-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedBook({
                        ...book,
                        displayTitle: book.title,
                        pages: (book.totalCopies || 3) * 110 + 120,
                        reviews: (book.id * 17) % 80 + 15,
                        ratings: (book.id * 83) % 400 + 150,
                        plot: book.description,
                      });
                      scrollToSection('section-modern-classics');
                    }}
                  >
                    <div className="academic-cover-wrap">
                      <img
                        src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'}
                        alt={book.title}
                        className="academic-cover-img"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80';
                        }}
                      />
                      <div className="academic-badge-tag">{book.category}</div>
                    </div>

                    <div className="academic-body">
                      <h4 className="academic-title" title={book.title}>
                        {book.title}
                      </h4>
                      <div className="academic-author">by {book.author}</div>

                      <div className="academic-meta-row">
                        <div className="meta-isbn">ISBN: {book.isbn || '978-0132350884'}</div>
                        <div className="meta-year">{book.publicationYear || 2021}</div>
                      </div>

                      <div className="academic-stock-row">
                        {isAvailable ? (
                          <span className="stock-pill in-stock">
                            <span className="dot dot-green" />
                            {book.availableCopies} of {book.totalCopies} Available
                          </span>
                        ) : (
                          <span className="stock-pill out-of-stock">
                            <span className="dot dot-amber" />
                            Reserved (0 Available)
                          </span>
                        )}
                      </div>

                      <div className="academic-card-actions">
                        <button
                          className="btn-academic-inspect"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBook({
                              ...book,
                              displayTitle: book.title,
                              pages: (book.totalCopies || 3) * 110 + 120,
                              reviews: (book.id * 17) % 80 + 15,
                              ratings: (book.id * 83) % 400 + 150,
                              plot: book.description,
                            });
                            scrollToSection('section-modern-classics');
                          }}
                        >
                          Quick View
                        </button>
                        <button
                          className="btn-academic-borrow"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActionClick(book);
                          }}
                        >
                          {isAvailable ? 'Borrow' : 'Reserve'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 5. Section: Digital Audiobooks & Research Media */}
        <section id="section-audiobooks" className="landing-container-block">
          <div className="section-header-row">
            <div>
              <div className="section-eyebrow">DIGITAL RESEARCH MEDIA</div>
              <h2 className="section-main-heading">Audiobooks & Research Lectures</h2>
              <p className="section-subtext">
                Stream verified scholarly narrations, computer science monographs, and cognitive science masterclasses.
              </p>
            </div>

            <div className="media-stats-badge">
              <HeadphonesIcon size={16} color="#2563eb" />
              <span>Studio Mastered 24-bit Audio</span>
            </div>
          </div>

          <div className="audiobooks-grid">
            {AUDIOBOOKS_DATA.map((audio) => (
              <div key={audio.id} className="audio-card">
                <div className="audio-cover-box">
                  <img src={audio.coverImage} alt={audio.title} className="audio-cover-img" />
                  <div className="audio-duration-pill">
                    <ClockIcon size={12} color="#ffffff" />
                    <span>{audio.duration}</span>
                  </div>
                </div>

                <div className="audio-info">
                  <div className="audio-category-tag">{audio.category}</div>
                  <h4 className="audio-title" title={audio.title}>
                    {audio.title}
                  </h4>
                  <div className="audio-author">By {audio.author}</div>
                  <div className="audio-narrator">Narrated by {audio.narrator}</div>

                  <div className="audio-rating-row">
                    <div className="rating-pill">
                      <StarIcon size={13} color="#f59e0b" />
                      <span>{audio.rating}</span>
                    </div>
                    <span className="listeners-count">{audio.listeners} Scholars</span>
                  </div>

                  <button
                    className="btn-audio-listen"
                    onClick={() => {
                      if (!activeMember) {
                        onOpenAuthModal();
                      } else {
                        setActionNotice(`Streaming preview initialized for "${audio.title}". Audio stream playing.`);
                        setTimeout(() => setActionNotice(''), 5000);
                      }
                    }}
                  >
                    <HeadphonesIcon size={14} color="#ffffff" />
                    <span>Listen Preview</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Operating Hours & Locations */}
        <section id="section-hours" className="landing-container-block">
          <div className="hours-banner-card">
            <div className="hours-left-info">
              <div className="hours-eyebrow">
                <MapPinIcon size={16} color="#3b82f6" />
                <span>CENTRAL CAMPUS NETWORK</span>
              </div>
              <h3 className="hours-headline">Library Operating Hours & Study Spaces</h3>
              <p className="hours-desc">
                NexRead maintains 3 specialized branches on campus, providing 24/7 continuous quiet study zones during midterm and final exam schedules.
              </p>

              <div className="branch-list">
                <div className="branch-item">
                  <div className="branch-header">
                    <span className="branch-name">NexRead Central Hall (Main Stacks)</span>
                    <span className="branch-status open">Open 24/7</span>
                  </div>
                  <div className="branch-meta">Floors 1-6 • Physical Collections, Reading Rooms, Silent Study</div>
                </div>

                <div className="branch-item">
                  <div className="branch-header">
                    <span className="branch-name">Turing Engineering & Computing Commons</span>
                    <span className="branch-status open">Closes at 11:00 PM</span>
                  </div>
                  <div className="branch-meta">Floors 2-3 • High-Performance Workstations, Hardware Labs</div>
                </div>

                <div className="branch-item">
                  <div className="branch-header">
                    <span className="branch-name">Ada Lovelace Digital Media Hub</span>
                    <span className="branch-status open">Open 24/7 (Card Access)</span>
                  </div>
                  <div className="branch-meta">Ground Floor • Audio Pods, VR Workstations, 3D Prototyping</div>
                </div>
              </div>
            </div>

            <div className="hours-right-cta">
              <div className="cta-box-content">
                <ShieldCheckIcon size={32} color="#ffffff" />
                <h4>Need Research Help?</h4>
                <p>Connect with a reference librarian via live digital desk or schedule an in-person session.</p>
                <button
                  className="btn-desk-consult"
                  onClick={() => {
                    if (!activeMember) onOpenAuthModal();
                    else {
                      setActionNotice('Librarian consultation desk queue opened. A staff member will assist you shortly.');
                      setTimeout(() => setActionNotice(''), 5000);
                    }
                  }}
                >
                  Open Librarian Desk
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 8. Institutional Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-top-grid">
            <div className="footer-col brand-col">
              <div className="footer-brand">
                <div className="footer-logo-icon">
                  <BookIcon size={20} color="#ffffff" />
                </div>
                <span className="footer-brand-title">NexRead</span>
              </div>
              <p className="footer-desc">
                NexRead Central Academic & Research Commons serves students, faculty, and scholars worldwide with open-access repositories and lending services.
              </p>
              <div className="footer-location-tag">
                <MapPinIcon size={14} color="#94a3b8" />
                <span>Central Campus • Knowledge Boulevard, Building 4</span>
              </div>
            </div>

            <div className="footer-col">
              <h5 className="footer-heading">Collections</h5>
              <ul className="footer-links">
                <li><a href="#section-academic-core">Academic Core Stacks</a></li>
                <li><a href="#section-modern-classics">Modern Classics Archive</a></li>
                <li><a href="#section-audiobooks">Audiobooks & Lectures</a></li>
                <li><a href="#section-academic-core">Computer Science Stacks</a></li>
                <li><a href="#section-academic-core">Software Architecture</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5 className="footer-heading">Patron Services</h5>
              <ul className="footer-links">
                <li><a href="#section-services">Study Pod Booking</a></li>
                <li><a href="#section-services">Inter-Library Loan</a></li>
                <li><a href="#section-services">Citation & Research Desk</a></li>
                <li><a href="#section-hours">Library Hours & Spaces</a></li>
                <li><button className="link-btn" onClick={onOpenAuthModal}>Member Registration</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5 className="footer-heading">Staff & Administration</h5>
              <ul className="footer-links">
                <li>
                  <button className="link-btn highlight" onClick={() => onEnterDashboard('ADMIN')}>
                    Librarian Studio
                  </button>
                </li>
                <li>
                  <button className="link-btn" onClick={() => onEnterDashboard('MEMBER')}>
                    Patron Dashboard
                  </button>
                </li>
                <li><a href="#section-hours">Circulation Policy</a></li>
                <li><a href="#section-hours">Borrowing Limits & Fines</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <div className="footer-copy">
              © {new Date().getFullYear()} NexRead Central Library System. All rights reserved.
            </div>
            <div className="footer-bottom-links">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Borrowing</span>
              <span>•</span>
              <span>Academic Integrity Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
