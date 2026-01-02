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
export const GATE_MAIN_GATE_2 = "gate_main_gate_2";

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

