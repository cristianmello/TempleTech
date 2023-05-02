const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/connection');


const Member = sequelize.define('Member', {
    member_code: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    member_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo no puede ser nulo"
            },
            isAlpha: {
                args: true,
                msg: "El nombre solo puede contener letras"
            },
            len: {
                args: [3, 255],
                msg: "El nombre tiene qque tener entre 3 y 255 caracteres"
            }
        }
    },
    member_lastname: {
        type: DataTypes.STRING,
        validate: {
            isAlpha: {
                args: true,
                msg: "El apellido solo puede contener letras"
            },
            len: {
                args: [3, 255],
                msg: "El apellido tiene qque tener entre 3 y 255 caracteres"
            }
        }
    },
    member_birth: {
        type: DataTypes.DATEONLY,
        validate: {
            isDate: {
                args: true,
                msg: "Ingrese una fecha valida"
            }
        }
    },
    member_mail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "El campo no puede ser nulo"
            },
            isEmail: {
                args: true,
                msg: "El campo tiene que ser un correo valido"
            }
        }
    },
    member_password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "La contraseña no puede estar vacia"
            },
            len: {
                args: [8, 250],
                msg: "La contraseña tiene que tener entre 8 y 25 caracteres"
            }
        }
    },
    member_image: {
        type: DataTypes.STRING,
        defaultValue: "default.png"
    },
    church_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: false,
    defaultScope: {
        attributes: { exclude: ['member_password'] }
    }


});

module.exports = Member;

/*
const member = database.define('members', {
    member_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    member_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo no puede ser nulo"
            },
            isAlpha: {
                args: true,
                msg: "El nombre solo puede contener letras"
            },
            len: {
                args: [3, 255],
                msg: "El nombre tiene qque tener entre 3 y 255 caracteres"
            }
        }
    },
    member_lastname: {
        type: DataTypes.STRING,
        validate: {
            isAlpha: {
                args: true,
                msg: "El apellido solo puede contener letras"
            },
            len: {
                args: [3, 255],
                msg: "El apellido tiene qque tener entre 3 y 255 caracteres"
            }
        }
    },
    member_birth: {
        type: DataTypes.DATE,
        defaultValue: Date.now,
        validate: {
            isDate: {
                args: true,
                msg: "Ingrese una fecha valida"
            }
        }
    },
    member_mail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo no puede ser nulo"
            },
            isEmail: {
                args: true,
                msg: "El campo tiene que ser un correo valido"
            }
        }
    },
    member_password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "La contraseña no puede estar vacia"
            },
            len: {
                args: [8, 25],
                msg: "La contraseña tiene que tener entre 8 y 25 caracteres"
            }
        }
    },
    church_code_fk: {
        type: DataTypes.INTEGER,
        required: true,
    },
    member_image: {
        type: DataTypes.STRING,
        defaultValue: "default.png"
    }
})
*/


