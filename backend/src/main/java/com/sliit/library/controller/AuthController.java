package com.sliit.library.controller;

import com.sliit.library.model.User;
import com.sliit.library.repository.MemberRepository;
import com.sliit.library.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final MemberRepository memberRepository;

    public AuthController(UserRepository userRepository, MemberRepository memberRepository) {
        this.userRepository = userRepository;
        this.memberRepository = memberRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.getOrDefault("username", "").trim();
        String password = body.getOrDefault("password", "").trim();

        if (username.isEmpty() || password.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Username and password are required.")
            );
        }

        // Try finding by username or email
        Optional<User> userOpt = userRepository.findByUsernameAndPasswordHash(username, password);
        if (userOpt.isEmpty()) {
            // Also allow login via email
            userOpt = userRepository.findByEmailAndPasswordHash(username, password);
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(
                    Map.of("error", "Invalid credentials. Please check your username and password.")
            );
        }

        User user = userOpt.get();

        // Check member membership status for CUSTOMER accounts
        if ("CUSTOMER".equals(user.getRole()) && user.getMemberId() != null) {

            Optional<com.sliit.library.model.Member> memberOpt =
                    memberRepository.findById(user.getMemberId());

            if (memberOpt.isPresent()) {

                com.sliit.library.model.Member member = memberOpt.get();
                String status = member.getStatus();

                // REJECTED members cannot log in
                if ("REJECTED".equalsIgnoreCase(status)) {

                    return ResponseEntity
                            .status(403)
                            .body(Map.of(
                                    "error",
                                    "Your membership application has been rejected."
                            ));
                }

                /*
                 * PENDING, SUSPENDED and INACTIVE members are
                 * allowed to log in.
                 *
                 * Their access to restricted library activities
                 * is controlled separately based on membership status.
                 */
            }
        }

        // Existing User account check
        if (!user.isActive()) {
            return ResponseEntity.status(403).body(
                    Map.of(
                            "error",
                            "Your account has been deactivated. Please contact the library."
                    )
            );
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("role", user.getRole());
        response.put("fullName", user.getFullName());
        response.put("email", user.getEmail());
        response.put("memberId", user.getMemberId());
        response.put("token", "session-" + user.getId() + "-" + System.currentTimeMillis());

        // If customer, also attach member object
        if ("CUSTOMER".equals(user.getRole()) && user.getMemberId() != null) {
            memberRepository.findById(user.getMemberId()).ifPresent(m ->
                    response.put("member", m)
            );
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, Object> body) {
        String username = body.getOrDefault("username", "").toString().trim();
        String password = body.getOrDefault("password", "").toString().trim();
        String fullName = body.getOrDefault("fullName", "").toString();
        String email    = body.getOrDefault("email",    "").toString();

        if (username.isEmpty() || password.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "error",
                            "Username and password are required."
                    )
            );
        }

        // PASSWORD VALIDATION
        if (password.length() < 6) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "error",
                            "Password must contain at least 6 characters."
                    )
            );
        }

        // DUPLICATE USERNAME
        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "error",
                            "Username already taken."
                    )
            );
        }

        Long memberId = body.get("memberId") != null ? Long.valueOf(body.get("memberId").toString()) : null;

        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(password);
        user.setRole("CUSTOMER");
        user.setMemberId(memberId);
        user.setFullName(fullName);
        user.setEmail(email);
        user.setActive(true);

        User saved = userRepository.save(user);
        return ResponseEntity.ok(Map.of(
                "id",
                saved.getId(),
                "username",
                saved.getUsername(),
                "role",
                saved.getRole()
        ));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody Map<String, String> body) {

        String identifier = body.getOrDefault("identifier", "").trim();

        if (identifier.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username or email is required."));
        }

        Optional<User> userOpt = userRepository.findByUsername(identifier);

        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(identifier);
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "No account found with this username or email."));
        }

        User user = userOpt.get();

        if (!user.isActive()) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "This account has been deactivated."));
        }

        // Generate one-time reset token
        String token = UUID.randomUUID().toString();

        user.setResetToken(token);
        user.setResetTokenExpiry(
                LocalDateTime.now().plusMinutes(15)
        );

        userRepository.save(user);

        /*
         * For this academic project, the token is returned directly
         * because no email service is configured.
         *
         * In a production system, this token would be sent
         * through a password-reset email.
         */

        return ResponseEntity.ok(
                Map.of(
                        "message", "Password reset request created.",
                        "token", token,
                        "username", user.getUsername()
                )
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody Map<String, String> body) {

        String token = body.getOrDefault("token", "").trim();
        String newPassword = body.getOrDefault("newPassword", "").trim();

        if (token.isEmpty() || newPassword.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            "Reset token and new password are required."
                    ));
        }

        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            "Password must contain at least 6 characters."
                    ));
        }

        Optional<User> userOpt =
                userRepository.findByResetToken(token);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(400)
                    .body(Map.of(
                            "error",
                            "Invalid or expired reset token."
                    ));
        }

        User user = userOpt.get();

        // Check token expiry
        if (user.getResetTokenExpiry() == null ||
                user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {

            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);

            return ResponseEntity.status(400)
                    .body(Map.of(
                            "error",
                            "Reset token has expired. Please request a new one."
                    ));
        }

        // Update actual password
        user.setPasswordHash(newPassword);

        // Make token one-time use
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Password has been reset successfully."
                )
        );
    }
}