package com.sliit.library.repository;

import com.sliit.library.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    // Member notifications
    List<Notification> findByMemberIdOrderByCreatedAtDesc(Long memberId);

    // Unread member notifications
    List<Notification> findByMemberIdAndReadFalseOrderByCreatedAtDesc(
            Long memberId
    );

    // Admin notifications
    List<Notification> findByRecipientTypeOrderByCreatedAtDesc(
            String recipientType
    );

    // Unread admin notifications
    List<Notification> findByRecipientTypeAndReadFalseOrderByCreatedAtDesc(
            String recipientType
    );

    // Unread count for member
    long countByMemberIdAndReadFalse(Long memberId);

    // Unread count for admin
    long countByRecipientTypeAndReadFalse(String recipientType);

    // Unread admin activity count by module/reference type
    long countByRecipientTypeAndReferenceTypeAndReadFalse(
            String recipientType,
            String referenceType
    );
}
