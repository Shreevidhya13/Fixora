
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Fixora backend is running",
  });
});

module.exports = router;
