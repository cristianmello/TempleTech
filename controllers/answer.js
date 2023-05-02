const Answer = require("../models/Answer");
const Question = require("../models/Question");

const getAnswers = async (req, res) => {

    try {
        const answer = await Answer.findAll({
            include: {
                model: Question,
                as: 'question',
                attributes: ['question_description']
            }
        });

        if (!answer) {
            return res.status(404).send('No hay respuestas publicadas');
        }

        res.json(answer)

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las las respuestas');
    }

}


const postAnswer = async (req, res) => {
    const answer = req.body;

    Answer.create(answer).then(answerCreated => {
        res.status(201).json(answerCreated);
    }).catch(error => {
        res.status(500).json({ message: error.message });
    })
}


const updateAnswer = async (req, res) => {

    try {
        const { answer_description, task_code } = req.body;

        const answer_code = req.params.answer_code;
        const answer = await Answer.findByPk(answer_code);

        if (!answer) {
            return res.status(404).json({ message: 'La respuesta no existe' });
        }

        answer.answer_description = answer_description;
        answer.task_code = task_code;

        await answer.save();

        return res.status(200).json(answer);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Hubo un error al actualizar la respuesta' });
    }

};


const deleteAnswer = async (req, res) => {

    try {
        const answer_code = req.params.answer_code;

        const answer = await Answer.findByPk(answer_code);

        if (!answer) {
            return res.status(404).json({ message: 'Respuesta no encontrada' });
        }

        await answer.destroy();
        return res.json({ message: 'Respuesta eliminada exitosamente' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al eliminar la respuesta' });
    }

}

module.exports = {
    getAnswers,
    postAnswer,
    updateAnswer,
    deleteAnswer
}