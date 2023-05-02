const express = require('express');
const router = express.Router();
const churchController = require("../controllers/church");
const check = require("../middlewares/auth")

//Definicion de rutas

//router.get('/', churchController.getAllChurch);
//router.get('/:church_code', churchController.getMember);
//router.get('/:field/churches', churchController.getChurchName);
router.post('/', churchController.churchRegister);
router.patch('/', check.checkRole(['pastor']), churchController.updateChurch);
router.delete('/:church_code', check.checkRole(['pastor']), churchController.deleteChurch);



//exportar router
module.exports = router;