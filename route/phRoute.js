const express = require("express");
const router = express.Router();

const ph = require("../controllers/phController");

router.route("/")
    .get(ph.getPh)
    .delete(ph.deletePh)

router.route("/recent")
    .get(ph.getRecentPh)

router.route("/byDate/:date")
    .get(ph.getByDate)

module.exports = router;