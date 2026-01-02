import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar.jsx";
import Header from "../../components/common/Header.jsx";
import FilterBar from "../../components/admin/FilterBar.jsx";
import LogsTable from "../../components/admin/LogsTable.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useAlert } from "../../context/AlertContext.jsx";

const ScanLogs = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { fetchViolations, violations, loading } = useAlert();
  const [filters, setFilters] = useState({
    search: "",
    date: "",
    type: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadViolations();
  }, [filters]);

  const loadViolations = async () => {
    const queryParams = {
      page: filters.page,
      limit: filters.limit,
    };

    if (filters.type) {
      queryParams.type = filters.type;
    }

    if (filters.date) {
      const startDate = new Date(filters.date);
      startDate.setHours(0, 0, 0, 0);
      queryParams.startDate = startDate.toISOString();
      
      const endDate = new Date(filters.date);
      endDate.setHours(23, 59, 59, 999);
      queryParams.endDate = endDate.toISOString();
    }

    const result = await fetchViolations(queryParams);
    if (result.success) {
      setPagination(result.pagination);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 }); // Reset to page 1 when filters change
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  const handleExport = () => {
    alert("Export functionality will be implemented in production");
  };

  // Filter violations by search query
  const filteredViolations = filters.search
    ? violations.filter(
        (v) =>
          (v.subject?.name || "").toLowerCase().includes(filters.search.toLowerCase()) ||
          v.id.toLowerCase().includes(filters.search.toLowerCase())
      )
    : violations;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <Header user={user} onLogout={handleLogout} />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Scan Logs</h1>

          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onExport={handleExport}
          />

          <LogsTable
            violations={filteredViolations}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
};

export default ScanLogs;
