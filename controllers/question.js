const Question = require("../models/Question");
const Task = require("../models/Task");

const getQuestions = async (req, res) => {

    try {
        const question = await Question.findAll({
            include: {
                model: Task,
                as: 'task',
                attributes: ['task_title']
            }
        });

        if (!question) {
            return res.status(404).send('No hay preguntas publicadas');
        }

        res.json(question)

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las preguntas');
    }

}


const postQuestion = async (req, res) => {
    const question = req.body;

    Question.create(question).then(questionCreated => {
        res.status(201).json(questionCreated);
    }).catch(error => {
        res.status(500).json({ message: error.message });
    })
}


const updateQuestion = async (req, res) => {

    try {
        const { question_description, task_code } = req.body;

        const question_code = req.params.question_code;
        const question = await Question.findByPk(question_code);

        if (!question) {
            return res.status(404).json({ message: 'La pregunta no existe' });
        }

        question.question_description = question_description;
        question.task_code = task_code;

        await question.save();

        return res.status(200).json(question);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Hubo un error al actualizar la pregunta.' });
    }

};


const deleteQuestion = async (req, res) => {

    try {
        const question_code = req.params.question_code;

        const question = await Question.findByPk(question_code);

        if (!question) {
            return res.status(404).json({ message: 'Pregunta no encontrada' });
        }

        await question.destroy();
        return res.json({ message: 'Pregunta eliminada exitosamente' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al eliminar la pregunta' });
    }

}

module.exports = {
    getQuestions,
    postQuestion,
    updateQuestion,
    deleteQuestion
}