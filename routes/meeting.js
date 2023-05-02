const express = require("express");
const router = express.Router();
const meetingsController = require("../controllers/meeting");
const check = require("../middlewares/auth")


//router.get("/", meetingsController.getAllMeetings);
router.get("/:meeting_code/members", check.auth, meetingsController.getMeetingMembers);
router.get("/members", check.auth, meetingsController.getDateMeetingMembers);
router.post("/", check.checkRole(["pastor"]), meetingsController.createMeeting);
router.post("/associate", check.auth, meetingsController.associateMeetingMembers);
router.patch("/:meeting_code/", check.checkRole(["pastor"]), meetingsController.updateMeeting);
router.delete("/:meeting_code/", check.checkRole(["pastor"]), meetingsController.deleteMeeting);


module.exports = router;