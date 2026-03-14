import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Building2, CalendarCheck, HeartHandshake, TrendingUp, TrendingDown } from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const KPICard = ({ title, value, icon: Icon, color, loading }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">
          {loading ? '...' : value}
        </h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, children, height = "h-80" }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
    <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
    <div className={`w-full ${height}`}>
      {children}
    </div>
  </div>
);

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    overview: null,
    users: null,
    listings: null,
    bookings: null,
    roommates: null,
    complaints: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseURL = 'http://localhost:5000/admin/analytics';
        // In real environments, API should be protected with tokens. We assume it's publicly reachable on localhost for MVP.
        const [
          overviewRes, usersRes, listingsRes,
          bookingsRes, roommatesRes, complaintsRes
        ] = await Promise.all([
          axios.get(`${baseURL}/overview`),
          axios.get(`${baseURL}/users`),
          axios.get(`${baseURL}/listings`),
          axios.get(`${baseURL}/bookings`),
          axios.get(`${baseURL}/roommates`),
          axios.get(`${baseURL}/complaints`)
        ]);

        setData({
          overview: overviewRes.data,
          users: usersRes.data,
          listings: listingsRes.data,
          bookings: bookingsRes.data,
          roommates: roommatesRes.data,
          complaints: complaintsRes.data
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format Data for Charts
  const userGrowthData = data.users?.newUsersPerMonth?.map(d => ({
    month: d._id, Users: d.count
  })) || [];

  const roleData = data.users?.roleDistribution 
    ? Object.keys(data.users.roleDistribution).map(role => ({
        name: role.charAt(0).toUpperCase() + role.slice(1), 
        value: data.users.roleDistribution[role]
      }))
    : [];

  const listingsByLocation = data.listings?.byLocation?.map(l => ({
    location: l.location, Listings: l.count
  })) || [];

  const bookingTrend = data.bookings?.bookingsTrend?.map(d => ({
    date: d._id, Bookings: d.count
  })) || [];

  const compatibilityStats = data.roommates?.compatibilityDistribution?.map(d => ({
    range: d.range, Matches: d.count
  })) || [];

  const complaintStats = data.complaints?.byStatus
    ? [
        { name: 'Resolved', value: data.complaints.byStatus.Resolved || 0 },
        { name: 'Open', value: data.complaints.byStatus.Open || 0 }
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Platform Overview</h2>
          <p className="text-gray-500 mt-1 text-sm">Welcome back, here's what's happening across MOV Stay.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
          Download Report
        </button>
      </div>

      {/* Top Section: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Users" 
          value={data.overview?.totalUsers?.toLocaleString() || '0'} 
          icon={Users} 
          color="bg-blue-500" 
          loading={loading}
        />
        <KPICard 
          title="Total Listings" 
          value={data.overview?.activeListings?.toLocaleString() || '0'} 
          icon={Building2} 
          color="bg-purple-500" 
          loading={loading}
        />
        <KPICard 
          title="Pending Bookings" 
          value={data.overview?.pendingBookings?.toLocaleString() || '0'} 
          icon={CalendarCheck} 
          color="bg-emerald-500" 
          loading={loading}
        />
        <KPICard 
          title="Roommate Matches" 
          value={data.roommates?.totalMatches?.toLocaleString() || '0'} 
          icon={HeartHandshake} 
          color="bg-amber-500" 
          loading={loading}
        />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="User Growth & Registration Trend">
            {!loading && userGrowthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="Users" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">Loading data...</div>
            )}
          </ChartCard>
        </div>
        
        <div className="lg:col-span-1">
          <ChartCard title="User Role Distribution">
            {!loading && roleData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
             ) : (
              <div className="flex h-full items-center justify-center text-gray-400">Loading data...</div>
            )}
          </ChartCard>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ChartCard title="Listings by Location" height="h-64">
           {!loading && listingsByLocation.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={listingsByLocation} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="location" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={5} textAnchor="end" height={60} angle={-45} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="Listings" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">Loading data...</div>
            )}
        </ChartCard>

        <ChartCard title="Booking Trends" height="h-64">
           {!loading && bookingTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={5} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="Bookings" stroke="#F59E0B" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">Loading data...</div>
            )}
        </ChartCard>

        <ChartCard title="Compatibility Match Scores" height="h-64">
           {!loading && compatibilityStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compatibilityStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={5} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="Matches" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">Loading data...</div>
            )}
        </ChartCard>

        <ChartCard title="Complaints Status" height="h-64">
           {!loading && complaintStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complaintStats}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {complaintStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'Resolved' ? '#10B981' : '#EF4444'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
             ) : (
              <div className="flex h-full items-center justify-center text-gray-400">Loading data...</div>
            )}
        </ChartCard>
      </div>

    </div>
  );
};

export default Dashboard;
