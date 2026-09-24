package com.sliit.library.repository;

import com.sliit.library.model.BookReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookReviewRepository extends JpaRepository<BookReview, Long> {
    List<BookReview> findByBookIdOrderByCreatedAtDesc(Long bookId);
    Optional<BookReview> findByMemberIdAndBookId(Long memberId, Long bookId);
}
