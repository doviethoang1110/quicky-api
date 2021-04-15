module.exports = (sequelize, DataTypes) => {
    const Notes = sequelize.define('notes', {
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'title'
        },
        details: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'details'
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'date'
        },
        usersId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'usersId'
        },
        tag: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        }
    }, {
        tableName: 'notes',
        timestamps: true
    });
    Notes.associate = function (models) {
        // define association of this model
    };
    return Notes;
};
