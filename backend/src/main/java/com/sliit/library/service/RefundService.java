package com.sliit.library.service;

import com.sliit.library.model.Fine;
import com.sliit.library.model.Member;
import com.sliit.library.model.Refund;
import com.sliit.library.repository.FineRepository;
import com.sliit.library.repository.RefundRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class RefundService {

    private final RefundRepository refundRepository;
    private final FineRepository fineRepository;
    private final NotificationService notificationService;

    public RefundService(
            RefundRepository refundRepository,
            FineRepository fineRepository,
            NotificationService notificationService
    ) {
        this.refundRepository = refundRepository;
        this.fineRepository = fineRepository;
        this.notificationService = notificationService;
    }
    // Get all refund records
    public List<Refund> getAllRefunds() {
        return refundRepository.findAll();
    }

    // Get refund history for a specific member
    public List<Refund> getRefundsByMember(Long memberId) {
        return refundRepository.findByMemberId(memberId);
    }

    // Get refund by fine ID
    public Refund getRefundByFineId(Long fineId) {
        return (refundRepository.findByFine_Id(fineId)
                .orElse(null)
        );
    }

    // Process a refund for a paid fine
    public Refund processRefund(Long fineId, String reason) {

        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Fine record not found"
                        )
                );

        // Refund is only allowed for paid fines
        if (!"PAID".equalsIgnoreCase(fine.getStatus())) {
            throw new IllegalStateException(
                    "Only paid fines can be refunded"
            );
        }

        // Prevent duplicate refunds
        if (refundRepository.existsByFine_Id(fineId)) {
            throw new IllegalStateException(
                    "A refund has already been processed for this fine"
            );
        }

        // Validate refund reason
        if (reason == null || reason.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Refund reason is required"
            );
        }

        if (fine.getAmount() == null ||
                fine.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalStateException(
                    "Invalid fine amount for refund"
            );
        }

        Member member = fine.getMember();

        Refund refund = new Refund();

        refund.setRefundReference(
                "REF-" +
                        LocalDateTime.now().getYear() +
                        "-" +
                        UUID.randomUUID()
                                .toString()
                                .substring(0, 8)
                                .toUpperCase()
        );

        refund.setFine(fine);
        refund.setMember(member);
        refund.setAmount(fine.getAmount());
        refund.setReason(reason.trim());
        refund.setStatus("PROCESSED");
        refund.setRefundDate(LocalDateTime.now());

        Refund savedRefund = refundRepository.save(refund);

// MEMBER NOTIFICATION
        notificationService.createMemberNotification(
                member,
                "Refund Processed",
                "Your refund for fine "
                        + fine.getFineCode()
                        + " has been processed successfully. "
                        + "Refund Reference: "
                        + savedRefund.getRefundReference()
                        + ". Amount: LKR "
                        + savedRefund.getAmount()
                        + ".",
                "REFUND",
                "REFUND",
                savedRefund.getId()
        );

// ADMIN NOTIFICATION
        notificationService.createAdminNotification(
                "Refund Processed",
                "Refund "
                        + savedRefund.getRefundReference()
                        + " for member "
                        + member.getFullName()
                        + " has been processed. "
                        + "Amount: LKR "
                        + savedRefund.getAmount()
                        + ". Fine: "
                        + fine.getFineCode()
                        + ".",
                "REFUND",
                "REFUND",
                savedRefund.getId()
        );

        return savedRefund;    }
}