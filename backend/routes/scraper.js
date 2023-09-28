const express = require("express");
const router = express.Router();
const textScraperController = require("../controller/TextScraperController");
router.use(express.json());
router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
router.post("/text", textScraperController.extractText);

module.exports = router;