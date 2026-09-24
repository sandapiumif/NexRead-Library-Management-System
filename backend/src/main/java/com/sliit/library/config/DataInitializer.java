package com.sliit.library.config;

import com.sliit.library.model.*;
import com.sliit.library.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

// Preload initial sample records if database is fresh
@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(
            MemberRepository memberRepo,
            BookRepository bookRepo,
            BorrowingRepository borrowingRepo,
            ReservationRepository reservationRepo,
            FineRepository fineRepo,
            BookRequestRepository requestRepo,
            UserRepository userRepo) {
        
        return args -> {
            if (memberRepo.count() > 0 && userRepo.count() > 0) {
                System.out.println(">>> Database already initialized with " + memberRepo.count() + " members and " + userRepo.count() + " users.");
                return;
            }

            System.out.println(">>> Seeding initial library data...");

            // 1. Members
            Member m1 = createMember("MEM-1001", "Kasun Perera", "kasun.p@library.org", "0771234567", "Colombo 07", "200115001234", "STUDENT", "ACTIVE", 3);
            Member m2 = createMember("MEM-1002", "Amaya Senanayake", "amaya.s@library.org", "0719876543", "Kaduwela Road, Malabe", "200224005678", "STUDENT", "ACTIVE", 3);
            Member m3 = createMember("MEM-1003", "Dilshan Jayawardena", "dilshan.j@library.org", "0763456789", "Station Road, Nugegoda", "200135009876", "STUDENT", "SUSPENDED", 3);
            Member m4 = createMember("MEM-1004", "Nethmi Wickramasinghe", "nethmi.w@library.org", "0754567890", "Battaramulla", "200256004321", "STUDENT", "ACTIVE", 3);
            Member m5 = createMember("MEM-1005", "Ravindu Bandara", "ravindu.b@library.org", "0785678901", "High Level Road, Maharagama", "200148003456", "STUDENT", "ACTIVE", 3);
            Member m6 = createMember("MEM-1006", "Kavindi Silva", "kavindi.s@library.org", "0726789012", "Kottawa", "200267007890", "STUDENT", "ACTIVE", 3);
            Member m7 = createMember("MEM-1007", "Dr. Sanath Wijesinghe", "sanath.w@library.org", "0701122334", "Staff Quarters", "198512345678", "FACULTY", "ACTIVE", 6);

            m1 = memberRepo.save(m1);
            m2 = memberRepo.save(m2);
            m3 = memberRepo.save(m3);
            m4 = memberRepo.save(m4);
            m5 = memberRepo.save(m5);
            m6 = memberRepo.save(m6);
            m7 = memberRepo.save(m7);

            // 2. Books
            Book b1 = createBook("BK-2001", "Clean Architecture: A Craftsman's Guide", "Robert C. Martin", "978-0134494166", "Prentice Hall", "Software Engineering", 5, 3, "AVAILABLE", "https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=400&q=80", "Foundational guide to clean enterprise software architecture and solid design principles.");
            Book b2 = createBook("BK-2002", "Design Patterns: Elements of Reusable OO Software", "Erich Gamma et al.", "978-0201633610", "Addison-Wesley", "Software Engineering", 4, 0, "BORROWED", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80", "The seminal Gang of Four catalog of fundamental software patterns.");
            Book b3 = createBook("BK-2003", "Introduction to Algorithms (CLRS)", "Thomas H. Cormen", "978-0262046305", "MIT Press", "Computer Science", 6, 4, "AVAILABLE", "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80", "The standard benchmark textbook on algorithm design and computational complexity.");
            Book b4 = createBook("BK-2004", "Database System Concepts (7th Ed)", "Abraham Silberschatz", "978-0078022159", "McGraw-Hill", "Database Systems", 4, 2, "AVAILABLE", "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400&q=80", "Principles of relational databases, SQL queries, transaction processing, and indexing.");
            Book b5 = createBook("BK-2005", "Spring Boot in Action", "Craig Walls", "978-1617292545", "Manning Publications", "Web Development", 3, 0, "RESERVED", "https://images.unsplash.com/photo-1507842229451-9f01079ca4b5?w=400&q=80", "Hands-on guide to building robust modern microservices and REST APIs with Java and Spring.");
            Book b6 = createBook("BK-2006", "Learning React: Modern Patterns for Web Apps", "Alex Banks, Eve Porcello", "978-1492051725", "O'Reilly Media", "Web Development", 5, 5, "AVAILABLE", "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80", "Master React Hooks, state management, component architecture, and modern JavaScript.");
            Book b7 = createBook("BK-2007", "Artificial Intelligence: A Modern Approach", "Stuart Russell, Peter Norvig", "978-0134610993", "Pearson", "Artificial Intelligence", 2, 1, "AVAILABLE", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80", "The leading textbook in AI covering probabilistic reasoning, search algorithms, and machine learning.");
            Book b8 = createBook("BK-2008", "The Cut-Up Trilogy: Nova Express", "William Burroughs", "978-0141189048", "Penguin Modern Classics", "Modern Classics", 3, 2, "AVAILABLE", "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80", "While Naked Lunch was an initial shock to the literary community, Nova Express was considered the culmination of Burroughs's stylistic experiment.");
            Book b9 = createBook("BK-2009", "The Cut-Up Trilogy: The Soft Machine", "William Burroughs", "978-0141189055", "Penguin Modern Classics", "Modern Classics", 2, 1, "AVAILABLE", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80", "The Soft Machine reconstructs a surreal space-age odyssey through Mayan mythology.");
            Book b10 = createBook("BK-2010", "The Cut-Up Trilogy: The Ticket That Exploded", "William Burroughs", "978-0141189062", "Penguin Modern Classics", "Modern Classics", 3, 3, "AVAILABLE", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80", "Burroughs develops the concept of language as an alien virus from outer space.");
            Book b11 = createBook("BK-2011", "Howl, Kaddish, and Other Poems", "Allen Ginsberg", "978-0141183015", "Penguin Modern Classics", "Modern Classics", 4, 4, "AVAILABLE", "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80", "Howl is one of the principal works of the Beat Generation, an impassioned lament.");
            Book b12 = createBook("BK-2012", "The Birth of the Clinic", "Michel Foucault", "978-0123456789", "Vintage Classics", "Philosophy & Medicine", 3, 2, "AVAILABLE", "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80", "An archaeology of medical perception exploring how clinical medicine developed its modern diagnostic gaze.");
            Book b13 = createBook("BK-2013", "Our Lady of the Flowers", "Jean Genet", "978-0987654321", "Gallimard", "French Literature", 3, 3, "AVAILABLE", "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80", "Genet's poetic debut explores the transgressive underworld of Montmartre.");

            b1 = bookRepo.save(b1);
            b2 = bookRepo.save(b2);
            b3 = bookRepo.save(b3);
            b4 = bookRepo.save(b4);
            b5 = bookRepo.save(b5);
            b6 = bookRepo.save(b6);
            b7 = bookRepo.save(b7);
            b8 = bookRepo.save(b8);
            b9 = bookRepo.save(b9);
            b10 = bookRepo.save(b10);
            b11 = bookRepo.save(b11);
            b12 = bookRepo.save(b12);
            b13 = bookRepo.save(b13);

            // 3. Borrowings
            BorrowingRecord br1 = new BorrowingRecord();
            br1.setBorrowCode("BRW-3001");
            br1.setMember(m1);
            br1.setBook(b1);
            br1.setBorrowDate(LocalDate.now().minusDays(20));
            br1.setDueDate(LocalDate.now().minusDays(6));
            br1.setReturnDate(LocalDate.now().minusDays(7));
            br1.setStatus("RETURNED");
            br1.setNotes("Returned on time in pristine condition");
            borrowingRepo.save(br1);

            BorrowingRecord br2 = new BorrowingRecord();
            br2.setBorrowCode("BRW-3002");
            br2.setMember(m3);
            br2.setBook(b2);
            br2.setBorrowDate(LocalDate.now().minusDays(35));
            br2.setDueDate(LocalDate.now().minusDays(21));
            br2.setStatus("OVERDUE");
            br2.setNotes("Past due date by 21 days - fine applied");
            borrowingRepo.save(br2);

            BorrowingRecord br3 = new BorrowingRecord();
            br3.setBorrowCode("BRW-3003");
            br3.setMember(m2);
            br3.setBook(b4);
            br3.setBorrowDate(LocalDate.now().minusDays(5));
            br3.setDueDate(LocalDate.now().plusDays(9));
            br3.setStatus("BORROWED");
            br3.setNotes("Active loan, due in 9 days");
            borrowingRepo.save(br3);

            // 4. Reservations
            Reservation r1 = new Reservation();
            r1.setReservationCode("RES-4001");
            r1.setMember(m4);
            r1.setBook(b2);
            r1.setWaitingPosition(1);
            r1.setStatus("ACTIVE");
            r1.setNotificationSent(false);
            reservationRepo.save(r1);

            Reservation r2 = new Reservation();
            r2.setReservationCode("RES-4002");
            r2.setMember(m6);
            r2.setBook(b2);
            r2.setWaitingPosition(2);
            r2.setStatus("ACTIVE");
            r2.setNotificationSent(false);
            reservationRepo.save(r2);

            Reservation r3 = new Reservation();
            r3.setReservationCode("RES-4003");
            r3.setMember(m1);
            r3.setBook(b5);
            r3.setWaitingPosition(1);
            r3.setStatus("ACTIVE");
            r3.setNotificationSent(true);
            reservationRepo.save(r3);

            // 5. Fines
            Fine f1 = new Fine();
            f1.setFineCode("FINE-5001");
            f1.setMember(m3);
            f1.setBorrowing(br2);
            f1.setAmount(BigDecimal.valueOf(210.00));
            f1.setOverdueDays(21);
            f1.setStatus("PENDING");
            fineRepo.save(f1);

            Fine f2 = new Fine();
            f2.setFineCode("FINE-5002");
            f2.setMember(m5);
            f2.setAmount(BigDecimal.valueOf(50.00));
            f2.setOverdueDays(5);
            f2.setStatus("PENDING");
            fineRepo.save(f2);

            Fine f3 = new Fine();
            f3.setFineCode("FINE-5003");
            f3.setMember(m2);
            f3.setAmount(BigDecimal.valueOf(120.00));
            f3.setOverdueDays(12);
            f3.setStatus("PAID");
            f3.setPaidAt(LocalDateTime.now().minusDays(10));
            f3.setPaymentMethod("ONLINE_CARD");
            f3.setReceiptNumber("RCPT-2026-89412");
            fineRepo.save(f3);

            // 6. Book Requests
            BookRequest req1 = new BookRequest();
            req1.setRequestCode("REQ-6001");
            req1.setMember(m6);
            req1.setTitle("Designing Data-Intensive Applications");
            req1.setAuthor("Martin Kleppmann");
            req1.setIsbn("978-1449373320");
            req1.setPublisher("O'Reilly Media");
            req1.setReason("Required for Distributed Systems research assignment.");
            req1.setStatus("PENDING");
            req1.setAdminNotes("Awaiting librarian review");
            requestRepo.save(req1);

            BookRequest req2 = new BookRequest();
            req2.setRequestCode("REQ-6002");
            req2.setMember(m1);
            req2.setTitle("Refactoring: Improving the Design of Existing Code");
            req2.setAuthor("Martin Fowler");
            req2.setIsbn("978-0134757599");
            req2.setPublisher("Addison-Wesley");
            req2.setReason("Useful for advanced Software Engineering Lab Module.");
            req2.setStatus("APPROVED");
            req2.setAdminNotes("Order placed with university supplier");
            requestRepo.save(req2);

            // 7. Users
            if (userRepo.count() == 0) {
                User uAdmin = new User();
                uAdmin.setUsername("admin");
                uAdmin.setPasswordHash("admin123");
                uAdmin.setRole("ADMIN");
                uAdmin.setFullName("Chief Librarian");
                uAdmin.setEmail("admin@novalib.lk");
                uAdmin.setActive(true);
                userRepo.save(uAdmin);

                User uKasun = new User();
                uKasun.setUsername("kasun.p");
                uKasun.setPasswordHash("password123");
                uKasun.setRole("CUSTOMER");
                uKasun.setMemberId(m1.getId());
                uKasun.setFullName(m1.getFullName());
                uKasun.setEmail(m1.getEmail());
                uKasun.setActive(true);
                userRepo.save(uKasun);

                User uAmaya = new User();
                uAmaya.setUsername("amaya.s");
                uAmaya.setPasswordHash("password123");
                uAmaya.setRole("CUSTOMER");
                uAmaya.setMemberId(m2.getId());
                uAmaya.setFullName(m2.getFullName());
                uAmaya.setEmail(m2.getEmail());
                uAmaya.setActive(true);
                userRepo.save(uAmaya);

                User uSanath = new User();
                uSanath.setUsername("sanath.w");
                uSanath.setPasswordHash("password123");
                uSanath.setRole("CUSTOMER");
                uSanath.setMemberId(m7.getId());
                uSanath.setFullName(m7.getFullName());
                uSanath.setEmail(m7.getEmail());
                uSanath.setActive(true);
                userRepo.save(uSanath);
            }

            System.out.println(">>> Sample data seeding completed successfully!");
        };
    }

    private Member createMember(String code, String name, String email, String phone, String address, String idNumber, String type, String status, int limit) {
        Member m = new Member();
        m.setMemberCode(code);
        m.setFullName(name);
        m.setEmail(email);
        m.setPhone(phone);
        m.setAddress(address);
        m.setIdNumber(idNumber);
        m.setMembershipType(type);
        m.setStatus(status);
        m.setMaxBorrowLimit(limit);
        m.setJoinDate(LocalDate.now().minusMonths(6));
        m.setExpiryDate(LocalDate.now().plusMonths(6));
        return m;
    }

    private Book createBook(String code, String title, String author, String isbn, String publisher, String category, int total, int avail, String status, String cover, String desc) {
        Book b = new Book();
        b.setBookCode(code);
        b.setTitle(title);
        b.setAuthor(author);
        b.setIsbn(isbn);
        b.setPublisher(publisher);
        b.setCategory(category);
        b.setTotalCopies(total);
        b.setAvailableCopies(avail);
        b.setStatus(status);
        b.setCoverImage(cover);
        b.setDescription(desc);
        return b;
    }
}
