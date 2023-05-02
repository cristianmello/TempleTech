const Treasury = require("../models/Treasury");
const Member = require("../models/Member");
const Church = require("../models/Church");
const { Op } = require("sequelize");


const getTreasuries = async (req, res) => {

    try {
        const member = req.member;
        const church_code = member.church_code;
        const church = await Church.findByPk(church_code);

        if (!church) {
            return res.status(404).json({ message: 'Iglesia no encontrada.' })
        }

        const members = await Member.findAll({
            where: { church_code },
            include: [{
                model: Treasury,
                as: 'treasury'
            }]
        });

        res.status(200).json(members);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las tareas de tesoreria.' })
    }

}

const getTreasury = async (req, res) => {

    const treasury_code = req.params.treasury_code;

    Treasury.findByPk(treasury_code).then(treasury => {
        if (treasury) {
            res.status(200).json(treasury);
        } else {
            res.status(404).json({ message: 'Actividad de tesorería no encontrada' });
        }
    }).catch(error => {
        res.status(500).json({ message: error.message });
    });
}

const getTreasuriesbetweenDate = async (req, res) => {

    const { startDate, finishDate } = req.query;

    // Validar fechas
    const startDateObj = new Date(startDate);
    const finishDateObj = new Date(finishDate);

    if (isNaN(startDateObj.getTime()) || isNaN(finishDateObj.getTime()) || startDateObj > finishDateObj) {
        return res.status(400).json({ message: 'Fechas inválidas' });
    }

    try {

        const member = req.member;
        const church_code = member.church_code;
        const church = await Church.findByPk(church_code);

        if (!church) {
            return res.status(404).json({ message: 'Iglesia no encontrada.' })
        }

        /*
        const members = await Member.findAll({
            include: [{
                model: Treasury,
                as: 'treasury',
                where: {
                    activity_date: {
                        [Op.between]: [startDate, finishDate],
                    },
                },
            }],
        });
        */

        // Buscar las tareas de tesorería de la iglesia entre las fechas especificadas
        const treasuries = await Treasury.findAll({
            where: {
                activity_date: {
                    [Op.between]: [startDate, finishDate],
                },
                member_code: {
                    [Op.eq]: member.member_code
                }
            },
        });

        // Obtener los miembros que tienen esas tareas de tesorería
        const members = await Member.findAll({
            attributes: ['member_code', 'member_name', 'member_lastname'],
            include: [{
                model: Treasury,
                as: 'treasury',
                where: {
                    activity_code: {
                        [Op.in]: treasuries.map(treasury => treasury.activity_code),
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

///Añadir un nuevo miembro
const postTreasury = async (req, res) => {

    try {
        const treasury = await Treasury.create({
            activity_value: req.body.activity_value,
            activity_type: req.body.activity_type,
            activity_description: req.body.activity_description,
            activity_date: req.body.activity_date,
            member_code: req.body.member_code
        });
        res.status(201).json(treasury);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al publicar la actividad de tesoreria' });
    }

}



const updateTreasury = async (req, res) => {

    try {
        const { activity_value, activity_type, activity_description, activity_date, member_code } = req.body;

        const treasury_code = req.params.treasury_code;
        const treasury = await Treasury.findByPk(treasury_code);

        if (!treasury) {
            return res.status(404).json({ message: 'La tarea de tesoreria no existe' });
        }

        treasury.activity_value = activity_value;
        treasury.activity_type = activity_type;
        treasury.activity_description = activity_description;
        treasury.activity_date = activity_date;
        treasury.member_code = member_code;

        await treasury.save();

        return res.status(200).json(treasury);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Hubo un error' });
    }

};


const deleteTreasury = async (req, res) => {
    try {
        const treasury_code = req.params.treasury_code;

        const treasury = await Treasury.findByPk(treasury_code);
        if (!treasury) {
            return res.status(404).json({ message: 'Tarea de tesoreria no encontrado' });
        }

        await treasury.destroy();
        return res.json({ message: 'Tarea de tesoreria eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al eliminar la tarea de tesoreria' });
    }
};

/*
const postTreasury = async (req, res) => {

    const treasury = req.body;
    const member_code = req.params.member_code;

    await Treasury.create(treasury).then(treasuryCreated => {

        Member.findByPk(member_code).then(member => {

            if (member) {
                treasury.addMembers(member).then(() => {
                    res.status(200).json({ message: 'Miembro agregado a la actividad de tesorería' });
                }).catch(error => {
                    res.status(500).json({ message: error.message });
                });
            } else {
                res.status(404).json({ message: 'Miembro no encontrado' });
            }
        }).catch(error => {
            res.status(500).json({ message: error.message });
        });
    })

    const members = await Member.findByPk(member_code)

    await treasury.addMembers(members);

    res.json(treasury);

}
*/



module.exports = {
    getTreasuries,
    getTreasuriesbetweenDate,
    getTreasury,
    postTreasury,
    updateTreasury,
    deleteTreasury,
}