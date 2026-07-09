# Lab_Equipment-Reservation
# Lab Equipment Reservation System

A full-stack web application for managing university laboratory equipment reservations, built with Node.js, Express, PostgreSQL, and vanilla JavaScript.

## Description

This system allows students to browse and reserve laboratory equipment, technicians and admins to manage inventory and approve/reject reservations, and everyone to track equipment damage reports. Built as a capstone project for Web Programming II.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Authentication:** JWT (jsonwebtoken), bcrypt for password hashing
- **Logging:** Winston

## Features

- Role-based access control (Student, Technician, Admin)
- JWT-based authentication with hashed passwords
- Equipment inventory management with image support
- Reservation system with availability checking (overlap detection) and approval workflow
- Damage report submission and resolution tracking
- Request/application logging via Winston

## Setup Instructions

### Prerequisites
- Node.js installed
- PostgreSQL installed and running

### Installation

1. Clone the repository