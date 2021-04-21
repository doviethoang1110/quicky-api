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
        }
    }, {
        tableName: 'relationships',
        timestamps: true
    });
    Relationships.associate = function (models) {
        Relationships.belongsTo(models.users, {
            foreignKey: 'senderId',
            as: 'senders'
        });
        Relationships.belongsTo(models.users, {
            foreignKey: 'receiverId',
            as: 'receivers'
        });
    };
    return Relationships;
};
