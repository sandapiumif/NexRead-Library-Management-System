package com.sliit.library;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Main entry point for the SLIIT Library Management System API
@SpringBootApplication
public class LibraryManagementApplication {

    public static void main(String[] args) {
        // start spring boot server on port 8080
        SpringApplication.run(LibraryManagementApplication.class, args);
        System.out.println(">>> Library Management System API is running on http://localhost:8080");
    }
}
