package com.sliit.library.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

// Fine entity for fee settlement, payment receipt, and suspension lifting (UC 05.3)
@Entity
@Table(name = "Fines")
public class Fine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fine_code", unique = true, nullable = false)
    private String fineCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "borrow_id")
    private BorrowingRecord borrowing;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount = BigDecimal.ZERO;

    @Column(name = "overdue_days", nullable = false)
    private int overdueDays = 0;

    @Column(nullable = false)
    private String status; // PENDING, PAID, WAIVED

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "payment_method")
    private String paymentMethod; // ONLINE_CARD, CASH, BANK_TRANSFER

    @Column(name = "receipt_number")
    private String receiptNumber;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Fine() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFineCode() { return fineCode; }
    public void setFineCode(String fineCode) { this.fineCode = fineCode; }

    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }

    public BorrowingRecord getBorrowing() { return borrowing; }
    public void setBorrowing(BorrowingRecord borrowing) { this.borrowing = borrowing; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public int getOverdueDays() { return overdueDays; }
    public void setOverdueDays(int overdueDays) { this.overdueDays = overdueDays; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
