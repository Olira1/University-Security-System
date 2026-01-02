import {
  UNAUTHORIZED_QR_SCAN,
  EXPIRED_VISITOR_QR_CODE,
  FACE_VERIFICATION_MISMATCH,
  MULTIPLE_FAIL_ATTEMPT,
  SUBJECT_STUDENT,
  SUBJECT_STAFF,
  SUBJECT_VISITOR,
  ERROR_INVALID_CREDENTIALS,
  ERROR_ACCOUNT_LOCKED,
  ERROR_UNAUTHORIZED,
  ERROR_VALIDATION_ERROR,
} from "../utils/constants.js";
import {
  MOCK_STUDENTS,
  MOCK_STAFF,
  MOCK_VISITORS,
  MOCK_GATES,
  MOCK_EMPLOYEES,
  MOCK_VIOLATIONS,
  MOCK_QR_CODES,
  getStudentByQR,
  getStaffByQR,
  getVisitorByQR,
  getGateById,
  getEmployeeById,
} from "../utils/mockData.js";
import { generateQRCodeData } from "./qrGenerator.js";
import { simulateFaceMatch } from "./faceMatchMock.js";
import wsMock from "./wsMock.js";

// Mock JWT token storage
let currentToken = null;
let currentUser = null;

// Mock users for authentication
const MOCK_USERS = [
  {
    id: "usr_abc123",
    employeeId: "EMP-2024-001",
    name: "John Smith",
    email: "john.smith@campus.edu",
    role: "security_officer",
    department: "Campus Security",
    password: "password123", // Mock password
  },
  {
    id: "usr_def456",
    employeeId: "EMP-2024-002",
    name: "Jane Doe",
    email: "jane.doe@campus.edu",
    role: "security_supervisor",
    department: "Campus Security",
    password: "password123",
  },
];

/**
 * Simulate network delay
 */
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate mock JWT token
 */
const generateToken = () => {
  return `mock_jwt_token_${Date.now()}_${Math.random()
    .toString(36)
    .substring(7)}`;
};

/**
 * Validate JWT token
 */
const validateToken = (token) => {
  return token && token.startsWith("mock_jwt_token_");
};

// ============================================================================
// Authentication Endpoints
// ============================================================================

/**
 * POST /api/v1/auth/login
 * Login with employee credentials
 */
export const login = async (employeeId, password) => {
  await delay(800);

  // #region agent log
  fetch("http://127.0.0.1:7243/ingest/63f021bc-fe02-4570-9406-864c4dc43516", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "apiMock.js:login",
      message: "Login called with credentials",
      data: {
        employeeId,
        passwordLength: password?.length,
        availableIds: MOCK_USERS.map((u) => u.employeeId),
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      hypothesisId: "A,B,C",
    }),
  }).catch(() => {});
  // #endregion

  const user = MOCK_USERS.find(
    (u) => u.employeeId === employeeId && u.password === password
  );

  // #region agent log
  fetch("http://127.0.0.1:7243/ingest/63f021bc-fe02-4570-9406-864c4dc43516", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "apiMock.js:login:find",
      message: "User find result",
      data: {
        userFound: !!user,
        employeeIdMatch: MOCK_USERS.some((u) => u.employeeId === employeeId),
        passwordMatch: MOCK_USERS.some((u) => u.password === password),
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      hypothesisId: "C,D",
    }),
  }).catch(() => {});
  // #endregion

  if (!user) {
    return {
      status: "error",
      code: ERROR_INVALID_CREDENTIALS,
      message: "Invalid employee ID or password",
    };
  }

  // Mock account lockout check (for demo, use EMP-2024-003 to trigger lockout)
  if (employeeId === "EMP-2024-003") {
    return {
      status: "error",
      code: ERROR_ACCOUNT_LOCKED,
      message:
        "Account locked due to multiple failed attempts. Try again in 15 minutes.",
    };
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

  currentToken = token;
  currentUser = { ...user };
  delete currentUser.password;

  return {
    status: "success",
    data: {
      token,
      expiresAt,
      user: {
        id: user.id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  };
};

/**
 * GET /api/v1/auth/me
 * Get current authenticated user information
 */
export const getMe = async (token) => {
  await delay(300);

  if (!validateToken(token)) {
    return {
      status: "error",
      code: ERROR_UNAUTHORIZED,
      message: "Invalid or expired authentication token",
    };
  }

  if (!currentUser) {
    return {
      status: "error",
      code: ERROR_UNAUTHORIZED,
      message: "Invalid or expired authentication token",
    };
  }

  return {
    status: "success",
    data: {
      ...currentUser,
      createdAt: "2024-03-15T08:00:00Z",
      lastLoginAt: new Date().toISOString(),
    },
  };
};

// ============================================================================
// Gate Scanning Endpoints (Public - No Auth)
// ============================================================================

/**
 * POST /api/v1/scan/qr
 * Validate a QR code at a gate
 */
export const scanQR = async (qrCode, gateId, scanTimestamp) => {
  await delay(600);

  // Check if QR code is invalid
  if (
    !qrCode ||
    qrCode === MOCK_QR_CODES.invalidQR ||
    (!qrCode.startsWith("QR-STU-") &&
      !qrCode.startsWith("QR-STF-") &&
      !qrCode.startsWith("QR-VIS-"))
  ) {
    const violationId = `vio_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;
    const gate = getGateById(gateId);

    // Send WebSocket alert
    wsMock.sendAlert({
      violationId,
      violationType: UNAUTHORIZED_QR_SCAN,
      severity: "high",
      gate: gate || {
        id: gateId,
        name: "Unknown Gate",
        location: "Unknown Location",
      },
      message: "Invalid or tampered QR code",
      subject: null,
      capturedImageUrl: `https://cdn.campus-security.example.com/captures/${violationId}.jpg`,
    });

    return {
      status: "success",
      data: {
        valid: false,
        accessGranted: false,
        violationType: UNAUTHORIZED_QR_SCAN,
        message: "Invalid or tampered QR code",
        violationId,
        subjectPersisted: false,
      },
    };
  }

  // Check for student QR
  if (qrCode.startsWith("QR-STU-")) {
    const student = getStudentByQR(qrCode) || MOCK_STUDENTS[0];
    return {
      status: "success",
      data: {
        valid: true,
        subjectType: SUBJECT_STUDENT,
        subject: {
          id: student.id,
          name: student.name,
          photoUrl: student.photoUrl,
          department: student.department,
          enrollmentStatus: student.enrollmentStatus,
        },
        accessGranted: true,
        message: "Access granted",
        requiresFaceVerification: true,
      },
    };
  }

  // Check for staff QR
  if (qrCode.startsWith("QR-STF-")) {
    const staff = getStaffByQR(qrCode) || MOCK_STAFF[0];
    return {
      status: "success",
      data: {
        valid: true,
        subjectType: SUBJECT_STAFF,
        subject: {
          id: staff.id,
          name: staff.name,
          photoUrl: staff.photoUrl,
          department: staff.department,
          position: staff.position,
          employmentStatus: staff.employmentStatus,
        },
        accessGranted: true,
        message: "Access granted",
        requiresFaceVerification: true,
      },
    };
  }

  // Check for visitor QR
  if (qrCode.startsWith("QR-VIS-")) {
    const visitor = getVisitorByQR(qrCode);

    if (!visitor) {
      // Unknown visitor QR
      const violationId = `vio_${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}`;
      return {
        status: "success",
        data: {
          valid: false,
          accessGranted: false,
          violationType: UNAUTHORIZED_QR_SCAN,
          message: "Invalid or tampered QR code",
          violationId,
          subjectPersisted: false,
        },
      };
    }

    // Check if visitor pass is expired
    const now = new Date();
    const validUntil = new Date(visitor.validUntil);

    if (now > validUntil) {
      const violationId = `vio_${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}`;
      const gate = getGateById(gateId);

      // Send WebSocket alert
      wsMock.sendAlert({
        violationId,
        violationType: EXPIRED_VISITOR_QR_CODE,
        severity: "medium",
        gate: gate || {
          id: gateId,
          name: "Unknown Gate",
          location: "Unknown Location",
        },
        message: "Visitor pass has expired",
        subject: {
          id: visitor.id,
          name: visitor.name,
          type: SUBJECT_VISITOR,
        },
        capturedImageUrl: `https://cdn.campus-security.example.com/captures/${violationId}.jpg`,
      });

      return {
        status: "success",
        data: {
          valid: false,
          accessGranted: false,
          violationType: EXPIRED_VISITOR_QR_CODE,
          message: "Visitor pass has expired",
          violationId,
          subjectPersisted: true,
          subject: {
            id: visitor.id,
            name: visitor.name,
            validUntil: visitor.validUntil,
          },
        },
      };
    }

    // Valid visitor pass
    return {
      status: "success",
      data: {
        valid: true,
        subjectType: SUBJECT_VISITOR,
        subject: {
          id: visitor.id,
          name: visitor.name,
          photoUrl: visitor.photoUrl,
          purpose: visitor.purpose,
          hostName: visitor.hostName,
          hostDepartment: visitor.hostDepartment,
          validFrom: visitor.validFrom,
          validUntil: visitor.validUntil,
        },
        accessGranted: true,
        message: "Visitor pass valid",
        requiresFaceVerification: false,
      },
    };
  }

  // Default: invalid QR
  const violationId = `vio_${Date.now()}_${Math.random()
    .toString(36)
    .substring(7)}`;
  return {
    status: "success",
    data: {
      valid: false,
      accessGranted: false,
      violationType: UNAUTHORIZED_QR_SCAN,
      message: "Invalid or tampered QR code",
      violationId,
      subjectPersisted: false,
    },
  };
};

/**
 * POST /api/v1/face/verify
 * Verify a captured face against the enrolled photo
 */
export const verifyFace = async (
  subjectId,
  subjectType,
  faceImage,
  gateId,
  scanTimestamp
) => {
  await delay(1200); // Simulate face verification delay

  // Get subject info for response
  let subjectInfo = null;
  if (subjectType === SUBJECT_STUDENT) {
    subjectInfo = MOCK_STUDENTS.find((s) => s.id === subjectId);
  } else if (subjectType === SUBJECT_STAFF) {
    subjectInfo = MOCK_STAFF.find((s) => s.id === subjectId);
  }

  // Use faceMatchMock to simulate verification
  const result = await simulateFaceMatch(subjectId, subjectType, faceImage, 0); // Already delayed above

  // If violation occurred, send WebSocket alert
  if (
    result.data.violationType === FACE_VERIFICATION_MISMATCH ||
    result.data.violationType === MULTIPLE_FAIL_ATTEMPT
  ) {
    const gate = getGateById(gateId);
    const violationId = result.data.violationId;

    wsMock.sendAlert({
      violationId,
      violationType: result.data.violationType,
      severity:
        result.data.violationType === MULTIPLE_FAIL_ATTEMPT
          ? "critical"
          : "high",
      gate: gate || {
        id: gateId,
        name: "Unknown Gate",
        location: "Unknown Location",
      },
      message: result.data.message,
      subject: {
        id: subjectId,
        name: subjectInfo?.name || "Unknown",
        type: subjectType,
        photoUrl: subjectInfo?.photoUrl || null,
      },
      capturedImageUrl: `https://cdn.campus-security.example.com/captures/${violationId}.jpg`,
      confidence: result.data.confidence,
      ...(result.data.lockoutUntil && {
        lockoutUntil: result.data.lockoutUntil,
        failedAttemptCount: result.data.failedAttemptCount,
      }),
    });
  }

  // Add subject info to response if available
  if (subjectInfo && result.data.subject) {
    result.data.subject.name = subjectInfo.name;
    if (subjectInfo.photoUrl) {
      result.data.subject.photoUrl = subjectInfo.photoUrl;
    }
  }

  return result;
};

// ============================================================================
// Dashboard Endpoints (Auth Required)
// ============================================================================

/**
 * GET /api/v1/violations
 * List violation history with optional filters
 */
export const getViolations = async (queryParams = {}, token) => {
  await delay(500);

  if (!validateToken(token)) {
    return {
      status: "error",
      code: ERROR_UNAUTHORIZED,
      message: "Invalid or expired authentication token",
    };
  }

  let filteredViolations = [...MOCK_VIOLATIONS];

  // Filter by type
  if (queryParams.type) {
    filteredViolations = filteredViolations.filter(
      (v) => v.type === queryParams.type
    );
  }

  // Filter by subjectType
  if (queryParams.subjectType) {
    filteredViolations = filteredViolations.filter(
      (v) => v.subjectType === queryParams.subjectType
    );
  }

  // Filter by gateId
  if (queryParams.gateId) {
    filteredViolations = filteredViolations.filter(
      (v) => v.gateId === queryParams.gateId
    );
  }

  // Filter by date range
  if (queryParams.startDate) {
    const startDate = new Date(queryParams.startDate);
    filteredViolations = filteredViolations.filter(
      (v) => new Date(v.occurredAt) >= startDate
    );
  }

  if (queryParams.endDate) {
    const endDate = new Date(queryParams.endDate);
    filteredViolations = filteredViolations.filter(
      (v) => new Date(v.occurredAt) <= endDate
    );
  }

  // Filter by resolved status
  if (queryParams.resolved !== undefined) {
    const resolved =
      queryParams.resolved === "true" || queryParams.resolved === true;
    filteredViolations = filteredViolations.filter(
      (v) => v.resolved === resolved
    );
  }

  // Pagination
  const page = parseInt(queryParams.page) || 1;
  const limit = Math.min(parseInt(queryParams.limit) || 20, 100);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedViolations = filteredViolations.slice(startIndex, endIndex);

  const totalItems = filteredViolations.length;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    status: "success",
    data: {
      violations: paginatedViolations,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  };
};

/**
 * POST /api/v1/visitors/passes
 * Create a new visitor pass with QR code
 */
export const createVisitorPass = async (visitorData, token) => {
  await delay(800);

  if (!validateToken(token)) {
    return {
      status: "error",
      code: ERROR_UNAUTHORIZED,
      message: "Invalid or expired authentication token",
    };
  }

  // Validation
  const errors = [];

  if (!visitorData.visitorName) {
    errors.push({ field: "visitorName", message: "Visitor name is required" });
  }

  if (!visitorData.purpose) {
    errors.push({ field: "purpose", message: "Purpose is required" });
  }

  if (!visitorData.hostEmployeeId) {
    errors.push({
      field: "hostEmployeeId",
      message: "Host employee ID is required",
    });
  }

  // Validate host exists
  const host = getEmployeeById(visitorData.hostEmployeeId);
  if (!host) {
    errors.push({
      field: "hostEmployeeId",
      message: "Employee not found or inactive",
    });
  }

  // Validate dates
  if (!visitorData.validFrom || !visitorData.validUntil) {
    errors.push({
      field: "validFrom",
      message: "Valid from and until dates are required",
    });
  } else {
    const validFrom = new Date(visitorData.validFrom);
    const validUntil = new Date(visitorData.validUntil);
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // validFrom must be future or within last hour
    if (validFrom < oneHourAgo) {
      errors.push({
        field: "validFrom",
        message: "Start time must be in the future or within the last hour",
      });
    }

    // validUntil must be after validFrom
    if (validUntil <= validFrom) {
      errors.push({
        field: "validUntil",
        message: "End time must be after start time",
      });
    }

    // Max 24h duration
    const durationHours = (validUntil - validFrom) / (1000 * 60 * 60);
    if (durationHours > 24) {
      errors.push({
        field: "validUntil",
        message: "Maximum pass duration is 24 hours",
      });
    }
  }

  if (errors.length > 0) {
    return {
      status: "error",
      code: ERROR_VALIDATION_ERROR,
      message: "Validation failed",
      details: errors,
    };
  }

  // Generate visitor pass
  const passId = `vis_pass_${Date.now()}_${Math.random()
    .toString(36)
    .substring(7)}`;
  const qrCodeData = generateQRCodeData(passId, "visitor");

  // Get gate info for allowed gates
  const allowedGates = visitorData.allowedGates
    ? visitorData.allowedGates.map((gateId) => {
        const gate = getGateById(gateId);
        return gate
          ? { id: gate.id, name: gate.name }
          : { id: gateId, name: "Unknown Gate" };
      })
    : MOCK_GATES.map((g) => ({ id: g.id, name: g.name }));

  const visitorPass = {
    passId,
    visitorName: visitorData.visitorName,
    visitorEmail: visitorData.visitorEmail || null,
    visitorPhone: visitorData.visitorPhone || null,
    purpose: visitorData.purpose,
    host: {
      employeeId: host.employeeId,
      name: host.name,
      department: host.department,
      email: host.email,
    },
    validFrom: visitorData.validFrom,
    validUntil: visitorData.validUntil,
    allowedGates,
    qrCode: qrCodeData,
    createdAt: new Date().toISOString(),
    createdBy: {
      id: currentUser?.id || "usr_abc123",
      name: currentUser?.name || "System",
    },
    notes: visitorData.notes || null,
  };

  // Add to mock visitors list (for demo)
  MOCK_VISITORS.push({
    id: passId,
    name: visitorData.visitorName,
    photoUrl: null,
    purpose: visitorData.purpose,
    hostName: host.name,
    hostDepartment: host.department,
    validFrom: visitorData.validFrom,
    validUntil: visitorData.validUntil,
  });

  return {
    status: "success",
    data: visitorPass,
  };
};

/**
 * Get dashboard statistics
 * (Not in API contract, but needed for dashboard)
 */
export const getDashboardStats = async (token) => {
  await delay(400);

  if (!validateToken(token)) {
    return {
      status: "error",
      code: ERROR_UNAUTHORIZED,
      message: "Invalid or expired authentication token",
    };
  }

  // Mock statistics
  return {
    status: "success",
    data: {
      totalEntries: 1245,
      totalVehicles: 389,
      totalVisitors: 56,
      entriesChange: 12.5,
      vehiclesChange: 8.1,
      visitorsChange: 0.0,
      recentScans: [
        {
          time: "10:32 AM",
          event: "Person",
          identity: "Alice Smith (Staff)",
          status: "Granted",
        },
        {
          time: "10:30 AM",
          event: "Vehicle",
          identity: "SUV (License: ABC 123)",
          status: "Granted",
        },
        {
          time: "10:28 AM",
          event: "Person",
          identity: "John Doe (Visitor)",
          status: "Denied",
        },
        {
          time: "10:25 AM",
          event: "Vehicle",
          identity: "Sedan (License: XYZ 789)",
          status: "Granted",
        },
        {
          time: "10:22 AM",
          event: "Person",
          identity: "Maria Garcia (Student)",
          status: "Granted",
        },
      ],
    },
  };
};

// Export all API functions
export default {
  login,
  getMe,
  scanQR,
  verifyFace,
  getViolations,
  createVisitorPass,
  getDashboardStats,
};
