require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

// Import all models from our unified schema file instead of separate models/
const {
  User, Neighborhood, PgListing, PgRoom, PgAvailability, PgReview
} = require("./src/models/schema");

mongoose.connect(process.env.MONGO_URI);
console.log("Connected to MongoDB");

// ─────────────────────────────────────────────
// REALISTIC INDIAN NAMES
// ─────────────────────────────────────────────
const indianFirstNames = [
    "Arjun", "Rahul", "Priya", "Sneha", "Karthik", "Divya", "Arun", "Meera",
    "Vijay", "Ananya", "Suresh", "Kavya", "Ramesh", "Pooja", "Harish", "Nithya",
    "Ganesh", "Lakshmi", "Manoj", "Rani", "Sanjay", "Deepa", "Prasad", "Revathi",
    "Balaji", "Saranya", "Venkat", "Geetha", "Dinesh", "Mythili", "Saravanan",
    "Lavanya", "Murugan", "Bharathi", "Ravi", "Sowmya", "Senthil", "Padma",
    "Krishnan", "Vasantha", "Naveen", "Champa", "Vikram", "Usha", "Ashok", "Chitra",
    "Sunil", "Jayanthi", "Prakash", "Sangeetha", "Vignesh", "Nirmala", "Praveen",
    "Jeeva", "Kiran", "Amudha", "Sathish", "Brindha", "Rajesh", "Anitha", "Mani",
    "Kokila", "Dhanush", "Tamilarasi", "Naresh", "Hema", "Sriram", "Malliga"
];

const indianLastNames = [
    "Kumar", "Sharma", "Reddy", "Nair", "Pillai", "Iyer", "Rao", "Murugan",
    "Krishnan", "Subramanian", "Venkatesh", "Sundaram", "Rajan", "Balan",
    "Natarajan", "Srinivasan", "Annamalai", "Gopalakrishnan", "Raghavan",
    "Chandrasekaran", "Thangavel", "Prabhu", "Selvam", "Arumugam", "Durai",
    "Palanisamy", "Muthukumar", "Jayakumar", "Ganesan", "Venkatesan",
    "Subramaniam", "Ramamurthy", "Parthasarathy", "Satheesh", "Senthilkumar"
];

const colleges = ["IIT Madras", "Anna University", "MIT Campus", "SRM University",
    "Loyola College", "MCC", "Sathyabama University", "VIT Chennai",
    "PSG College", "CEG Campus"];

const emailDomains = ["gmail.com", "yahoo.com", "outlook.com"];

async function seedUsers(User) {
    const users = [];
    for (let i = 0; i < 500; i++) {
        const role = i < 400 ? "student" : i < 480 ? "owner" : "admin";
        const password = await bcrypt.hash("password123", 10);
        const firstName = faker.helpers.arrayElement(indianFirstNames);
        const lastName = faker.helpers.arrayElement(indianLastNames);
        const name = `${firstName} ${lastName}`;
        const domain = faker.helpers.arrayElement(emailDomains);
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${faker.number.int({ min: 10, max: 999 })}@${domain}`;
        const phone = `+91 ${faker.number.int({ min: 7000000000, max: 9999999999 })}`;

        users.push({ name, email, password, role, phone, profileImage: faker.image.avatar() });
    }
    return await User.insertMany(users);
}

// ─────────────────────────────────────────────
// REALISTIC NEIGHBORHOOD DATA (per area)
// ─────────────────────────────────────────────
const neighborhoodData = {
    "Velachery": {
        hospitals: ["Apollo Spectra Hospital", "Vijaya Hospital", "Fortis Malar Hospital"],
        colleges: ["MOP Vaishnav College", "Women's Christian College", "SRM Dental College"],
        transport: ["Velachery Metro Station (Blue Line)", "Velachery MRTS Station", "SETC Bus Stop"],
        amenities: ["Phoenix MarketCity Mall", "Reliance Fresh", "Velachery Lake Park", "Dominos", "DMart"],
        safetyScore: 8, transportScore: 9, convenienceScore: 9, lifestyleScore: 8, environmentScore: 7,
        averageRent: 9500
    },
    "Adyar": {
        hospitals: ["MIOT International", "Malar Hospital", "Billroth Hospitals"],
        colleges: ["IIT Madras", "Ethiraj College", "Stella Maris College"],
        transport: ["Adyar Bus Terminus", "Kasturbai Nagar MRTS", "Tiruvanmiyur Metro (upcoming)"],
        amenities: ["Spencer's Daily", "Adyar Bakery", "Adyar Ananda Bhavan", "Theosophical Society Garden"],
        safetyScore: 8, transportScore: 8, convenienceScore: 9, lifestyleScore: 9, environmentScore: 9,
        averageRent: 11000
    },
    "Taramani": {
        hospitals: ["Sri Ramachandra Hospital", "SKS Hospital", "Kumar Hospital"],
        colleges: ["IIT Madras (Back Gate)", "Anna University", "CSIR-CLRI"],
        transport: ["Taramani MRTS Station", "OMR Bus Stop", "TIDEL Park Shuttle"],
        amenities: ["TIDEL Park Food Court", "Nilgiris Supermarket", "Taramani Social Club"],
        safetyScore: 7, transportScore: 8, convenienceScore: 8, lifestyleScore: 7, environmentScore: 8,
        averageRent: 9000
    },
    "Guindy": {
        hospitals: ["Government Rajiv Gandhi Hospital", "Sundaram Medical Foundation", "Sri Ramachandra"],
        colleges: ["Anna University CEG", "Guindy Engineering College", "Government College of Technology"],
        transport: ["Guindy Metro Station (Blue Line)", "Guindy Railway Station", "CMBT Bus Stand"],
        amenities: ["Express Avenue Mall", "Forum Vijaya Mall", "Guindy National Park", "Big Bazaar"],
        safetyScore: 7, transportScore: 10, convenienceScore: 9, lifestyleScore: 8, environmentScore: 7,
        averageRent: 10000
    },
    "Tambaram": {
        hospitals: ["Tambaram Government Hospital", "Rela Hospital", "Sri Sowdambika Hospital"],
        colleges: ["Madras Christian College", "St. Thomas Mount College", "Vels University"],
        transport: ["Tambaram Railway Station (Suburban)", "GST Road Bus Stop", "Airport Expressway"],
        amenities: ["Mahalakshmi Supermarket", "Tambaram Market", "Pizza Hut", "Reliance Digital"],
        safetyScore: 7, transportScore: 8, convenienceScore: 8, lifestyleScore: 6, environmentScore: 7,
        averageRent: 7000
    },
    "Anna Nagar": {
        hospitals: ["Apollo Hospitals", "SIMS Hospital", "Fortis Hospital Vadapalani"],
        colleges: ["Loyola College", "SRM Arts and Science College", "Pachaiyappa's College"],
        transport: ["Anna Nagar East Metro (Green Line)", "Anna Nagar West Metro", "Koyambedu Bus Terminus"],
        amenities: ["Chennai City Centre Mall", "Ampa Skywalk Mall", "Spencer's Anna Nagar", "McDonalds"],
        safetyScore: 9, transportScore: 9, convenienceScore: 10, lifestyleScore: 10, environmentScore: 8,
        averageRent: 12000
    },
    "Perungudi": {
        hospitals: ["Kauvery Hospital", "Dr. Kamakshi Memorial Hospital", "Prashanth Hospitals"],
        colleges: ["CEG Perungudi Campus", "Hindustan College", "Vel Tech Multi Tech"],
        transport: ["Perungudi OMR Bus Stop", "Taramani Link Road Bus", "Sholinganallur Junction Autos"],
        amenities: ["Nexus Vijaya Mall", "OMR Food Street", "Perungudi Lake", "KFC OMR"],
        safetyScore: 7, transportScore: 7, convenienceScore: 8, lifestyleScore: 7, environmentScore: 8,
        averageRent: 9000
    },
    "Sholinganallur": {
        hospitals: ["Sri Ramachandra Medical Centre", "Narayana Hrudayalaya", "Sims Hospital OMR"],
        colleges: ["SRM University", "Sathyabama University", "Saveetha Engineering"],
        transport: ["Sholinganallur OMR Bus Stop", "Perungudi MRTS", "Infosys/TCS Shuttle Services"],
        amenities: ["Elante Mall OMR", "Sholinganallur Social", "Burger King", "Heritage Fresh"],
        safetyScore: 8, transportScore: 8, convenienceScore: 9, lifestyleScore: 9, environmentScore: 7,
        averageRent: 10000
    },
    "Chromepet": {
        hospitals: ["Chromepet Government Hospital", "Vijaya Health Centre", "Chettinad Health City"],
        colleges: ["Chettinad Technology College", "Hindustan College", "Jerusalem Engineering College"],
        transport: ["Chromepet Railway Station", "Pallavaram Bus Stand", "GST Road TNSTC Buses"],
        amenities: ["Grand Mall Chromepet", "Chromepet Market", "Subway", "More Supermarket"],
        safetyScore: 7, transportScore: 8, convenienceScore: 8, lifestyleScore: 6, environmentScore: 6,
        averageRent: 7500
    },
    "Medavakkam": {
        hospitals: ["Medavakkam Government Hospital", "Sri sakthi hospital", "Grace Medical Centre"],
        colleges: ["BSA Crescent Engineering College", "Peri's College", "Sri Krishna Arts and Science"],
        transport: ["Medavakkam Bus Stop", "Perumbakkam Junction", "Kelambakkam OMR Buses"],
        amenities: ["Medavakkam Market", "Nilgiris Daily", "Medavakkam Lake Walk", "Saravana Stores"],
        safetyScore: 7, transportScore: 7, convenienceScore: 7, lifestyleScore: 6, environmentScore: 7,
        averageRent: 6500
    }
};

const areas = Object.keys(neighborhoodData);

function createNeighborhoods(Neighborhood) {
    return Neighborhood.insertMany(
        areas.map(area => {
            const d = neighborhoodData[area];
            return {
                locationName: area,
                city: "Chennai",
                safetyScore: d.safetyScore,
                transportScore: d.transportScore,
                convenienceScore: d.convenienceScore,
                lifestyleScore: d.lifestyleScore,
                environmentScore: d.environmentScore,
                averageRent: d.averageRent,
                nearbyHospitals: d.hospitals,
                nearbyColleges: d.colleges,
                nearbyTransport: d.transport,
                popularAmenities: d.amenities
            };
        })
    );
}

// ─────────────────────────────────────────────
// REALISTIC PG DATA
// ─────────────────────────────────────────────
const pgNamePrefixes = [
    "Sri Balaji", "Lakshmi", "Saraswathi", "Sri Murugan", "Royal", "Green Park",
    "Sri Venkateswara", "Comfort Zone", "Classic", "Elite", "Happy Home", "Sun Rise",
    "Silver Oak", "Golden Stay", "Sri Ram", "Lotus", "Tranquil", "Harmony",
    "Sai Krupa", "Om Sakthi", "Annapurna", "Vijaya", "Pavithra", "Surabhi",
    "Meenakshi", "Durga", "Shakthi", "Sri Ayyappa", "Parvathi", "Thirumal",
    "New Age", "Metro", "Urban Nest", "Student Hub", "Scholar", "Campus View"
];

const pgNameSuffixes = [
    "PG", "Boys Hostel", "Girls Hostel", "Residency", "Paying Guest Home",
    "Accommodation", "Student Hostel", "Ladies PG", "Gents PG", "Guest House",
    "Stay", "Nest", "Home Stay", "Executive PG"
];

const chennaiStreets = {
    "Velachery": [
        "42, Velachery Main Road", "17, 100 Feet Road", "8, Taramani Link Road",
        "25, Vijaya Nagar 1st Street", "63, Bharathi Nagar 3rd Cross",
        "11, Vijayanagar East", "5, Srinivasa Nagar", "38, South Block Road"
    ],
    "Adyar": [
        "12, Gandhi Nagar 5th Avenue", "55, LB Road", "3, Kasturba Nagar 2nd Street",
        "88, 4th Main Road", "21, Canal Bank Road", "14, Besant Nagar Beach Road",
        "7, Shastri Nagar", "44, Lattice Bridge Road"
    ],
    "Taramani": [
        "14, CSIR Road", "7, Taramani Main Road", "31, SRP Colony 2nd Street",
        "9, TIDEL Park Road", "46, Research Colony Cross Lane",
        "22, Narayanapuram", "3, IT Expressway", "58, Perungudi Link Road"
    ],
    "Guindy": [
        "5, Mount Poonamallee Road", "22, Saidapet High Road", "77, Anna Salai",
        "33, Guindy Industrial Estate Block B", "11, Ekkatuthangal 2nd Street",
        "66, St. Thomas Mount Road", "18, Ashok Nagar 10th Avenue", "9, Kumaran Colony"
    ],
    "Tambaram": [
        "19, GST Road", "4, East Tambaram Main Road", "38, Mudichur Road",
        "62, Tambaram Sanatorium North", "27, Pallavaram Main Road",
        "51, West Tambaram", "13, EMU Colony", "7, Railway Feeder Road"
    ],
    "Anna Nagar": [
        "16, Anna Nagar 2nd Avenue", "48, Shanthi Colony Main Road", "72, Anna Nagar East",
        "5, 13th Main Road", "29, Mogappair West Road", "37, P-Block Anna Nagar",
        "9, Thirumangalam Road", "63, Collector Nagar 6th Street"
    ],
    "Perungudi": [
        "10, Perungudi Main Road", "34, OMR Phase 2", "6, Thoraipakkam Junction",
        "51, Perungudi IT Park Road", "18, East Coast Road Kott",
        "25, Kottivakkam", "42, Palavakkam Beach Road", "3, Rajiv Gandhi Salai"
    ],
    "Sholinganallur": [
        "23, Sholinganallur Main Road", "56, OMR Sholinganallur", "11, Medavakkam Highway",
        "44, Shollinganallur Bypass Lane", "8, VOC Nagar", "17, Bakthavatsalam Nagar",
        "33, Kannan Street", "61, Rajiv Gandhi IT Corridor"
    ],
    "Chromepet": [
        "37, Chromepet Main Road", "15, Old Mahabalipuram Road", "9, Pallavaram-Thoraipakkam Road",
        "52, Railway Station Road", "28, Gandhi Road", "44, Dr. Ambedkar Road",
        "7, Market Street", "20, Aavin Colony"
    ],
    "Medavakkam": [
        "6, Medavakkam Main Road", "43, Kelambakkam Road", "17, East Tambaram Road",
        "30, Perumbakkam Junction", "58, Urapakkam Main Road",
        "11, Nanmangalam Road", "24, Madipakkam Main Road", "3, Kovilambakkam Road"
    ]
};

const pgDescriptions = [
    "A well-maintained PG located in a peaceful residential area with easy access to public transport. Ideal for students and working professionals seeking affordable yet comfortable accommodation.",
    "Spacious, fully furnished accommodation with 24/7 security and housekeeping services. Walking distance from metro station and major IT parks. Zero brokerage, direct owner contact.",
    "Comfortable and affordable PG with a homely atmosphere. South Indian home-cooked meals provided twice daily. Strictly no smoking or alcohol on premises. House curfew at 10:30 PM.",
    "Modern PG facility with high-speed fiber WiFi, power backup, and CCTV surveillance. Close to major colleges and tech companies on OMR. Tiffin and laundry included in rent.",
    "Well-ventilated rooms with attached bathrooms available. Hygienic kitchen and bi-weekly laundry service included in rent. Quiet residential neighborhood, perfect for focused studying.",
    "Premium PG offering both AC and non-AC room options at different price points. Strong community of students from top Chennai colleges. Regular warden supervision and visitor register maintained.",
    "Budget-friendly accommodation with all basic amenities provided. TNSTC bus stop just 2 minutes walk. Monthly rent payment accepted. Advance deposit of 2 months refundable on exit.",
    "Newly constructed PG with modern interiors, cross-ventilation, and ample natural light. Separate floors maintained for boys and girls. RO filtered drinking water available round the clock.",
    "Cozy PG situated inside a gated community with dedicated two-wheeler parking. Common TV lounge and a separate study hall open till midnight. Grocery shop and medical pharmacy within 200m.",
    "Trusted and well-known PG running successfully for 12 years with 100+ satisfied long-term residents. Tiffin service from a local mess available at nominal extra cost. Emergency medical assistance coordinated.",
    "Semi-furnished rooms with bed, wardrobe, study table, and reading lamp included. Cooking facility available for long-term residents. Security deposit fully refundable within 7 days of check-out.",
    "Strategically located near the main bus terminus offering excellent connectivity to all parts of Chennai. Separate common bathrooms for each floor maintained daily. Biometric entry system installed for security.",
    "PG with exclusive terrace garden access and a dedicated air-conditioned study room open 24 hours. 200 Mbps fiber broadband WiFi. Strict house rules ensure a calm and productive environment.",
    "Affordable PG specifically catering to college students. Home-like, supportive environment with an understanding and approachable owner. Short-term (minimum 2 months) and long-term stays both welcomed.",
    "Fully air-conditioned PG with in-house gym and coin-operated laundry machines. DG generator backup provided during TNEB power cuts. Monthly rent inclusive of electricity and water maintenance charges.",
    "A newly renovated PG by a working professional-friendly owner. High-speed internet, daily housekeeping, and security guard on duty. Just 5 minutes from the nearest metro station by auto.",
    "Established ladies PG with 24/7 female warden on premises. CCTV monitoring on all floors and entrance gate. Breakfast and dinner included. Biometric attendance system for safety of residents.",
    "Gents-only PG with a rooftop cricket net and common room with chess/carrom. Fortnightly pest control maintained. Proximity to coaching centres, IIT, and Anna University campus roads.",
    "Spacious double and triple sharing rooms perfect for groups of friends relocating to Chennai. Discounts available on 6-month and 12-month advance bookings. No hidden charges — fully transparent billing.",
    "Co-ed PG with separate wings for boys and girls and a common dining area. Chef-cooked North and South Indian meals served. Visitors allowed in the common lounge between 8 AM and 8 PM."
];

function generatePGs(PgListing, owners, neighborhoods) {
    const pgs = [];
    for (let i = 0; i < 150; i++) {
        const owner = faker.helpers.arrayElement(owners);
        const neighborhood = faker.helpers.arrayElement(neighborhoods);
        const locationName = neighborhood.locationName;
        const streetList = chennaiStreets[locationName] || ["10, Main Road, Chennai"];

        const pgName = `${faker.helpers.arrayElement(pgNamePrefixes)} ${faker.helpers.arrayElement(pgNameSuffixes)}`;
        const pincode = 600001 + areas.indexOf(locationName) * 10 + faker.number.int({ min: 0, max: 9 });
        const address = `${faker.helpers.arrayElement(streetList)}, ${locationName}, Chennai - ${pincode}`;

        // Amenity probabilities based on rent tier
        const rent = faker.number.int({ min: 4000, max: 14000 });
        const isPremium = rent > 10000;
        const isMid = rent > 7000;

        pgs.push({
            pgName,
            address,
            location: locationName,
            neighborhoodId: neighborhood._id,
            ownerId: owner._id,
            rent,
            genderPreference: faker.helpers.arrayElement(["Boys", "Girls", "Co-ed"]),
            amenities: {
                wifi: true,
                food: isPremium ? true : faker.datatype.boolean(),
                laundry: isMid ? true : faker.datatype.boolean(),
                parking: faker.datatype.boolean(),
                powerBackup: isMid ? true : faker.datatype.boolean(),
                cctv: true,
                gym: isPremium ? faker.datatype.boolean() : false,
                studyRoom: isMid ? faker.datatype.boolean() : false
            },
            images: [faker.image.url()],
            description: faker.helpers.arrayElement(pgDescriptions)
        });
    }
    return PgListing.insertMany(pgs);
}

// ─────────────────────────────────────────────
// ROOMS — Realistic bed counts by type
// ─────────────────────────────────────────────
function generateRooms(PgRoom, pgs) {
    const roomTypes = ["Single", "Double", "Triple", "Dormitory"];
    const rooms = [];

    pgs.forEach(pg => {
        roomTypes.forEach(type => {
            let rent, totalBeds;

            if (type === "Single") {
                rent = faker.number.int({ min: 9000, max: 14000 });
                totalBeds = faker.number.int({ min: 2, max: 6 });   // few single rooms
            } else if (type === "Double") {
                rent = faker.number.int({ min: 7000, max: 10000 });
                totalBeds = faker.number.int({ min: 4, max: 10 });
            } else if (type === "Triple") {
                rent = faker.number.int({ min: 5000, max: 8000 });
                totalBeds = faker.number.int({ min: 6, max: 15 });
            } else {
                rent = faker.number.int({ min: 3500, max: 5500 });
                totalBeds = faker.number.int({ min: 10, max: 30 }); // dormitories are large
            }

            rooms.push({
                pgId: pg._id,
                roomType: type,
                sharingCapacity: type === "Single" ? 1 : type === "Double" ? 2 : type === "Triple" ? 3 : 6,
                totalBeds,
                roomRent: rent,
                acAvailable: type === "Single" ? true : faker.datatype.boolean()
            });
        });
    });

    return PgRoom.insertMany(rooms);
}

// ─────────────────────────────────────────────
// AVAILABILITY — Occupancy logic
// ─────────────────────────────────────────────
function generateAvailability(PgAvailability, rooms) {
    const records = [];

    rooms.forEach(room => {
        let occupancyRate;
        if (room.roomRent < 5000) occupancyRate = faker.number.float({ min: 0.80, max: 0.98 });
        else if (room.roomRent < 9000) occupancyRate = faker.number.float({ min: 0.55, max: 0.80 });
        else occupancyRate = faker.number.float({ min: 0.30, max: 0.65 });

        const occupied = Math.floor(room.totalBeds * occupancyRate);
        const availableBeds = room.totalBeds - occupied;

        records.push({
            roomId: room._id,
            availableBeds,
            status: availableBeds === 0 ? "Full" : availableBeds <= 2 ? "Limited" : "Available"
        });
    });

    return PgAvailability.insertMany(records);
}

// ─────────────────────────────────────────────
// REVIEWS — Varied, realistic text per rating
// ─────────────────────────────────────────────
const reviewTexts = {
    5: [
        "Absolutely love staying here. The rooms are clean, food is tasty, and the owner is very supportive. Best PG in the area without a doubt.",
        "Excellent PG! WiFi is fast, hot water is always available, and the food is just like home. Highly recommend to all students joining colleges nearby.",
        "I have been staying here for 8 months and it has been a wonderful experience. Safe, clean, and the warden is very helpful. 10/10.",
        "The best PG I have stayed in Chennai. Very secure building, polite staff, and mess food quality is top-notch. Totally worth the rent.",
        "Peaceful environment and very cooperative owner. Rooms are spacious and well-ventilated. No power cut issues at all. Perfect for focused work.",
        "Superb location with great connectivity to OMR. The food here is fantastic and the common areas are always clean. Strongly recommended!"
    ],
    4: [
        "Good PG overall. The food is decent and the staff is cooperative. WiFi can be slightly slow during peak hours but otherwise great.",
        "Nice and clean accommodation. The warden is responsive and the rooms are well-maintained. Happy with my stay so far.",
        "Comfortable stay with good facilities. The location is very convenient for working professionals. A minor complaint about hot water timing.",
        "Pretty good place for the price. The room size is adequate and the building is secure. Would suggest improving the common bathroom schedule.",
        "Satisfied with the stay. The owner is understanding and flexible with payment timing. Meals are wholesome and served on time.",
        "Great place with very good WiFi. The neighbourhood is safe and calm. A little far from the bus stop but the PG itself is well-managed."
    ],
    3: [
        "Average PG. Facilities are decent but nothing exceptional. The food quality varies day to day. Would not say it is bad, just ordinary.",
        "Okay for the price. The room is acceptable but the common bathroom could be cleaner. WiFi works fine during off-peak hours.",
        "It is an average place. The owner is okay but not very prompt with maintenance requests. The area is good but the PG can do better.",
        "Manageable stay. Nothing extraordinary. The rent is fairly priced but some amenities like laundry are not always available.",
        "Neutral experience. The PG is neither great nor terrible. Food is predictable and simple. Would consider moving if rent increases further.",
        "It is fine for short stays. The rooms are basic and the building is safe. Maintenance response time could be better."
    ],
    2: [
        "Not satisfied with the stay. The food quality has gone down significantly in the past month. WiFi disconnects very frequently.",
        "The rooms were not as described. Cleanliness is a big issue especially the shared bathrooms. Management needs to improve response time.",
        "Too many residents crammed into small spaces. The dormitory does not feel hygienic. I would not recommend this to anyone.",
        "Maintenance is very slow. Complained about a broken fan 3 weeks ago and it is still not fixed. Very disappointing experience.",
        "The food was unhygienic on some days. Power backup does not work properly. For the rent charged, the facilities are below expectations.",
        "Overcrowded and poorly managed. The warden is rarely available. Expected much better based on the photos shown during enquiry."
    ],
    1: [
        "Terrible experience. The room had cockroaches and the bathrooms were filthy. Do not waste your money here. Run away.",
        "Absolute worst PG in the area. No hot water, frequent WiFi outages, and the owner is not reachable on most days. Avoid at all costs.",
        "The PG was nothing like advertised. Small, dark rooms with no ventilation. Food was inedible on most days. Shifted out in 2 weeks.",
        "Avoid this place completely. False promises made at the time of joining. No water from 8 AM to 12 PM everyday. Pathetic management.",
        "Very bad experience. Rooms smell damp and there is no proper lighting. Security is lax and strangers enter the building freely.",
        "Highly disappointed. Warden is rude and unhelpful. WiFi is non-existent despite being advertised. Not worth even half the rent charged."
    ]
};

function generateReviews(PgReview, students, pgs) {
    const reviews = [];
    for (let i = 0; i < 1200; i++) {
        const rating = faker.helpers.weightedArrayElement([
            { weight: 8, value: 5 },
            { weight: 20, value: 4 },
            { weight: 30, value: 3 },
            { weight: 25, value: 2 },
            { weight: 17, value: 1 }
        ]);

        const reviewText = faker.helpers.arrayElement(reviewTexts[rating]);

        reviews.push({
            pgId: faker.helpers.arrayElement(pgs)._id,
            studentId: faker.helpers.arrayElement(students)._id,
            rating,
            reviewText,
            sentimentScore: parseFloat((rating / 5).toFixed(2))
        });
    }
    return PgReview.insertMany(reviews);
}

// ─────────────────────────────────────────────
// MAIN RUNNER
// ─────────────────────────────────────────────
async function runSeeder() {
    await mongoose.connection.dropDatabase();
    console.log("Database dropped. Seeding fresh data...");

    const users = await seedUsers(User);
    console.log(`✅ Seeded ${users.length} users`);

    const students = users.filter(u => u.role === "student");
    const owners = users.filter(u => u.role === "owner");

    const neighborhoods = await createNeighborhoods(Neighborhood);
    console.log(`✅ Seeded ${neighborhoods.length} neighborhoods`);

    const pgs = await generatePGs(PgListing, owners, neighborhoods);
    console.log(`✅ Seeded ${pgs.length} PG listings`);

    const rooms = await generateRooms(PgRoom, pgs);
    console.log(`✅ Seeded ${rooms.length} rooms`);

    await generateAvailability(PgAvailability, rooms);
    console.log(`✅ Seeded availability for ${rooms.length} rooms`);

    await generateReviews(PgReview, students, pgs);
    console.log(`✅ Seeded 1200 reviews`);

    console.log("\n🎉 AI Dataset Generated Successfully!\n");
    process.exit();
}

runSeeder();
