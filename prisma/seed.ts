import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SeedCollege = {
  name: string;
  city: string;
  state: string;
  type: "Government" | "Private" | "Deemed";
  fees: number;
  rating: number;
  established: number;
  overview: string;
  logoColor: string;
  courses: { name: string; duration: string; fees: number; seats: number }[];
  placements: {
    year: number;
    avgPackage: number;
    highestPackage: number;
    placementRate: number;
    topRecruiters: string;
  }[];
  reviews: { authorName: string; rating: number; comment: string }[];
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const colleges: SeedCollege[] = [
  {
    name: "Indian Institute of Technology Bombay",
    city: "Mumbai",
    state: "Maharashtra",
    type: "Government",
    fees: 220000,
    rating: 4.8,
    established: 1958,
    overview:
      "IIT Bombay is one of India's premier engineering institutes, known for its rigorous CS and core engineering programs, strong research output, and top-tier placement record.",
    logoColor: "#DC2626",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", fees: 220000, seats: 120 },
      { name: "B.Tech Electrical Engineering", duration: "4 years", fees: 220000, seats: 100 },
      { name: "M.Tech Data Science", duration: "2 years", fees: 150000, seats: 40 },
    ],
    placements: [
      { year: 2025, avgPackage: 2400000, highestPackage: 12000000, placementRate: 96, topRecruiters: "Google, Microsoft, Goldman Sachs, Sequoia" },
      { year: 2024, avgPackage: 2200000, highestPackage: 11000000, placementRate: 95, topRecruiters: "Google, Amazon, JPMorgan, Uber" },
    ],
    reviews: [
      { authorName: "Rohan S.", rating: 5, comment: "Best CS program in India, faculty is world class and the peer group pushes you constantly." },
      { authorName: "Ananya K.", rating: 4.5, comment: "Intense workload but placement outcomes and alumni network make it worth it." },
    ],
  },
  {
    name: "Indian Institute of Technology Delhi",
    city: "New Delhi",
    state: "Delhi",
    type: "Government",
    fees: 218000,
    rating: 4.7,
    established: 1961,
    overview:
      "IIT Delhi offers a strong blend of engineering rigor and entrepreneurship culture, with excellent industry connections in the capital region.",
    logoColor: "#2563EB",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", fees: 218000, seats: 110 },
      { name: "B.Tech Mechanical Engineering", duration: "4 years", fees: 218000, seats: 100 },
    ],
    placements: [
      { year: 2025, avgPackage: 2300000, highestPackage: 10500000, placementRate: 95, topRecruiters: "Microsoft, Adobe, Flipkart, McKinsey" },
      { year: 2024, avgPackage: 2100000, highestPackage: 9800000, placementRate: 94, topRecruiters: "Amazon, Google, BCG" },
    ],
    reviews: [
      { authorName: "Vikram T.", rating: 4.5, comment: "Great startup ecosystem on campus and strong internship pipeline." },
    ],
  },
  {
    name: "Vellore Institute of Technology",
    city: "Vellore",
    state: "Tamil Nadu",
    type: "Private",
    fees: 198000,
    rating: 4.1,
    established: 1984,
    overview:
      "VIT is a large private university known for its flexible credit system, strong placement cell, and wide range of engineering specializations.",
    logoColor: "#059669",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", fees: 198000, seats: 600 },
      { name: "B.Tech Information Technology", duration: "4 years", fees: 190000, seats: 300 },
    ],
    placements: [
      { year: 2025, avgPackage: 850000, highestPackage: 4400000, placementRate: 88, topRecruiters: "TCS, Infosys, Cognizant, Amazon" },
      { year: 2024, avgPackage: 780000, highestPackage: 4100000, placementRate: 86, topRecruiters: "Wipro, Accenture, Deloitte" },
    ],
    reviews: [
      { authorName: "Sneha R.", rating: 4, comment: "Flexible curriculum (FLEX system) and a huge number of recruiters visit every year." },
      { authorName: "Karthik M.", rating: 3.8, comment: "Campus is massive, hostel food could be better but academics are solid." },
    ],
  },
  {
    name: "VNR Vignana Jyothi Institute of Engineering and Technology",
    city: "Hyderabad",
    state: "Telangana",
    type: "Private",
    fees: 145000,
    rating: 4.2,
    established: 1995,
    overview:
      "VNRVJIET is a well-regarded autonomous engineering college in Hyderabad with strong CSE placements and an active coding culture among students.",
    logoColor: "#7C3AED",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", fees: 145000, seats: 240 },
      { name: "B.Tech AI & ML", duration: "4 years", fees: 150000, seats: 120 },
    ],
    placements: [
      { year: 2025, avgPackage: 720000, highestPackage: 4400000, placementRate: 90, topRecruiters: "Amazon, Deloitte, Zoho, Cognizant" },
      { year: 2024, avgPackage: 680000, highestPackage: 4000000, placementRate: 89, topRecruiters: "TCS, Infosys, Accenture" },
    ],
    reviews: [
      { authorName: "Priya D.", rating: 4.3, comment: "Strong CSE department and good exposure to hackathons and coding clubs." },
    ],
  },
  {
    name: "Birla Institute of Technology and Science, Pilani",
    city: "Pilani",
    state: "Rajasthan",
    type: "Private",
    fees: 232000,
    rating: 4.5,
    established: 1964,
    overview:
      "BITS Pilani is known for its no-reservation, merit-based admission and dual-degree flexibility, with a strong reputation among core and software recruiters.",
    logoColor: "#EA580C",
    courses: [
      { name: "B.E. Computer Science", duration: "4 years", fees: 232000, seats: 180 },
      { name: "B.E. Electronics & Instrumentation", duration: "4 years", fees: 228000, seats: 90 },
    ],
    placements: [
      { year: 2025, avgPackage: 1900000, highestPackage: 8500000, placementRate: 93, topRecruiters: "Microsoft, Qualcomm, Texas Instruments, Goldman Sachs" },
    ],
    reviews: [
      { authorName: "Aditya P.", rating: 4.6, comment: "Practice School (internship) program is genuinely industry-grade experience." },
    ],
  },
  {
    name: "National Institute of Technology Trichy",
    city: "Tiruchirappalli",
    state: "Tamil Nadu",
    type: "Government",
    fees: 165000,
    rating: 4.4,
    established: 1964,
    overview:
      "NIT Trichy is consistently ranked among the top NITs, with strong core engineering programs and a competitive placement cycle.",
    logoColor: "#0891B2",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", fees: 165000, seats: 130 },
      { name: "B.Tech Production Engineering", duration: "4 years", fees: 160000, seats: 60 },
    ],
    placements: [
      { year: 2025, avgPackage: 1650000, highestPackage: 6200000, placementRate: 92, topRecruiters: "Amazon, Samsung, Bosch, ZS Associates" },
    ],
    reviews: [
      { authorName: "Meera N.", rating: 4.4, comment: "Great core engineering exposure with strong industry tie-ups for internships." },
    ],
  },
  {
    name: "SRM Institute of Science and Technology",
    city: "Chennai",
    state: "Tamil Nadu",
    type: "Deemed",
    fees: 210000,
    rating: 3.9,
    established: 1985,
    overview:
      "SRM is a large deemed university with modern infrastructure and a broad range of specializations, popular for its CSE and management dual programs.",
    logoColor: "#D97706",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", fees: 210000, seats: 500 },
      { name: "B.Tech Biotechnology", duration: "4 years", fees: 195000, seats: 120 },
    ],
    placements: [
      { year: 2025, avgPackage: 690000, highestPackage: 4100000, placementRate: 82, topRecruiters: "TCS, Cognizant, HCL, Zoho" },
    ],
    reviews: [
      { authorName: "Arjun V.", rating: 3.7, comment: "Good infra and clubs, but placement quality varies a lot by department." },
    ],
  },
  {
    name: "Manipal Institute of Technology",
    city: "Manipal",
    state: "Karnataka",
    type: "Private",
    fees: 205000,
    rating: 4.0,
    established: 1957,
    overview:
      "MIT Manipal offers a vibrant campus life alongside solid engineering fundamentals and a growing reputation in computer science placements.",
    logoColor: "#0D9488",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", fees: 205000, seats: 300 },
      { name: "B.Tech Mechatronics", duration: "4 years", fees: 200000, seats: 80 },
    ],
    placements: [
      { year: 2025, avgPackage: 950000, highestPackage: 4800000, placementRate: 87, topRecruiters: "Amazon, Nvidia, Cisco, Deloitte" },
    ],
    reviews: [
      { authorName: "Divya S.", rating: 4.1, comment: "Beautiful campus, strong alumni network in the US, decent CSE placements." },
    ],
  },
  {
    name: "Delhi Technological University",
    city: "New Delhi",
    state: "Delhi",
    type: "Government",
    fees: 158000,
    rating: 4.3,
    established: 1941,
    overview:
      "DTU is one of Delhi's top state universities, offering strong ROI given its government fee structure and consistently improving placement stats.",
    logoColor: "#4338CA",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", fees: 158000, seats: 180 },
      { name: "B.Tech Software Engineering", duration: "4 years", fees: 155000, seats: 60 },
    ],
    placements: [
      { year: 2025, avgPackage: 1450000, highestPackage: 6000000, placementRate: 91, topRecruiters: "Microsoft, Adobe, Samsung, Paytm" },
    ],
    reviews: [
      { authorName: "Ishaan G.", rating: 4.3, comment: "Excellent value for money — near-IIT outcomes at a fraction of the fees." },
    ],
  },
  {
    name: "Amrita Vishwa Vidyapeetham",
    city: "Coimbatore",
    state: "Tamil Nadu",
    type: "Deemed",
    fees: 175000,
    rating: 4.0,
    established: 1994,
    overview:
      "Amrita is a well-ranked deemed university with strong research output and a close-knit campus community across engineering disciplines.",
    logoColor: "#BE185D",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", fees: 175000, seats: 240 },
      { name: "B.Tech Electronics & Communication", duration: "4 years", fees: 170000, seats: 120 },
    ],
    placements: [
      { year: 2025, avgPackage: 780000, highestPackage: 4300000, placementRate: 85, topRecruiters: "TCS, Wipro, Amazon, EY" },
    ],
    reviews: [
      { authorName: "Nithya R.", rating: 4, comment: "Good faculty support and research opportunities for undergrads." },
    ],
  },
];

async function main() {
  console.log("Seeding database...");
  await prisma.review.deleteMany();
  await prisma.placementYear.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();

  for (const c of colleges) {
    await prisma.college.create({
      data: {
        name: c.name,
        slug: slugify(c.name),
        city: c.city,
        state: c.state,
        type: c.type,
        fees: c.fees,
        rating: c.rating,
        established: c.established,
        overview: c.overview,
        logoColor: c.logoColor,
        courses: { create: c.courses },
        placements: { create: c.placements },
        reviews: { create: c.reviews },
      },
    });
  }

  console.log(`Seeded ${colleges.length} colleges.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
