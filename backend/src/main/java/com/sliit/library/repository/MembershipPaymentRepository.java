package com.sliit.library.repository;

import com.sliit.library.model.MembershipPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MembershipPaymentRepository
        extends JpaRepository<MembershipPayment, Long> {

    List<MembershipPayment> findByMemberIdOrderByCreatedAtDesc(
            Long memberId
    );

    Optional<MembershipPayment> findByPaymentCode(
            String paymentCode
    );

    Optional<MembershipPayment> findByReceiptNumber(
            String receiptNumber
    );

    List<MembershipPayment> findByMemberIdAndStatus(
            Long memberId,
            String status
    );

    boolean existsByMemberIdAndPaymentTypeAndStatus(
            Long memberId,
            String paymentType,
            String status
    );

    Optional<MembershipPayment>
    findTopByMemberIdAndPaymentTypeAndStatusOrderByPaidAtDesc(
            Long memberId,
            String paymentType,
            String status
    );
}