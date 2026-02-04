// routes/courses.js
router.get("/", (req, res) => {
  res.json([
    { _id: "montessori", title: "Montessori (Early Childhood)" },
    { _id: "primary", title: "Primary School" },
    { _id: "jhs", title: "Junior High School" },
    { _id: "shs", title: "Senior High School" },
    { _id: "undergraduate", title: "University (Undergraduate)" },
    { _id: "postgraduate", title: "Postgraduate / Masters" },
    { _id: "phd", title: "PhD / Research" }
  ]);
});
