const express = require("express");
const router = express.Router();

/* =========================
   GET ALL COURSES
   ========================= */
router.get("/", (req, res) => {
  try {
    return res.status(200).json([
      {
        id: "theology-christian",
        title: "Theology – Christian Studies",
        lessons: [
          { id: "act101", title: "Biblical Interpretation in African Cultures" },
          { id: "act102", title: "Liberation Theology (Post-Colonial Africa)" },
          { id: "act103", title: "African Church History" },
          { id: "act104", title: "Contextual Christian Ethics in Africa" },
          { id: "act105", title: "Missions and Evangelism in African Contexts" },
          { id: "act106", title: "Prophecy and African Prophets" },
          { id: "act107", title: "Poverty, Justice & Biblical Themes" },
          { id: "act108", title: "Church Leadership & Administration in Africa" }
        ]
      },
      {
        id: "theology-islamic",
        title: "Theology – Islamic Studies",
        lessons: [
          { id: "isa101", title: "Spread of Islam in Africa (Historical)" },
          { id: "isa102", title: "Sufism and Spiritual Traditions in West Africa" },
          { id: "isa103", title: "Sharia Application in African Societies" },
          { id: "isa104", title: "Contemporary Muslim Issues in Africa" },
          { id: "isa105", title: "Interfaith Dialogue: Christian-Muslim Relations" },
          { id: "isa106", title: "Islamic Ethics and Social Justice" }
        ]
      },
      {
        id: "african-spirituality",
        title: "African Indigenous Spirituality & Interfaith",
        lessons: [
          { id: "ais101", title: "Traditional African Religions & Cosmology" },
          { id: "ais102", title: "Ancestor Veneration & Rituals" },
          { id: "ais103", title: "Syncretism: Christianity, Islam & Indigenous Faiths" },
          { id: "ais104", title: "Spirituality, Environment & Sustainability" },
          { id: "ais105", title: "Peacebuilding Through Interfaith Dialogue" }
        ]
      },
      {
        id: "bba",
        title: "Bachelor of Business Administration (BBA)",
        lessons: [
          { id: "bba101", title: "Introduction to Business" },
          { id: "bba102", title: "Principles of Management" },
          { id: "bba103", title: "Financial Accounting" },
          { id: "bba104", title: "Business Mathematics" }
        ]
      },
      {
        id: "african-entrepreneurship",
        title: "African Entrepreneurship & Innovation",
        lessons: [
          { id: "aei101", title: "Startup Ecosystems in Africa" },
          { id: "aei102", title: "Fintech and Mobile Money" },
          { id: "aei103", title: "Agribusiness & Value Chains" },
          { id: "aei104", title: "Women in African Business Leadership" },
          { id: "aei105", title: "Scaling Ventures in Emerging Markets" }
        ]
      },
      {
        id: "ict",
        title: "Information & Communication Technology (ICT)",
        lessons: [
          { id: "ict101", title: "Computer Fundamentals & Digital Literacy" },
          { id: "ict102", title: "Networking & Internet Technologies" },
          { id: "ict103", title: "Database Management Systems" },
          { id: "ict104", title: "Cybersecurity Basics" },
          { id: "ict105", title: "Cloud Computing & Virtualization" }
        ]
      },
      {
        id: "computer-science",
        title: "Computer Science Fundamentals",
        lessons: [
          { id: "cs101", title: "Introduction to Programming Concepts" },
          { id: "cs102", title: "Data Structures & Algorithms" },
          { id: "cs103", title: "Operating Systems & Architecture" },
          { id: "cs104", title: "Software Engineering Principles" },
          { id: "cs105", title: "Artificial Intelligence & Machine Learning Intro" }
        ]
      },
      {
        id: "coding",
        title: "Coding & Programming",
        lessons: [
          { id: "cod101", title: "Python for Beginners" },
          { id: "cod102", title: "JavaScript & Web Development" },
          { id: "cod103", title: "Java Programming" },
          { id: "cod104", title: "Mobile App Development (Flutter/React Native)" },
          { id: "cod105", title: "Full-Stack Development Project" }
        ]
      },
      {
        id: "robotics",
        title: "Robotics Program with Basic Sciences",
        lessons: [
          { id: "rob-montessori", title: "Montessori Level: Sensory Robotics & Basic Physics (Ages 3–6)" },
          { id: "rob-primary", title: "Primary Level: Simple Machines, Logic & Intro Coding (Ages 6–12)" },
          { id: "rob-secondary", title: "Secondary Level: Electronics, Sensors, Arduino & Chemistry Basics (Ages 12–18)" },
          { id: "rob-university", title: "University Level: AI Robotics, Automation, Advanced Physics & Engineering" }
        ]
      },
      {
        id: "african-history-dev",
        title: "African History & Development",
        lessons: [
          { id: "ahd101", title: "Pre-Colonial African Societies" },
          { id: "ahd102", title: "Colonialism & Its Lasting Impact" },
          { id: "ahd103", title: "Pan-Africanism & Independence Movements" },
          { id: "ahd104", title: "Modern African Political Economy" }
        ]
      },
      {
        id: "public-health-africa",
        title: "Public Health in Africa",
        lessons: [
          { id: "pha101", title: "Tropical Diseases & Epidemiology" },
          { id: "pha102", title: "HIV/AIDS & Infectious Disease Control" },
          { id: "pha103", title: "Maternal & Child Health in Africa" },
          { id: "pha104", title: "Health Systems Strengthening" }
        ]
      },
      {
        id: "sustainable-dev-africa",
        title: "Sustainable Development in Africa",
        lessons: [
          { id: "sda101", title: "SDGs Localization in Africa" },
          { id: "sda102", title: "Climate Resilience & Adaptation" },
          { id: "sda103", title: "Renewable Energy Solutions" },
          { id: "sda104", title: "Food Security & Agriculture" }
        ]
      }
    ]);
  } catch (error) {
    console.error("❌ Courses route error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load courses."
    });
  }
});

module.exports = router;
