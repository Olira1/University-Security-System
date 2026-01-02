import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { verifyFace } from "../../services/apiMock.js";
import { GATE_MAIN_ENTRANCE } from "../../utils/constants.js";

/**
 * CameraPreview Component (Admin Portal)
 * Live camera feed for face verification in admin portal
 * @param {object} subject - Subject info from QR scan
 * @param {function} onFaceVerified - Callback when face is verified
 * @param {function} onFaceMismatch - Callback when face doesn't match
 */
const CameraPreview = ({ subject, onFaceVerified, onFaceMismatch }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [verificationMessage, setVerificationMessage] = useState("");
  const webcamRef = useRef(null);

  useEffect(() => {
    // Auto-capture when subject is available
    if (subject && subject.requiresFaceVerification && !isCapturing) {
      const timer = setTimeout(() => {
        captureAndVerify();
      }, 1000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  const captureAndVerify = async () => {
    if (!webcamRef.current || !subject) return;

    setIsCapturing(true);
    setVerificationStatus("verifying");
    setVerificationMessage("Verifying face...");

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (!imageSrc) {
        throw new Error("Failed to capture image");
      }

      const base64Image = imageSrc.split(",")[1] || imageSrc;
      const scanTimestamp = new Date().toISOString();
      
      const response = await verifyFace(
        subject.subject.id,
        subject.subjectType,
        base64Image,
        GATE_MAIN_ENTRANCE,
        scanTimestamp
      );

      if (response.status === "success") {
        const { data } = response;

        if (data.verified && data.accessGranted) {
          setVerificationStatus("success");
          setVerificationMessage("Face Matched");
          
          if (onFaceVerified) {
            onFaceVerified(data);
          }
        } else {
          setVerificationStatus("failed");
          setVerificationMessage("Face verification failed");
          
          if (onFaceMismatch) {
            onFaceMismatch(data);
          }
        }
      }
    } catch (error) {
      console.error("Face verification error:", error);
      setVerificationStatus("failed");
      setVerificationMessage("Error during face verification");
    } finally {
      setIsCapturing(false);
    }
  };

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  if (!subject) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[400px] border-2 border-dashed border-gray-300">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-600">Scan a QR code to start face verification</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full"
        />
        
        {/* Verification Overlay */}
        {verificationStatus === "success" && (
          <div className="absolute inset-0 bg-green-900 bg-opacity-75 flex items-center justify-center">
            <div className="text-center text-white">
              <svg
                className="w-24 h-24 mx-auto mb-4 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-2xl font-bold">{verificationMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* Welcome Message */}
      {verificationStatus === "success" && (
        <div className="text-center">
          <h2 className="text-4xl font-bold text-purple-600">Welcome</h2>
        </div>
      )}

      {/* Manual Capture Button */}
      {subject.requiresFaceVerification && !verificationStatus && (
        <button
          onClick={captureAndVerify}
          disabled={isCapturing}
          className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCapturing ? "Verifying..." : "Capture & Verify Face"}
        </button>
      )}
    </div>
  );
};

export default CameraPreview;

