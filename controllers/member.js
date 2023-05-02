const Church = require('../models/Church');
const bcrypt = require('bcrypt');
const { or, Op } = require('sequelize');
const sequelize = require('sequelize');

const sequelizePaginate = require('sequelize-paginate')
const Member = require('../models/Member');
const jwt = require("../services/jwt")


const login = async (req, res) => {
    try {

        const { member_mail, member_password } = req.body;

        // Buscar el miembro en la base de datos
        const member = await Member.scope(null).findOne({
            where: {
                member_mail: member_mail
            }
        });

        // Verificar si el usuario existe
        if (!member) {
            return res.status(401).json({ message: 'No existe ese miembro' });
        }

        // Verificar si la contraseña es correcta
        const passwordMatch = await bcrypt.compare(member_password, member.member_password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Conseguir el token con JWT
        const token = jwt.createToken(member)

        // Devolver los datos del usuario y el token
        return res.status(200).send({
            status: "Success",
            message: "Te has identificado correctamente",
            token: token,
            member: {
                member_code: member.member_code,
                member_name: member.member_name,
                member_mail: member.member_mail
            },
            token
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ocurrió un error al autenticar al usuario' });
    }
}

const logout = async (req, res) => {
    const member_code = req.member.member_code;

    try {
        const member = await Member.findByPk(member_code);

        if (!member) {
            return res.status(404).json({ message: 'Miembro no encontrado' });
        }

        // Eliminar token de autenticación del miembro
        res.clearCookie('token');
        await member.save();

        res.json({ message: 'Sesión cerrada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cerrar sesión', error });
    }
}



//Obtener perfil del miembro por ID
const getProfile = async (req, res) => {
    try {
        const member_code = req.params.member_code;
        const member = await Member.findByPk(member_code);

        if (!member) {
            return res.status(404).json({ message: 'El miembro no existe' });
        }

        return res.json(member);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al obtener el miembro' });
    }
}

//listar todos los miembros de una Iglesia
const list = async (req, res) => {
    try {
        const { church_code, page } = req.params;
        const limit = 5;
        const currentPage = parseInt(page);
        const offset = (currentPage - 1) * limit;

        // Validar que church_code sea un número válido
        if (isNaN(church_code)) {
            return res.status(400).json({ message: 'El parámetro church_code debe ser un número válido' });
        }

        if (isNaN(currentPage) || currentPage < 1) {
            return res.status(400).json({ message: 'El parámetro page debe ser un número positivo' });
        }

        // Validar que limit sea un número positivo
        if (isNaN(limit) || limit <= 0) {
            return res.status(400).json({ message: 'El parámetro limit debe ser un número positivo' });
        }

        const members = await Member.findAndCountAll({
            where: {
                church_code: {
                    [Op.eq]: church_code,
                },
            },
            limit: limit,
            offset: offset,
            order: [
                ["member_code", "ASC"]
            ]
        });

        const totalPages = Math.ceil(members.count / limit);

        return res.status(200).json({
            members: members.rows,
            currentPage: currentPage,
            totalPages: totalPages,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error al obtener la lista de miembros" });
    }
}


// Actualizar miembro 
const updateMember = async (req, res) => {

    try {
        // Obtener el miembro a actualizar
        let userToUpdate = await Member.findOne({
            where: {
                member_code: req.member.member_code,
            },
        });

        if (!userToUpdate) {
            return res.status(404).json({ error: 'Miembro no encontrado' });
        }

        // Actualizar los atributos
        // Validar que se proporcione una nueva contraseña solo si se requiere
        userToUpdate.member_name = req.body.member_name || userToUpdate.member_name;
        userToUpdate.member_lastname = req.body.member_lastname || userToUpdate.member_lastname;
        userToUpdate.member_birth = req.body.member_birth || userToUpdate.member_birth;
        userToUpdate.member_mail = req.body.member_mail || userToUpdate.member_mail;
        userToUpdate.member_image = req.body.member_image || userToUpdate.member_image;
        if (req.body.member_password) {
            userToUpdate.member_password = await bcrypt.hash(req.body.member_password, 10);
        }

        // Excluir los atributos church_code y member_image de la actualización
        userToUpdate.church_code = userToUpdate.church_code;

        // Guardar los cambios
        await userToUpdate.save();

        // Devolver la respuesta
        return res.json({
            success: true,
            message: 'Miembro actualizado exitosamente',
            member: userToUpdate,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

}



//Obtener todos los miembros de la Iglesia que posean el nombre ingresado
const listMembersByName = async (req, res) => {

    const { church_code } = req.member;
    const { member_name } = req.query;

    // Validar que el parámetro de entrada sea una cadena de texto
    if (typeof member_name !== 'string') {
        return res.status(400).json({ message: 'El parámetro de búsqueda debe ser una cadena de texto' });
    }

    try {
        const members = await Member.findAll({
            where: {
                [Op.and]: [
                    sequelize.where(sequelize.fn('LOWER', sequelize.col('member_name')), 'LIKE', '%' + member_name.toLowerCase() + '%'),
                    { church_code: church_code }
                ]
            },
            attributes: { exclude: ['member_password'] },
        });
        return res.status(200).json({ members });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error al buscar los miembros de la iglesia' });
    }
}


//Añadir un nuevo miembro
const register = async (req, res) => {

    const { member_name, member_lastname, member_password, member_mail,
        member_birth, member_image, church_code } = req.body;

    // Verificar si el correo ya está registrado
    const memberExist = await Member.findOne({ where: { member_mail } });
    if (memberExist) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    try {
        //Cifrar la contraseña
        const hashedPassword = await bcrypt.hash(member_password, 10);

        const member = await Member.create({
            member_name,
            member_lastname,
            member_password: hashedPassword,
            member_mail,
            member_birth,
            member_image,
            church_code
        });

        // Devolver el miembro creado en la respuesta
        res.status(201).json(member);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el miembro' });
    }

}

// Eliminar miembro
const deleteMember = async (req, res) => {

    try {
        const { member_code } = req.params;

        // Buscar y eliminar la iglesia por su ID
        const member = await Member.findByPk(member_code);
        if (!member_code) {
            return res.status(404).json({ message: 'Miembro no encontrado' });
        }

        await member.destroy();
        return res.json({ message: 'Miembro eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al eliminar el miembro' });
    }
};

module.exports = {
    login,
    logout,
    getProfile,
    list,
    listMembersByName,
    register,
    updateMember,
    deleteMember
}