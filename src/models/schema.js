const mongoose = require('mongoose');

// 1. Users Collection
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "owner", "admin"], default: "student" },
  phone: String,
  profileImage: String,
  createdAt: { type: Date, default: Date.now }
});

// 2. Student Profile
const StudentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  college: String,
  gender: { type: String, enum: ["Male", "Female"] },
  preferredLocation: String,
  budget: Number,
  preferredRoomType: { type: String, enum: ["Single", "Double", "Triple", "Dormitory"] },
  foodPreference: { type: String, enum: ["Veg", "Non-Veg", "Any"] },
  smokingPreference: Boolean,
  sleepTime: String,
  cleanlinessLevel: String
});

// 3. Neighborhood Collection
const NeighborhoodSchema = new mongoose.Schema({
  locationName: { type: String, required: true },
  city: String,
  safetyScore: Number,
  transportScore: Number,
  convenienceScore: Number,
  lifestyleScore: Number,
  environmentScore: Number,
  averageRent: Number,
  nearbyHospitals: [String],
  nearbyColleges: [String],
  nearbyTransport: [String],
  popularAmenities: [String]
});

// 4. PG Listings
const PgListingSchema = new mongoose.Schema({
  pgName: { type: String, required: true },
  address: String,
  location: String,
  neighborhoodId: { type: mongoose.Schema.Types.ObjectId, ref: "Neighborhood" },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rent: Number,
  genderPreference: { type: String, enum: ["Boys", "Girls", "Co-ed"] },
  amenities: {
    wifi: Boolean, food: Boolean, laundry: Boolean, parking: Boolean,
    powerBackup: Boolean, cctv: Boolean, gym: Boolean, studyRoom: Boolean
  },
  images: [String],
  description: String,
  ratingAverage: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// 5. PG Rooms
const PgRoomSchema = new mongoose.Schema({
  pgId: { type: mongoose.Schema.Types.ObjectId, ref: "PgListing" },
  roomType: { type: String, enum: ["Single", "Double", "Triple", "Dormitory"] },
  sharingCapacity: Number,
  totalBeds: Number,
  roomRent: Number,
  acAvailable: Boolean
});

// 6. Bed Availability
const PgAvailabilitySchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "PgRoom" },
  availableBeds: Number,
  status: { type: String, enum: ["Available", "Limited", "Full"] },
  lastUpdatedOn: { type: Date, default: Date.now }
});

// 7. Visit Booking
const VisitBookingSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pgId: { type: mongoose.Schema.Types.ObjectId, ref: "PgListing" },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "PgRoom" },
  visitDate: Date,
  status: { type: String, enum: ["Pending", "Approved", "Rejected"] },
  createdAt: { type: Date, default: Date.now }
});

// 8. PG Reviews
const PgReviewSchema = new mongoose.Schema({
  pgId: { type: mongoose.Schema.Types.ObjectId, ref: "PgListing" },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, min: 1, max: 5 },
  reviewText: String,
  sentimentScore: Number,
  createdAt: { type: Date, default: Date.now }
});

// 9. Favorites
const FavoriteSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pgId: { type: mongoose.Schema.Types.ObjectId, ref: "PgListing" },
  savedAt: { type: Date, default: Date.now }
});

// 10. Roommate Preferences
const RoommatePreferenceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sleepTime: String,
  cleanlinessLevel: String,
  smoking: Boolean,
  studyHabits: String,
  budget: Number
});

// 11. Roommate Matches
const RoommateMatchSchema = new mongoose.Schema({
  studentA: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  studentB: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  compatibilityScore: Number,
  status: { type: String, enum: ["Pending", "Accepted", "Rejected"] }
});

// 12. Notifications
const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  type: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// 13. Complaints
const ComplaintSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pgId: { type: mongoose.Schema.Types.ObjectId, ref: "PgListing" },
  complaintText: String,
  status: { type: String, enum: ["Open", "Resolved"] },
  createdAt: { type: Date, default: Date.now }
});

// 14. Recommendation Logs (AI)
const RecommendationLogSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recommendedPgIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "PgListing" }],
  algorithmVersion: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const StudentProfile = mongoose.model('StudentProfile', StudentProfileSchema);
const Neighborhood = mongoose.model('Neighborhood', NeighborhoodSchema);
const PgListing = mongoose.model('PgListing', PgListingSchema);
const PgRoom = mongoose.model('PgRoom', PgRoomSchema);
const PgAvailability = mongoose.model('PgAvailability', PgAvailabilitySchema);
const VisitBooking = mongoose.model('VisitBooking', VisitBookingSchema);
const PgReview = mongoose.model('PgReview', PgReviewSchema);
const Favorite = mongoose.model('Favorite', FavoriteSchema);
const RoommatePreference = mongoose.model('RoommatePreference', RoommatePreferenceSchema);
const RoommateMatch = mongoose.model('RoommateMatch', RoommateMatchSchema);
const Notification = mongoose.model('Notification', NotificationSchema);
const Complaint = mongoose.model('Complaint', ComplaintSchema);
const RecommendationLog = mongoose.model('RecommendationLog', RecommendationLogSchema);

module.exports = {
  User, StudentProfile, Neighborhood, PgListing, PgRoom,
  PgAvailability, VisitBooking, PgReview, Favorite,
  RoommatePreference, RoommateMatch, Notification,
  Complaint, RecommendationLog
};
