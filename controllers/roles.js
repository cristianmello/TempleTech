const Role = require('../models/Role');
const Member = require('../models/Member');


//Obtener todos los Roles con los miembros que que poseen esos roles
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();

        const rolesWithMembers = await Promise.all(roles.map(async (role) => {
            const members = await role.getMembers();
            return {
                role_code: role.role_code,
                role_name: role.role_name,
                role_description: role.role_description,
                members
            };
        }));

        res.json(rolesWithMembers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al obtener los roles con sus miembros' });
    }
}


//Obtener un rol con todos sus miembros
const getRoleMembers = async (req, res) => {

    try {
        const role = await Role.findByPk(req.params.role_code);

        const rolesWithMembers = await Promise.all(role.map(async (role) => {
            const members = await role.getMembers();
            return {
                role_code: role.role_code,
                role_name: role.role_name,
                role_description: role.role_description,
                members
            };
        }));

        res.json(rolesWithMembers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al obtener los roles con sus miembros' });
    }
}



const associateRoleMember = async (req, res) => {

    try {
        const role = await Role.findByPk(req.params.role_code);
        const member = await Member.findByPk(req.params.member_code);

        if (!role || !member) {
            return res.status(404).send('Rol o miembro no encontrados');
        }

        await role.addMember(member);

        res.send('Rol asociado con el miembro exitosamente');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al asociar rol con el miembro');
    }

}

const updateRole = async (req, res) => {

    try {
        const { role_name, role_description } = req.body;

        const role_code = req.params.role_code;

        const role = await Role.findByPk(role_code);
        if (!role) {
            return res.status(404).json({ message: 'El rol no existe' });
        }

        role.role_name = role_name;
        role.role_description = role_description;


        await role.save();
        return res.status(200).json(role);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Hubo un error al actualizar el rol' });
    }

};


const deleteRole = async (req, res) => {

    try {
        const role_code = req.params.role_code;

        const role = await Role.findByPk(role_code);
        if (!role) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        await role.destroy();
        return res.json({ message: 'Rol eliminado exitosamente' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al eliminar el rol' });
    }
};

module.exports = {
    getAllRoles,
    getRoleMembers,
    associateRoleMember,
    updateRole,
    deleteRole,
}
