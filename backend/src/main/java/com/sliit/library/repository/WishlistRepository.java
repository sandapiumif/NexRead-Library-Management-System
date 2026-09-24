package com.sliit.library.repository;

import com.sliit.library.model.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByMemberIdOrderByCreatedAtDesc(Long memberId);
    Optional<WishlistItem> findByMemberIdAndBookId(Long memberId, Long bookId);
    boolean existsByMemberIdAndBookId(Long memberId, Long bookId);
}
