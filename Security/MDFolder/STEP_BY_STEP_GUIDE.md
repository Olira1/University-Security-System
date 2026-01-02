# Campus Access System - Step-by-Step Implementation Guide

## Overview

This guide provides detailed, step-by-step instructions for implementing the Campus Access System frontend. Follow these steps sequentially, as each step builds upon the previous ones.

**Reference Documents:**
- `api_contract.md` - API specifications and data structures
- `PLAN.md` - Complete project plan and architecture
- `IMPLEMENTATION_PLAN.md` - Detailed task breakdown

---

## Prerequisites

Before starting, ensure you have:
- Node.js installed (v18+ recommended)
- Code editor (VS Code recommended)
- Git initialized in the project
- Basic understanding of React, Tailwind CSS, and React Router

---

## Phase 1: Foundation (Start Here)

### Step 1: Install Dependencies

**Objective:** Install all required npm packages

**Actions:**
1. Open terminal in project root (`University-Security-System/Security/`)
2. Run the following commands:

```bash
npm install react-router-dom@^6.20.0
npm install react-qr-reader@^2.2.1
npm install react-webcam@^7.1.1
npm install qrcode.react@^3.1.0
npm install react-toastify@^10.0.0
```

**Verify:** Check `package.json` to confirm all dependencies are listed

**Files Modified:**
- `package.json`

---

### Step 2: Create Constants File

**Objective:** Define all constants used throughout the application

**File:** `src/utils/constants.js`

**Implementation:**
```javascript
// Violation Types (from API contract)
export const UNAUTHORIZED_QR_SCAN = "unauthorized_qr_scan";
export const FACE_VERIFICATION_MISMATCH = "face_verification_mismatch";
export const MULTIPLE_FAIL_ATTEMPT = "multiple_fail_attempt";
export const EXPIRED_VISITOR_QR_CODE = "expired_visitor_qr_code";

// Subject Types
export const SUBJECT_STUDENT = "student";
export const SUBJECT_STAFF = "staff";
export const SUBJECT_VISITOR = "visitor";

// Severity Levels
export const SEVERITY_LOW = "low";
export const SEVERITY_MEDIUM = "medium";
export const SEVERITY_HIGH = "high";
export const SEVERITY_CRITICAL = "critical";

// Gate IDs
export const GATE_MAIN_ENTRANCE = "gate_main_entrance";
export const GATE_LIBRARY = "gate_library";
export const GATE_HR_BUILDING = "gate_hr_building";
export const GATE_NORTH_ENTRANCE = "gate_north_entrance";
export const GATE_WEST_GATE = "gate_west_gate";

// API Configuration
export const API_BASE_URL = "http://localhost:8000/api/v1";
export const WS_ALERTS_URL = "ws://localhost:8000/ws/alerts";

// Error Codes (from API contract)
export const ERROR_INVALID_CREDENTIALS = "INVALID_CREDENTIALS";
export const ERROR_ACCOUNT_LOCKED = "ACCOUNT_LOCKED";
export const ERROR_UNAUTHORIZED = "UNAUTHORIZED";
export const ERROR_VALIDATION_ERROR = "VALIDATION_ERROR";
export const ERROR_NOT_FOUND = "NOT_FOUND";
export const ERROR_FORBIDDEN = "FORBIDDEN";
export const ERROR_INTERNAL_ERROR = "INTERNAL_ERROR";

// User Roles
export const ROLE_SECURITY_OFFICER = "security_officer";
export const ROLE_SECURITY_SUPERVISOR = "security_supervisor";
export const ROLE_ADMIN = "admin";
```

**Verify:** Constants can be imported and used in other files

---

### Step 3: Create Mock Data

**Objective:** Create sample data matching API contract schemas

**File:** `src/utils/mockData.js`

**Implementation Requirements:**

1. **Sample Students** (structure from API contract):
   ```javascript
   {
     id: "stu_789xyz",
     name: "Alice Johnson",
     photoUrl: "https://cdn.campus-security.example.com/photos/stu_789xyz.jpg",
     department: "Computer Science",
     enrollmentStatus: "active"
   }
   ```

2. **Sample Staff**:
   ```javascript
   {
     id: "stf_456abc",
     name: "Dr. Robert Chen",
     photoUrl: "https://cdn.campus-security.example.com/photos/stf_456abc.jpg",
     department: "Engineering",
     position: "Professor",
     employmentStatus: "active"
   }
   ```

3. **Sample Visitors**:
   ```javascript
   {
     id: "vis_pass_456",
     name: "Bob Williams",
     photoUrl: null,
     purpose: "Interview at HR Department",
     hostName: "Jane Doe",
     hostDepartment: "Human Resources",
     validFrom: "2026-01-02T09:00:00Z",
     validUntil: "2026-01-02T17:00:00Z"
   }
   ```

4. **Sample Violations** (matching API contract):
   - `unauthorized_qr_scan` (subject: null)
   - `face_verification_mismatch` (with subject info)
   - `multiple_fail_attempt` (with subject info and lockoutUntil)
   - `expired_visitor_qr_code` (with subject info)

5. **Sample Gates**:
   ```javascript
   {
     id: "gate_main_entrance",
     name: "Main Entrance Gate",
     location: "Building A - North Side",
     status: "online"
   }
   ```

6. **Sample Employees** (for host selection):
   ```javascript
   {
     employeeId: "EMP-2024-015",
     name: "Jane Doe",
     department: "Human Resources",
     email: "jane.doe@campus.edu"
   }
   ```

**Reference:** See `api_contract.md` sections 6 (Data Types & Enums) for exact schemas

**Verify:** All data structures match API contract specifications

---

### Step 4: Implement QR Generator Service

**Objective:** Create utility for generating QR codes

**File:** `src/services/qrGenerator.js`

**Implementation:**
- `generateQRCode(passId, passType)`: Generates QR code content string
  - Format: `"QR-STU-2024-ABC123XYZ"` for students
  - Format: `"QR-VIS-2026-NEW789XYZ"` for visitors
- `generateQRImage(qrContent)`: Creates QR code image using `qrcode.react`
  - Returns base64 image data matching API contract format

**Dependencies:** `qrcode.react`

**Verify:** Can generate QR code strings and images

---

### Step 5: Implement Face Match Mock Service

**Objective:** Simulate face verification with configurable delay

**File:** `src/services/faceMatchMock.js`

**Implementation:**
- `simulateFaceMatch(subjectId, subjectType, faceImage, delay)`
  - Returns `{ verified: boolean, confidence: number }` matching API contract
  - Can simulate violations: `face_verification_mismatch` or `multiple_fail_attempt`
  - Configurable delay (1-2 seconds default)

**Response Format** (from API contract):
- Success: `{ verified: true, confidence: 0.94, accessGranted: true, message: "Face verification successful" }`
- Failure: `{ verified: false, confidence: 0.32, violationType: "face_verification_mismatch", violationId, subject: {...} }`
- Multiple failures: `{ verified: false, violationType: "multiple_fail_attempt", lockoutUntil, failedAttemptCount }`

**Reference:** `api_contract.md` section 3.2 (POST /api/v1/face/verify)

**Verify:** Returns responses matching API contract format

---

### Step 6: Implement WebSocket Mock Service

**Objective:** Simulate real-time violation alerts via WebSocket

**File:** `src/services/wsMock.js`

**Implementation:**
- Mock WebSocket connection to `/ws/alerts`
- Simulates real-time violation alerts
- Sends `violation_alert` messages with format:
  ```json
  {
    "type": "violation_alert",
    "timestamp": "2026-01-02T14:30:05Z",
    "data": {
      "violationId": "vio_ghi789",
      "violationType": "face_verification_mismatch",
      "severity": "high",
      "gate": { "id": "gate_main_entrance", "name": "Main Entrance Gate", "location": "Building A - North Side" },
      "subject": { "id": "stu_789xyz", "name": "Alice Johnson", "type": "student" },
      "message": "Face verification failed at Main Entrance Gate"
    }
  }
  ```
- Handles heartbeat/pong messages
- Provides `connect()`, `subscribe(listener)`, `unsubscribe(listener)` methods

**Reference:** `api_contract.md` section 5 (WebSocket)

**Verify:** Can simulate violation alerts and handle subscriptions

---

### Step 7: Implement API Mock Service

**Objective:** Create mock API service matching API contract exactly

**File:** `src/services/apiMock.js`

**Implementation Requirements:**

**1. Authentication Endpoints:**

- `POST /api/v1/auth/login(employeeId, password)`
  - Request: `{ employeeId: string, password: string }`
  - Success Response: `{ status: "success", data: { token: string, expiresAt: string, user: {...} } }`
  - Error Response: `{ status: "error", code: "INVALID_CREDENTIALS"|"ACCOUNT_LOCKED", message: string }`
  - Reference: `api_contract.md` section 2.1

- `GET /api/v1/auth/me()`
  - Requires: JWT token in Authorization header
  - Success Response: `{ status: "success", data: { id, employeeId, name, email, role, department, ... } }`
  - Error Response: `{ status: "error", code: "UNAUTHORIZED", message: string }`
  - Reference: `api_contract.md` section 2.2

**2. Gate Scanning Endpoints (Public - No Auth):**

- `POST /api/v1/scan/qr(qrCode, gateId, scanTimestamp)`
  - Request: `{ qrCode: string, gateId: string, scanTimestamp: string (ISO 8601) }`
  - Success (Valid QR): `{ status: "success", data: { valid: true, subjectType: "student"|"staff"|"visitor", subject: {...}, accessGranted: boolean, requiresFaceVerification: boolean } }`
  - Success (Invalid QR): `{ status: "success", data: { valid: false, violationType: "unauthorized_qr_scan", violationId: string, message: string } }`
  - Success (Expired Visitor): `{ status: "success", data: { valid: false, violationType: "expired_visitor_qr_code", violationId: string, subject: {...}, message: string } }`
  - Reference: `api_contract.md` section 3.1

- `POST /api/v1/face/verify(subjectId, subjectType, faceImage, gateId, scanTimestamp)`
  - Request: `{ subjectId: string, subjectType: "student"|"staff"|"visitor", faceImage: string (base64), gateId: string, scanTimestamp: string (ISO 8601) }`
  - Success (Match): `{ status: "success", data: { verified: true, confidence: number, accessGranted: true, message: string } }`
  - Success (Mismatch): `{ status: "success", data: { verified: false, violationType: "face_verification_mismatch", violationId: string, subject: {...}, confidence: number } }`
  - Success (Multiple Failures): `{ status: "success", data: { verified: false, violationType: "multiple_fail_attempt", violationId: string, lockoutUntil: string, failedAttemptCount: number, subject: {...} } }`
  - Reference: `api_contract.md` section 3.2

**3. Dashboard Endpoints (Auth Required):**

- `GET /api/v1/violations(queryParams)`
  - Query Params: `page`, `limit`, `type`, `subjectType`, `gateId`, `startDate`, `endDate`, `resolved`
  - Success Response: `{ status: "success", data: { violations: [...], pagination: {...} } }`
  - Note: `unauthorized_qr_scan` violations have `subject: null` and `subjectType: null`
  - Reference: `api_contract.md` section 4.1

- `POST /api/v1/visitors/passes(visitorData)`
  - Request: `{ visitorName: string, visitorEmail?: string, visitorPhone?: string, purpose: string, hostEmployeeId: string, validFrom: string (ISO 8601), validUntil: string (ISO 8601), allowedGates?: string[], notes?: string }`
  - Validation: validFrom must be future/within last hour, validUntil after validFrom, max 24h duration
  - Success Response: `{ status: "success", data: { passId: string, visitorName: string, host: {...}, qrCode: { content: string, imageUrl: string, imageBase64: string }, ... } }`
  - Error Response: `{ status: "error", code: "VALIDATION_ERROR", message: string, details: [...] }`
  - Reference: `api_contract.md` section 4.2

**Important:** All responses must follow `{ status: "success"|"error", data: {...} }` format

**Verify:** All endpoints return responses matching API contract exactly

---

### Step 8: Create Common Components

**Objective:** Build reusable components used across admin portal

**Files to Create:**

**8.1. StatusBadge Component**
- **File:** `src/components/common/StatusBadge.jsx`
- **Props:** `status` (string), `type` (string - for different badge styles)
- **Usage:** Display status badges (Granted/Denied/Active/Expired/New/Investigating/Acknowledged)
- **Styling:** Color-coded badges (green for granted/active, red for denied, purple for investigating, etc.)

**8.2. MetricCard Component**
- **File:** `src/components/common/MetricCard.jsx`
- **Props:** `title` (string), `value` (number), `change` (number), `changeType` ("increase"|"decrease"|"neutral"), `icon` (React component)
- **Usage:** Display dashboard metrics (Total Entries, Total Vehicles, Total Visitors)
- **Features:** Show percentage change with arrow indicator

**8.3. Header Component**
- **File:** `src/components/common/Header.jsx`
- **Features:** User profile picture, user name, logout button
- **Usage:** Top header for all admin pages
- **Props:** `user` (object with user info)

**8.4. Sidebar Component**
- **File:** `src/components/common/Sidebar.jsx`
- **Features:** Navigation menu with icons
  - Dashboard (house icon)
  - Logs (document icon)
  - Alerts (bell icon)
  - Live Scan (bar chart icon)
  - Visitor Management (two-person icon)
  - Log Out (at bottom)
- **Props:** `currentPath` (string) - to highlight active route
- **Styling:** Purple accents, active item highlighted

**Verify:** All components render correctly and are reusable

---

### Step 9: Create Context Providers

**Objective:** Set up global state management

**9.1. AuthContext**
- **File:** `src/context/AuthContext.jsx`
- **Features:**
  - `login(employeeId, password)` - Calls `POST /api/v1/auth/login`, stores token
  - `logout()` - Clears token and user info
  - `isAuthenticated()` - Returns boolean
  - `getCurrentUser()` - Returns current user object
  - Token storage in localStorage (with "Remember me" support)
  - Token expiration handling
  - Sets Authorization header for API calls
- **Provider:** Wrap app with AuthProvider

**9.2. AlertContext**
- **File:** `src/context/AlertContext.jsx`
- **Features:**
  - `addViolation(violation)` - Add new violation
  - `acknowledgeViolation(violationId)` - Mark violation as resolved
  - `getViolations(filters)` - Get filtered violations
  - `getViolationsByType(type)` - Get violations by type
  - Connects to WebSocket (`wsMock.js`) for real-time violation alerts
  - Stores violations matching API contract format
  - Handles all violation types: `unauthorized_qr_scan`, `face_verification_mismatch`, `multiple_fail_attempt`, `expired_visitor_qr_code`
- **Provider:** Wrap app with AlertProvider

**Verify:** Contexts provide state and methods correctly

---

## Phase 2: Core Features

### Step 10: Setup Routing

**Objective:** Configure React Router with all routes

**File:** `src/App.jsx`

**Implementation:**
1. Import `BrowserRouter`, `Routes`, `Route`, `Navigate` from `react-router-dom`
2. Set up routes:
   - `/police` → `PoliceDashboard` (public)
   - `/admin/login` → `Login` (public)
   - `/admin/dashboard` → `Dashboard` (protected)
   - `/admin/livescan` → `LiveScan` (protected)
   - `/admin/visitor-management` → `VisitorManagement` (protected)
   - `/admin/scan-logs` → `ScanLogs` (protected)
   - `/admin/alerts` → `Alerts` (protected)
   - `/` → Redirect to `/police`
3. Create `ProtectedRoute` component for admin routes
4. Wrap app with `AuthProvider` and `AlertProvider`

**Verify:** Routes work correctly, protected routes redirect to login if not authenticated

---

### Step 11: Implement Admin Login Page

**Objective:** Create login page with authentication

**Files:**

**11.1. LoginForm Component**
- **File:** `src/components/auth/LoginForm.jsx`
- **Features:**
  - Employee ID input field
  - Password input field (with show/hide toggle)
  - "Remember me" checkbox
  - "Forgot Password?" link (can be non-functional for demo)
  - Form validation
  - Error message display
  - Loading state during login

**11.2. Login Page**
- **File:** `src/pages/admin/Login.jsx`
- **Features:**
  - Uses `LoginForm` component
  - Integrates with `AuthContext`
  - Calls `POST /api/v1/auth/login` via `apiMock`
  - Handles error responses: `INVALID_CREDENTIALS`, `ACCOUNT_LOCKED`
  - Stores JWT token and user info on success
  - Redirects to `/admin/dashboard` on successful login
  - Styling: Match login page design from images

**Reference:** `api_contract.md` section 2.1

**Verify:** Login works, errors display correctly, redirects on success

---

### Step 12: Implement Police Portal

**Objective:** Build full-screen scanning interface for police

**Files:**

**12.1. QRScanner Component (Police)**
- **File:** `src/components/police/QRScanner.jsx`
- **Features:**
  - Uses `react-qr-reader` or manual input
  - Calls `POST /api/v1/scan/qr` with `{ qrCode, gateId, scanTimestamp }`
  - Handles response:
    - Valid QR → fetch subject info, trigger face verification
    - Invalid QR (`unauthorized_qr_scan`) → trigger violation alert
    - Expired visitor (`expired_visitor_qr_code`) → trigger violation alert
  - Displays scanning status

**12.2. CameraPreview Component (Police)**
- **File:** `src/components/police/CameraPreview.jsx`
- **Features:**
  - Uses `react-webcam` for live camera feed
  - Captures face image on QR scan
  - Converts image to base64 format
  - Calls `POST /api/v1/face/verify` with `{ subjectId, subjectType, faceImage (base64), gateId, scanTimestamp }`
  - Handles response:
    - Verified → trigger white screen state
    - Mismatch (`face_verification_mismatch`) → trigger violation alert
    - Multiple failures (`multiple_fail_attempt`) → trigger violation alert with lockout info
  - Shows "Face Matched" with checkmark when successful
  - Simulates face match with delay (1-2 seconds)

**12.3. AlertDisplay Component**
- **File:** `src/components/police/AlertDisplay.jsx`
- **Features:**
  - Full-screen alert modal
  - Displays violation details:
    - Violation type and severity
    - Gate name and location
    - Subject info (if available, null for unauthorized_qr_scan)
    - Timestamp (occurredAt)
    - Captured image URL (if available)
  - Auto-dismisses after 5 seconds or manual close
  - Uses `AlertContext` for violation state

**12.4. PoliceDashboard Page**
- **File:** `src/pages/police/PoliceDashboard.jsx`
- **Features:**
  - Full-screen interface (no sidebar)
  - Real-time QR scanning area
  - Camera preview for face verification
  - Alert overlay that appears when violations occur
  - White screen state when QR scan + face verification both succeed
  - Connects to WebSocket for real-time violation alerts
  - Uses all three components above

**Reference:** `api_contract.md` sections 3.1 and 3.2

**Verify:** QR scanning works, face verification simulates correctly, alerts display properly, white screen shows on success

---

## Phase 3: Admin Portal

### Step 13: Implement Admin Dashboard

**Objective:** Create dashboard overview page

**File:** `src/pages/admin/Dashboard.jsx`

**Features:**
- Uses `Sidebar` and `Header` components
- Metric cards: Total Entries, Total Vehicles, Total Visitors (with percentage changes)
  - Use `MetricCard` component
  - Display upward/downward arrows
  - Show percentage change (e.g., "+12.5% daily")
- Recent Live Scans table:
  - Columns: Time, Event, Identity, Status
  - Sample data from mockData
  - Use `StatusBadge` for status column
- Quick Actions section:
  - "+ Add New Visitor" button
  - "View All Alerts" button (with bell icon)
  - "Monitor Vehicles" button (with car icon)
- Integrate with `apiMock` for dashboard stats

**Styling:** Match dashboard design from images

**Verify:** Dashboard displays correctly, metrics show, table renders

---

### Step 14: Implement Admin Live Scan Page

**Objective:** Create live scan page with face recognition

**Files:**

**14.1. QRScanner Component (Admin)**
- **File:** `src/components/admin/QRScanner.jsx`
- **Features:** Similar to police QRScanner but for admin portal
- Used in Live Scan page

**14.2. CameraPreview Component (Admin)**
- **File:** `src/components/admin/CameraPreview.jsx`
- **Features:** Similar to police CameraPreview but for admin portal
- Shows face match status and "Welcome" message

**14.3. LiveScan Page**
- **File:** `src/pages/admin/LiveScan.jsx`
- **Features:**
  - Left side: Camera preview with face recognition status
  - Right side: Student/Visitor info card with QR code display
  - Shows "Face Matched" with checkmark when successful
  - Displays person details (name, department, ID, status)
  - Uses `Sidebar` and `Header` components
  - Integrates with `apiMock` for QR scanning and face verification

**Reference:** Live Scan page design from images

**Verify:** Live scan works, displays person info correctly

---

### Step 15: Implement Admin Visitor Management

**Objective:** Create visitor registration and management page

**Files:**

**15.1. VisitorForm Component**
- **File:** `src/components/admin/VisitorForm.jsx`
- **Features:**
  - Form fields matching API contract:
    - Visitor Name (required)
    - Visitor Email (optional)
    - Visitor Phone (optional)
    - Purpose (required)
    - Host Employee ID (required, dropdown)
    - Valid From (required, ISO 8601 date/time picker)
    - Valid Until (required, ISO 8601 date/time picker)
    - Allowed Gates (optional, multi-select)
    - Notes (optional, textarea)
  - Validation:
    - validFrom must be future/within last hour
    - validUntil after validFrom
    - max 24h duration
  - Form submission handling
  - Error display

**15.2. QRCodeDisplay Component**
- **File:** `src/components/admin/QRCodeDisplay.jsx`
- **Features:**
  - Displays QR code image (from `imageBase64`)
  - Shows visitor details (name, purpose, host, access period)
  - Print button (optional)

**15.3. VisitorManagement Page**
- **File:** `src/pages/admin/VisitorManagement.jsx`
- **Features:**
  - Left card: Create Visitor QR form
    - Uses `VisitorForm` component
    - Calls `POST /api/v1/visitors/passes` on submit
    - Displays generated QR code with `QRCodeDisplay` component
  - Right card: Current Visitors table
    - Columns: Visitor, Host, Access Period, Status, Actions
    - Search functionality
    - View QR and Edit actions
    - Fetches visitor passes from mock data
  - Uses `Sidebar` and `Header` components

**Reference:** `api_contract.md` section 4.2, Visitor Management page design from images

**Verify:** Form validation works, QR code generates and displays, visitors table shows data

---

### Step 16: Implement Admin Scan Logs

**Objective:** Create scan logs page with filtering and pagination

**Files:**

**16.1. FilterBar Component**
- **File:** `src/components/admin/FilterBar.jsx`
- **Features:**
  - Search input (search by user or scan ID)
  - Date picker (startDate/endDate)
  - Violation type filter (dropdown)
  - Subject type filter (dropdown)
  - Gate ID filter (dropdown)
  - Resolution status filter (dropdown)
  - Export Data button (mock functionality)

**16.2. LogsTable Component**
- **File:** `src/components/admin/LogsTable.jsx`
- **Features:**
  - Table columns: Timestamp (occurredAt), Violation Type, Subject Type, Subject Name, Gate, Status (resolved), Actions
  - Handles `unauthorized_qr_scan` violations (subject: null) appropriately
  - Pagination controls matching API contract pagination object
  - Sorting functionality (optional)
  - Uses `StatusBadge` for status column

**16.3. ScanLogs Page**
- **File:** `src/pages/admin/ScanLogs.jsx`
- **Features:**
  - Uses `FilterBar` and `LogsTable` components
  - Uses `Sidebar` and `Header` components
  - Fetches violations from `GET /api/v1/violations` with filters
  - Handles pagination
  - Displays filtered results

**Reference:** `api_contract.md` section 4.1, Scan Logs page design from images

**Verify:** Filtering works, pagination works, table displays violations correctly

---

### Step 17: Implement Admin Alerts Page

**Objective:** Create security alerts monitoring page

**Files:**

**17.1. AlertCard Component**
- **File:** `src/components/admin/AlertCard.jsx`
- **Features:**
  - Displays violation details matching API contract format:
    - Violation type icon
    - Violation type and title
    - Severity badge (uses `StatusBadge`)
    - Status badge (New/Investigating/Acknowledged)
    - Details: Type, Description, Timestamp, Gate, Subject (if available)
    - For `unauthorized_qr_scan`: Shows "Unknown Individual" (subject is null)
  - Action buttons: Acknowledge (marks as resolved), Investigate (opens details modal)
  - Card styling with borders and shadows

**17.2. Alerts Page**
- **File:** `src/pages/admin/Alerts.jsx`
- **Features:**
  - Security Alerts page title and description
  - Displays violations from `GET /api/v1/violations`
  - Shows alert cards for each violation
  - Displays violation types: `unauthorized_qr_scan`, `face_verification_mismatch`, `multiple_fail_attempt`, `expired_visitor_qr_code`
  - Shows severity badges: `low`, `medium`, `high`, `critical`
  - Shows resolution status: `resolved: false` (New/Investigating), `resolved: true` (Acknowledged)
  - Real-time updates via WebSocket connection
  - Uses `Sidebar` and `Header` components
  - Uses `AlertContext` for violation state

**Reference:** `api_contract.md` section 4.1 and 5, Alerts page design from images

**Verify:** Alerts display correctly, acknowledge works, WebSocket updates in real-time

---

## Phase 4: Polish

### Step 18: Apply Styling & Polish

**Objective:** Apply consistent Tailwind CSS styling across all pages

**Tasks:**

1. **Color Scheme:**
   - Purple accents (#9333ea or similar)
   - White backgrounds
   - Gray text for secondary content
   - Color-coded status badges

2. **Animations & Transitions:**
   - Smooth transitions for page navigation
   - Loading state animations
   - Alert popup animations
   - Button hover effects

3. **Responsive Design:**
   - Mobile-friendly layouts
   - Tablet optimization
   - Desktop full-width layouts

4. **Loading States:**
   - Add loading spinners for async operations
   - Skeleton loaders for tables
   - Button loading states

5. **Error Handling UI:**
   - Error message displays
   - Toast notifications (using react-toastify)
   - Form validation errors
   - API error handling

**Reference:** Match design from provided images

**Verify:** All pages are styled consistently, responsive, and polished

---

### Step 19: Testing & Demo Prep

**Objective:** Test all flows and prepare for demo

**Testing Checklist:**

1. **Authentication Flow:**
   - [ ] Login with valid credentials
   - [ ] Login with invalid credentials (error handling)
   - [ ] Remember me functionality
   - [ ] Logout functionality
   - [ ] Protected route access

2. **Police Portal:**
   - [ ] QR code scanning (valid QR)
   - [ ] QR code scanning (invalid QR - triggers alert)
   - [ ] Face verification (success - white screen)
   - [ ] Face verification (mismatch - triggers alert)
   - [ ] Multiple failure attempts (triggers alert with lockout)
   - [ ] Expired visitor QR (triggers alert)
   - [ ] WebSocket real-time alerts

3. **Admin Dashboard:**
   - [ ] Metrics display correctly
   - [ ] Recent scans table shows data
   - [ ] Quick actions work

4. **Admin Live Scan:**
   - [ ] QR scanning works
   - [ ] Face verification displays correctly
   - [ ] Person info card shows details

5. **Admin Visitor Management:**
   - [ ] Form validation works
   - [ ] QR code generation works
   - [ ] Visitors table displays data
   - [ ] Search functionality works
   - [ ] View QR and Edit actions work

6. **Admin Scan Logs:**
   - [ ] Filtering works (all filter types)
   - [ ] Pagination works
   - [ ] Table displays violations correctly
   - [ ] Export functionality (mock)

7. **Admin Alerts:**
   - [ ] Violations display correctly
   - [ ] Severity badges show correctly
   - [ ] Status badges show correctly
   - [ ] Acknowledge action works
   - [ ] Investigate action works
   - [ ] WebSocket real-time updates work

8. **Integration Testing:**
   - [ ] Alerts sync between Police Portal and Admin Portal
   - [ ] Authentication works across all admin pages
   - [ ] Common components work on all pages
   - [ ] Mock services work correctly

9. **Demo Preparation:**
   - [ ] Prepare sample data for demo scenarios
   - [ ] Test demo flow end-to-end
   - [ ] Verify all features work for demo
   - [ ] Prepare demo script/notes

**Verify:** All tests pass, demo is ready

---

## Implementation Summary

### Files Created (Total: 30+ files)

**Services (4 files):**
- `src/services/apiMock.js`
- `src/services/faceMatchMock.js`
- `src/services/qrGenerator.js`
- `src/services/wsMock.js`

**Utils (2 files):**
- `src/utils/mockData.js`
- `src/utils/constants.js`

**Context (2 files):**
- `src/context/AuthContext.jsx`
- `src/context/AlertContext.jsx`

**Common Components (4 files):**
- `src/components/common/Sidebar.jsx`
- `src/components/common/Header.jsx`
- `src/components/common/MetricCard.jsx`
- `src/components/common/StatusBadge.jsx`

**Police Components (3 files):**
- `src/components/police/QRScanner.jsx`
- `src/components/police/CameraPreview.jsx`
- `src/components/police/AlertDisplay.jsx`

**Admin Components (7 files):**
- `src/components/admin/QRScanner.jsx`
- `src/components/admin/CameraPreview.jsx`
- `src/components/admin/AlertCard.jsx`
- `src/components/admin/LogsTable.jsx`
- `src/components/admin/VisitorForm.jsx`
- `src/components/admin/QRCodeDisplay.jsx`
- `src/components/admin/FilterBar.jsx`

**Auth Components (1 file):**
- `src/components/auth/LoginForm.jsx`

**Pages (7 files):**
- `src/pages/police/PoliceDashboard.jsx`
- `src/pages/admin/Login.jsx`
- `src/pages/admin/Dashboard.jsx`
- `src/pages/admin/LiveScan.jsx`
- `src/pages/admin/VisitorManagement.jsx`
- `src/pages/admin/ScanLogs.jsx`
- `src/pages/admin/Alerts.jsx`

**Main Files (2 files):**
- `src/App.jsx` (routing)
- `src/main.jsx` (entry point)

---

## Quick Reference

### API Endpoints Summary

1. **POST /api/v1/auth/login** - Login with employeeId/password
2. **GET /api/v1/auth/me** - Get current user (requires auth)
3. **POST /api/v1/scan/qr** - Validate QR code (public)
4. **POST /api/v1/face/verify** - Verify face match (public)
5. **GET /api/v1/violations** - Get violations list (requires auth)
6. **POST /api/v1/visitors/passes** - Create visitor pass (requires auth)

### WebSocket

- **Endpoint:** `/ws/alerts`
- **Message Type:** `violation_alert`
- **Format:** See `api_contract.md` section 5

### Key Constants

- Violation Types: `unauthorized_qr_scan`, `face_verification_mismatch`, `multiple_fail_attempt`, `expired_visitor_qr_code`
- Subject Types: `student`, `staff`, `visitor`
- Severity Levels: `low`, `medium`, `high`, `critical`

---

## Troubleshooting

### Common Issues

1. **Import Errors:** Ensure all file paths are correct
2. **API Mock Not Working:** Check response format matches API contract exactly
3. **WebSocket Not Connecting:** Verify wsMock.js is properly implemented
4. **Routing Issues:** Check App.jsx routes are configured correctly
5. **Context Not Available:** Ensure providers wrap the app correctly

### Getting Help

- Refer to `api_contract.md` for API specifications
- Refer to `PLAN.md` for architecture details
- Refer to `IMPLEMENTATION_PLAN.md` for task breakdown

---

_Document Version: 1.0.0_  
_Last Updated: January 2026_  
_Based on API Contract Document v1.1.0_

