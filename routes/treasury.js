const express = require('express');
const router = express.Router();
const treasuryController = require("../controllers/treasury");
const check = require("../middlewares/auth")


router.get('/treasuries', check.auth, treasuryController.getTreasuries);
router.get('/:treasury_code', check.auth, treasuryController.getTreasury);
router.get('/treasuries/date', check.auth, treasuryController.getTreasuriesbetweenDate)
router.post('/', check.checkRole(['pastor', 'tesorero']), treasuryController.postTreasury);
router.patch('/:treasury_code', check.checkRole(['pastor', 'tesorero']), treasuryController.updateTreasury);
router.delete('/:treasury_code', check.checkRole(['pastor', 'tesorero']), treasuryController.deleteTreasury);


//exportar router
module.exports = router;
