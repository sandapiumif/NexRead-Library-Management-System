package com.sliit.library.service;

import com.sliit.library.model.Member;
import com.sliit.library.model.Notification;
import com.sliit.library.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepo;


    // =========================================================
    // MEMBER NOTIFICATION
    // =========================================================

    public Notification createMemberNotification(
            Member member,
            String title,
            String message,
            String type,
            String referenceType,
            Long referenceId
    ) {

        if (member == null) {
            return null;
        }

        Notification notification = new Notification();

        notification.setRecipientType("MEMBER");
        notification.setMember(member);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setReferenceType(referenceType);
        notification.setReferenceId(referenceId);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        return notificationRepo.save(notification);
    }


    // =========================================================
    // ADMIN NOTIFICATION
    // =========================================================

    public Notification createAdminNotification(
            String title,
            String message,
            String type,
            String referenceType,
            Long referenceId
    ) {

        Notification notification = new Notification();

        notification.setRecipientType("ADMIN");
        notification.setMember(null);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setReferenceType(referenceType);
        notification.setReferenceId(referenceId);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        return notificationRepo.save(notification);
    }


    // =========================================================
    // GET MEMBER NOTIFICATIONS
    // =========================================================

    public List<Notification> getMemberNotifications(Long memberId) {

        return notificationRepo
                .findByMemberIdOrderByCreatedAtDesc(memberId);
    }


    // =========================================================
    // GET ADMIN NOTIFICATIONS
    // =========================================================

    public List<Notification> getAdminNotifications() {

        return notificationRepo
                .findByRecipientTypeOrderByCreatedAtDesc("ADMIN");
    }


    // =========================================================
    // MEMBER UNREAD COUNT
    // =========================================================

    public long getMemberUnreadCount(Long memberId) {

        return notificationRepo
                .countByMemberIdAndReadFalse(memberId);
    }


    // =========================================================
    // ADMIN UNREAD COUNT
    // =========================================================

    public long getAdminUnreadCount() {

        return notificationRepo
                .countByRecipientTypeAndReadFalse("ADMIN");
    }


    // =========================================================
    // ADMIN UNREAD ACTIVITY COUNTS BY MODULE
    // =========================================================

    public java.util.Map<String, Long> getAdminUnreadActivityCounts() {

        return java.util.Map.of(
                "BORROWING", notificationRepo
                        .countByRecipientTypeAndReferenceTypeAndReadFalse(
                                "ADMIN", "BORROWING"),
                "BORROWING_REQUEST", notificationRepo
                        .countByRecipientTypeAndReferenceTypeAndReadFalse(
                                "ADMIN", "BORROWING_REQUEST"),
                "RESERVATION", notificationRepo
                        .countByRecipientTypeAndReferenceTypeAndReadFalse(
                                "ADMIN", "RESERVATION"),
                "FINE", notificationRepo
                        .countByRecipientTypeAndReferenceTypeAndReadFalse(
                                "ADMIN", "FINE"),
                "BOOK_REQUEST", notificationRepo
                        .countByRecipientTypeAndReferenceTypeAndReadFalse(
                                "ADMIN", "BOOK_REQUEST"),
                "MEMBERSHIP", notificationRepo
                        .countByRecipientTypeAndReferenceTypeAndReadFalse(
                                "ADMIN", "MEMBERSHIP")
        );
    }


    // =========================================================
    // MARK ONE AS READ
    // =========================================================

    @Transactional
    public Notification markAsRead(Long id) {

        Notification notification = notificationRepo
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Notification not found"
                        )
                );

        notification.setRead(true);

        return notificationRepo.save(notification);
    }


    // =========================================================
    // MARK ALL MEMBER NOTIFICATIONS AS READ
    // =========================================================

    @Transactional
    public void markAllMemberAsRead(Long memberId) {

        List<Notification> notifications =
                notificationRepo
                        .findByMemberIdOrderByCreatedAtDesc(memberId);

        for (Notification notification : notifications) {
            notification.setRead(true);
        }

        notificationRepo.saveAll(notifications);
    }


    // =========================================================
    // MARK ALL ADMIN NOTIFICATIONS AS READ
    // =========================================================

    @Transactional
    public void markAllAdminAsRead() {

        List<Notification> notifications =
                notificationRepo
                        .findByRecipientTypeOrderByCreatedAtDesc("ADMIN");

        for (Notification notification : notifications) {
            notification.setRead(true);
        }

        notificationRepo.saveAll(notifications);
    }
}
