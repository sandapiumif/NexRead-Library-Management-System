package com.sliit.library.model;

import jakarta.persistence.*;

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

    public void setMembershipDurationMonths(int membershipDurationMonths) {
        this.membershipDurationMonths = membershipDurationMonths;
    }
}