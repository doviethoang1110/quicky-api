module.exports = (sequelize, DataTypes) => {
    const Relationships = sequelize.define('relationships', {
        senderId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'senderId'
        },
        receiverId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'receiverId'
        },
        status: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 1,
            field: 'status'
        },
        userActionId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'userActionId'
        },
        type: {
            type: DataTypes.ENUM('facebook', 'google', 'twitter'),
            allowNull: false,
            defaultValue: 'facebook',
            field: 'type'
        }
    }, {
        tableName: 'relationships',
        timestamps: true
    });
    Relationships.associate = function (models) {
        // define association of this model
    };
    return Relationships;
};
