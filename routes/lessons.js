// routes/lessons.js
router.get("/:courseId", (req, res) => {
  const { courseId } = req.params;

  res.json([
    { _id: `${courseId}-lesson-1`, title: "Introduction" },
    { _id: `${courseId}-lesson-2`, title: "Core Concepts" },
    { _id: `${courseId}-lesson-3`, title: "Examples & Practice" }
  ]);
});
