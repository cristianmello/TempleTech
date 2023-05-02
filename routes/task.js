const express = require('express');
const { Model } = require('sequelize');
const router = express.Router();
const taskController = require("../controllers/task");
const check = require("../middlewares/auth")


router.get('/', check.auth, taskController.getTasks);
router.post('/', check.checkRole(['admin', 'pastor', 'maestro']), taskController.postTask);
router.patch('/:task_code', check.checkRole(['admin', 'pastor', 'maestro']), taskController.updateTask);
router.delete('/:task_code', check.checkRole(['admin', 'pastor', 'maestro']), taskController.deleteTask);


module.exports = router; 