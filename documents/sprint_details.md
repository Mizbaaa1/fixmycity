# 2.4 Sprint Planning and Execution Details

This document outlines the Sprint Planning for the **FixMyCity (Smart Civic Issue Reporting System)** project in accordance with Agile software development methodology and standard project documentation formats.

---

## 2.4 Sprint

### Sprint 1: Project Setup, UI Foundation & Citizen Authentication

| Module | Task | Pending task if any | Hour of completion | Expected date of completion | Actual date of completion | Reason for delay |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Citizen / User** | Project Setup & React-Vite Environment Initialization | - | 3 hr. | 15/07/2025 | 15/07/2025 | - |
| **Citizen / User** | Landing Page & "How It Works" Workflow Section | - | 3 hr. | 18/07/2025 | 18/07/2025 | - |
| **Citizen / User** | Navigation Bar & React Router Configuration | - | 2 hr. | 21/07/2025 | 21/07/2025 | - |
| **Citizen / User** | Citizen User Registration Interface (`Register.jsx`) | - | 3 hr. | 24/07/2025 | 24/07/2025 | - |
| **Citizen / User** | Citizen Login Interface & Authentication Flow (`Login.jsx`) | - | 2 hr. | 27/07/2025 | 27/07/2025 | - |
| **Citizen / User** | Node.js Express Server Setup & MongoDB Atlas Connection | - | 3 hr. | 30/07/2025 | 30/07/2025 | - |

---

### Sprint 2: Citizen Issue Reporting & Geolocation Module

| Module | Task | Pending task if any | Hour of completion | Expected date of completion | Actual date of completion | Reason for delay |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Citizen / User** | Civic Issue Reporting UI Form Design (`ReportIssue.jsx`) | - | 3 hr. | 02/08/2025 | 02/08/2025 | - |
| **Citizen / User** | Browser GPS Geolocation API Integration (Lat/Long fetch) | - | 4 hr. | 05/08/2025 | 06/08/2025 | Permission handling on mobile devices |
| **Citizen / User** | Photo & Media Attachment Upload Handler | - | 2 hr. | 09/08/2025 | 09/08/2025 | - |
| **Citizen / User** | Mongoose Issue Schema & Model Definition (`Issue.js`) | - | 2 hr. | 11/08/2025 | 11/08/2025 | - |
| **Citizen / User** | Issue Submission Backend REST API (`POST /api/issues`) | - | 3 hr. | 13/08/2025 | 13/08/2025 | - |
| **Citizen / User** | Citizen Complaint Tracking Interface (`TrackComplaint.jsx`) | - | 3 hr. | 16/08/2025 | 16/08/2025 | - |

---

### Sprint 3: Admin Dashboard, Verification & Department Assignment Module

| Module | Task | Pending task if any | Hour of completion | Expected date of completion | Actual date of completion | Reason for delay |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Admin** | Admin Dashboard Interface Layout (`AdminDashboard.jsx`) | - | 4 hr. | 19/08/2025 | 19/08/2025 | - |
| **Admin** | Fetch & Display All Submitted Civic Complaints (`GET /api/issues`) | - | 2 hr. | 22/08/2025 | 22/08/2025 | - |
| **Admin** | Complaint Verification & Validation Workflow | - | 3 hr. | 25/08/2025 | 25/08/2025 | - |
| **Admin** | Department Schema & Management API (`/api/departments`) | - | 3 hr. | 27/08/2025 | 27/08/2025 | - |
| **Admin** | Department Assignment to Complaints (`PUT /api/issues/:id/department`) | - | 3 hr. | 29/08/2025 | 29/08/2025 | - |
| **Admin** | Complaint Status Transition Workflow (`PUT /api/issues/:id/status`) | - | 2 hr. | 31/08/2025 | 31/08/2025 | - |

---

### Sprint 4: Department Module, Resolution Lifecycle & System Integration

| Module | Task | Pending task if any | Hour of completion | Expected date of completion | Actual date of completion | Reason for delay |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Department** | Department Dashboard Interface (`DepartmentDashboard.jsx`) | - | 3 hr. | 03/09/2025 | 03/09/2025 | - |
| **Department** | Department-Wise Complaint Filter & Assigned Tasks Queue | - | 3 hr. | 06/09/2025 | 06/09/2025 | - |
| **Department** | Issue Work In-Progress & Resolution Status Updater | - | 2 hr. | 09/09/2025 | 09/09/2025 | - |
| **Department** | Complaint Search by ID & Dynamic Badge Status Sync | - | 2 hr. | 11/09/2025 | 11/09/2025 | - |
| **Integration** | End-to-End System Integration Testing (Citizen ➔ Admin ➔ Dept) | - | 4 hr. | 13/09/2025 | 13/09/2025 | - |
| **Integration** | Cross-Browser Testing, UI Refinements & Final Report Preparation | - | 3 hr. | 15/09/2025 | 15/09/2025 | - |

---

## Consolidated Sprint Table (Alternative Single-Table Format)

If your project documentation requires all tasks in a single unified table under **Sprint 1** or a combined table:

| Module | Task | Pending task if any | Hour of completion | Expected date of completion | Actual date of completion | Reason for delay |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Admin** | Citizen Login & Authentication Setup | - | 2 hr. | 16/07/2025 | 16/07/2025 | - |
| **Admin** | Admin Dashboard Interface Layout | - | 3 hr. | 19/07/2025 | 19/07/2025 | - |
| **Admin** | View & Monitor Reported Civic Issues | - | 2 hr. | 23/07/2025 | 23/07/2025 | - |
| **Admin** | Department Creation & Management | - | 3 hr. | 27/07/2025 | 27/07/2025 | - |
| **Admin** | Assign Complaints to Municipal Departments | - | 2 hr. | 31/07/2025 | 31/07/2025 | - |
| **Admin** | Update Complaint Resolution Status | - | 2 hr. | 03/08/2025 | 03/08/2025 | - |
| **Citizen** | Report Civic Issue with GPS Geolocation | - | 4 hr. | 06/08/2025 | 06/08/2025 | - |
| **Citizen** | Track Complaint Status by ID | - | 2 hr. | 09/08/2025 | 09/08/2025 | - |
| **Department** | Department-Wise Issue Filtering & Resolution | - | 3 hr. | 12/08/2025 | 12/08/2025 | - |
