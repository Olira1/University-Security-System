import React, { useState, useRef } from "react";
import { scanQR } from "../../services/apiMock.js";
import { GATE_MAIN_ENTRANCE } from "../../utils/constants.js";

/**
 * QRScanner Component (Police Portal)
 * QR scanning component for police dashboard
 * @param {function} onQRScanned - Callback when QR is scanned
 * @param {function} onError - Callback for errors
 */
const QRScanner = ({ onQRScanned, onError }) => {
  const [scanning, setScanning] = useState(false);
  const [manualQR, setManualQR] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef(null);

  const handleScan = async (qrCode) => {
    if (!qrCode || scanning) return;

    setScanning(true);
    try {
      const scanTimestamp = new Date().toISOString();
      const response = await scanQR(qrCode, GATE_MAIN_ENTRANCE, scanTimestamp);

      if (onQRScanned) {
        onQRScanned(response, qrCode);
      }
    } catch (error) {
      console.error("QR scan error:", error);
      if (onError) {
        onError(error);
      }
    } finally {
      setScanning(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualQR.trim()) {
      handleScan(manualQR.trim());
      setManualQR("");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real implementation, you would use a QR code reading library
      // For demo, we'll just show an alert
      alert("File upload QR scanning not implemented in demo. Please use manual input or camera.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        QR Code Scanner
      </h3>

      {/* Manual QR Input */}
      <div className="space-y-4">
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            value={manualQR}
            onChange={(e) => setManualQR(e.target.value)}
            placeholder="Enter QR code manually or scan..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
            disabled={scanning}
          />
          <button
            type="submit"
            disabled={scanning || !manualQR.trim()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {scanning ? "Scanning..." : "Scan"}
          </button>
        </form>

        {/* Camera Scanner Placeholder */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
            />
          </svg>
          <p className="text-gray-600 mb-2">
            Camera scanner (use react-qr-reader in production)
          </p>
          <p className="text-sm text-gray-500">
            For demo: Enter QR code manually above
          </p>
        </div>

        {/* Demo QR Codes */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Demo QR Codes:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleScan("QR-STU-2024-789XYZ")}
              className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
              disabled={scanning}
            >
              Valid Student
            </button>
            <button
              onClick={() => handleScan("QR-STF-2024-456ABC")}
              className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
              disabled={scanning}
            >
              Valid Staff
            </button>
            <button
              onClick={() => handleScan("QR-VIS-2026-456XYZ")}
              className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
              disabled={scanning}
            >
              Valid Visitor
            </button>
            <button
              onClick={() => handleScan("INVALID_QR_DATA_xyz")}
              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
              disabled={scanning}
            >
              Invalid QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;

