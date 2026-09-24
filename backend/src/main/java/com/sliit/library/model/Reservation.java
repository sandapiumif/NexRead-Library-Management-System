package com.sliit.library.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

// Reservation entity for queue and waiting-list management (UC 04.1)
@Entity
@Table(name = "Reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reservation_code", unique = true, nullable = false)
    private String reservationCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(name = "reservation_date", nullable = false)
    private LocalDateTime reservationDate = LocalDateTime.now();

    @Column(name = "waiting_position", nullable = false)
    private int waitingPosition = 1;

    @Column(nullable = false)
    private String status; // ACTIVE, FULFILLED, CANCELLED, EXPIRED

    @Column(name = "notification_sent", nullable = false)
    private boolean notificationSent = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Reservation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReservationCode() { return reservationCode; }
    public void setReservationCode(String reservationCode) { this.reservationCode = reservationCode; }

    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }

    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }

    public LocalDateTime getReservationDate() { return reservationDate; }
    public void setReservationDate(LocalDateTime reservationDate) { this.reservationDate = reservationDate; }

    public int getWaitingPosition() { return waitingPosition; }
    public void setWaitingPosition(int waitingPosition) { this.waitingPosition = waitingPosition; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isNotificationSent() { return notificationSent; }
    public void setNotificationSent(boolean notificationSent) { this.notificationSent = notificationSent; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
