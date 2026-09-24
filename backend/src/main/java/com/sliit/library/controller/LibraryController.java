package com.sliit.library.controller;

import com.sliit.library.model.Member;
import com.sliit.library.service.LibraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.nio.file.Files;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LibraryController {

    @Autowired
    private LibraryService libraryService;


    // ==============================
    // DASHBOARD / ANALYTICS
    // ==============================

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {

        return ResponseEntity.ok(
                libraryService.getDashboardStats()
        );
    }

    // ==============================
    // MEMBER PROFILE
    // ==============================

    // Get member profile
    @GetMapping("/member-profile/{id}")
    public ResponseEntity<?> getMemberProfile(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    libraryService.getMemberProfile(id)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }


    // Update member profile
    @PutMapping("/member-profile/{id}")
    public ResponseEntity<?> updateMemberProfile(
            @PathVariable Long id,
            @RequestBody Member updatedMember) {

        try {

            return ResponseEntity.ok(
                    libraryService.updateMemberProfile(
                            id,
                            updatedMember
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

    // ==============================
    // MEMBER PROFILE IMAGE
    // ==============================

    // Upload / Change profile image
    @PostMapping(
            value = "/member-profile/{id}/profile-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> uploadProfileImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        try {

            return ResponseEntity.ok(
                    libraryService.uploadProfileImage(
                            id,
                            file
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

    @GetMapping("/member-profile/{id}/profile-image")
    public ResponseEntity<?> getProfileImage(
            @PathVariable Long id) {

        try {

            Member member =
                    libraryService.getMemberProfile(id);

            if (member.getProfileImage() == null ||
                    member.getProfileImage().trim().isEmpty()) {

                return ResponseEntity.notFound().build();
            }

            String fileName =
                    member.getProfileImage();

            Path imagePath =
                    Paths.get("uploads/profile-images")
                            .resolve(fileName)
                            .normalize();

            Resource resource =
                    new UrlResource(
                            imagePath.toUri()
                    );

            if (!resource.exists() ||
                    !resource.isReadable()) {

                return ResponseEntity.notFound().build();
            }

            String contentType =
                    Files.probeContentType(imagePath);

            MediaType mediaType =
                    MediaType.parseMediaType(
                            contentType != null
                                    ? contentType
                                    : "application/octet-stream"
                    );

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline"
                    )
                    .body(resource);

        } catch (Exception e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }

    // Remove profile image
    @DeleteMapping("/member-profile/{id}/profile-image")
    public ResponseEntity<?> deleteProfileImage(
            @PathVariable Long id) {

        try {

            libraryService.deleteProfileImage(id);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Profile image removed successfully."
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

}