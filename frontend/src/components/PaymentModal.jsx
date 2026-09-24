import React, { useState } from 'react';
import { AlertTriangleIcon } from './Icons';

export default function PaymentModal({ isOpen, onClose, fine, onProcessPayment }) {
  const [method, setMethod] = useState('ONLINE_CARD');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [cardHolder, setCardHolder] = useState('KASUN PERERA');
  const [expiry, setExpiry] = useState('08/28');
  const [cvv, setCvv] = useState('321');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !fine) return null;

  const handleConfirm = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMsg('');

    try {
      await onProcessPayment(fine.id, method);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Payment processing failed.');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = Number(fine.amount).toFixed(2);

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        zIndex: 9999,
        boxSizing: 'border-box',
      }}
    >
      <div
        className="modal-content"
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg-surface, #ffffff)',
          borderRadius: '18px',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.25)',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >

        {/* ================= HEADER ================= */}
        <div
          className="modal-header"
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            background: 'var(--bg-surface, #ffffff)',
            zIndex: 5,
          }}
        >
          <div>
            <h3
              className="modal-title"
              style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-main)',
              }}
            >
              Library Fine Settlement Portal
            </h3>

            <div
              style={{
                marginTop: '4px',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
              }}
            >
              Secure payment settlement
            </div>
          </div>

          <button
            className="close-btn"
            onClick={onClose}
            type="button"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '20px',
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div
          style={{
            padding: '22px 24px 24px',
          }}
        >

          {/* ERROR */}
          {errorMsg && (
            <div
              className="alert alert-danger"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '18px',
              }}
            >
              <AlertTriangleIcon size={16} color="var(--danger)" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ================= FINE SUMMARY ================= */}
          <div
            style={{
              background: 'var(--bg-input)',
              borderRadius: '14px',
              padding: '18px',
              marginBottom: '22px',
              border: '1px solid var(--border-color)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '10px 20px',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>
                Fine Reference
              </span>

              <strong style={{ textAlign: 'right' }}>
                {fine.fineCode}
              </strong>

              <span style={{ color: 'var(--text-secondary)' }}>
                Member Name
              </span>

              <strong style={{ textAlign: 'right' }}>
                {fine.member?.fullName || 'Member'}
              </strong>

              <span style={{ color: 'var(--text-secondary)' }}>
                Overdue Assessment
              </span>

              <span style={{ textAlign: 'right' }}>
                {fine.overdueDays} Days overdue
              </span>
            </div>

            {/* TOTAL */}
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px dashed var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px',
              }}
            >
              <strong
                style={{
                  fontSize: '1.15rem',
                  color: 'var(--text-main)',
                }}
              >
                Total Payable
              </strong>

              <strong
                style={{
                  fontSize: '1.35rem',
                  color: 'var(--danger)',
                  whiteSpace: 'nowrap',
                }}
              >
                LKR {totalAmount}
              </strong>
            </div>
          </div>

          {/* ================= PAYMENT METHOD ================= */}
          <div style={{ marginBottom: '22px' }}>
            <label
              className="form-label"
              style={{
                display: 'block',
                marginBottom: '10px',
              }}
            >
              Select Payment Channel
            </label>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <button
                type="button"
                className={`pill-btn ${
                  method === 'ONLINE_CARD' ? 'active' : ''
                }`}
                onClick={() => setMethod('ONLINE_CARD')}
              >
                Visa / Mastercard
              </button>

              <button
                type="button"
                className={`pill-btn ${
                  method === 'CASH' ? 'active' : ''
                }`}
                onClick={() => setMethod('CASH')}
              >
                Cash at Counter
              </button>

              <button
                type="button"
                className={`pill-btn ${
                  method === 'BANK_TRANSFER' ? 'active' : ''
                }`}
                onClick={() => setMethod('BANK_TRANSFER')}
              >
                Bank Transfer
              </button>
            </div>
          </div>

          {/* ================= CARD PAYMENT ================= */}
          {method === 'ONLINE_CARD' && (
            <form onSubmit={handleConfirm}>

              {/* Card Number */}
              <div className="form-group">
                <label className="form-label">
                  Card Number
                </label>

                <input
                  id="card-number-input"
                  type="text"
                  className="form-input"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Name */}
              <div className="form-group">
                <label className="form-label">
                  Name on Card
                </label>

                <input
                  id="card-name-input"
                  type="text"
                  className="form-input"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Expiry + CVV */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px',
                }}
              >
                <div className="form-group">
                  <label className="form-label">
                    Expiry (MM/YY)
                  </label>

                  <input
                    id="card-expiry-input"
                    type="text"
                    className="form-input"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    CVV
                  </label>

                  <input
                    id="card-cvv-input"
                    type="password"
                    maxLength="4"
                    className="form-input"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Security Note */}
              <div
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '11px 13px',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  marginTop: '4px',
                  marginBottom: '20px',
                }}
              >
                🔒 Secured simulated payment gateway. Settling this fine
                will automatically restore member borrowing privileges.
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  paddingTop: '4px',
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  id="confirm-payment-btn"
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading
                    ? 'Processing Transaction...'
                    : `Confirm & Pay LKR ${totalAmount}`}
                </button>
              </div>
            </form>
          )}

          {/* ================= CASH / BANK ================= */}
          {method !== 'ONLINE_CARD' && (
            <div>

              <div
                className="alert alert-info"
                style={{
                  marginBottom: '20px',
                  lineHeight: 1.5,
                }}
              >
                Please verify the physical cash or transfer receipt
                with the cashier desk officer before confirming.
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  id="confirm-cash-payment-btn"
                  type="button"
                  className="btn btn-success"
                  disabled={loading}
                  onClick={handleConfirm}
                >
                  {loading
                    ? 'Recording Settlement...'
                    : 'Record Payment & Lift Suspension'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}