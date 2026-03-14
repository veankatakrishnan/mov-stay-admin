import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../components/dashboard/DataTable';

const Complaints = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchComplaints();
  }, [page]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${baseURL}/admin/data/complaints?page=${page}&limit=${limit}`);
      setData(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch complaints", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: "Date", accessor: "createdAt", render: (row) => new Date(row.createdAt).toLocaleDateString() },
    { header: "Student", accessor: "studentId", render: (row) => <span className="font-medium text-gray-800">{row.studentId?.name || '-'}</span> },
    { header: "PG Info", accessor: "pgId", render: (row) => row.pgId?.pgName || '-' },
    { header: "Complaint", accessor: "complaintText", render: (row) => (
      <span className="truncate block max-w-xs">{row.complaintText}</span>
    )},
    { header: "Status", accessor: "status", render: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium 
        ${row.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
        {row.status}
      </span>
    )}
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Support & Complaints</h2>
        <p className="text-gray-500 mt-1 text-sm">Monitor issues raised by students regarding PGs.</p>
      </div>
      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Complaints;
