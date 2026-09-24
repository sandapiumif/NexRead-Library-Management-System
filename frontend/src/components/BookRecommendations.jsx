import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8080/api';

export default function BookRecommendations({
  activeMember,
  onOpenBook,
  wishlistRefreshKey,
}) {

  const [recommendations, setRecommendations] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const loadData = async () => {
    if (!activeMember) return;
    try {
      const [recRes, wishRes] = await Promise.all([
        fetch(`${API_BASE}/recommendations/member/${activeMember.id}`),
        fetch(`${API_BASE}/wishlists/member/${activeMember.id}`),
      ]);

      const recData = await recRes.json();
      const wishData = await wishRes.json();

      if (recRes.ok) setRecommendations(recData);
      if (wishRes.ok) setWishlist(wishData);
    } catch (error) {
      // Keep the catalog usable even if these optional panels fail.
    }
  };

  useEffect(() => {
    loadData();
  }, [activeMember?.id, wishlistRefreshKey]);

  const removeWishlist = async (bookId) => {
    const response = await fetch(
      `${API_BASE}/wishlists/member/${activeMember.id}/book/${bookId}`,
      { method: 'DELETE' }
    );
    if (response.ok) {
      setWishlist((current) => current.filter((item) => item.book?.id !== bookId));
    }
  };

  if (!activeMember) return null;

  const BookMiniCard = ({ book, wishlistItem = false }) => (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: 12,
        border: '1px solid var(--border-color)',
        borderRadius: 10,
        background: 'var(--bg-card)',
        cursor: 'pointer',
      }}
      onClick={() => onOpenBook(book)}
    >
      <img
        src={book.coverImage}
        alt={book.title}
        style={{ width: 48, height: 68, objectFit: 'cover', borderRadius: 6 }}
        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'; }}
      />
      <div style={{ minWidth: 0, flex: 1 }}>
        <strong style={{ display: 'block', marginBottom: 4 }}>{book.title}</strong>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>by {book.author}</div>
        <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 5 }}>{book.category}</div>
        {wishlistItem && (
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 8 }}
            onClick={(e) => { e.stopPropagation(); removeWishlist(book.id); }}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ marginTop: 28, display: 'grid', gap: 24 }}>
      <section>
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ marginBottom: 4 }}>Recommended for You</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            Recommendations are based on your borrowing categories.
          </p>
        </div>
        {recommendations.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12 }}>
            {recommendations.map((book) => <BookMiniCard key={book.id} book={book} />)}
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>No recommendations available yet.</div>
        )}
      </section>

      <section>
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ marginBottom: 4 }}>My Wishlist</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>Books you saved for future reading.</p>
        </div>
        {wishlist.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12 }}>
            {wishlist.map((item) => <BookMiniCard key={item.id} book={item.book} wishlistItem />)}
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>Your wishlist is empty.</div>
        )}
      </section>
    </div>
  );
}
