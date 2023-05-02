const { Op } = require('sequelize');
const SpecialTask = require('../models/SpecialTask');
const Member = require('../models/Member');


const getSpecialTaskMembers = async (req, res) => {

    const specialTask_code = req.params.specialTask_code;

    try {
        const specialTask = await SpecialTask.findByPk(specialTask_code, {
            include: {
                model: Member,
                attributes: ['member_name'],
                through: { attributes: [] }, // excluye la tabla intermedia de la respuesta
            },
        });

        if (!specialTask) {
            return res.status(404).send('La tarea no existe');
        }
        res.json(specialTask)
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la tarea');
    }

}


const getDateSpecialTaskMembers = async (req, res) => {
    const { startDate, finishDate } = req.query;

    try {
        const members = await Member.findAll({
            include: [{
                model: SpecialTask,
                where: {
                    specialtask_startdate: { [Op.lte]: finishDate },
                    specialTask_finishdate: { [Op.gte]: startDate }
                },
                through: { attributes: [] },
            }],
        });
        res.json(members)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }
}


// Crea una nueva tarea especial
const postSpecialTask = async (req, res) => {

    try {
        const specialTask = req.body;
        const specialTaskCreated = await SpecialTask.create(specialTask);
        res.status(201).json(specialTaskCreated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la tarea especial' });
    }
};

//Añade miembros a una tarea especial
const postSpecialTaskMember = async (req, res) => {

    try {
        const specialTask = await SpecialTask.findByPk(req.params.specialTask_code);
        const member = await Member.findByPk(req.params.member_code);

        if (!specialTask || !member) {
            return res.status(404).send('Tarea o miembro no encontrados');
        }

        await specialTask.addMember(member);

        res.send('Miembro añadido a la tarea');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al asociar el miembro con la tarea');
    }

}

const updateSpecialTask = async (req, res) => {

    try {
        const { specialtask_description, specialtask_startdate,
            specialtask_finishdate, specialtask_starttime, specialtask_finishtime } = req.body;

        const specialTask_code = req.params.specialTask_code;
        const specialTask = await SpecialTask.findByPk(specialTask_code);

        if (!specialTask) {
            return res.status(404).json({ message: 'La tarea no existe' });
        }

        specialTask.specialtask_description = specialtask_description;
        specialTask.specialtask_startdate = specialtask_startdate;
        specialTask.specialtask_finishdate = specialtask_finishdate;
        specialTask.specialtask_starttime = specialtask_starttime;
        specialTask.specialtask_finishtime = specialtask_finishtime;

        await specialTask.save();

        return res.status(200).json(specialTask);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Hubo un error al actualizzar la reunión' });
    }

};


const deleteSpecialTask = async (req, res) => {
    try {
        const specialTask_code = req.params.specialTask_code;

        const specialTask = await SpecialTask.findByPk(specialTask_code);
        if (!specialTask) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        await specialTask.destroy();
        return res.json({ message: 'Tarea eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al eliminar la tarea' });
    }
};

module.exports = {
    getSpecialTaskMembers,
    getDateSpecialTaskMembers,
    postSpecialTask,
    postSpecialTaskMember,
    updateSpecialTask,
    deleteSpecialTask
}
