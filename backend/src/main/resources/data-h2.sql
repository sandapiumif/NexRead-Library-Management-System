CREATE TABLE IF NOT EXISTS Members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_code VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    id_number VARCHAR(30) NOT NULL,
    membership_type VARCHAR(30) DEFAULT 'STUDENT',
    status VARCHAR(20) DEFAULT 'ACTIVE',
    max_borrow_limit INT DEFAULT 3,
    join_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_code VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(150) NOT NULL,
    isbn VARCHAR(30) NOT NULL UNIQUE,
    publisher VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    description CLOB,
    cover_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Borrowings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    borrow_code VARCHAR(30) NOT NULL UNIQUE,
    member_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    borrow_date DATE,
    due_date DATE,
    return_date DATE,
    status VARCHAR(20) DEFAULT 'BORROWED',
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_code VARCHAR(30) NOT NULL UNIQUE,
    member_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    waiting_position INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    notification_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Fines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fine_code VARCHAR(30) NOT NULL UNIQUE,
    member_id BIGINT NOT NULL,
    borrow_id BIGINT,
    amount DECIMAL(10,2) DEFAULT 0.00,
    overdue_days INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PENDING',
    paid_at TIMESTAMP,
    payment_method VARCHAR(30),
    receipt_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS BookRequests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_code VARCHAR(30) NOT NULL UNIQUE,
    member_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(150) NOT NULL,
    isbn VARCHAR(30),
    publisher VARCHAR(150),
    reason VARCHAR(500) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    admin_notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Members
INSERT INTO Members (member_code, full_name, email, phone, address, id_number, membership_type, status, max_borrow_limit, join_date, expiry_date) VALUES 
('MEM-1001', 'Kasun Perera', 'kasun.p@library.org', '0771234567', 'Colombo 07', '200115001234', 'STUDENT', 'ACTIVE', 3, '2026-01-10', '2027-01-10'),
('MEM-1002', 'Amaya Senanayake', 'amaya.s@library.org', '0719876543', 'Kaduwela Road, Malabe', '200224005678', 'STUDENT', 'ACTIVE', 3, '2026-01-12', '2027-01-12'),
('MEM-1003', 'Dilshan Jayawardena', 'dilshan.j@library.org', '0763456789', 'Station Road, Nugegoda', '200135009876', 'STUDENT', 'SUSPENDED', 3, '2026-01-15', '2027-01-15'),
('MEM-1004', 'Nethmi Wickramasinghe', 'nethmi.w@library.org', '0754567890', 'Battaramulla', '200256004321', 'STUDENT', 'ACTIVE', 3, '2026-01-18', '2027-01-18'),
('MEM-1005', 'Ravindu Bandara', 'ravindu.b@library.org', '0785678901', 'High Level Road, Maharagama', '200148003456', 'STUDENT', 'ACTIVE', 3, '2026-01-20', '2027-01-20'),
('MEM-1006', 'Kavindi Silva', 'kavindi.s@library.org', '0726789012', 'Kottawa', '200267007890', 'STUDENT', 'ACTIVE', 3, '2026-01-22', '2027-01-22'),
('MEM-1007', 'Dr. Sanath Wijesinghe', 'sanath.w@library.org', '0701122334', 'Staff Quarters', '198512345678', 'FACULTY', 'ACTIVE', 6, '2025-08-01', '2027-08-01');

-- Seed Books
INSERT INTO Books (book_code, title, author, isbn, publisher, category, total_copies, available_copies, status, description, cover_image) VALUES
('BK-2001', 'Clean Architecture: A Craftsman''s Guide to Software Structure', 'Robert C. Martin', '978-0134494166', 'Prentice Hall', 'Software Engineering', 5, 3, 'AVAILABLE', 'A comprehensive practical guide to clean enterprise software architecture and solid design principles.', 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=400&q=80'),
('BK-2002', 'Design Patterns: Elements of Reusable Object-Oriented Software', 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides', '978-0201633610', 'Addison-Wesley', 'Software Engineering', 4, 0, 'BORROWED', 'The seminal Gang of Four catalog of fundamental software engineering patterns.', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'),
('BK-2003', 'Introduction to Algorithms (CLRS)', 'Thomas H. Cormen, Charles E. Leiserson', '978-0262046305', 'MIT Press', 'Computer Science', 6, 4, 'AVAILABLE', 'The standard benchmark textbook on algorithm design and computational complexity analysis.', 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80'),
('BK-2004', 'Database System Concepts (7th Edition)', 'Abraham Silberschatz, Henry F. Korth', '978-0078022159', 'McGraw-Hill', 'Database Systems', 4, 2, 'AVAILABLE', 'Foundational principles of relational databases, SQL queries, transaction processing, and indexing.', 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400&q=80'),
('BK-2005', 'Spring Boot in Action', 'Craig Walls', '978-1617292545', 'Manning Publications', 'Web Development', 3, 0, 'RESERVED', 'Hands-on guide to building robust modern microservices and REST APIs with Java and Spring.', 'https://images.unsplash.com/photo-1507842229451-9f01079ca4b5?w=400&q=80'),
('BK-2006', 'Learning React: Modern Patterns for Developing React Apps', 'Alex Banks, Eve Porcello', '978-1492051725', 'O''Reilly Media', 'Web Development', 5, 5, 'AVAILABLE', 'Master React Hooks, state management, component architecture, and modern JavaScript.', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80'),
('BK-2007', 'Artificial Intelligence: A Modern Approach', 'Stuart Russell, Peter Norvig', '978-0134610993', 'Pearson', 'Artificial Intelligence', 2, 1, 'AVAILABLE', 'The leading textbook in AI covering probabilistic reasoning, search algorithms, and machine learning.', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80');

-- Seed Borrowings
INSERT INTO Borrowings (borrow_code, member_id, book_id, borrow_date, due_date, return_date, status, notes) VALUES
('BRW-3001', 1, 1, '2026-08-20', '2026-09-03', '2026-09-02', 'RETURNED', 'Returned on time in pristine condition'),
('BRW-3002', 3, 2, '2026-08-10', '2026-08-24', NULL, 'OVERDUE', 'Past due date by 21 days - fine applied'),
('BRW-3003', 2, 4, '2026-09-05', '2026-09-19', NULL, 'BORROWED', 'Active loan, due in 5 days'),
('BRW-3004', 5, 7, '2026-09-01', '2026-09-15', NULL, 'BORROWED', 'Active loan, renewal permitted');

-- Seed Reservations
INSERT INTO Reservations (reservation_code, member_id, book_id, reservation_date, waiting_position, status, notification_sent) VALUES
('RES-4001', 4, 2, CURRENT_TIMESTAMP, 1, 'ACTIVE', FALSE),
('RES-4002', 6, 2, CURRENT_TIMESTAMP, 2, 'ACTIVE', FALSE),
('RES-4003', 1, 5, CURRENT_TIMESTAMP, 1, 'ACTIVE', TRUE);

-- Seed Fines
INSERT INTO Fines (fine_code, member_id, borrow_id, amount, overdue_days, status, paid_at, payment_method, receipt_number) VALUES
('FINE-5001', 3, 2, 210.00, 21, 'PENDING', NULL, NULL, NULL),
('FINE-5002', 5, 1, 50.00, 5, 'PENDING', NULL, NULL, NULL),
('FINE-5003', 2, NULL, 120.00, 12, 'PAID', CURRENT_TIMESTAMP, 'ONLINE_CARD', 'RCPT-2026-89412');

-- Seed BookRequests
INSERT INTO BookRequests (request_code, member_id, title, author, isbn, publisher, reason, status, admin_notes) VALUES
('REQ-6001', 6, 'Designing Data-Intensive Applications', 'Martin Kleppmann', '978-1449373320', 'O''Reilly Media', 'Required for SE3020 Distributed Systems research assignment.', 'PENDING', 'Under evaluation by Chief Librarian'),
('REQ-6002', 1, 'Refactoring: Improving the Design of Existing Code', 'Martin Fowler', '978-0134757599', 'Addison-Wesley', 'Useful for advanced Software Engineering Lab Module.', 'APPROVED', 'Order placed with university supplier');
