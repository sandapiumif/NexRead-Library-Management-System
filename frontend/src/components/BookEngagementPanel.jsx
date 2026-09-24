import React, { useEffect, useMemo, useState } from 'react';

const API_BASE = 'http://localhost:8080/api';

export default function BookEngagementPanel({
  book,
  activeMember,
  onWishlistChanged,
}) {

  const [reviews, setReviews] = useState([]);
  const [inWishlist, setInWishlist] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      const reviewRes = await fetch(`${API_BASE}/reviews/book/${book.id}`);
      const reviewData = await reviewRes.json();
      if (reviewRes.ok) setReviews(reviewData);

      if (activeMember) {
        const wishRes = await fetch(
          `${API_BASE}/wishlists/member/${activeMember.id}/book/${book.id}/exists`
        );
        const wishData = await wishRes.json();
        if (wishRes.ok) setInWishlist(Boolean(wishData.inWishlist));
      }
    } catch (error) {
      setMessage('Unable to load book reviews right now.');
    }
  };

  useEffect(() => {
    setMessage('');
    setComment('');
    setRating(5);
    loadData();
  }, [book.id, activeMember?.id]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  }, [reviews]);

const toggleWishlist = async () => {
  if (!activeMember) {
    setMessage('Please log in as a member to use your wishlist.');
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE}/wishlists/member/${activeMember.id}/book/${book.id}`,
      { method: inWishlist ? 'DELETE' : 'POST' }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Wishlist update failed');
    }

    setInWishlist(!inWishlist);

    setMessage(
      inWishlist
        ? 'Removed from your wishlist.'
        : 'Added to your wishlist.'
    );

    if (onWishlistChanged) {
      onWishlistChanged();
    }
  } catch (error) {
    setMessage(error.message);
  }
};

  const submitReview = async (e) => {
    e.preventDefault();
    if (!activeMember) {
      setMessage('Please log in as a member to write a review.');
      return;
    }
    if (!comment.trim()) {
      setMessage('Please enter a review comment.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: activeMember.id,
          bookId: book.id,
          rating,
          comment: comment.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit review');
      setComment('');
      setMessage('Review saved successfully.');
      await loadData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '28px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ marginBottom: 4 }}>Reviews</h3>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            {reviews.length ? `${averageRating.toFixed(1)} / 5 · ${reviews.length} review${reviews.length === 1 ? '' : 's'}` : 'No reviews yet'}
          </div>
        </div>

        {activeMember && (
          <button className="btn btn-secondary" onClick={toggleWishlist}>
            {inWishlist ? '♥ Remove from Wishlist' : '♡ Add to Wishlist'}
          </button>
        )}
      </div>

      {message && (
        <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 8, background: 'rgba(91,75,240,0.08)', color: 'var(--text-main)', fontSize: '0.85rem' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
        {reviews.length ? reviews.map((review) => (
          <div key={review.id} style={{ padding: 12, border: '1px solid var(--border-color)', borderRadius: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
              <strong>{review.member?.fullName || 'Library Member'}</strong>
              <span>⭐ {review.rating}/5</span>
            </div>
            <p style={{ margin: '7px 0 0', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{review.comment}</p>
          </div>
        )) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>Be the first member to review this book.</div>
        )}
      </div>

      {activeMember && (
        <form onSubmit={submitReview} style={{ marginTop: 18, padding: 14, background: 'var(--bg-input)', borderRadius: 10 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
            <strong>Your review</strong>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="select-dropdown">
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Good</option>
              <option value={3}>3 - Average</option>
              <option value={2}>2 - Poor</option>
              <option value={1}>1 - Very poor</option>
            </select>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            rows={3}
            maxLength={1000}
            style={{ width: '100%', resize: 'vertical', padding: 10, borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Review'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
