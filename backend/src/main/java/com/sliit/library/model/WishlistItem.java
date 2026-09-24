package com.sliit.library.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "WishlistItems", uniqueConstraints = {
        @UniqueConstraint(name = "uk_wishlist_member_book", columnNames = {"member_id", "book_id"})
})
public class WishlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public WishlistItem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }

    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
