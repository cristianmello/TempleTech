const { Op } = require('sequelize');
const Church = require('../models/Church');
const Member = require('../models/Member');
const Role = require('../models/Role');
const bcrypt = require('bcrypt');




/*
//Ver los miembros de iglesia /api/members/:church_code/miembros
const getMember = async (req, res) => {
    try {
        const church_code = req.params.church_code;

        // Buscar la iglesia por su ID
        const church = await Church.findByPk(church_code);

        if (!church) {
            return res.status(404).json({ error: 'Iglesia no encontrada' });
        }

        // Buscar los miembros que pertenecen a la iglesia
        const members = await Member.findAll({
            where: { church_code: church.church_code }
        });

        res.json(members);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener los miembros de la iglesia' });
    }
};
*/


/*
const getChurchName = async (req, res) => {
    try {
        const churches = await Church.findAll({
            where: {
                church_name: req.query.church_name
            }
        });
        res.status(200).json(churches);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
*/

const churchRegister = async (req, res) => {
    const { church_name, church_address, church_description, church_telephone,
        member_name, member_lastname, member_birth, member_mail, member_password, member_image } = req.body;

    try {
        const church = await Church.create({
            church_name: church_name,
            church_address: church_address,
            church_description: church_description,
            church_telephone: church_telephone
        });

        const hashedPassword = await bcrypt.hash(member_password, 10);

        const shepherd = await church.createMember({
            member_name: member_name,
            member_lastname: member_lastname,
            member_birth: member_birth,
            member_mail: member_mail,
            member_password: hashedPassword,
            member_image: member_image,
            church_code: church.church_code
        });

        const roleShepherd = await Role.findOne({ where: { role_name: 'pastor' } });
        await shepherd.addRole(roleShepherd);

        res.json({ church, shepherd });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la iglesia', error });
    }
}


// UPDATE /api/church/:church_code
const updateChurch = async (req, res) => {

    const churchData = req.body;

    try {
        const church = await Church.findOne({
            where: {
                church_code: req.member.church_code
            }
        });

        if (!church) {
            return res.status(404).json({ message: 'Iglesia no encontrada' });
        }

        // Verificar si otra Iglesia tiene el mismo nombre
        const existingChurch = await Church.findOne({
            where: {
                church_name: churchData.church_name,
                church_code: { [Op.ne]: req.member.church_code } // Excluir la propia Iglesia de la búsqueda
            }
        });

        if (existingChurch) {
            return res.status(400).json({ message: 'Ya existe otra Iglesia con el mismo nombre' });
        }

        await Church.update(churchData, {
            where: {
                church_code: req.member.church_code
            }
        });
        const updatedChurch = await Church.findOne({
            where: {
                church_code: req.member.church_code
            }
        });

        res.json(updatedChurch);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar los datos de la iglesia', error });
    }

    /*
    const { church_code } = req.params;
    const { church_name, church_address, church_description } = req.body;

    try {
        // Buscar la iglesia por su ID
        const church = await Church.findByPk(church_code);

        if (!church) {
            return res.status(404).json({ message: 'La iglesia no existe' });
        }

        // Verificar que no haya otra iglesia con el mismo nombre
        const churchSomeName = await Church.findAll({
            where: {
                church_name: church_name,
                church_code: {
                    [Op.ne]: church.church_code // Excluir la iglesia actual
                }
            }
        });

        if (churchSomeName.length > 0) {
            return res.status(400).json({ message: 'Ya existe una iglesia con ese nombre' });
        }

        // Actualizar los datos de la iglesia
        church.church_name = church_name;
        church.church_address = church_address;
        church.church_description = church_description;
        await church.save();

        return res.json({ church });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error al actualizar la iglesia' });
    }
    */

}


// DELETE /api/posts/:church_code
const deleteChurch = async (req, res) => {

    try {
        const church_code = req.params.church_code;

        // Buscar y eliminar la iglesia por su ID
        const church = await Church.findByPk(church_code);
        if (!church_code) {
            return res.status(404).json({ message: 'Iglesia no encontrada' });
        }

        await church.destroy();
        return res.json({ message: 'Iglesia eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al eliminar la iglesia' });
    }
};


module.exports = {
    //getAllChurch,
    //getMember,
    //getChurchName,
    churchRegister,
    updateChurch,
    deleteChurch
}
