import React from "react";
import { QRCodeSVG } from "qrcode.react";

/**
 * QRCodeDisplay Component
 * Displays visitor QR code with details
 * @param {object} visitorPass - Visitor pass object with QR code data
 */
const QRCodeDisplay = ({ visitorPass }) => {
  if (!visitorPass) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Visitor Access QR Code</h2>
      <p className="text-sm text-gray-600 mb-6">Details for temporary access</p>

      {/* Visitor Info */}
      <div className="space-y-3 mb-6">
        <div>
          <p className="text-sm text-gray-500">Visitor Name:</p>
          <p className="text-base font-semibold text-gray-900">{visitorPass.visitorName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Purpose of Visit:</p>
          <p className="text-base font-semibold text-gray-900">{visitorPass.purpose}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status:</p>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Active
          </span>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-white border-2 border-purple-200 rounded-lg">
          <QRCodeSVG
            value={visitorPass.qrCode.content}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>

      {/* Access Details */}
      <div className="space-y-2 mb-6">
        <div>
          <p className="text-sm text-gray-500">Access ID:</p>
          <p className="text-base font-semibold text-gray-900">{visitorPass.passId}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Valid From:</p>
          <p className="text-base font-semibold text-gray-900">{formatDate(visitorPass.validFrom)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Valid Until:</p>
          <p className="text-base font-semibold text-gray-900">{formatDate(visitorPass.validUntil)}</p>
        </div>
      </div>

      {/* Print Button */}
      <button
        onClick={() => window.print()}
        className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
      >
        Print
      </button>
    </div>
  );
};

export default QRCodeDisplay;

