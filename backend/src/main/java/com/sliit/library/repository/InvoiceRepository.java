package com.sliit.library.repository;

import com.sliit.library.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByFineId(Long fineId);

    boolean existsByFineId(Long fineId);
}
