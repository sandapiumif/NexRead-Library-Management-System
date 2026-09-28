package com.sliit.library.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "MembershipTypes")
public class MembershipType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type_name", unique = true, nullable = false)
    private String typeName;

    @Column(name = "borrow_limit", nullable = false)
    private int borrowLimit;

    @Column(name = "membership_duration_months", nullable = false)
    private int membershipDurationMonths;

    // Membership fee
    // Nullable so existing membership type records are not broken
    // when the new column is added to the database.
    @Column(name = "fee_amount")
    private BigDecimal feeAmount;

    public MembershipType() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public int getBorrowLimit() {
        return borrowLimit;
    }

    public void setBorrowLimit(int borrowLimit) {
        this.borrowLimit = borrowLimit;
    }

    public int getMembershipDurationMonths() {
        return membershipDurationMonths;
    }

    public void setMembershipDurationMonths(
            int membershipDurationMonths) {

        this.membershipDurationMonths =
                membershipDurationMonths;
    }

    public BigDecimal getFeeAmount() {
        return feeAmount;
    }

    public void setFeeAmount(BigDecimal feeAmount) {
        this.feeAmount = feeAmount;
    }
}