const express = require('express');
const router = express.Router();
const memberController = require("../controllers/member");
const check = require("../middlewares/auth")


router.post('/login', memberController.login);
router.post('/logout', check.auth, memberController.logout);
router.get('/profile/:member_code', check.auth, memberController.getProfile);
router.get('/members/:church_code/list/:page?', check.auth, memberController.list);
router.get('/members', check.auth, memberController.listMembersByName);
router.post('/', memberController.register);
router.patch('/update', check.auth, memberController.updateMember);
router.delete('/:member_code', check.checkRole(["pastor"]), memberController.deleteMember);


//exportar router 
module.exports = router;