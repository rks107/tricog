const express = require("express");
const router = express.Router();

// HOME CONTROLLER
const homeConroller = require("../controllers/home_controller");

router.get("/users/info", homeConroller.home);

// FOR USE OF USERS ROUTER
router.use("/users", require("./users"));

module.exports = router;