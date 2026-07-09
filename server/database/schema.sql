-- =========================================
-- Lab Equipment Reservation System - Schema
-- =========================================

-- ----------------------------
-- Users Table
-- ----------------------------
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'technician', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- Equipment Table
-- ----------------------------
CREATE TABLE Equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    image_url TEXT,
    quantity INT NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'retired')),
    added_by INT REFERENCES Users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- Reservations Table
-- ----------------------------
CREATE TABLE Reservations (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    equipment_id INT NOT NULL REFERENCES Equipment(id) ON DELETE CASCADE,
    quantity_requested INT NOT NULL DEFAULT 1,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'returned', 'cancelled')),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by INT REFERENCES Users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP NULL,
    returned_at TIMESTAMP NULL
);

-- ----------------------------
-- DamageReports Table
-- ----------------------------
CREATE TABLE DamageReports (
    id SERIAL PRIMARY KEY,
    reservation_id INT NOT NULL REFERENCES Reservations(id) ON DELETE CASCADE,
    reported_by INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'resolved')),
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL
);