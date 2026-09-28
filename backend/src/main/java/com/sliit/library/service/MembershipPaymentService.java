package com.sliit.library.service;

import com.sliit.library.model.Member;
import com.sliit.library.model.MembershipPayment;
import com.sliit.library.repository.MemberRepository;
import com.sliit.library.repository.MembershipPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class MembershipPaymentService {

    @Autowired
    private MembershipPaymentRepository membershipPaymentRepo;

    @Autowired
    private MemberRepository memberRepo;

    @Autowired
    private NotificationService notificationService;


    // =========================================================
    // GET ALL MEMBERSHIP PAYMENTS
    // =========================================================

    public List<MembershipPayment> getAllPayments() {
        return membershipPaymentRepo.findAll();
    }


    // =========================================================
    // GET PAYMENTS BY MEMBER
    // =========================================================

    public List<MembershipPayment> getPaymentsByMember(
            Long memberId) {

        if (!memberRepo.existsById(memberId)) {
            throw new IllegalArgumentException(
                    "Member not found"
            );
        }

        return membershipPaymentRepo
                .findByMemberIdOrderByCreatedAtDesc(memberId);
    }


    // =========================================================
    // GET PAYMENT BY ID
    // =========================================================

    public MembershipPayment getPaymentById(Long id) {

        return membershipPaymentRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Membership payment not found"
                        )
                );
    }


    // =========================================================
    // CREATE MEMBERSHIP PAYMENT
    // =========================================================

    public MembershipPayment createPayment(
            Long memberId,
            BigDecimal amount,
            String paymentType) {

        Member member = memberRepo.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Member not found"
                        )
                );


        // Validate amount
        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Membership payment amount must be greater than 0"
            );
        }


        // Validate payment type
        if (paymentType == null ||
                paymentType.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Payment type is required"
            );
        }


        String normalizedPaymentType =
                paymentType.trim().toUpperCase();


        if (!normalizedPaymentType.equals("REGISTRATION") &&
                !normalizedPaymentType.equals("RENEWAL")) {

            throw new IllegalArgumentException(
                    "Payment type must be REGISTRATION or RENEWAL"
            );
        }


        // Create payment
        MembershipPayment payment =
                new MembershipPayment();


        long count =
                membershipPaymentRepo.count() + 10001;


        payment.setPaymentCode(
                "MEM-PAY-" + count
        );


        payment.setMember(member);


        payment.setMembershipType(
                member.getMembershipType()
        );


        payment.setAmount(amount);


        payment.setPaymentType(
                normalizedPaymentType
        );


        payment.setStatus("PENDING");


        MembershipPayment savedPayment =
                membershipPaymentRepo.save(payment);


        // Notify member
        notificationService.createMemberNotification(
                member,
                "Membership Payment Created",
                "A membership payment of Rs. "
                        + savedPayment.getAmount()
                        + " has been created. "
                        + "Payment code: "
                        + savedPayment.getPaymentCode()
                        + ".",
                "MEMBERSHIP_PAYMENT",
                "MEMBERSHIP",
                savedPayment.getId()
        );


        // Notify admin
        notificationService.createAdminNotification(
                "Membership Payment Created",
                "Member "
                        + member.getFullName()
                        + " has a new membership payment of Rs. "
                        + savedPayment.getAmount()
                        + ".",
                "MEMBERSHIP_PAYMENT",
                "MEMBERSHIP",
                savedPayment.getId()
        );


        return savedPayment;
    }


    // =========================================================
    // PAY MEMBERSHIP FEE
    // =========================================================

    public MembershipPayment payMembershipFee(
            Long paymentId,
            String paymentMethod) {

        MembershipPayment payment =
                membershipPaymentRepo.findById(paymentId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Membership payment not found"
                                )
                        );


        // Prevent duplicate payment
        if ("PAID".equalsIgnoreCase(
                payment.getStatus())) {

            throw new IllegalStateException(
                    "Membership payment has already been completed"
            );
        }


        // Validate payment method
        String method =
                paymentMethod == null ||
                        paymentMethod.trim().isEmpty()
                        ? "ONLINE_CARD"
                        : paymentMethod.trim().toUpperCase();


        if (!method.equals("ONLINE_CARD") &&
                !method.equals("CASH") &&
                !method.equals("BANK_TRANSFER")) {

            throw new IllegalArgumentException(
                    "Invalid payment method"
            );
        }


        payment.setPaymentMethod(method);

        payment.setStatus("PAID");

        payment.setPaidAt(
                LocalDateTime.now()
        );


        // Generate transaction reference
        int transactionSuffix =
                10000 + new Random().nextInt(90000);

        payment.setTransactionReference(
                "TXN-MEM-"
                        + LocalDate.now().getYear()
                        + "-"
                        + transactionSuffix
        );


        // Generate receipt number
        int receiptSuffix =
                10000 + new Random().nextInt(90000);

        payment.setReceiptNumber(
                "RCPT-MEM-"
                        + LocalDate.now().getYear()
                        + "-"
                        + receiptSuffix
        );


        MembershipPayment savedPayment =
                membershipPaymentRepo.save(payment);


        // =====================================================
        // MEMBER NOTIFICATION
        // =====================================================

        notificationService.createMemberNotification(
                savedPayment.getMember(),
                "Membership Payment Confirmed",
                "Your membership payment of Rs. "
                        + savedPayment.getAmount()
                        + " has been recorded successfully. "
                        + "Receipt: "
                        + savedPayment.getReceiptNumber()
                        + ".",
                "MEMBERSHIP_PAYMENT_PAID",
                "MEMBERSHIP",
                savedPayment.getMember().getId()
        );


        // =====================================================
        // ADMIN NOTIFICATION
        // =====================================================

        notificationService.createAdminNotification(
                "Membership Payment Received",
                "Member "
                        + savedPayment.getMember().getFullName()
                        + " paid Rs. "
                        + savedPayment.getAmount()
                        + " for "
                        + savedPayment.getPaymentType()
                        + ". Receipt: "
                        + savedPayment.getReceiptNumber()
                        + ".",
                "MEMBERSHIP_PAYMENT_PAID",
                "MEMBERSHIP",
                savedPayment.getId()
        );


        return savedPayment;
    }


    // =========================================================
    // GET PAYMENT BY PAYMENT CODE
    // =========================================================

    public MembershipPayment getPaymentByCode(
            String paymentCode) {

        return membershipPaymentRepo
                .findByPaymentCode(paymentCode)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Membership payment not found"
                        )
                );
    }


    // =========================================================
    // GET PAYMENT BY RECEIPT NUMBER
    // =========================================================

    public MembershipPayment getPaymentByReceipt(
            String receiptNumber) {

        return membershipPaymentRepo
                .findByReceiptNumber(receiptNumber)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Membership payment not found"
                        )
                );
    }
}
