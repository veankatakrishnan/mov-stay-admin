import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../components/dashboard/DataTable';

const Matches = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchMatches();
  }, [page]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/admin/data/roommates?page=${page}&limit=${limit}`);
      setData(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch matches", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: "Student A", accessor: "studentA", render: (row) => <span className="font-medium text-gray-800">{row.studentA?.name || '-'}</span> },
    { header: "Student B", accessor: "studentB", render: (row) => <span className="font-medium text-gray-800">{row.studentB?.name || '-'}</span> },
    { header: "Score", accessor: "compatibilityScore", render: (row) => (
      <span className="font-bold text-blue-600">{row.compatibilityScore}%</span>
    )},
    { header: "Status", accessor: "status", render: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium 
        ${row.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' : 
          row.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
        {row.status}
      </span>
    )}
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Roommate Matches</h2>
        <p className="text-gray-500 mt-1 text-sm">Review AI-generated student matches and their status.</p>
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

export default Matches;
