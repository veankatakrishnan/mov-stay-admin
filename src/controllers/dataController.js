const {
  User, PgListing, VisitBooking, Complaint,
  RoommateMatch, RecommendationLog, Neighborhood
} = require('../models/schema');

// GET /admin/data/users
exports.getUsersData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const data = await User.find({}, '-password').sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await User.countDocuments();

    res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /admin/data/listings
exports.getListingsData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const data = await PgListing.find().populate('ownerId', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await PgListing.countDocuments();

    res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /admin/data/bookings
exports.getBookingsData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const data = await VisitBooking.find()
      .populate('studentId', 'name email')
      .populate('pgId', 'pgName location')
      .sort({ createdAt: -1 })
      .skip(skip).limit(limit);
    const total = await VisitBooking.countDocuments();

    res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /admin/data/roommates // (matches)
exports.getRoommatesData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const data = await RoommateMatch.find()
      .populate('studentA', 'name email')
      .populate('studentB', 'name email')
      .sort({ compatibilityScore: -1 })
      .skip(skip).limit(limit);
    const total = await RoommateMatch.countDocuments();

    res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /admin/data/complaints
exports.getComplaintsData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const data = await Complaint.find()
      .populate('studentId', 'name email')
      .populate('pgId', 'pgName location')
      .sort({ createdAt: -1 })
      .skip(skip).limit(limit);
    const total = await Complaint.countDocuments();

    res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
