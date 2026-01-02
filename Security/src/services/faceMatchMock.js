import {
  FACE_VERIFICATION_MISMATCH,
  MULTIPLE_FAIL_ATTEMPT,
} from "../utils/constants.js";

// Track failed attempts per subject
const failedAttempts = new Map(); // subjectId -> { count, firstAttempt, lastAttempt }

/**
 * Simulates face matching with configurable delay
 * @param {string} subjectId - ID of the subject
 * @param {string} subjectType - Type of subject: "student", "staff", or "visitor"
 * @param {string} faceImage - Base64 encoded face image
 * @param {number} delay - Delay in milliseconds (default: 1500)
 * @returns {Promise<object>} Verification result matching API contract
 */
export const simulateFaceMatch = async (
  subjectId,
  subjectType,
  faceImage,
  delay = 1500
) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Check for multiple failed attempts (3+ failures in 5 minutes)
  const now = new Date();
  const attemptKey = subjectId;
  const attemptData = failedAttempts.get(attemptKey) || {
    count: 0,
    firstAttempt: now,
    lastAttempt: now,
  };

  // Reset if more than 5 minutes since first attempt
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  if (attemptData.firstAttempt < fiveMinutesAgo) {
    attemptData.count = 0;
    attemptData.firstAttempt = now;
  }

  // Simulate verification result (80% success rate for demo)
  const isMatch = Math.random() > 0.2;

  if (isMatch) {
    // Success - reset failed attempts
    failedAttempts.delete(attemptKey);
    return {
      status: "success",
      data: {
        verified: true,
        confidence: 0.85 + Math.random() * 0.1, // 0.85 to 0.95
        accessGranted: true,
        message: "Face verification successful",
      },
    };
  } else {
    // Failure - increment attempt count
    attemptData.count += 1;
    attemptData.lastAttempt = now;
    failedAttempts.set(attemptKey, attemptData);

    // Check for multiple failures
    if (attemptData.count >= 3) {
      const lockoutUntil = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes lockout
      return {
        status: "success",
        data: {
          verified: false,
          accessGranted: false,
          violationType: MULTIPLE_FAIL_ATTEMPT,
          message: `Access blocked: ${attemptData.count}+ verification failures in 5 minutes`,
          violationId: `vio_${Date.now()}_${subjectId}`,
          lockoutUntil: lockoutUntil.toISOString(),
          failedAttemptCount: attemptData.count,
          confidence: 0.2 + Math.random() * 0.15, // 0.2 to 0.35
          subject: {
            id: subjectId,
            name: "Subject Name", // Will be filled by caller
            type: subjectType,
          },
        },
      };
    }

    // Single failure - face mismatch
    return {
      status: "success",
      data: {
        verified: false,
        confidence: 0.25 + Math.random() * 0.15, // 0.25 to 0.40
        accessGranted: false,
        violationType: FACE_VERIFICATION_MISMATCH,
        message: "Face does not match enrolled photo",
        violationId: `vio_${Date.now()}_${subjectId}`,
        subject: {
          id: subjectId,
          name: "Subject Name", // Will be filled by caller
          type: subjectType,
        },
      },
    };
  }
};

/**
 * Reset failed attempts for a subject (for testing)
 * @param {string} subjectId - ID of the subject
 */
export const resetFailedAttempts = (subjectId) => {
  failedAttempts.delete(subjectId);
};

/**
 * Get current failed attempt count for a subject
 * @param {string} subjectId - ID of the subject
 * @returns {number} Failed attempt count
 */
export const getFailedAttemptCount = (subjectId) => {
  const attemptData = failedAttempts.get(subjectId);
  return attemptData ? attemptData.count : 0;
};

