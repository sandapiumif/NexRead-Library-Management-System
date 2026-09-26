package com.sliit.library.controller;

import com.sliit.library.model.Notification;
import com.sliit.library.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;


    // =========================================================
    // MEMBER NOTIFICATIONS
    // =========================================================

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Notification>> getMemberNotifications(
            @PathVariable Long memberId
    ) {

        return ResponseEntity.ok(
                notificationService.getMemberNotifications(memberId)
        );
    }


    // =========================================================
    // MEMBER UNREAD COUNT
    // =========================================================

    @GetMapping("/member/{memberId}/unread-count")
    public ResponseEntity<Map<String, Long>> getMemberUnreadCount(
            @PathVariable Long memberId
    ) {

        return ResponseEntity.ok(
                Map.of(
                        "count",
                        notificationService
                                .getMemberUnreadCount(memberId)
                )
        );
    }


    // =========================================================
    // ADMIN NOTIFICATIONS
    // =========================================================

    @GetMapping("/admin")
    public ResponseEntity<List<Notification>> getAdminNotifications() {

        return ResponseEntity.ok(
                notificationService.getAdminNotifications()
        );
    }


    // =========================================================
    // ADMIN UNREAD COUNT
    // =========================================================

    @GetMapping("/admin/unread-count")
    public ResponseEntity<Map<String, Long>> getAdminUnreadCount() {

        return ResponseEntity.ok(
                Map.of(
                        "count",
                        notificationService
                                .getAdminUnreadCount()
                )
        );
    }


    // =========================================================
    // ADMIN UNREAD ACTIVITY COUNTS BY MODULE
    // =========================================================

    @GetMapping("/admin/unread-counts")
    public ResponseEntity<Map<String, Long>> getAdminUnreadActivityCounts() {

        return ResponseEntity.ok(
                notificationService
                        .getAdminUnreadActivityCounts()
        );
    }


    // =========================================================
    // MARK ONE AS READ
    // =========================================================

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long id
    ) {

        try {

            return ResponseEntity.ok(
                    notificationService.markAsRead(id)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(
                            Map.of("error", e.getMessage())
                    );
        }
    }


    // =========================================================
    // MARK ALL MEMBER NOTIFICATIONS AS READ
    // =========================================================

    @PutMapping("/member/{memberId}/read-all")
    public ResponseEntity<?> markAllMemberAsRead(
            @PathVariable Long memberId
    ) {

        notificationService.markAllMemberAsRead(memberId);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "All member notifications marked as read"
                )
        );
    }


    // =========================================================
    // MARK ALL ADMIN NOTIFICATIONS AS READ
    // =========================================================

    @PutMapping("/admin/read-all")
    public ResponseEntity<?> markAllAdminAsRead() {

        notificationService.markAllAdminAsRead();

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "All admin notifications marked as read"
                )
        );
    }
}