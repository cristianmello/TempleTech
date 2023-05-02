const { Op } = require('sequelize');
const Meeting = require('../models/Meeting');
const Member = require('../models/Member');



/*
//Obtener todas las reuniones de todas las Iglesias
const getAllMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find All();
        res.json(meetings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al obtener las reuniones con sus miembros' });
    }
}
*/


//Obtener todos los miembros que fueron a una reunion
const getMeetingMembers = async (req, res) => {

    const meeting_code = req.params.meeting_code;

    try {
        const meeting = await Meeting.findByPk(meeting_code, {
            include: {
                model: Member,
                attributes: ['member_code', 'member_name', 'member_lastname',
                    'member_birth', 'member_mail', 'member_password', 'member_image', 'church_code'],
                through: { attributes: [] }, // excluye la tabla intermedia de la respuesta

            },
        });

        if (!meeting) {
            return res.status(404).send('La reunion no existe');
        }
        res.json(meeting)
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la reunion');
    }

}

//Obtener los miembros que participaron en las reuniones entre dos fechas.
const getDateMeetingMembers = async (req, res) => {
    const { startDate, finishDate } = req.query;

    try {
        const members = await Member.findAll({
            include: [{
                model: Meeting,
                where: {
                    meeting_data: {
                        [Op.between]: [startDate, finishDate],
                    },
                },
            }],
        });
        res.json(members)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las tareas de tesoreria' });
    }
}


//Crea una nueva reunion
const createMeeting = async (req, res) => {
    try {
        const newMeeting = req.body;
        const meetingCreated = await Meeting.create(newMeeting);
        res.status(201).json({ message: 'Reunión creada correctamente', meeting: meetingCreated });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la reunión' });
    }
}

//Añade miembros a una reunion ya creada
const associateMeetingMembers = async (req, res) => {

    try {
        const { meeting_code, member_code } = req.body;

        const meeting = await Meeting.findByPk(meeting_code);

        if (!meeting) {
            return res.status(404).send('Reunión no encontrada');
        }

        const members = await Member.findAll({
            where: {
                member_code: member_code
            }
        });

        if (!members.length) {
            return res.status(404).send('Miembros no encontrados');
        }

        await meeting.addMembers(members);

        res.send('Miembro añadido a la reunion exitosamente');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al asociar el miembro con la reunion');
    }

}

const updateMeeting = async (req, res) => {

    try {
        const { meeting_description, meeting_data, meeting_starttime, meeting_finishtime, church_code } = req.body;

        const meeting_code = req.params.meeting_code;
        const meeting = await Meeting.findByPk(meeting_code);

        if (!meeting) {
            return res.status(404).json({ message: 'La reunion no existe' });
        }

        meeting.meeting_description = meeting_description;
        meeting.meeting_data = meeting_data;
        meeting.meeting_starttime = meeting_starttime;
        meeting.meeting_finishtime = meeting_finishtime;
        meeting.church_code = church_code;

        await meeting.save();

        return res.status(200).json(meeting);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Hubo un error al actualizzar la reunión' });
    }

};


const deleteMeeting = async (req, res) => {
    try {
        const meeting_code = req.params.meeting_code;

        const meeting = await Meeting.findByPk(meeting_code);
        if (!meeting) {
            return res.status(404).json({ message: 'Miembro no encontrado' });
        }

        await meeting.destroy();
        return res.json({ message: 'Reunion eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al eliminar la reunión' });
    }
};

module.exports = {
    //getAllMeetings,
    getMeetingMembers,
    getDateMeetingMembers,
    createMeeting,
    associateMeetingMembers,
    updateMeeting,
    deleteMeeting,
}
