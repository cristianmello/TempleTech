const express = require("express");
const router = express.Router();
const rolesController = require("../controllers/roles");
const check = require("../middlewares/auth")


router.get("/", check.auth, rolesController.getAllRoles);
router.get("/:role_code/members", check.auth, rolesController.getRoleMembers);
router.post("/:role_code/members/:member_code", check.checkRole(["pastor"]), rolesController.associateRoleMember);
router.patch("/:role_code/", check.checkRole(["pastor"]), rolesController.updateRole);
router.delete("/:role_code/", check.checkRole(["pastor"]), rolesController.deleteRole);


module.exports = router;