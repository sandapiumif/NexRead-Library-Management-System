package com.sliit.library.service;

import com.sliit.library.model.Book;
import com.sliit.library.model.BorrowingRecord;
import com.sliit.library.repository.BookRepository;
import com.sliit.library.repository.BorrowingRepository;
import com.sliit.library.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookRecommendationService {

    @Autowired private BookRepository bookRepo;
    @Autowired private BorrowingRepository borrowingRepo;
    @Autowired private MemberRepository memberRepo;

    /**
     * Simple rule-based recommendations. This intentionally does not use AI,
     * matching the proposal limitation that AI-based recommendation algorithms
     * are outside the initial version.
     */
    public List<Book> getRecommendations(Long memberId) {
        if (!memberRepo.existsById(memberId)) {
            throw new IllegalArgumentException("Member not found");
        }

        List<BorrowingRecord> history = borrowingRepo.findByMemberId(memberId);
        Set<Long> borrowedBookIds = history.stream()
                .filter(h -> h.getBook() != null)
                .map(h -> h.getBook().getId())
                .collect(Collectors.toSet());

        LinkedHashSet<Book> recommendations = new LinkedHashSet<>();

        // Recommend books from categories the member has previously borrowed.
        history.stream()
                .filter(h -> h.getBook() != null && h.getBook().getCategory() != null)
                .map(h -> h.getBook().getCategory())
                .distinct()
                .forEach(category -> bookRepo.findByCategoryIgnoreCase(category).stream()
                        .filter(book -> !"ARCHIVED".equalsIgnoreCase(book.getStatus()))
                        .filter(book -> book.getAvailableCopies() > 0)
                        .filter(book -> !borrowedBookIds.contains(book.getId()))
                        .forEach(recommendations::add));

        // New members receive a small general recommendation list.
        if (recommendations.isEmpty()) {
            bookRepo.findAll().stream()
                    .filter(book -> !"ARCHIVED".equalsIgnoreCase(book.getStatus()))
                    .filter(book -> book.getAvailableCopies() > 0)
                    .forEach(recommendations::add);
        }

        return new ArrayList<>(recommendations).stream().limit(6).toList();
    }
}
