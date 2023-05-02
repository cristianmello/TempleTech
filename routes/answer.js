const express = require('express');
const router = express.Router();
const answerController = require("../controllers/answer");


router.get("/", answerController.getAnswers);
router.post("/", answerController.postAnswer);
router.patch("/:answer_code", answerController.updateAnswer);
router.delete("/:answer_code", answerController.deleteAnswer);


module.exports = router;