import {
  UNAUTHORIZED_QR_SCAN,
  FACE_VERIFICATION_MISMATCH,
  MULTIPLE_FAIL_ATTEMPT,
  EXPIRED_VISITOR_QR_CODE,
  SUBJECT_STUDENT,
  SUBJECT_STAFF,
  SUBJECT_VISITOR,
  SEVERITY_LOW,
  SEVERITY_MEDIUM,
  SEVERITY_HIGH,
  SEVERITY_CRITICAL,
  GATE_MAIN_ENTRANCE,
  GATE_LIBRARY,
  GATE_HR_BUILDING,
  GATE_NORTH_ENTRANCE,
  GATE_WEST_GATE,
  GATE_MAIN_GATE_2,
} from "./constants.js";

// Sample Students (matching API contract schema)
export const MOCK_STUDENTS = [
  {
    id: "stu_789xyz",
    name: "Alice Johnson",
    photoUrl: "https://cdn.campus-security.example.com/photos/stu_789xyz.jpg",
    department: "Computer Science",
    enrollmentStatus: "active",
  },
  {
    id: "stu_123abc",
    name: "Alex Johnson",
    photoUrl: "https://cdn.campus-security.example.com/photos/stu_123abc.jpg",
    department: "Computer Science",
    enrollmentStatus: "active",
  },
  {
    id: "stu_456def",
    name: "Maria Garcia",
    photoUrl: "https://cdn.campus-security.example.com/photos/stu_456def.jpg",
    department: "Engineering",
    enrollmentStatus: "active",
  },
  {
    id: "stu_789ghi",
    name: "John Doe",
    photoUrl: "https://cdn.campus-security.example.com/photos/stu_789ghi.jpg",
    department: "Business",
    enrollmentStatus: "active",
  },
];

// Sample Staff (matching API contract schema)
export const MOCK_STAFF = [
  {
    id: "stf_456abc",
    name: "Dr. Robert Chen",
    photoUrl: "https://cdn.campus-security.example.com/photos/stf_456abc.jpg",
    department: "Engineering",
    position: "Professor",
    employmentStatus: "active",
  },
  {
    id: "stf_789xyz",
    name: "Jane Smith",
    photoUrl: "https://cdn.campus-security.example.com/photos/stf_789xyz.jpg",
    department: "Computer Science",
    position: "Associate Professor",
    employmentStatus: "active",
  },
];

// Sample Visitors (matching API contract schema)
export const MOCK_VISITORS = [
  {
    id: "vis_pass_456",
    name: "Bob Williams",
    photoUrl: null,
    purpose: "Interview at HR Department",
    hostName: "Jane Doe",
    hostDepartment: "Human Resources",
    validFrom: "2026-01-02T09:00:00Z",
    validUntil: "2026-01-02T17:00:00Z",
  },
  {
    id: "vis_pass_789",
    name: "Alice Wonderland",
    photoUrl: null,
    purpose: "Vendor Meeting",
    hostName: "Bob Williams",
    hostDepartment: "Procurement",
    validFrom: "2026-01-20T09:00:00Z",
    validUntil: "2026-01-20T17:00:00Z",
  },
  {
    id: "vis_pass_123",
    name: "Bob The Builder",
    photoUrl: null,
    purpose: "Maintenance Work",
    hostName: "Alice Johnson",
    hostDepartment: "Facilities",
    validFrom: "2026-01-19T10:00:00Z",
    validUntil: "2026-01-19T18:00:00Z",
  },
  {
    id: "vis_pass_321",
    name: "Charlie",
    photoUrl: null,
    purpose: "Guest Lecture",
    hostName: "Bob Will",
    hostDepartment: "Academic Affairs",
    validFrom: "2026-01-21T11:00:00Z",
    validUntil: "2026-01-21T15:00:00Z",
  },
];

// Sample Gates (matching API contract schema)
export const MOCK_GATES = [
  {
    id: GATE_MAIN_ENTRANCE,
    name: "Main Entrance Gate",
    location: "Building A - North Side",
    status: "online",
  },
  {
    id: GATE_LIBRARY,
    name: "Library Gate",
    location: "Library Building - East Side",
    status: "online",
  },
  {
    id: GATE_HR_BUILDING,
    name: "HR Building Gate",
    location: "HR Building - South Side",
    status: "online",
  },
  {
    id: GATE_NORTH_ENTRANCE,
    name: "North Entrance",
    location: "North Campus - Main Road",
    status: "online",
  },
  {
    id: GATE_WEST_GATE,
    name: "West Gate",
    location: "West Campus - Parking Area",
    status: "online",
  },
  {
    id: GATE_MAIN_GATE_2,
    name: "Main Gate 2",
    location: "Building B - South Side",
    status: "online",
  },
];

// Sample Employees (for host selection in visitor management)
export const MOCK_EMPLOYEES = [
  {
    employeeId: "EMP-2024-001",
    name: "John Smith",
    department: "Campus Security",
    email: "john.smith@campus.edu",
  },
  {
    employeeId: "EMP-2024-015",
    name: "Jane Doe",
    department: "Human Resources",
    email: "jane.doe@campus.edu",
  },
  {
    employeeId: "EMP-2024-020",
    name: "Bob Williams",
    department: "Procurement",
    email: "bob.williams@campus.edu",
  },
  {
    employeeId: "EMP-2024-025",
    name: "Alice Johnson",
    department: "Facilities",
    email: "alice.johnson@campus.edu",
  },
  {
    employeeId: "EMP-2024-030",
    name: "Bob Will",
    department: "Academic Affairs",
    email: "bob.will@campus.edu",
  },
];

// Sample Violations (matching API contract schema)
export const MOCK_VIOLATIONS = [
  // Unauthorized QR Scan (subject: null)
  {
    id: "vio_abc123",
    type: UNAUTHORIZED_QR_SCAN,
    subjectType: null,
    subject: null,
    gateId: GATE_LIBRARY,
    gateName: "Library Gate",
    occurredAt: "2026-01-02T11:45:00Z",
    details: {
      scannedQrCode: "INVALID_QR_DATA_xyz",
      capturedImageUrl:
        "https://cdn.campus-security.example.com/captures/vio_abc123.jpg",
    },
    resolved: true,
    resolvedAt: "2026-01-02T12:00:00Z",
    resolvedBy: {
      id: "usr_abc123",
      name: "John Smith",
    },
    notes: "Investigated - student using old expired ID card",
    severity: SEVERITY_MEDIUM,
  },
  // Face Verification Mismatch (with subject info)
  {
    id: "vio_ghi789",
    type: FACE_VERIFICATION_MISMATCH,
    subjectType: SUBJECT_STUDENT,
    subject: {
      id: "stu_789xyz",
      name: "Alice Johnson",
      photoUrl:
        "https://cdn.campus-security.example.com/photos/stu_789xyz.jpg",
    },
    gateId: GATE_MAIN_ENTRANCE,
    gateName: "Main Entrance Gate",
    occurredAt: "2026-01-02T14:30:05Z",
    details: {
      confidence: 0.32,
      capturedImageUrl:
        "https://cdn.campus-security.example.com/captures/vio_ghi789.jpg",
    },
    resolved: false,
    resolvedAt: null,
    resolvedBy: null,
    notes: null,
    severity: SEVERITY_HIGH,
  },
  // Multiple Failed Attempts (with subject info and lockout)
  {
    id: "vio_jkl012",
    type: MULTIPLE_FAIL_ATTEMPT,
    subjectType: SUBJECT_STUDENT,
    subject: {
      id: "stu_789xyz",
      name: "Alice Johnson",
      photoUrl:
        "https://cdn.campus-security.example.com/photos/stu_789xyz.jpg",
    },
    gateId: GATE_NORTH_ENTRANCE,
    gateName: "North Entrance",
    occurredAt: "2026-01-02T09:15:00Z",
    details: {
      failedAttemptCount: 3,
      lockoutUntil: "2026-01-02T14:20:00Z",
      capturedImageUrl:
        "https://cdn.campus-security.example.com/captures/vio_jkl012.jpg",
    },
    resolved: false,
    resolvedAt: null,
    resolvedBy: null,
    notes: "Possible suspicious activity",
    severity: SEVERITY_HIGH,
  },
  // Expired Visitor QR Code (with subject info)
  {
    id: "vio_def456",
    type: EXPIRED_VISITOR_QR_CODE,
    subjectType: SUBJECT_VISITOR,
    subject: {
      id: "vis_pass_789",
      name: "Charlie Brown",
      validUntil: "2026-01-01T17:00:00Z",
    },
    gateId: GATE_MAIN_GATE_2,
    gateName: "Main Gate 2",
    occurredAt: "2026-01-25T17:00:00Z",
    details: {
      capturedImageUrl:
        "https://cdn.campus-security.example.com/captures/vio_def456.jpg",
    },
    resolved: true,
    resolvedAt: "2026-01-25T17:30:00Z",
    resolvedBy: {
      id: "usr_abc123",
      name: "John Smith",
    },
    notes: "Visitor pass expired",
    severity: SEVERITY_MEDIUM,
  },
  // Face Verification Mismatch - New (for alerts page)
  {
    id: "vio_new001",
    type: FACE_VERIFICATION_MISMATCH,
    subjectType: SUBJECT_STUDENT,
    subject: {
      id: "stu_123abc",
      name: "Alex Johnson",
      photoUrl:
        "https://cdn.campus-security.example.com/photos/stu_123abc.jpg",
    },
    gateId: GATE_WEST_GATE,
    gateName: "West Gate",
    occurredAt: "2026-01-02T08:40:00Z",
    details: {
      confidence: 0.28,
      capturedImageUrl:
        "https://cdn.campus-security.example.com/captures/vio_new001.jpg",
    },
    resolved: false,
    resolvedAt: null,
    resolvedBy: null,
    notes: null,
    severity: SEVERITY_HIGH,
  },
];

// Sample QR Codes for testing
export const MOCK_QR_CODES = {
  validStudent: "QR-STU-2024-789XYZ",
  validStaff: "QR-STF-2024-456ABC",
  validVisitor: "QR-VIS-2026-456XYZ",
  expiredVisitor: "QR-VIS-2026-789EXP",
  invalidQR: "INVALID_QR_DATA_xyz",
};

// Helper function to get student by QR code
export const getStudentByQR = (qrCode) => {
  if (qrCode === MOCK_QR_CODES.validStudent) {
    return MOCK_STUDENTS[0]; // Alice Johnson
  }
  return null;
};

// Helper function to get staff by QR code
export const getStaffByQR = (qrCode) => {
  if (qrCode === MOCK_QR_CODES.validStaff) {
    return MOCK_STAFF[0]; // Dr. Robert Chen
  }
  return null;
};

// Helper function to get visitor by QR code
export const getVisitorByQR = (qrCode) => {
  if (qrCode === MOCK_QR_CODES.validVisitor) {
    return MOCK_VISITORS[0]; // Bob Williams
  }
  if (qrCode === MOCK_QR_CODES.expiredVisitor) {
    return MOCK_VISITORS[3]; // Charlie (expired)
  }
  return null;
};

// Helper function to get gate by ID
export const getGateById = (gateId) => {
  return MOCK_GATES.find((gate) => gate.id === gateId) || null;
};

// Helper function to get employee by ID
export const getEmployeeById = (employeeId) => {
  return MOCK_EMPLOYEES.find(
    (emp) => emp.employeeId === employeeId
  ) || null;
};

// Helper function to get violation by ID
export const getViolationById = (violationId) => {
  return MOCK_VIOLATIONS.find((v) => v.id === violationId) || null;
};

