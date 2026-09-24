package com.sliit.library.service;

import com.sliit.library.model.BorrowingRecord;
import com.sliit.library.model.Fine;
import com.sliit.library.model.Reservation;
import com.sliit.library.model.BookRequest;
import com.sliit.library.repository.BookRepository;
import com.sliit.library.repository.BorrowingRepository;
import com.sliit.library.repository.FineRepository;
import com.sliit.library.repository.MemberRepository;
import com.sliit.library.repository.ReservationRepository;
import com.sliit.library.repository.BookRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.sliit.library.model.Member;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class LibraryService {

    @Autowired
    private BookRepository bookRepo;

    @Autowired
    private MemberRepository memberRepo;

    @Autowired
    private BorrowingRepository borrowingRepo;

    @Autowired
    private ReservationRepository reservationRepo;

    @Autowired
    private FineRepository fineRepo;

    @Autowired
    private BookRequestRepository bookRequestRepo;


    // ==============================
    // MEMBER REGISTRATION
    // ==============================

    public com.sliit.library.model.Member registerMember(
            com.sliit.library.model.Member member) {

        // ==============================
        // REQUIRED FIELD VALIDATION
        // ==============================

        if (member.getFullName() == null ||
                member.getFullName().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Full name is required."
            );
        }

        if (member.getEmail() == null ||
                member.getEmail().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Email address is required."
            );
        }

        if (member.getPhone() == null ||
                member.getPhone().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Phone number is required."
            );
        }

        if (member.getIdNumber() == null ||
                member.getIdNumber().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "National ID / Student ID is required."
            );
        }


        // ==============================
        // CLEAN INPUT
        // ==============================

        String email = member.getEmail()
                .trim()
                .toLowerCase();

        String phone = member.getPhone()
                .trim();

        String idNumber = member.getIdNumber()
                .trim();


        // ==============================
        // DUPLICATE EMAIL CHECK
        // ==============================

        if (memberRepo.findByEmail(email).isPresent()) {

            throw new IllegalArgumentException(
                    "A member with this email already exists."
            );
        }


        // ==============================
        // DUPLICATE PHONE CHECK
        // ==============================

        if (memberRepo.findByPhone(phone).isPresent()) {

            throw new IllegalArgumentException(
                    "A member with this phone number already exists."
            );
        }


        // ==============================
        // DUPLICATE NIC / STUDENT ID
        // ==============================

        if (memberRepo.findByIdNumber(idNumber).isPresent()) {

            throw new IllegalArgumentException(
                    "A member with this National ID / Student ID already exists."
            );
        }


        // ==============================
        // SET CLEAN VALUES
        // ==============================

        member.setFullName(
                member.getFullName().trim()
        );

        member.setEmail(email);
        member.setPhone(phone);
        member.setIdNumber(idNumber);


        // ==============================
        // MEMBER CODE
        // ==============================

        member.setMemberCode(
                "MEM-" + (memberRepo.count() + 1001)
        );


        // ==============================
        // DEFAULT STATUS
        // ==============================

        member.setStatus("PENDING");


        // ==============================
        // JOIN / EXPIRY DATES
        // ==============================

        member.setJoinDate(LocalDate.now());

        member.setExpiryDate(
                LocalDate.now().plusYears(1)
        );


        // ==============================
        // BORROW LIMIT
        // ==============================

        if ("FACULTY".equalsIgnoreCase(
                member.getMembershipType())) {

            member.setMaxBorrowLimit(6);

        } else if ("GENERAL".equalsIgnoreCase(
                member.getMembershipType())) {

            member.setMaxBorrowLimit(2);

        } else {

            member.setMaxBorrowLimit(3);
        }


        // ==============================
        // SAVE MEMBER
        // ==============================

        return memberRepo.save(member);
    }


    // ==============================
    // DASHBOARD / ANALYTICS
    // ==============================

    public Map<String, Object> getDashboardStats() {

        Map<String, Object> stats = new HashMap<>();

        // Total books
        stats.put(
                "totalBooks",
                bookRepo.count()
        );

        // Total members
        stats.put(
                "totalMembers",
                memberRepo.count()
        );

        // Active borrowings
        stats.put(
                "activeBorrowings",
                borrowingRepo.findAll()
                        .stream()
                        .filter(b ->
                                "BORROWED".equalsIgnoreCase(b.getStatus())
                                        ||
                                        "OVERDUE".equalsIgnoreCase(b.getStatus())
                        )
                        .count()
        );

        // Active reservations
        stats.put(
                "activeReservations",
                reservationRepo.findAll()
                        .stream()
                        .filter(r ->
                                "ACTIVE".equalsIgnoreCase(r.getStatus())
                        )
                        .count()
        );

        // Pending fines
        stats.put(
                "pendingFinesCount",
                fineRepo.findAll()
                        .stream()
                        .filter(f ->
                                "PENDING".equalsIgnoreCase(f.getStatus())
                        )
                        .count()
        );

        // Total collected fines
        BigDecimal totalCollected =
                fineRepo.findAll()
                        .stream()
                        .filter(f ->
                                "PAID".equalsIgnoreCase(f.getStatus())
                        )
                        .map(Fine::getAmount)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        stats.put(
                "finesCollected",
                totalCollected
        );

        // Pending book requests
        stats.put(
                "pendingRequests",
                bookRequestRepo.findAll()
                        .stream()
                        .filter(r ->
                                "PENDING".equalsIgnoreCase(r.getStatus())
                        )
                        .count()
        );

        return stats;
    }

        // ==============================
        // MEMBER PROFILE IMAGE
        // ==============================

        public Member uploadProfileImage(
                Long memberId,
                MultipartFile file) {

            Member member = memberRepo.findById(memberId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Member not found."
                            )
                    );

            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException(
                        "Please select an image."
                );
            }

            // Maximum file size = 5 MB
            if (file.getSize() > 5 * 1024 * 1024) {
                throw new IllegalArgumentException(
                        "Profile image must be smaller than 5 MB."
                );
            }

            String contentType = file.getContentType();

            if (contentType == null ||
                    !(contentType.equals("image/jpeg") ||
                            contentType.equals("image/png") ||
                            contentType.equals("image/webp"))) {

                throw new IllegalArgumentException(
                        "Only JPG, PNG, and WEBP images are allowed."
                );
            }

            try {

                // Create upload directory
                Path uploadDirectory =
                        Paths.get("uploads/profile-images");

                Files.createDirectories(uploadDirectory);


                // Delete old image if one exists
                if (member.getProfileImage() != null &&
                        !member.getProfileImage().trim().isEmpty()) {

                    String oldImageUrl =
                            member.getProfileImage();

                    String oldFileName =
                            oldImageUrl.substring(
                                    oldImageUrl.lastIndexOf("/") + 1
                            );

                    Path oldFile =
                            uploadDirectory.resolve(oldFileName);

                    Files.deleteIfExists(oldFile);
                }


                // Determine file extension
                String extension;

                if (contentType.equals("image/png")) {
                    extension = ".png";
                } else if (contentType.equals("image/webp")) {
                    extension = ".webp";
                } else {
                    extension = ".jpg";
                }


                // Generate unique filename
                String fileName =
                        UUID.randomUUID().toString() + extension;


                // Save file
                Path targetFile =
                        uploadDirectory.resolve(fileName);

                Files.copy(
                        file.getInputStream(),
                        targetFile
                );


                // Store the actual saved filename in the database
                member.setProfileImage(fileName);

                return memberRepo.save(member);

            } catch (IOException e) {

                throw new IllegalArgumentException(
                        "Failed to save profile image."
                );
            }
        }


        public void deleteProfileImage(Long memberId) {

            Member member = memberRepo.findById(memberId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Member not found."
                            )
                    );

            if (member.getProfileImage() == null ||
                    member.getProfileImage().trim().isEmpty()) {

                return;
            }

            try {

                Path uploadDirectory =
                        Paths.get("uploads/profile-images");

                String fileName =
                        member.getProfileImage();

                Path imageFile =
                        uploadDirectory.resolve(fileName);

                Files.deleteIfExists(imageFile);

            } catch (IOException e) {

                throw new IllegalArgumentException(
                        "Failed to remove profile image."
                );
            }

            member.setProfileImage(null);

            memberRepo.save(member);
        }



    // ==============================
    // MEMBER PROFILE
    // ==============================

    public Member getMemberProfile(Long memberId) {

        return memberRepo.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found.")
                );
    }


    public Member updateMemberProfile(
            Long memberId,
            Member updatedMember) {

        Member member = memberRepo.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found.")
                );

        // ==============================
        // UPDATE EDITABLE FIELDS ONLY
        // ==============================

        if (updatedMember.getFullName() == null ||
                updatedMember.getFullName().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Full name is required."
            );
        }

        if (updatedMember.getEmail() == null ||
                updatedMember.getEmail().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Email address is required."
            );
        }

        if (updatedMember.getPhone() == null ||
                updatedMember.getPhone().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Phone number is required."
            );
        }

        if (updatedMember.getAddress() == null ||
                updatedMember.getAddress().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Address is required."
            );
        }


        String email = updatedMember.getEmail()
                .trim()
                .toLowerCase();

        String phone = updatedMember.getPhone()
                .trim();


        // ==============================
        // DUPLICATE EMAIL CHECK
        // ==============================

        memberRepo.findByEmail(email)
                .ifPresent(existing -> {

                    if (!existing.getId().equals(memberId)) {
                        throw new IllegalArgumentException(
                                "A member with this email already exists."
                        );
                    }
                });


        // ==============================
        // DUPLICATE PHONE CHECK
        // ==============================

        memberRepo.findByPhone(phone)
                .ifPresent(existing -> {

                    if (!existing.getId().equals(memberId)) {
                        throw new IllegalArgumentException(
                                "A member with this phone number already exists."
                        );
                    }
                });


        // ==============================
        // UPDATE PROFILE DETAILS
        // ==============================

        member.setFullName(
                updatedMember.getFullName().trim()
        );

        member.setEmail(email);

        member.setPhone(phone);

        member.setAddress(
                updatedMember.getAddress().trim()
        );


        // ==============================
        // KEEP THESE UNCHANGED
        // ==============================

        // memberCode
        // idNumber
        // membershipType
        // status
        // maxBorrowLimit
        // joinDate
        // expiryDate
        // profileImage


        return memberRepo.save(member);
    }

    // ==============================
// MEMBER MANAGEMENT
// ==============================

    // Get all members
    public java.util.List<Member> getAllMembers() {

        return memberRepo.findAll();
    }


    // Approve pending member
    public Member approveMember(Long memberId) {

        Member member = memberRepo.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found.")
                );

        if (!"PENDING".equalsIgnoreCase(member.getStatus())) {

            throw new IllegalArgumentException(
                    "Only pending members can be approved."
            );
        }

        member.setStatus("ACTIVE");

        return memberRepo.save(member);
    }


    // Reject pending member
    public Member rejectMember(Long memberId) {

        Member member = memberRepo.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found.")
                );

        if (!"PENDING".equalsIgnoreCase(member.getStatus())) {

            throw new IllegalArgumentException(
                    "Only pending members can be rejected."
            );
        }

        member.setStatus("REJECTED");

        return memberRepo.save(member);
    }


    // Update member status
    public Member updateMemberStatus(
            Long memberId,
            String status) {

        Member member = memberRepo.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found.")
                );

        if (status == null || status.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Status is required."
            );
        }

        String newStatus =
                status.trim().toUpperCase();

        if (!newStatus.equals("ACTIVE") &&
                !newStatus.equals("SUSPENDED") &&
                !newStatus.equals("INACTIVE")) {

            throw new IllegalArgumentException(
                    "Invalid member status."
            );
        }

        member.setStatus(newStatus);

        return memberRepo.save(member);
    }


    // Deactivate member
    public void deleteMember(Long memberId) {

        Member member = memberRepo.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found.")
                );

        // Keep the member record to preserve library history
        member.setStatus("INACTIVE");

        memberRepo.save(member);
    }
}