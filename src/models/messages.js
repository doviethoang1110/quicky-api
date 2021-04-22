module.exports = (sequelize, DataTypes) => {
    const Messages = sequelize.define('messages', {
        conversationsId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'conversationsId'
        },
        usersId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'usersId'
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'message'
        },
        type: {
            type: DataTypes.ENUM('text', 'image', 'file'),
            field: 'type',
            allowNull: false,
            defaultValue: 'text'
        }
    }, {
        tableName: 'messages',
        timestamps: true,
        updatedAt: false,
        paranoid: true
    });
    Messages.associate = function (models) {
        // define association of this model
    };
    return Messages;
};
