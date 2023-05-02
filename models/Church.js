const { DataTypes } = require("sequelize");
const sequelize = require('../database/connection');


const Church = sequelize.define('Church', {
    church_code: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    church_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true,
        validate: {
            notNull: {
                msg: "EL campo no debe ser nulo"
            },
            len: {
                args: [1, 100],
                msg: "El nombre de la iglesia debe tener al menos 1 caracter"
            }
        }
    },
    church_address: {
        type: DataTypes.STRING,
    },
    church_description: {
        type: DataTypes.STRING,
    },
    church_telephone: {
        type: DataTypes.STRING,
    },

}, {
    timestamps: false,
});

module.exports = Church;
