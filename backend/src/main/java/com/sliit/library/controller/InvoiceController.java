package com.sliit.library.controller;

import com.sliit.library.model.Invoice;
import com.sliit.library.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @PostMapping("/generate/{fineId}")
    public ResponseEntity<?> generateInvoice(
            @PathVariable Long fineId) {

        try {

            Invoice invoice =
                    invoiceService.generateInvoice(fineId);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(invoice);

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Collections.singletonMap(
                            "error",
                            e.getMessage()
                    ));
        }
    }

    @GetMapping("/fine/{fineId}")
    public ResponseEntity<?> getInvoiceByFine(
            @PathVariable Long fineId) {

        try {

            return ResponseEntity.ok(
                    invoiceService.getInvoiceByFineId(fineId)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }

    @PostMapping("/generate-by-code/{fineCode}")
    public ResponseEntity<?> generateInvoiceByCode(
            @PathVariable String fineCode) {

        try {

            Invoice invoice =
                    invoiceService.generateInvoiceByFineCode(fineCode);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(invoice);

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Collections.singletonMap(
                            "error",
                            e.getMessage()
                    ));
        }
    }
}