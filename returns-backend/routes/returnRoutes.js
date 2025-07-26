const express = require("express");
const router = express.Router();
const {
  getAllReturns,
  updateReturnStatus,
} = require("../controllers/returnController");

router.get("/", getAllReturns);
router.put("/:id", updateReturnStatus);

module.exports = router;
