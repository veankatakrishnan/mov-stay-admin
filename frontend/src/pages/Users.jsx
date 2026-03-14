import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../components/dashboard/DataTable';

const Users = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${baseURL}/admin/data/users?page=${page}&limit=${limit}`);
      setData(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: "Name", accessor: "name", render: (row) => <span className="font-medium text-gray-800">{row.name}</span> },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role", render: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize 
        ${row.role === 'admin' ? 'bg-red-100 text-red-700' : 
          row.role === 'owner' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
        {row.role}
      </span>
    )},
    { header: "Joined On", accessor: "createdAt", render: (row) => new Date(row.createdAt).toLocaleDateString() }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <p className="text-gray-500 mt-1 text-sm">View and manage all registered platform users.</p>
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

export default Users;
