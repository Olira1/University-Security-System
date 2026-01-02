import React, { useState } from "react";
import { scanQR } from "../../services/apiMock.js";
import { GATE_MAIN_ENTRANCE } from "../../utils/constants.js";

/**
 * QRScanner Component (Admin Portal)
 * QR scanning component for admin live scan page
 * @param {function} onQRScanned - Callback when QR is scanned
 * @param {function} onError - Callback for errors
 */
const QRScanner = ({ onQRScanned, onError }) => {
  const [scanning, setScanning] = useState(false);
  const [manualQR, setManualQR] = useState("");

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

  return (
    <div className="space-y-4">
      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <input
          type="text"
          value={manualQR}
          onChange={(e) => setManualQR(e.target.value)}
          placeholder="Scan or enter QR code..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
          disabled={scanning}
        />
        <button
          type="submit"
          disabled={scanning || !manualQR.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {scanning ? "Scanning..." : "Scan"}
        </button>
      </form>

      {/* Demo QR Codes */}
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
      </div>
    </div>
  );
};

export default QRScanner;

