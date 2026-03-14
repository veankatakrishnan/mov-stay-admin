import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../components/dashboard/DataTable';

const Listings = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchListings();
  }, [page]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/admin/data/listings?page=${page}&limit=${limit}`);
      setData(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch listings", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: "PG Name", accessor: "pgName", render: (row) => <span className="font-medium text-gray-800">{row.pgName}</span> },
    { header: "Location", accessor: "location" },
    { header: "Owner", accessor: "ownerId", render: (row) => row.ownerId ? row.ownerId.name : '-' },
    { header: "Rent", accessor: "rent", render: (row) => `₹${row.rent?.toLocaleString() || '0'}` },
    { header: "Status", accessor: "isActive", render: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium 
        ${row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
        {row.isActive ? 'Active' : 'Inactive'}
      </span>
    )},
    { header: "Rating", accessor: "ratingAverage", render: (row) => row.ratingAverage ? `${row.ratingAverage.toFixed(1)} ⭐` : '-' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">PG Listings</h2>
        <p className="text-gray-500 mt-1 text-sm">Monitor all properties registered on the platform.</p>
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

export default Listings;
