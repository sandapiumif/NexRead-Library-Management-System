package com.sliit.library.controller;

import com.sliit.library.model.Reservation;
import com.sliit.library.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;


    // READ - Get all reservations
    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {

        return ResponseEntity.ok(
                reservationService.getAllReservations()
        );
    }


    // CREATE - Create reservation
    @PostMapping
    public ResponseEntity<?> createReservation(
            @RequestBody Map<String, Object> payload) {

        try {

            if (payload == null ||
                    payload.get("memberId") == null ||
                    payload.get("bookId") == null) {

                return ResponseEntity.badRequest()
                        .body(Collections.singletonMap(
                                "error",
                                "Member and Book selection are required"
                        ));
            }

            Long memberId =
                    Long.valueOf(payload.get("memberId").toString());

            Long bookId =
                    Long.valueOf(payload.get("bookId").toString());


            Reservation reservation =
                    reservationService.reserveBook(
                            memberId,
                            bookId
                    );


            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(reservation);

        } catch (IllegalArgumentException |
                 IllegalStateException ex) {

            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap(
                            "error",
                            ex.getMessage()
                    ));
        }
    }


    // UPDATE - Update reservation status
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReservation(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        try {

            String status = body.get("status");

            Reservation updated =
                    reservationService.updateReservation(
                            id,
                            status
                    );

            return ResponseEntity.ok(updated);

        } catch (IllegalArgumentException ex) {

            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap(
                            "error",
                            ex.getMessage()
                    ));
        }
    }


    // DELETE - Cancel reservation
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelReservation(
            @PathVariable Long id) {

        try {

            Reservation reservation =
                    reservationService.cancelReservation(id);

            return ResponseEntity.ok(reservation);

        } catch (IllegalArgumentException ex) {

            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap(
                            "error",
                            ex.getMessage()
                    ));
        }
    }
}