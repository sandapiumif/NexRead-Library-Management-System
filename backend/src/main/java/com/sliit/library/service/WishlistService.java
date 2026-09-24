package com.sliit.library.service;

import com.sliit.library.model.Book;
import com.sliit.library.model.Member;
import com.sliit.library.model.WishlistItem;
import com.sliit.library.repository.BookRepository;
import com.sliit.library.repository.MemberRepository;
import com.sliit.library.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistService {

    @Autowired private WishlistRepository wishlistRepo;
    @Autowired private MemberRepository memberRepo;
    @Autowired private BookRepository bookRepo;

    public List<WishlistItem> getWishlist(Long memberId) {
        if (!memberRepo.existsById(memberId)) {
            throw new IllegalArgumentException("Member not found");
        }
        return wishlistRepo.findByMemberIdOrderByCreatedAtDesc(memberId);
    }

    public WishlistItem addToWishlist(Long memberId, Long bookId) {
        Member member = memberRepo.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));
        Book book = bookRepo.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));

        if (!"ACTIVE".equalsIgnoreCase(member.getStatus())) {
            throw new IllegalStateException("Only active members can maintain a wishlist");
        }
        if ("ARCHIVED".equalsIgnoreCase(book.getStatus())) {
            throw new IllegalStateException("Archived books cannot be added to a wishlist");
        }
        if (wishlistRepo.existsByMemberIdAndBookId(memberId, bookId)) {
            throw new IllegalArgumentException("Book is already in your wishlist");
        }

        WishlistItem item = new WishlistItem();
        item.setMember(member);
        item.setBook(book);
        return wishlistRepo.save(item);
    }

    public void removeFromWishlist(Long memberId, Long bookId) {
        WishlistItem item = wishlistRepo.findByMemberIdAndBookId(memberId, bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book is not in your wishlist"));
        wishlistRepo.delete(item);
    }

    public boolean isInWishlist(Long memberId, Long bookId) {
        return wishlistRepo.existsByMemberIdAndBookId(memberId, bookId);
    }
}
