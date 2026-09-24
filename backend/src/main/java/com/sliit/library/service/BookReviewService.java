package com.sliit.library.service;

import com.sliit.library.model.Book;
import com.sliit.library.model.BookReview;
import com.sliit.library.model.Member;
import com.sliit.library.repository.BookRepository;
import com.sliit.library.repository.BookReviewRepository;
import com.sliit.library.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookReviewService {

    @Autowired private BookReviewRepository reviewRepo;
    @Autowired private BookRepository bookRepo;
    @Autowired private MemberRepository memberRepo;

    public List<BookReview> getReviewsForBook(Long bookId) {
        if (!bookRepo.existsById(bookId)) {
            throw new IllegalArgumentException("Book not found");
        }
        return reviewRepo.findByBookIdOrderByCreatedAtDesc(bookId);
    }

    public BookReview addOrUpdateReview(Long memberId, Long bookId, int rating, String comment) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        if (comment == null || comment.trim().isEmpty()) {
            throw new IllegalArgumentException("Review comment is required");
        }

        Member member = memberRepo.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));
        Book book = bookRepo.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));

        if (!"ACTIVE".equalsIgnoreCase(member.getStatus())) {
            throw new IllegalStateException("Only active members can submit reviews");
        }

        BookReview review = reviewRepo.findByMemberIdAndBookId(memberId, bookId)
                .orElseGet(BookReview::new);

        review.setMember(member);
        review.setBook(book);
        review.setRating(rating);
        review.setComment(comment.trim());

        return reviewRepo.save(review);
    }
}

