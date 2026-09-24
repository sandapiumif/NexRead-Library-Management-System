import React from 'react';
import { FileTextIcon, CheckCircleIcon } from './Icons';

export default function ReceiptModal({ isOpen, onClose, fine }) {
  if (!fine && !isOpen) return null;
  if (isOpen === false) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px', padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Printable Receipt Paper */}
        <div className="receipt-paper" id="printable-receipt">
          <div className="receipt-header">
            <h3>NexRead CENTRAL LIBRARY</h3>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
              Academic Learning Commons • University Campus
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: '0.4rem', color: '#4F46E5' }}>
              OFFICIAL PAYMENT RECEIPT
            </div>
          </div>

          <div className="receipt-row">
            <span>RECEIPT NO:</span>
            <strong>{fine.receiptNumber || 'RCPT-2026-89412'}</strong>
          </div>
          <div className="receipt-row">
            <span>DATE / TIME:</span>
            <span>{fine.paidAt ? new Date(fine.paidAt).toLocaleString() : new Date().toLocaleString()}</span>
          </div>
          <div className="receipt-row">
            <span>FINE REF:</span>
            <span>{fine.fineCode}</span>
          </div>

          <div className="receipt-divider" />

          <div className="receipt-row">
            <span>MEMBER NAME:</span>
            <strong>{fine.member?.fullName}</strong>
          </div>
          <div className="receipt-row">
            <span>MEMBER ID:</span>
            <span>{fine.member?.memberCode}</span>
          </div>
          <div className="receipt-row">
            <span>NIC / PASSPORT:</span>
            <span>{fine.member?.idNumber}</span>
          </div>

          <div className="receipt-divider" />

          <div className="receipt-row">
            <span>OVERDUE ASSESSMENT:</span>
            <span>{fine.overdueDays} Days overdue</span>
          </div>
          <div className="receipt-row">
            <span>OVERDUE RATE:</span>
            <span>LKR 10.00 / day</span>
          </div>
          <div className="receipt-row">
            <span>PAYMENT CHANNEL:</span>
            <span>{fine.paymentMethod || 'ONLINE_CARD'}</span>
          </div>
          <div className="receipt-row">
            <span>PAYMENT STATUS:</span>
            <strong style={{ color: '#059669' }}>SETTLED (PAID)</strong>
          </div>

          <div className="receipt-divider" />

          <div className="receipt-total">
            <span>TOTAL AMOUNT PAID:</span>
            <span>LKR {Number(fine.amount).toFixed(2)}</span>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.72rem', color: '#64748B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: 600 }}>
              <CheckCircleIcon size={12} color="#059669" />
              Borrowing suspension lifted automatically.
            </span>
            <span>Thank you for keeping your library account in good standing!</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button id="print-receipt-btn" className="btn btn-primary" onClick={handlePrint} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <FileTextIcon size={14} color="#ffffff" />
            <span>Print / Save PDF</span>
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
