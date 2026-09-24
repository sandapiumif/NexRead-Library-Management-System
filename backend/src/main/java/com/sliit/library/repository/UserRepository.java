package com.sliit.library.repository;

import com.sliit.library.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameAndPasswordHash(
            String username,
            String passwordHash
    );

    Optional<User> findByEmailAndPasswordHash(
            String email,
            String passwordHash
    );

    Optional<User> findByResetToken(String resetToken);
}