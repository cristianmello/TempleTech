const express = require("express");
const router = express.Router();
const specialTaskController = require("../controllers/specialTask");
const check = require("../middlewares/auth")


//router.get("/", meetingsController.getAllMeetings);
router.get("/:specialTask_code/members", check.auth, specialTaskController.getSpecialTaskMembers);
router.get("/members", check.auth, specialTaskController.getDateSpecialTaskMembers);
router.post("/", check.checkRole(['pastor', 'admin']), specialTaskController.postSpecialTask);
router.post("/:specialTask_code/members/:member_code", check.checkRole(['pastor', 'admin']), specialTaskController.postSpecialTaskMember);
router.patch("/:specialTask_code/", check.checkRole(['pastor', 'admin']), specialTaskController.updateSpecialTask);
router.delete("/:specialTask_code/", check.checkRole(['pastor', 'admin']), specialTaskController.deleteSpecialTask);


module.exports = router