const express = require("express");
const router = express.Router();

const token = require("../controllers/tokensController");

router.route("/")
    .patch(token.notifPermission)
    .post(token.createToken)
    
module.exports = router;