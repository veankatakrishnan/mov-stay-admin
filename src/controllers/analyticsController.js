const {
  User, PgListing, VisitBooking, Complaint,
  RoommateMatch, RecommendationLog, Neighborhood
} = require('../models/schema');

// GET /admin/analytics/overview
exports.getOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeListings = await PgListing.countDocuments({ isActive: true });
    const pendingBookings = await VisitBooking.countDocuments({ status: "Pending" });
    const openComplaints = await Complaint.countDocuments({ status: "Open" });

    res.json({
      totalUsers,
      activeListings,
      pendingBookings,
      openComplaints
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /admin/analytics/users
exports.getUsersAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    
    // User count by role
    const roleDistributionRaw = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);
    
    const roleDistribution = {};
    roleDistributionRaw.forEach(item => {
      roleDistribution[item._id || 'unknown'] = item.count;
    });

    // New users per month
    const newUsersPerMonth = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalUsers,
      roleDistribution,
      newUsersPerMonth
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /admin/analytics/listings
exports.getListingsAnalytics = async (req, res) => {
  try {
    const totalListings = await PgListing.countDocuments();
    const activeListings = await PgListing.countDocuments({ isActive: true });

    // Listings per location
    const byLocationRaw = await PgListing.aggregate([
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const byLocation = byLocationRaw.map(item => ({
      location: item._id,
      count: item.count
    }));

    // Average rent by area
    const avgRentByLocationRaw = await PgListing.aggregate([
      { $group: { _id: "$location", averageRent: { $avg: "$rent" } } }
    ]);

    const avgRentByLocation = avgRentByLocationRaw.map(item => ({
      location: item._id,
      averageRent: Math.round(item.averageRent || 0)
    }));
    
    // Platform average rating
    const ratingStats = await PgListing.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avgRating: { $avg: "$ratingAverage" } } }
    ]);
    const platformAverageRating = ratingStats.length > 0 ? Number(ratingStats[0].avgRating.toFixed(1)) : 0;

    res.json({
      totalListings,
      activeListings,
      platformAverageRating,
      byLocation,
      avgRentByLocation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /admin/analytics/bookings
exports.getBookingsAnalytics = async (req, res) => {
  try {
    const totalBookings = await VisitBooking.countDocuments();

    // Visit bookings trend (per day)
    const bookingsTrend = await VisitBooking.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Bookings by status
    const byStatusRaw = await VisitBooking.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    const byStatus = {};
    byStatusRaw.forEach(item => {
      byStatus[item._id || 'unknown'] = item.count;
    });

    res.json({
      totalBookings,
      byStatus,
      bookingsTrend
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /admin/analytics/roommates
exports.getRoommatesAnalytics = async (req, res) => {
  try {
    const totalMatches = await RoommateMatch.countDocuments();
    const acceptedMatches = await RoommateMatch.countDocuments({ status: "Accepted" });

    // Match status breakdown
    const matchStatusRaw = await RoommateMatch.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    const matchStatus = {};
    matchStatusRaw.forEach(item => {
      matchStatus[item._id || 'unknown'] = item.count;
    });

    // Average compatibility score of accepted matches
    const scoreStats = await RoommateMatch.aggregate([
      { $match: { status: "Accepted" } },
      { $group: { _id: null, avgScore: { $avg: "$compatibilityScore" } } }
    ]);
    const averageAcceptedCompatibilityScore = scoreStats.length > 0 ? Number(scoreStats[0].avgScore.toFixed(1)) : 0;

    // Compatibility score distribution
    const compatibilityDistributionRaw = await RoommateMatch.aggregate([
      { $match: { compatibilityScore: { $type: "number" } } },
      {
        $bucket: {
          groupBy: "$compatibilityScore",
          boundaries: [0, 50, 60, 70, 80, 90, 101],
          default: "Other",
          output: { count: { $sum: 1 } }
        }
      }
    ]);
    const compatibilityDistribution = compatibilityDistributionRaw.filter(b => b._id !== "Other").map(b => ({
      range: `${b._id}-${b._id < 90 ? b._id + 9 : 100}%`,
      count: b.count
    }));

    // AI recommendation total logs
    const totalAIRecommendationsMade = await RecommendationLog.countDocuments();

    res.json({
      totalMatches,
      acceptedMatches,
      matchStatus,
      averageAcceptedCompatibilityScore,
      compatibilityDistribution,
      totalAIRecommendationsMade
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /admin/analytics/complaints
exports.getComplaintsAnalytics = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    
    const openComplaints = await Complaint.countDocuments({ status: "Open" });
    const resolvedComplaints = await Complaint.countDocuments({ status: "Resolved" });

    const byStatus = {
      Open: openComplaints,
      Resolved: resolvedComplaints
    };

    // Complaint frequency over time (per month)
    const frequencyOverTime = await Complaint.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalComplaints,
      byStatus,
      frequencyOverTime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
