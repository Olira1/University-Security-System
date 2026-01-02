# Campus Access System Frontend - Complete Implementation Plan

## Overview

Build a frontend-only React application with two portals (Police and Admin) for campus access management, featuring QR scanning, face verification simulation, visitor management, vehicle logging, and real-time alerts. All API calls will be mocked for Day 1 demo.

## Work Division: Dev-A & Dev-B

This project is being developed by two developers collaborating on GitHub. Each developer is responsible for complete implementation (UI + Logic/Context) of their assigned pages and components.

### Dev-A Responsibilities

**Pages:**

1. **Police Portal** (`/police`)

   - `src/pages/police/PoliceDashboard.jsx` - Complete implementation
   - All UI, state management, API integration, WebSocket connection

2. **Admin Login** (`/admin/login`)

   - `src/pages/admin/Login.jsx` - Complete implementation
   - UI, form handling, authentication logic

3. **Admin Dashboard** (`/admin/dashboard`)

   - `src/pages/admin/Dashboard.jsx` - Complete implementation
   - UI, metrics display, recent scans table, quick actions

4. **Admin Live Scan** (`/admin/livescan`)
   - `src/pages/admin/LiveScan.jsx` - Complete implementation
   - UI, camera integration, QR scanning, face verification display

**Components:**

- `src/components/police/QRScanner.jsx` - Complete implementation
- `src/components/police/CameraPreview.jsx` - Complete implementation
- `src/components/police/AlertDisplay.jsx` - Complete implementation
- `src/components/admin/QRScanner.jsx` - Complete implementation (for Live Scan page)
- `src/components/admin/CameraPreview.jsx` - Complete implementation (for Live Scan page)
- `src/components/auth/LoginForm.jsx` - Complete implementation

**Context & Infrastructure:**

- `src/context/AuthContext.jsx` - Complete implementation (JWT token management, login/logout)
- `src/App.jsx` - Routing setup (all routes, protected routes for admin)

**Responsibilities Summary:**

- Police Portal: Full implementation (page + all components + logic)
- Admin Login: Full implementation (page + component + AuthContext integration)
- Admin Dashboard: Full implementation (page + UI + API calls)
- Admin Live Scan: Full implementation (page + components + camera/QR logic)
- Authentication: AuthContext and routing protection

---

### Dev-B Responsibilities

**Pages:**

1. **Admin Visitor Management** (`/admin/visitor-management`)

   - `src/pages/admin/VisitorManagement.jsx` - Complete implementation
   - UI, form handling, visitor list, QR generation

2. **Admin Scan Logs** (`/admin/scan-logs`)

   - `src/pages/admin/ScanLogs.jsx` - Complete implementation
   - UI, filtering, pagination, table display

3. **Admin Alerts** (`/admin/alerts`)
   - `src/pages/admin/Alerts.jsx` - Complete implementation
   - UI, violation cards, real-time updates, acknowledge/investigate actions

**Components:**

- `src/components/common/Sidebar.jsx` - Complete implementation (used by all admin pages)
- `src/components/common/Header.jsx` - Complete implementation (used by all admin pages)
- `src/components/common/MetricCard.jsx` - Complete implementation (used by Dashboard)
- `src/components/common/StatusBadge.jsx` - Complete implementation (used across admin pages)
- `src/components/admin/VisitorForm.jsx` - Complete implementation
- `src/components/admin/QRCodeDisplay.jsx` - Complete implementation
- `src/components/admin/FilterBar.jsx` - Complete implementation
- `src/components/admin/LogsTable.jsx` - Complete implementation
- `src/components/admin/AlertCard.jsx` - Complete implementation

**Context & Infrastructure:**

- `src/context/AlertContext.jsx` - Complete implementation (violation state, WebSocket integration)
- `src/services/apiMock.js` - Complete implementation (all API endpoints)
- `src/services/faceMatchMock.js` - Complete implementation (face verification simulation)
- `src/services/qrGenerator.js` - Complete implementation (QR code generation)
- `src/services/wsMock.js` - Complete implementation (WebSocket simulation)
- `src/utils/mockData.js` - Complete implementation (all sample data)
- `src/utils/constants.js` - Complete implementation (all constants)

**Responsibilities Summary:**

- Admin Visitor Management: Full implementation (page + components + API integration)
- Admin Scan Logs: Full implementation (page + components + filtering/pagination)
- Admin Alerts: Full implementation (page + components + WebSocket + violation management)
- Common Components: All reusable components used across admin portal
- Backend Simulation: All mock services, data, and constants
- Alert System: AlertContext and WebSocket integration

---

### Collaboration Points

**Shared Dependencies:**

- Dev-A's pages will use Dev-B's common components (Sidebar, Header, MetricCard, StatusBadge)
- Dev-A's AuthContext will be used by Dev-B's pages for authentication checks
- Dev-B's AlertContext will be used by Dev-A's Police Portal for real-time alerts
- Dev-B's mock services will be used by Dev-A's pages for API calls
- Dev-B's constants will be used by both developers

**Git Workflow:**

1. Dev-B should create mock services and constants first (foundation)
2. Dev-A can start with Police Portal (independent) and Admin Login
3. Dev-B creates common components early (needed by Dev-A's Dashboard)
4. Both developers work in parallel on their assigned pages
5. Regular commits and pulls to sync shared dependencies

**Integration Checklist:**

- [ ] Dev-B: Create `constants.js` and `mockData.js` first
- [ ] Dev-B: Create `apiMock.js` with all endpoints
- [ ] Dev-B: Create common components (Sidebar, Header, MetricCard, StatusBadge)
- [ ] Dev-A: Create `AuthContext.jsx` for authentication
- [ ] Dev-B: Create `AlertContext.jsx` and `wsMock.js` for alerts
- [ ] Dev-A: Implement Police Portal (can work independently)
- [ ] Dev-A: Implement Admin Login (uses AuthContext)
- [ ] Dev-A: Implement Admin Dashboard (uses Dev-B's common components)
- [ ] Dev-A: Implement Admin Live Scan (uses Dev-B's mock services)
- [ ] Dev-B: Implement Admin Visitor Management (uses Dev-B's mock services)
- [ ] Dev-B: Implement Admin Scan Logs (uses Dev-B's mock services)
- [ ] Dev-B: Implement Admin Alerts (uses AlertContext and mock services)

---

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
│   │   └── constants.js            # App constants (violation types, subject types, severity levels, gate IDs)
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

## Implementation Details

### 1. Routing Setup

- Install `react-router-dom` for routing
- Set up routes: `/police` for Police Portal, `/admin/*` for Admin Portal
- Default route redirects to `/police`
- Protected routes for admin (mock authentication)

### 2. Police Portal (`/police`)

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

- `QRScanner.jsx`: Uses `react-qr-reader` or manual input, calls `POST /api/v1/scan/qr` with `{ qrCode, gateId, scanTimestamp }`
  - Handles response: valid QR → fetch subject info, invalid QR → trigger violation alert
  - For visitors: checks if pass is expired → triggers `expired_visitor_qr_code` violation
- `CameraPreview.jsx`: Uses `react-webcam`, captures face image on QR scan
  - Calls `POST /api/v1/face/verify` with `{ subjectId, subjectType, faceImage (base64), gateId, scanTimestamp }`
  - Handles response: verified → white screen, mismatch → trigger violation alert
  - Simulates face match with configurable delay (1-2 seconds)
- `AlertDisplay.jsx`: Full-screen alert modal with violation details matching API contract
  - Displays violation type, severity, gate info, subject info (if available), timestamp
  - Shows captured image if available
  - Auto-dismisses after 5 seconds or manual close

### 3. Admin Portal (`/admin/*`)

**Login.jsx:**

- Employee ID and password fields (matching API contract)
- "Remember me" checkbox
- "Forgot Password?" link
- Calls `POST /api/v1/auth/login` with `{ employeeId, password }`
- Stores JWT token and user info on success
- Handles error responses: `INVALID_CREDENTIALS`, `ACCOUNT_LOCKED`
- Redirects to `/admin/dashboard` on success

**Dashboard.jsx:**

- Sidebar navigation (Dashboard, Logs, Alerts, Live Scan, Visitor Management)
- Header with user profile
- Metric cards: Total Entries, Total Vehicles, Total Visitors (with percentage changes)
- Recent Live Scans table (Time, Event, Identity, Status)
- Quick Actions section

**LiveScan.jsx:**

- Left side: Camera preview with face recognition status
- Right side: Student/Visitor info card with QR code display
- Shows "Face Matched" with checkmark when successful
- Displays person details (name, department, ID, status)

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

**ScanLogs.jsx:**

- Filter bar: Search input, Date picker (startDate/endDate), Export Data button
- Table displays violations from `GET /api/v1/violations` endpoint
- Columns: Timestamp (occurredAt), Violation Type, Subject Type, Subject Name, Gate, Status (resolved), Actions
- Pagination controls matching API contract pagination object
- Filter by: violation type, subject type, gate ID, date range, resolution status
- Handles `unauthorized_qr_scan` violations (subject: null) appropriately

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

### 4. Mock Services

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

**WebSocket Service:**

- `wsMock.js`: Mock WebSocket connection to `/ws/alerts`
  - Simulates real-time violation alerts
  - Sends `violation_alert` messages with format: `{ type: "violation_alert", timestamp, data: { violationId, violationType, severity, gate: {...}, subject: {...}, message } }`
  - Handles heartbeat/pong messages

**faceMatchMock.js:**

- `simulateFaceMatch(subjectId, subjectType, faceImage, delay)`: Simulates face matching with configurable delay
- Returns `{ verified: boolean, confidence: number }` matching API contract format
- Can simulate violations: `face_verification_mismatch` or `multiple_fail_attempt`

**qrGenerator.js:**

- `generateQRCode(passId, passType)`: Generates QR code content string (e.g., "QR-STU-2024-ABC123XYZ" or "QR-VIS-2026-NEW789XYZ")
- `generateQRImage(qrContent)`: Creates QR code image using `qrcode.react` library
- Returns base64 image data matching API contract format

### 5. Mock Data

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

### 6. State Management

**AlertContext.jsx:**

- Global alert/violation state for real-time updates
- Methods: `addViolation()`, `acknowledgeViolation()`, `getViolations()`, `getViolationsByType()`
- Connects to WebSocket (`wsMock.js`) for real-time violation alerts
- Stores violations matching API contract format: `{ violationId, violationType, severity, gate, subject, occurredAt, resolved, ... }`
- Used by both portals for alert synchronization
- Handles violation types: `unauthorized_qr_scan`, `face_verification_mismatch`, `multiple_fail_attempt`, `expired_visitor_qr_code`

**AuthContext.jsx:**

- Mock authentication state with JWT token management
- Methods: `login(employeeId, password)`, `logout()`, `isAuthenticated()`, `getCurrentUser()`
- Stores JWT token and user info (localStorage for "Remember me")
- Includes token expiration handling
- Sets Authorization header for authenticated API calls

### 7. Styling

- Use Tailwind CSS (already configured)
- Color scheme: Purple accents (#9333ea or similar), white backgrounds
- Responsive design for mobile/tablet
- Match design from provided images

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

## Task Breakdown

### 1. Setup & Routing (Foundation) - **Dev-A**

- Install dependencies
- Set up React Router with portal routes in `App.jsx`
- Note: Basic layout components (Sidebar, Header) will be created by Dev-B

### 2. Mock Services (Backend Simulation) - **Dev-B**

- Implement `apiMock.js` matching API contract endpoints:
  - Authentication: `POST /api/v1/auth/login`, `GET /api/v1/auth/me`
  - Gate scanning: `POST /api/v1/scan/qr`, `POST /api/v1/face/verify`
  - Dashboard: `GET /api/v1/violations`, `POST /api/v1/visitors/passes`
  - All responses follow `{ status: "success"|"error", data: {...} }` format
- Implement `faceMatchMock.js` with simulation logic matching API contract
- Create `mockData.js` with sample data matching API schemas (subjects, violations, gates, employees)
- Implement `qrGenerator.js` for QR code creation (content string and base64 image)
- Implement `wsMock.js` for WebSocket simulation (`/ws/alerts` endpoint)
- Create `constants.js` with all violation types, subject types, severity levels, gate IDs, API URLs

### 3. Context Providers (State Management)

- **Dev-A**: Create `AuthContext` for mock authentication with JWT token management
  - Handles login with `employeeId` and `password`
  - Stores JWT token and user info
  - Manages token expiration
  - Sets Authorization header for API calls
- **Dev-B**: Create `AlertContext` for violation/alert management
  - Connects to WebSocket for real-time violations
  - Stores violations matching API contract format
  - Handles violation types and severity levels
  - Methods for acknowledging/resolving violations

### 4. Police Portal (Alert-Focused) - **Dev-A**

- Build `PoliceDashboard` with scanning interface
- Implement `QRScanner` component calling `POST /api/v1/scan/qr` (uses Dev-B's apiMock)
  - Handle valid QR responses and violation responses (`unauthorized_qr_scan`, `expired_visitor_qr_code`)
- Implement `CameraPreview` with face match simulation
  - Capture face image, convert to base64
  - Call `POST /api/v1/face/verify` with subject info (uses Dev-B's apiMock)
  - Handle verification responses and violations (`face_verification_mismatch`, `multiple_fail_attempt`)
- Implement `AlertDisplay` for full-screen alerts showing violation details
  - Display violation type, severity, gate info, subject info (if available), timestamp
  - Uses Dev-B's AlertContext for violation state
- Add white screen state for successful QR scan + face verification
- Connect to WebSocket for real-time violation alerts (uses Dev-B's wsMock)

### 5. Admin Portal - Auth (Login) - **Dev-A**

- Build `Login` page with `employeeId` and `password` fields (matching API contract)
- Implement `LoginForm` component
- Integrate with `AuthContext` (Dev-A's own context) to call `POST /api/v1/auth/login` (uses Dev-B's apiMock)
- Handle error responses: `INVALID_CREDENTIALS`, `ACCOUNT_LOCKED`
- Store JWT token and user info on success
- Redirect to `/admin/dashboard` on successful login

### 6. Admin Portal - Dashboard (Overview) - **Dev-A**

- Build `Dashboard` page with metrics
- Use Dev-B's `MetricCard` component (common component)
- Use Dev-B's `Sidebar` and `Header` components (common components)
- Create Recent Live Scans table
- Add Quick Actions section
- Integrate with Dev-B's apiMock for dashboard stats

### 7. Admin Portal - Live Scan (Face Recognition) - **Dev-A**

- Build `LiveScan` page
- Implement admin `QRScanner` and `CameraPreview` components
- Use Dev-B's `Sidebar` and `Header` components (common components)
- Integrate camera preview and QR scanner
- Display student/visitor info card with QR
- Integrate with Dev-B's apiMock for QR scanning and face verification

### 8. Admin Portal - Visitor Management (QR Creation) - **Dev-B**

- Build `VisitorManagement` page
- Implement `VisitorForm` component with all API contract fields:
  - Required: visitorName, purpose, hostEmployeeId, validFrom, validUntil
  - Optional: visitorEmail, visitorPhone, allowedGates, notes
- Implement `QRCodeDisplay` component
- Use Dev-B's own `Sidebar` and `Header` components (common components)
- Add validation: validFrom validation, validUntil after validFrom, max 24h duration
- Call `POST /api/v1/visitors/passes` on submit (uses Dev-B's own apiMock)
- Display generated QR code using `imageBase64` from response (uses Dev-B's qrGenerator)
- Create visitors table with search functionality
- Implement View QR and Edit actions

### 9. Admin Portal - Scan Logs (History) - **Dev-B**

- Build `ScanLogs` page displaying violations from `GET /api/v1/violations`
- Implement `FilterBar` component with filters:
  - Violation type, subject type, gate ID, date range (startDate/endDate), resolution status
- Implement `LogsTable` component with columns matching violation schema:
  - Timestamp (occurredAt), Violation Type, Subject Type, Subject Name, Gate, Status (resolved)
- Use Dev-B's own `Sidebar` and `Header` components (common components)
- Handle `unauthorized_qr_scan` violations (subject: null) appropriately
- Add pagination matching API contract pagination object
- Add export functionality (mock)
- Integrate with Dev-B's apiMock for violations data

### 10. Admin Portal - Alerts (Security Monitoring) - **Dev-B**

- Build `Alerts` page displaying violations from `GET /api/v1/violations`
- Implement `AlertCard` component matching API contract violation format
- Use Dev-B's own `Sidebar` and `Header` components (common components)
- Use Dev-B's `StatusBadge` component for severity and status badges
- Display violation types: `unauthorized_qr_scan`, `face_verification_mismatch`, `multiple_fail_attempt`, `expired_visitor_qr_code`
- Show severity badges: `low`, `medium`, `high`, `critical`
- Show resolution status: `resolved: false` (New/Investigating), `resolved: true` (Acknowledged)
- Handle `unauthorized_qr_scan` violations (subject: null) - show "Unknown Individual"
- Add acknowledge (marks as resolved) and investigate (opens details modal) actions
- Connect to WebSocket for real-time violation updates (uses Dev-B's own AlertContext and wsMock)
- Integrate with Dev-B's apiMock for violations data

### 11. Styling & Polish (UI/UX) - **Both Developers**

- **Dev-A**: Apply Tailwind styling to Police Portal, Admin Login, Admin Dashboard, Admin Live Scan
- **Dev-B**: Apply Tailwind styling to Admin Visitor Management, Admin Scan Logs, Admin Alerts, Common Components
- Both developers: Add animations and transitions to their respective pages
- Both developers: Ensure responsive design for their pages
- Both developers: Add loading states and error handling
- Coordinate to ensure consistent styling across the application

### 12. Testing & Demo Prep (Finalization) - **Both Developers**

- **Dev-A**: Test Police Portal flows, Admin Login, Admin Dashboard, Admin Live Scan
- **Dev-B**: Test Admin Visitor Management, Admin Scan Logs, Admin Alerts
- **Both**: Test integration between portals (alerts, authentication)
- **Dev-B**: Verify mock data displays correctly across all pages
- **Dev-A**: Ensure alerts trigger properly in Police Portal (using Dev-B's AlertContext)
- **Dev-B**: Test visitor QR generation and scanning flow
- **Both**: Prepare demo scenarios with sample data
- **Both**: Cross-test each other's pages for integration issues

## Implementation Checklist

### Dev-A Checklist

- [ ] Setup & Routing (App.jsx)
- [ ] AuthContext (JWT token management)
- [ ] Police Portal - PoliceDashboard page
- [ ] Police Portal - QRScanner component
- [ ] Police Portal - CameraPreview component
- [ ] Police Portal - AlertDisplay component
- [ ] Admin Portal - Login page + LoginForm component
- [ ] Admin Portal - Dashboard page
- [ ] Admin Portal - Live Scan page
- [ ] Admin Portal - QRScanner component (for Live Scan)
- [ ] Admin Portal - CameraPreview component (for Live Scan)
- [ ] Styling & Polish (Dev-A's pages)
- [ ] Testing (Dev-A's pages)

### Dev-B Checklist

- [ ] Constants & Mock Data (constants.js, mockData.js)
- [ ] Mock Services - apiMock.js (all endpoints)
- [ ] Mock Services - faceMatchMock.js
- [ ] Mock Services - qrGenerator.js
- [ ] Mock Services - wsMock.js
- [ ] AlertContext (violation state, WebSocket)
- [ ] Common Components - Sidebar
- [ ] Common Components - Header
- [ ] Common Components - MetricCard
- [ ] Common Components - StatusBadge
- [ ] Admin Portal - Visitor Management page
- [ ] Admin Portal - VisitorForm component
- [ ] Admin Portal - QRCodeDisplay component
- [ ] Admin Portal - Scan Logs page
- [ ] Admin Portal - FilterBar component
- [ ] Admin Portal - LogsTable component
- [ ] Admin Portal - Alerts page
- [ ] Admin Portal - AlertCard component
- [ ] Styling & Polish (Dev-B's pages and components)
- [ ] Testing (Dev-B's pages)

### Integration Checklist (Both Developers)

- [ ] Verify Dev-A's pages use Dev-B's common components correctly
- [ ] Verify Dev-A's pages use Dev-B's mock services correctly
- [ ] Verify Dev-B's pages use Dev-A's AuthContext correctly
- [ ] Verify Police Portal uses Dev-B's AlertContext correctly
- [ ] Cross-test all flows end-to-end
- [ ] Verify styling consistency across portals
- [ ] Prepare demo scenarios

---

_Document Version: 1.0.0_  
_Last Updated: January 2026_  
_Based on API Contract Document v1.1.0_
