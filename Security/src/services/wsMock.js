import {
  UNAUTHORIZED_QR_SCAN,
  FACE_VERIFICATION_MISMATCH,
  MULTIPLE_FAIL_ATTEMPT,
  EXPIRED_VISITOR_QR_CODE,
  SEVERITY_HIGH,
  SEVERITY_MEDIUM,
  SEVERITY_CRITICAL,
} from "../utils/constants.js";

class WebSocketMock {
  constructor() {
    this.listeners = [];
    this.connected = false;
    this.heartbeatInterval = null;
    this.autoAlertInterval = null;
  }

  /**
   * Connect to WebSocket (mock)
   */
  connect() {
    if (this.connected) return;

    this.connected = true;
    console.log("WebSocket Mock: Connected to alerts stream");

    // Start heartbeat
    this.startHeartbeat();

    // Simulate periodic violation alerts for demo
    this.startAutoAlerts();
  }

  /**
   * Disconnect from WebSocket (mock)
   */
  disconnect() {
    this.connected = false;
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.autoAlertInterval) {
      clearInterval(this.autoAlertInterval);
      this.autoAlertInterval = null;
    }
    console.log("WebSocket Mock: Disconnected from alerts stream");
  }

  /**
   * Subscribe to alert messages
   * @param {function} listener - Callback function to receive alerts
   */
  subscribe(listener) {
    if (typeof listener !== "function") {
      console.error("WebSocket Mock: Listener must be a function");
      return;
    }
    this.listeners.push(listener);
  }

  /**
   * Unsubscribe from alert messages
   * @param {function} listener - Callback function to remove
   */
  unsubscribe(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  /**
   * Send alert message to all subscribers
   * @param {object} alert - Alert message object
   */
  sendAlert(alert) {
    if (!this.connected) {
      console.warn("WebSocket Mock: Not connected, cannot send alert");
      return;
    }

    const message = {
      type: "violation_alert",
      timestamp: new Date().toISOString(),
      data: alert,
    };

    this.listeners.forEach((listener) => {
      try {
        listener(message);
      } catch (error) {
        console.error("WebSocket Mock: Error in listener", error);
      }
    });
  }

  /**
   * Start heartbeat messages
   */
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      const heartbeat = {
        type: "heartbeat",
        timestamp: new Date().toISOString(),
      };

      // Send heartbeat (optional - listeners can ignore)
      // In real implementation, server sends this
    }, 30000); // Every 30 seconds
  }

  /**
   * Start auto-generating alerts for demo purposes
   */
  startAutoAlerts() {
    // Generate random alerts every 30-60 seconds for demo
    this.autoAlertInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance to generate an alert
        this.generateRandomAlert();
      }
    }, 30000 + Math.random() * 30000); // 30-60 seconds
  }

  /**
   * Generate a random alert for demo
   */
  generateRandomAlert() {
    const alertTypes = [
      UNAUTHORIZED_QR_SCAN,
      FACE_VERIFICATION_MISMATCH,
      MULTIPLE_FAIL_ATTEMPT,
      EXPIRED_VISITOR_QR_CODE,
    ];

    const gates = [
      {
        id: "gate_main_entrance",
        name: "Main Entrance Gate",
        location: "Building A - North Side",
      },
      {
        id: "gate_library",
        name: "Library Gate",
        location: "Library Building - East Side",
      },
      {
        id: "gate_north_entrance",
        name: "North Entrance",
        location: "North Campus - Main Road",
      },
    ];

    const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const randomGate = gates[Math.floor(Math.random() * gates.length)];

    let alert = {
      violationId: `vio_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      violationType: randomType,
      severity: SEVERITY_HIGH,
      gate: randomGate,
      message: `Security violation detected at ${randomGate.name}`,
    };

    // Add subject info for non-unauthorized_qr_scan violations
    if (randomType !== UNAUTHORIZED_QR_SCAN) {
      alert.subject = {
        id: `stu_${Math.random().toString(36).substring(7)}`,
        name: "Demo Subject",
        type: "student",
        photoUrl: null,
      };
      alert.capturedImageUrl = `https://cdn.campus-security.example.com/captures/${alert.violationId}.jpg`;
    } else {
      alert.subject = null;
      alert.capturedImageUrl = `https://cdn.campus-security.example.com/captures/${alert.violationId}.jpg`;
    }

    this.sendAlert(alert);
  }
}

// Export singleton instance
const wsMock = new WebSocketMock();
export default wsMock;

