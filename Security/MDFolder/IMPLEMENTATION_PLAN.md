# Campus Access System Frontend - Implementation Plan

## Overview

Build a frontend-only React application with two portals (Police and Admin) for campus access management, featuring QR scanning, face verification simulation, visitor management, vehicle logging, and real-time alerts. All API calls will be mocked for Day 1 demo.

## Project Structure

```
University-Security-System/Security/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Sidebar.jsx          # Reusable sidebar navigation
│   │   │   ├── Header.jsx           # Top header with user profile
│   │   │   ├── MetricCard.jsx       # Dashboard metric cards
│   │   │   └── StatusBadge.jsx     # Status badges (Granted/Denied/Active/etc)
│   │   ├── police/
│   │   │   ├── QRScanner.jsx        # QR scanning component (mock)
│   │   │   ├── CameraPreview.jsx    # Live camera feed for mock face match
│   │   │   └── AlertDisplay.jsx     # Full-screen alert display for police portal
│   │   ├── admin/
│   │   │   ├── QRScanner.jsx        # QR scanner for admin portal
│   │   │   ├── CameraPreview.jsx    # Camera preview for admin
│   │   │   ├── AlertCard.jsx        # Alert card component for alerts page
│   │   │   ├── LogsTable.jsx        # Entry history table component
│   │   │   ├── VisitorForm.jsx      # Visitor registration form
│   │   │   ├── QRCodeDisplay.jsx    # QR code display component
│   │   │   └── FilterBar.jsx        # Filter/search bar for logs
│   │   └── auth/
│   │       └── LoginForm.jsx        # Login form component
│   ├── pages/
│   │   ├── police/
│   │   │   └── PoliceDashboard.jsx # Police portal dashboard (alert-focused)
│   │   └── admin/
│   │       ├── Login.jsx            # Admin login page
│   │       ├── Dashboard.jsx         # Admin dashboard overview
│   │       ├── LiveScan.jsx         # Live scan page with face recognition
│   │       ├── VisitorManagement.jsx # Visitor registration and management
│   │       ├── ScanLogs.jsx         # Scan logs page with filters
│   │       └── Alerts.jsx           # Security alerts page
│   ├── services/
│   │   ├── apiMock.js               # Mock API calls matching API contract
│   │   ├── faceMatchMock.js         # Mock face match logic
│   │   ├── qrGenerator.js           # QR code generation utility
│   │   └── wsMock.js                # Mock WebSocket for real-time alerts
│   ├── context/
│   │   ├── AuthContext.jsx          # Authentication context (mock)
│   │   └── AlertContext.jsx         # Alert state management
│   ├── utils/
│   │   ├── mockData.js              # Mock data matching API schemas
│   │   └── constants.js             # App constants (violation types, subject types, severity levels, gate IDs)
│   ├── App.jsx                      # Main app with routing
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles
└── package.json                     # Dependencies
```

## Architecture Overview

```mermaid
flowchart TD
    App[App.jsx] --> Router[React Router]
    Router --> PoliceRoute[/police/*]
    Router --> AdminRoute[/admin/*]

    PoliceRoute --> PoliceDash[PoliceDashboard]
    PoliceDash --> QRScanner[QRScanner Component]
    PoliceDash --> CameraPreview[CameraPreview Component]
    PoliceDash --> AlertDisplay[AlertDisplay Component]

    AdminRoute --> Login[Login Page]
    AdminRoute --> AdminDash[Admin Dashboard]
    AdminRoute --> LiveScan[Live Scan Page]
    AdminRoute --> VisitorMgmt[Visitor Management]
    AdminRoute --> ScanLogs[Scan Logs]
    AdminRoute --> Alerts[Alerts Page]

    QRScanner --> MockAPI[apiMock.js]
    CameraPreview --> FaceMatch[faceMatchMock.js]
    AlertDisplay --> AlertContext[AlertContext]

    AdminDash --> MockAPI
    LiveScan --> MockAPI
    VisitorMgmt --> MockAPI
    ScanLogs --> MockAPI
    Alerts --> AlertContext
```

## API Contract Compliance

All mock services and API calls must follow the API contract structure:

### Response Format

- Success: `{ status: "success", data: {...} }`
- Error: `{ status: "error", code: "ERROR_CODE", message: "Human readable message" }`

### Violation Types (from API contract)

- `unauthorized_qr_scan`: Invalid/tampered QR code (subject: null, only captured image saved)
- `face_verification_mismatch`: Face doesn't match enrolled photo (subject info + captured image saved)
- `multiple_fail_attempt`: 3+ failures in 5 minutes (subject info + all captured images saved, includes lockoutUntil)
- `expired_visitor_qr_code`: Visitor pass expired (subject info + captured image saved)

### Subject Types

- `student`: Enrolled student with active campus access
- `staff`: Faculty or staff member
- `visitor`: Temporary visitor with issued pass

### Severity Levels

- `low`: Minor issue, informational
- `medium`: Requires attention but not urgent
- `high`: Urgent, requires immediate attention
- `critical`: Security breach, immediate action required

### Base URL

- Development: `http://localhost:8000/api/v1`
- All endpoints prefixed with `/api/v1`

## Implementation Tasks

### Task 1: Setup & Routing (Foundation)

**Status:** Pending

**Description:**
Install react-router-dom and set up routing structure with /police and /admin/* routes. Create basic layout components (Sidebar, Header).

**Details:**
- Install `react-router-dom` for routing
- Set up routes: `/police` for Police Portal, `/admin/*` for Admin Portal
- Default route redirects to `/police`
- Protected routes for admin (mock authentication)

**Dependencies:** None

---

### Task 2: Mock Services (Backend Simulation)

**Status:** Pending

**Description:**
Implement apiMock.js matching API contract: POST /api/v1/auth/login, GET /api/v1/auth/me, POST /api/v1/scan/qr, POST /api/v1/face/verify, GET /api/v1/violations, POST /api/v1/visitors/passes. All responses follow { status: "success"|"error", data: {...} } format. Implement faceMatchMock.js for face verification simulation. Create mockData.js with sample data matching API schemas. Implement qrGenerator.js for QR code creation. Implement wsMock.js for WebSocket simulation (/ws/alerts).

**Details:**

**apiMock.js:**
All endpoints follow the API contract structure with `{ status: "success"|"error", data: {...} }` format.

**Authentication Endpoints:**
- `POST /api/v1/auth/login(employeeId, password)`: Returns JWT token, expiresAt, and user object
- `GET /api/v1/auth/me()`: Returns current authenticated user info (requires JWT token)

**Gate Scanning Endpoints (Public - No Auth):**
- `POST /api/v1/scan/qr(qrCode, gateId, scanTimestamp)`:
  - Returns `{ valid: boolean, subjectType: "student"|"staff"|"visitor", subject: {...}, accessGranted: boolean, requiresFaceVerification: boolean }`
  - Or violation response: `{ valid: false, violationType: "unauthorized_qr_scan"|"expired_visitor_qr_code", violationId: string, message: string }`
- `POST /api/v1/face/verify(subjectId, subjectType, faceImage, gateId, scanTimestamp)`:
  - Returns `{ verified: boolean, confidence: number, accessGranted: boolean, message: string }`
  - Or violation response: `{ verified: false, violationType: "face_verification_mismatch"|"multiple_fail_attempt", violationId: string, subject: {...} }`

**Dashboard Endpoints (Auth Required):**
- `GET /api/v1/violations(queryParams)`: Returns paginated violations list with filters
  - Query params: `page`, `limit`, `type`, `subjectType`, `gateId`, `startDate`, `endDate`, `resolved`
  - Returns `{ violations: [...], pagination: {...} }`
- `POST /api/v1/visitors/passes(visitorData)`:
  - Request: `{ visitorName, visitorEmail?, visitorPhone?, purpose, hostEmployeeId, validFrom, validUntil, allowedGates?, notes? }`
  - Returns `{ passId, visitorName, host: {...}, qrCode: { content, imageUrl, imageBase64 }, ... }`

**faceMatchMock.js:**
- `simulateFaceMatch(subjectId, subjectType, faceImage, delay)`: Simulates face matching with configurable delay
- Returns `{ verified: boolean, confidence: number }` matching API contract format
- Can simulate violations: `face_verification_mismatch` or `multiple_fail_attempt`

**qrGenerator.js:**
- `generateQRCode(passId, passType)`: Generates QR code content string (e.g., "QR-STU-2024-ABC123XYZ" or "QR-VIS-2026-NEW789XYZ")
- `generateQRImage(qrContent)`: Creates QR code image using `qrcode.react` library
- Returns base64 image data matching API contract format

**wsMock.js:**
- Mock WebSocket connection to `/ws/alerts`
- Simulates real-time violation alerts
- Sends `violation_alert` messages with format: `{ type: "violation_alert", timestamp, data: { violationId, violationType, severity, gate: {...}, subject: {...}, message } }`
- Handles heartbeat/pong messages

**mockData.js:**
- Sample students with structure: `{ id, name, photoUrl, department, enrollmentStatus }`
- Sample staff members: `{ id, name, photoUrl, department, position, employmentStatus }`
- Sample visitors: `{ id, name, purpose, hostName, hostDepartment, validFrom, validUntil }`
- Sample violations matching API contract:
  - `unauthorized_qr_scan` (subject: null)
  - `face_verification_mismatch` (with subject info)
  - `multiple_fail_attempt` (with subject info and lockoutUntil)
  - `expired_visitor_qr_code` (with subject info)
- Sample gates: `{ id, name, location, status }`
- Sample employees for host selection: `{ employeeId, name, department, email }`

**constants.js:**
- Violation types: `UNAUTHORIZED_QR_SCAN = "unauthorized_qr_scan"`, `FACE_VERIFICATION_MISMATCH = "face_verification_mismatch"`, `MULTIPLE_FAIL_ATTEMPT = "multiple_fail_attempt"`, `EXPIRED_VISITOR_QR_CODE = "expired_visitor_qr_code"`
- Subject types: `STUDENT = "student"`, `STAFF = "staff"`, `VISITOR = "visitor"`
- Severity levels: `LOW = "low"`, `MEDIUM = "medium"`, `HIGH = "high"`, `CRITICAL = "critical"`
- Gate IDs: `GATE_MAIN_ENTRANCE = "gate_main_entrance"`, `GATE_LIBRARY = "gate_library"`, `GATE_HR_BUILDING = "gate_hr_building"`
- API base URL: `API_BASE_URL = "http://localhost:8000/api/v1"`
- WebSocket URL: `WS_ALERTS_URL = "ws://localhost:8000/ws/alerts"`
- Error codes: `INVALID_CREDENTIALS`, `ACCOUNT_LOCKED`, `UNAUTHORIZED`, `VALIDATION_ERROR`, etc.

**Dependencies:** None

---

### Task 3: Context Providers (State Management)

**Status:** Pending

**Description:**
Create AuthContext for mock authentication with JWT token management (login with employeeId/password, logout, token storage, Authorization header). Create AlertContext for violation/alert state management (connects to WebSocket, stores violations matching API contract format, handles violation types and severity, acknowledge/resolve methods).

**Details:**

**AuthContext.jsx:**
- Mock authentication state with JWT token management
- Methods: `login(employeeId, password)`, `logout()`, `isAuthenticated()`, `getCurrentUser()`
- Stores JWT token and user info (localStorage for "Remember me")
- Includes token expiration handling
- Sets Authorization header for authenticated API calls

**AlertContext.jsx:**
- Global alert/violation state for real-time updates
- Methods: `addViolation()`, `acknowledgeViolation()`, `getViolations()`, `getViolationsByType()`
- Connects to WebSocket (`wsMock.js`) for real-time violation alerts
- Stores violations matching API contract format: `{ violationId, violationType, severity, gate, subject, occurredAt, resolved, ... }`
- Used by both portals for alert synchronization
- Handles violation types: `unauthorized_qr_scan`, `face_verification_mismatch`, `multiple_fail_attempt`, `expired_visitor_qr_code`

**Dependencies:** 
- mock-services

---

### Task 4: Police Portal (Alert-Focused)

**Status:** Pending

**Description:**
Build PoliceDashboard with full-screen scanning interface. Implement QRScanner calling POST /api/v1/scan/qr (handles valid QR and violations: unauthorized_qr_scan, expired_visitor_qr_code). Implement CameraPreview calling POST /api/v1/face/verify with base64 image (handles violations: face_verification_mismatch, multiple_fail_attempt). Implement AlertDisplay showing violation details (type, severity, gate, subject if available). Add white screen state for successful QR + face matches. Connect to WebSocket for real-time violations.

**Details:**

**PoliceDashboard.jsx:**
- Full-screen interface (no sidebar)
- Real-time QR scanning area
- Camera preview for face verification
- Alert overlay that appears when violations occur:
  - `unauthorized_qr_scan`: Invalid/tampered QR code
  - `face_verification_mismatch`: Face doesn't match enrolled photo
  - `multiple_fail_attempt`: 3+ verification failures
  - `expired_visitor_qr_code`: Visitor pass expired
- White screen state when QR scan + face verification both succeed
- Alert display shows full violation information:
  - Violation type and severity
  - Gate name and location
  - Subject info (if available, null for unauthorized_qr_scan)
  - Timestamp (occurredAt)
  - Captured image URL (if available)
- Connects to WebSocket for real-time violation alerts

**Components:**

**QRScanner.jsx:**
- Uses `react-qr-reader` or manual input, calls `POST /api/v1/scan/qr` with `{ qrCode, gateId, scanTimestamp }`
- Handles response: valid QR → fetch subject info, invalid QR → trigger violation alert
- For visitors: checks if pass is expired → triggers `expired_visitor_qr_code` violation

**CameraPreview.jsx:**
- Uses `react-webcam`, captures face image on QR scan
- Calls `POST /api/v1/face/verify` with `{ subjectId, subjectType, faceImage (base64), gateId, scanTimestamp }`
- Handles response: verified → white screen, mismatch → trigger violation alert
- Simulates face match with configurable delay (1-2 seconds)

**AlertDisplay.jsx:**
- Full-screen alert modal with violation details matching API contract
- Displays violation type, severity, gate info, subject info (if available), timestamp
- Shows captured image if available
- Auto-dismisses after 5 seconds or manual close

**Dependencies:**
- setup-routing
- mock-services
- context-providers

---

### Task 5: Admin Portal - Auth (Login)

**Status:** Pending

**Description:**
Build Login page with employeeId and password fields (matching API contract). Call POST /api/v1/auth/login via AuthContext. Handle error responses (INVALID_CREDENTIALS, ACCOUNT_LOCKED). Store JWT token and user info. Add Remember me functionality. Redirect to /admin/dashboard on success.

**Details:**

**Login.jsx:**
- Employee ID and password fields (matching API contract)
- "Remember me" checkbox
- "Forgot Password?" link
- Calls `POST /api/v1/auth/login` with `{ employeeId, password }`
- Stores JWT token and user info on success
- Handles error responses: `INVALID_CREDENTIALS`, `ACCOUNT_LOCKED`
- Redirects to `/admin/dashboard` on success

**LoginForm.jsx:**
- Reusable login form component
- Form validation
- Error message display

**Dependencies:**
- setup-routing
- context-providers

---

### Task 6: Admin Portal - Dashboard (Overview)

**Status:** Pending

**Description:**
Build Dashboard page with sidebar navigation. Implement MetricCard component (Total Entries, Vehicles, Visitors). Create Recent Live Scans table. Add Quick Actions section. Integrate with mock API for stats.

**Details:**

**Dashboard.jsx:**
- Sidebar navigation (Dashboard, Logs, Alerts, Live Scan, Visitor Management)
- Header with user profile
- Metric cards: Total Entries, Total Vehicles, Total Visitors (with percentage changes)
- Recent Live Scans table (Time, Event, Identity, Status)
- Quick Actions section

**MetricCard.jsx:**
- Reusable metric card component
- Displays metric value, percentage change, icon
- Color-coded for positive/negative changes

**Dependencies:**
- setup-routing
- mock-services

---

### Task 7: Admin Portal - Live Scan (Face Recognition)

**Status:** Pending

**Description:**
Build LiveScan page with camera preview and QR scanner. Display face match status and Welcome message. Show student/visitor info card with QR code. Integrate with faceMatchMock for simulation.

**Details:**

**LiveScan.jsx:**
- Left side: Camera preview with face recognition status
- Right side: Student/Visitor info card with QR code display
- Shows "Face Matched" with checkmark when successful
- Displays person details (name, department, ID, status)

**Components:**
- Uses admin `QRScanner` and `CameraPreview` components
- Integrates with faceMatchMock for simulation

**Dependencies:**
- admin-dashboard
- mock-services

---

### Task 8: Admin Portal - Visitor Management (QR Creation)

**Status:** Pending

**Description:**
Build VisitorManagement page with Create Visitor QR form matching API contract (visitorName, visitorEmail?, visitorPhone?, purpose, hostEmployeeId, validFrom, validUntil, allowedGates?, notes?). Add validation (validFrom rules, validUntil after validFrom, max 24h duration). Call POST /api/v1/visitors/passes on submit. Display QR code using imageBase64 from response. Implement visitors table with search. Add View QR and Edit actions.

**Details:**

**VisitorManagement.jsx:**
- Left card: Create Visitor QR form matching API contract
  - Fields: Visitor Name (required), Visitor Email (optional), Visitor Phone (optional), Purpose (required), Host Employee ID (required, dropdown), Valid From (required, ISO 8601), Valid Until (required, ISO 8601), Allowed Gates (optional, multi-select), Notes (optional)
  - Validation: validFrom must be future/within last hour, validUntil after validFrom, max 24h duration
  - Calls `POST /api/v1/visitors/passes` on submit
  - Displays generated QR code with `imageBase64` from response
- Right card: Current Visitors table
  - Columns: Visitor, Host, Access Period, Status, Actions
  - Search functionality
  - View QR and Edit actions
  - Fetches visitor passes from mock data

**Components:**
- `VisitorForm.jsx`: Form component with all fields and validation
- `QRCodeDisplay.jsx`: Component to display QR code with visitor details

**Dependencies:**
- admin-dashboard
- mock-services

---

### Task 9: Admin Portal - Scan Logs (History)

**Status:** Pending

**Description:**
Build ScanLogs page displaying violations from GET /api/v1/violations. Implement FilterBar with filters (violation type, subject type, gate ID, startDate/endDate, resolution status). Implement LogsTable with columns (Timestamp/occurredAt, Violation Type, Subject Type, Subject Name, Gate, Status/resolved). Handle unauthorized_qr_scan violations (subject: null) appropriately. Add pagination matching API contract pagination object. Add export functionality (mock).

**Details:**

**ScanLogs.jsx:**
- Filter bar: Search input, Date picker (startDate/endDate), Export Data button
- Table displays violations from `GET /api/v1/violations` endpoint
- Columns: Timestamp (occurredAt), Violation Type, Subject Type, Subject Name, Gate, Status (resolved), Actions
- Pagination controls matching API contract pagination object
- Filter by: violation type, subject type, gate ID, date range, resolution status
- Handles `unauthorized_qr_scan` violations (subject: null) appropriately

**Components:**
- `FilterBar.jsx`: Filter component with all filter options
- `LogsTable.jsx`: Table component with pagination and sorting

**Dependencies:**
- admin-dashboard
- mock-services

---

### Task 10: Admin Portal - Alerts (Security Monitoring)

**Status:** Pending

**Description:**
Build Alerts page displaying violations from GET /api/v1/violations. Implement AlertCard component matching API contract violation format. Display violation types (unauthorized_qr_scan, face_verification_mismatch, multiple_fail_attempt, expired_visitor_qr_code). Show severity badges (low, medium, high, critical). Show resolution status (resolved: false for New/Investigating, resolved: true for Acknowledged). Handle unauthorized_qr_scan (subject: null) - show Unknown Individual. Add Acknowledge (marks resolved) and Investigate (details modal) actions. Connect to WebSocket for real-time updates.

**Details:**

**Alerts.jsx:**
- Security Alerts page title and description
- Displays violations from `GET /api/v1/violations` endpoint
- Alert cards displaying violations matching API contract:
  - Violation type: `unauthorized_qr_scan`, `face_verification_mismatch`, `multiple_fail_attempt`, `expired_visitor_qr_code`
  - Severity badge: `low`, `medium`, `high`, `critical`
  - Status badge: `resolved: false` (New/Investigating), `resolved: true` (Acknowledged)
  - Details: Type, Description (from violation), Timestamp (occurredAt), Gate (name/location), Subject (if available)
  - For `unauthorized_qr_scan`: Shows "Unknown Individual" (subject is null)
  - Action buttons: Acknowledge (marks as resolved), Investigate (opens details modal)
- Real-time updates via WebSocket connection

**Components:**
- `AlertCard.jsx`: Card component displaying violation details
- Uses `StatusBadge` component for severity and status

**Dependencies:**
- admin-dashboard
- context-providers

---

### Task 11: Styling & Polish (UI/UX)

**Status:** Pending

**Description:**
Apply Tailwind CSS styling to match provided images (purple accents, white backgrounds). Add animations and transitions. Ensure responsive design. Add loading states and error handling.

**Details:**
- Use Tailwind CSS (already configured)
- Color scheme: Purple accents (#9333ea or similar), white backgrounds
- Responsive design for mobile/tablet
- Match design from provided images
- Add loading states for async operations
- Add error handling and error messages
- Add smooth animations and transitions

**Dependencies:**
- police-portal
- admin-login
- admin-dashboard
- admin-livescan
- admin-visitor-mgmt
- admin-scan-logs
- admin-alerts

---

### Task 12: Testing & Demo Prep (Finalization)

**Status:** Pending

**Description:**
Test all flows end-to-end. Verify mock data displays correctly. Ensure alerts trigger properly in Police Portal. Test visitor QR generation and scanning. Prepare demo scenarios with sample data.

**Details:**
- Test all flows end-to-end
- Verify mock data displays correctly
- Ensure alerts trigger properly in Police Portal
- Test visitor QR generation and scanning
- Prepare demo scenarios with sample data
- Test error handling and edge cases
- Verify responsive design on different screen sizes

**Dependencies:**
- styling-polish

---

## Key Features Implementation

### QR Scanning Flow

1. User scans QR code (or enters manually)
2. `QRScanner` calls `POST /api/v1/scan/qr` with `{ qrCode, gateId, scanTimestamp }`
3. Response handling:
   - If `valid: false` with `violationType: "unauthorized_qr_scan"` → trigger violation alert (subject: null)
   - If `valid: true` for visitor with `violationType: "expired_visitor_qr_code"` → trigger violation alert (with subject info)
   - If `valid: true` and `accessGranted: true` → fetch subject details
4. If `requiresFaceVerification: true` → trigger face verification
5. Face verification: `POST /api/v1/face/verify` with captured image
   - If `verified: true` → white screen (Police) or display info (Admin)
   - If `verified: false` with `violationType: "face_verification_mismatch"` → trigger violation alert
   - If `violationType: "multiple_fail_attempt"` → trigger violation alert with lockout info
6. All violations trigger WebSocket alert and update AlertContext

### Face Match Simulation

1. On QR scan, `CameraPreview` captures image from webcam
2. Converts image to base64 format
3. Calls `POST /api/v1/face/verify` with `{ subjectId, subjectType, faceImage (base64), gateId, scanTimestamp }`
4. Mock service simulates verification with delay (1-2 seconds)
5. Returns response matching API contract:
   - Success: `{ verified: true, confidence: 0.94, accessGranted: true, message: "Face verification successful" }`
   - Failure: `{ verified: false, confidence: 0.32, violationType: "face_verification_mismatch", violationId, subject: {...} }`
   - Multiple failures: `{ verified: false, violationType: "multiple_fail_attempt", lockoutUntil, failedAttemptCount }`
6. Updates UI accordingly and triggers violations if needed

### Alert/Violation System

1. Violations triggered by:
   - `unauthorized_qr_scan`: Invalid/tampered QR code (subject: null)
   - `face_verification_mismatch`: Face doesn't match enrolled photo (with subject info)
   - `multiple_fail_attempt`: 3+ failures in 5 minutes (with subject info and lockout)
   - `expired_visitor_qr_code`: Visitor pass expired (with subject info)
2. Violations sent via WebSocket (`/ws/alerts`) in real-time
3. Police Portal: Full-screen alert display showing violation details
4. Admin Portal: Violation cards on Alerts page (fetched from `GET /api/v1/violations`)
5. Violations stored in `AlertContext` for cross-portal sync
6. Violations can be acknowledged/resolved (updates `resolved` status)

### Visitor QR Generation

1. Fill visitor form with all required fields matching API contract
2. Submit → `POST /api/v1/visitors/passes` with visitor data
3. API validates: hostEmployeeId exists, validFrom/validUntil are valid, max 24h duration
4. API generates QR code and returns:
   - `passId`: Unique visitor pass ID
   - `qrCode.content`: QR code string (e.g., "QR-VIS-2026-NEW789XYZ")
   - `qrCode.imageUrl`: CDN URL for QR image
   - `qrCode.imageBase64`: Base64 encoded QR image
5. Display QR code with visitor details (name, purpose, host, access period)
6. QR code contains pass ID and can be validated at gates

## Dependencies to Install

```json
{
  "react-router-dom": "^6.x",
  "react-qr-reader": "^2.x" or "html5-qrcode": "^2.x",
  "react-webcam": "^7.x",
  "qrcode.react": "^3.x",
  "react-toastify": "^10.x" (optional, for notifications)
}
```

**Note:** WebSocket will be mocked using a custom `wsMock.js` service that simulates WebSocket behavior without requiring a real WebSocket server.

## Implementation Checklist

- [ ] Task 1: Setup & Routing
- [ ] Task 2: Mock Services (apiMock.js, faceMatchMock.js, qrGenerator.js, wsMock.js, mockData.js, constants.js)
- [ ] Task 3: Context Providers (AuthContext, AlertContext)
- [ ] Task 4: Police Portal (PoliceDashboard, QRScanner, CameraPreview, AlertDisplay)
- [ ] Task 5: Admin Portal - Login
- [ ] Task 6: Admin Portal - Dashboard
- [ ] Task 7: Admin Portal - Live Scan
- [ ] Task 8: Admin Portal - Visitor Management
- [ ] Task 9: Admin Portal - Scan Logs
- [ ] Task 10: Admin Portal - Alerts
- [ ] Task 11: Styling & Polish
- [ ] Task 12: Testing & Demo Prep

---

_Document Version: 1.0.0_  
_Last Updated: January 2026_  
_Based on API Contract Document v1.1.0_

