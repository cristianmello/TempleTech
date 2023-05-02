const { min } = require("moment/moment");
const { DataTypes } = require("sequelize");
const sequelize = require('../database/connection');


const Treasury = sequelize.define('Treasury', {
    activity_code: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    activity_value: {
        type: DataTypes.DECIMAL,
        validate: {
            isNumeric: {
                args: true,
                msg: "El campo tiene que ser un número"
            }
        }

    },
    activity_type: {
        type: DataTypes.INTEGER,
        validate: {
            isNumeric: {
                args: true,
                msg: "El campo tiene que ser un número"
            },
            isIn: {
                args: [[1, 2]],
                msg: "El valor debe ser 1 para entrada de dinero o 2 para salida de dinero"

            }
        }
    },
    activity_description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [3, 255],
                msg: "El campo tiene que tener entre 10 y 255 caracteres"
            }
        }
    },
    activity_date: {
        type: DataTypes.DATEONLY,
        validate: {
            isDate: {
                args: true,
                msg: "Ingrese una fecha valida"
            }
        }
    }
}, {
    timestamps: false,
});

module.exports = Treasury;
