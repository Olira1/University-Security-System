import React, { useState } from "react";
import { createVisitorPass } from "../../services/apiMock.js";
import { MOCK_EMPLOYEES } from "../../utils/mockData.js";

/**
 * VisitorForm Component
 * Form for creating visitor QR codes
 * @param {function} onSuccess - Callback when visitor pass is created
 * @param {function} onError - Callback for errors
 */
const VisitorForm = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    visitorName: "",
    visitorEmail: "",
    visitorPhone: "",
    purpose: "",
    hostEmployeeId: "",
    validFrom: "",
    validUntil: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem("auth_token");
      const response = await createVisitorPass(formData, token);

      if (response.status === "error") {
        if (response.details) {
          const fieldErrors = {};
          response.details.forEach((detail) => {
            fieldErrors[detail.field] = detail.message;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: response.message });
        }
        if (onError) {
          onError(response);
        }
      } else {
        // Success
        if (onSuccess) {
          onSuccess(response.data);
        }
        // Reset form
        setFormData({
          visitorName: "",
          visitorEmail: "",
          visitorPhone: "",
          purpose: "",
          hostEmployeeId: "",
          validFrom: "",
          validUntil: "",
          notes: "",
        });
      }
    } catch (error) {
      console.error("Error creating visitor pass:", error);
      setErrors({ general: "An error occurred while creating the visitor pass" });
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Set default dates (today and tomorrow)
  const getDefaultDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    return {
      from: formatDate(today),
      until: formatDate(tomorrow),
    };
  };

  const defaultDates = getDefaultDates();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errors.general}
        </div>
      )}

      <div>
        <label htmlFor="visitorName" className="block text-sm font-medium text-gray-700 mb-1">
          Visitor Name *
        </label>
        <input
          id="visitorName"
          name="visitorName"
          type="text"
          value={formData.visitorName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
          placeholder="John Doe"
        />
        {errors.visitorName && (
          <p className="mt-1 text-sm text-red-600">{errors.visitorName}</p>
        )}
      </div>

      <div>
        <label htmlFor="visitorEmail" className="block text-sm font-medium text-gray-700 mb-1">
          Visitor Email
        </label>
        <input
          id="visitorEmail"
          name="visitorEmail"
          type="email"
          value={formData.visitorEmail}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
          placeholder="john.doe@email.com"
        />
      </div>

      <div>
        <label htmlFor="visitorPhone" className="block text-sm font-medium text-gray-700 mb-1">
          Visitor Phone
        </label>
        <input
          id="visitorPhone"
          name="visitorPhone"
          type="tel"
          value={formData.visitorPhone}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
          placeholder="+1-555-123-4567"
        />
      </div>

      <div>
        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
          Visiting Reason *
        </label>
        <input
          id="purpose"
          name="purpose"
          type="text"
          value={formData.purpose}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
          placeholder="For Training, Meeting..."
        />
        {errors.purpose && (
          <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
        )}
      </div>

      <div>
        <label htmlFor="hostEmployeeId" className="block text-sm font-medium text-gray-700 mb-1">
          Host *
        </label>
        <select
          id="hostEmployeeId"
          name="hostEmployeeId"
          value={formData.hostEmployeeId}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
        >
          <option value="">Select a host</option>
          {MOCK_EMPLOYEES.map((employee) => (
            <option key={employee.employeeId} value={employee.employeeId}>
              {employee.name} - {employee.department}
            </option>
          ))}
        </select>
        {errors.hostEmployeeId && (
          <p className="mt-1 text-sm text-red-600">{errors.hostEmployeeId}</p>
        )}
      </div>

      <div>
        <label htmlFor="validFrom" className="block text-sm font-medium text-gray-700 mb-1">
          Access Start *
        </label>
        <input
          id="validFrom"
          name="validFrom"
          type="datetime-local"
          value={formData.validFrom || defaultDates.from}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
        />
        {errors.validFrom && (
          <p className="mt-1 text-sm text-red-600">{errors.validFrom}</p>
        )}
      </div>

      <div>
        <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700 mb-1">
          Access End *
        </label>
        <input
          id="validUntil"
          name="validUntil"
          type="datetime-local"
          value={formData.validUntil || defaultDates.until}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
        />
        {errors.validUntil && (
          <p className="mt-1 text-sm text-red-600">{errors.validUntil}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
          placeholder="Additional notes..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Generating..." : "Generate QR Code"}
      </button>
    </form>
  );
};

export default VisitorForm;

