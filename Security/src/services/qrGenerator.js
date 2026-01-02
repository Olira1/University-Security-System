import { QRCodeSVG } from "qrcode.react";

/**
 * Generates QR code content string based on pass ID and type
 * @param {string} passId - Unique pass identifier
 * @param {string} passType - Type of pass: "student", "staff", or "visitor"
 * @returns {string} QR code content string
 */
export const generateQRCode = (passId, passType) => {
  const year = new Date().getFullYear();
  const randomSuffix = Math.random().toString(36).substring(2, 11).toUpperCase();

  switch (passType) {
    case "student":
      return `QR-STU-${year}-${passId}${randomSuffix}`;
    case "staff":
      return `QR-STF-${year}-${passId}${randomSuffix}`;
    case "visitor":
      return `QR-VIS-${year}-${passId}${randomSuffix}`;
    default:
      return `QR-UNK-${year}-${passId}${randomSuffix}`;
  }
};

/**
 * Generates QR code image as base64 string
 * Note: qrcode.react generates SVG, so we'll convert it or use canvas
 * For now, returns the QR code content that can be used with QRCodeSVG component
 * @param {string} qrContent - QR code content string
 * @returns {string} Base64 encoded image data (or content for component use)
 */
export const generateQRImage = (qrContent) => {
  // For mock purposes, we'll return a data URL
  // In a real implementation, you might use a canvas-based QR generator
  // For now, components can use QRCodeSVG directly from qrcode.react
  
  // Return the content - components will use QRCodeSVG component
  return qrContent;
};

/**
 * Generates complete QR code data matching API contract format
 * @param {string} passId - Unique pass identifier
 * @param {string} passType - Type of pass
 * @returns {object} QR code object with content, imageUrl, and imageBase64
 */
export const generateQRCodeData = (passId, passType) => {
  const content = generateQRCode(passId, passType);
  
  return {
    content: content,
    imageUrl: `https://cdn.campus-security.example.com/qrcodes/${passId}.png`,
    imageBase64: content, // Components will use QRCodeSVG, so we pass content
  };
};

