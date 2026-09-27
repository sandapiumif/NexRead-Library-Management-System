package com.sliit.library.service;

import com.sliit.library.model.Fine;
import com.sliit.library.model.Invoice;
import com.sliit.library.repository.FineRepository;
import com.sliit.library.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private FineRepository fineRepository;

    public Invoice generateInvoice(Long fineId) {

        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Fine record not found")
                );

        if (!"PAID".equalsIgnoreCase(fine.getStatus())) {
            throw new IllegalStateException(
                    "Invoice can only be generated for a paid fine"
            );
        }

        // Do not create duplicate invoices
        return invoiceRepository.findByFineId(fineId)
                .orElseGet(() -> {

                    Invoice invoice = new Invoice();

                    invoice.setInvoiceNumber(
                            "INV-" +
                                    LocalDateTime.now().getYear() +
                                    "-" +
                                    UUID.randomUUID()
                                            .toString()
                                            .substring(0, 8)
                                            .toUpperCase()
                    );

                    invoice.setFine(fine);
                    invoice.setMember(fine.getMember());
                    invoice.setInvoiceDate(
                            LocalDateTime.now()
                    );
                    invoice.setAmount(fine.getAmount());
                    invoice.setStatus("PAID");

                    invoice.setDescription(
                            "Overdue library fine payment for "
                                    + fine.getFineCode()
                    );

                    return invoiceRepository.save(invoice);
                });
    }

    public Invoice getInvoiceByFineId(Long fineId) {

        return invoiceRepository.findByFineId(fineId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invoice not found for this fine"
                        )
                );
    }

    public Invoice generateInvoiceByFineCode(String fineCode) {

        Fine fine = fineRepository.findByFineCode(fineCode)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Fine record not found: " + fineCode
                        )
                );

        if (!"PAID".equalsIgnoreCase(fine.getStatus())) {
            throw new IllegalStateException(
                    "Invoice can only be generated for a paid fine"
            );
        }

        return invoiceRepository.findByFineId(fine.getId())
                .orElseGet(() -> {

                    Invoice invoice = new Invoice();

                    invoice.setInvoiceNumber(
                            "INV-" +
                                    LocalDateTime.now().getYear() +
                                    "-" +
                                    UUID.randomUUID()
                                            .toString()
                                            .substring(0, 8)
                                            .toUpperCase()
                    );

                    invoice.setFine(fine);
                    invoice.setMember(fine.getMember());
                    invoice.setInvoiceDate(LocalDateTime.now());
                    invoice.setAmount(fine.getAmount());
                    invoice.setStatus("PAID");

                    invoice.setDescription(
                            "Overdue library fine payment for "
                                    + fine.getFineCode()
                    );

                    return invoiceRepository.save(invoice);
                });
    }
}
