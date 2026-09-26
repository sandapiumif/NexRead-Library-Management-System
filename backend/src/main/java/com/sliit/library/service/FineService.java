package com.sliit.library.service;

import com.sliit.library.model.Fine;
import com.sliit.library.model.Member;
import com.sliit.library.repository.FineRepository;
import com.sliit.library.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class FineService {

    @Autowired
    private FineRepository fineRepo;

    @Autowired
    private MemberRepository memberRepo;

    @Autowired
    private NotificationService notificationService;


    // =========================
    // READ - Get all fines
    // =========================
    public List<Fine> getAllFines() {
        return fineRepo.findAll();
    }


    // =========================
    // READ - Get fines by member
    // =========================
    public List<Fine> getFinesByMember(Long memberId) {
        return fineRepo.findByMemberId(memberId);
    }


    // =========================
    // CREATE - Create a fine
    // =========================
    public Fine createFine(Fine fine) {

        if (fine.getMember() == null ||
                fine.getMember().getId() == null) {

            throw new IllegalArgumentException(
                    "Member is required"
            );
        }

        Member member = memberRepo.findById(
                fine.getMember().getId()
        ).orElseThrow(() ->
                new IllegalArgumentException(
                        "Member not found"
                )
        );


        if (fine.getAmount() == null ||
                fine.getAmount().compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Fine amount must be greater than 0"
            );
        }


        long count = fineRepo.count() + 5001;

        fine.setFineCode("FINE-" + count);
        fine.setMember(member);


        if (fine.getStatus() == null ||
                fine.getStatus().trim().isEmpty()) {

            fine.setStatus("PENDING");
        }


        Fine savedFine = fineRepo.save(fine);

        notificationService.createMemberNotification(
                member,
                "Fine Created",
                "A fine of Rs. " + savedFine.getAmount() + " has been added to your account.",
                "FINE",
                "FINE",
                savedFine.getId()
        );

        return savedFine;
    }


    // =========================
    // UPDATE - Pay fine
    // =========================
    public Fine payFine(Long fineId, String paymentMethod) {

        Fine fine = fineRepo.findById(fineId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Fine record not found"
                        )
                );


        if ("PAID".equalsIgnoreCase(fine.getStatus())) {

            throw new IllegalStateException(
                    "Fine has already been settled"
            );
        }


        fine.setStatus("PAID");
        fine.setPaidAt(LocalDateTime.now());

        fine.setPaymentMethod(
                paymentMethod != null
                        ? paymentMethod
                        : "ONLINE_CARD"
        );


        // Generate receipt number
        int randomSuffix =
                10000 + new Random().nextInt(90000);

        fine.setReceiptNumber(
                "RCPT-" +
                        LocalDate.now().getYear() +
                        "-" +
                        randomSuffix
        );


        fine = fineRepo.save(fine);


        // Check whether member has other pending fines
        Long memberId = fine.getMember().getId();

        List<Fine> remainingFines =
                fineRepo.findByMemberIdAndStatus(
                        memberId,
                        "PENDING"
                );


        // Reactivate member if all fines are paid
        if (remainingFines.isEmpty()) {

            Member member = fine.getMember();

            if ("SUSPENDED".equalsIgnoreCase(
                    member.getStatus())) {

                member.setStatus("ACTIVE");

                memberRepo.save(member);
            }
        }


        notificationService.createMemberNotification(
                fine.getMember(),
                "Fine Payment Confirmed",
                "Your fine payment of Rs. " + fine.getAmount() + " has been recorded successfully. Receipt: " + fine.getReceiptNumber() + ".",
                "FINE_PAID",
                "FINE",
                fine.getId()
        );

        notificationService.createAdminNotification(
                "Fine Payment Received",
                "Member " + fine.getMember().getFullName() + " paid fine " + fine.getFineCode() + ".",
                "FINE_PAID",
                "FINE",
                fine.getId()
        );

        return fine;
    }


    // =========================
    // UPDATE - Update fine
    // =========================
    public Fine updateFine(
            Long id,
            Fine updatedFine) {

        Fine fine = fineRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Fine record not found"
                        )
                );


        if (updatedFine.getAmount() == null ||
                updatedFine.getAmount()
                        .compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Fine amount must be greater than 0"
            );
        }


        fine.setAmount(
                updatedFine.getAmount()
        );

        fine.setOverdueDays(
                updatedFine.getOverdueDays()
        );


        if (updatedFine.getStatus() != null &&
                !updatedFine.getStatus()
                        .trim()
                        .isEmpty()) {

            fine.setStatus(
                    updatedFine.getStatus()
                            .toUpperCase()
            );
        }


        Fine savedFine = fineRepo.save(fine);

        notificationService.createMemberNotification(
                fine.getMember(),
                "Fine Updated",
                "Your fine record " + fine.getFineCode() + " has been updated by library staff.",
                "FINE",
                "FINE",
                fine.getId()
        );

        return savedFine;
    }


    // =========================
    // DELETE - Cancel fine
    // =========================
    public void deleteFine(Long id) {

        Fine fine = fineRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Fine record not found"
                        )
                );


        if ("PAID".equalsIgnoreCase(
                fine.getStatus())) {

            throw new IllegalStateException(
                    "A paid fine cannot be deleted"
            );
        }


        // Soft delete / cancellation
        fine.setStatus("CANCELLED");

        fineRepo.save(fine);

        notificationService.createMemberNotification(
                fine.getMember(),
                "Fine Cancelled",
                "Your fine " + fine.getFineCode() + " has been cancelled by library staff.",
                "FINE",
                "FINE",
                fine.getId()
        );
    }
}