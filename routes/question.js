const express = require("express");
const router = express.Router();
const questionController = require("../controllers/question");


router.get("/", questionController.getQuestions);
router.post("/", questionController.postQuestion);
router.patch("/:question_code", questionController.updateQuestion);
router.delete("/:question_code", questionController.deleteQuestion);



module.exports = router;