package com.sliit.library.controller;

import com.sliit.library.model.MembershipPayment;
import com.sliit.library.service.MembershipPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/membership-payments")
@CrossOrigin(origins = "*")
public class MembershipPaymentController {

    @Autowired
    private MembershipPaymentService membershipPaymentService;


    // =========================================================
    // GET ALL MEMBERSHIP PAYMENTS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<MembershipPayment>> getAllPayments() {

        return ResponseEntity.ok(
                membershipPaymentService.getAllPayments()
        );
    }


    // =========================================================
    // GET PAYMENTS BY MEMBER
    // =========================================================

    @GetMapping("/member/{memberId}")
    public ResponseEntity<?> getPaymentsByMember(
            @PathVariable Long memberId) {

        try {

            return ResponseEntity.ok(
                    membershipPaymentService
                            .getPaymentsByMember(memberId)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap(
                            "error",
                            e.getMessage()
                    ));
        }
    }


    // =========================================================
    // GET PAYMENT BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentById(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    membershipPaymentService
                            .getPaymentById(id)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.notFound().build();
        }
    }


    // =========================================================
    // CREATE MEMBERSHIP PAYMENT
    // =========================================================

    @PostMapping
    public ResponseEntity<?> createPayment(
            @RequestBody Map<String, Object> payload) {

        try {

            Object memberIdValue =
                    payload.get("memberId");

            Object amountValue =
                    payload.get("amount");

            String paymentType =
                    payload.get("paymentType") != null
                            ? payload.get("paymentType").toString()
                            : null;


            if (memberIdValue == null) {

                throw new IllegalArgumentException(
                        "Member ID is required"
                );
            }

            if (amountValue == null) {

                throw new IllegalArgumentException(
                        "Payment amount is required"
                );
            }


            Long memberId =
                    Long.valueOf(
                            memberIdValue.toString()
                    );


            BigDecimal amount =
                    new BigDecimal(
                            amountValue.toString()
                    );


            MembershipPayment payment =
                    membershipPaymentService.createPayment(
                            memberId,
                            amount,
                            paymentType
                    );


            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(payment);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap(
                            "error",
                            e.getMessage()
                    ));
        }
    }


    // =========================================================
    // PAY MEMBERSHIP FEE
    // =========================================================

    @PostMapping("/{id}/pay")
    public ResponseEntity<?> payMembershipFee(
            @PathVariable Long id,
            @RequestBody(required = false)
            Map<String, String> payload) {

        try {

            String paymentMethod =
                    payload != null
                            ? payload.get("paymentMethod")
                            : "ONLINE_CARD";


            MembershipPayment payment =
                    membershipPaymentService
                            .payMembershipFee(
                                    id,
                                    paymentMethod
                            );


            return ResponseEntity.ok(payment);

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap(
                            "error",
                            e.getMessage()
                    ));
        }
    }


    // =========================================================
    // GET PAYMENT BY PAYMENT CODE
    // =========================================================

    @GetMapping("/code/{paymentCode}")
    public ResponseEntity<?> getPaymentByCode(
            @PathVariable String paymentCode) {

        try {

            return ResponseEntity.ok(
                    membershipPaymentService
                            .getPaymentByCode(paymentCode)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.notFound().build();
        }
    }


    // =========================================================
    // GET PAYMENT BY RECEIPT NUMBER
    // =========================================================

    @GetMapping("/receipt/{receiptNumber}")
    public ResponseEntity<?> getPaymentByReceipt(
            @PathVariable String receiptNumber) {

        try {

            return ResponseEntity.ok(
                    membershipPaymentService
                            .getPaymentByReceipt(receiptNumber)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.notFound().build();
        }
    }
}
