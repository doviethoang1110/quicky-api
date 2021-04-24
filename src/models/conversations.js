module.exports = (sequelize, DataTypes) => {
    const Conversations = sequelize.define('conversations', {
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
            field: 'name'
        },
        creatorId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'creatorId'
        },
        lastMessageId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            field: 'lastMessageId'
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'image'
        },
        type: {
            type: DataTypes.ENUM('single', 'group'),
            field: 'type',
            allowNull: false,
            defaultValue: 'single'
        }
    }, {
        tableName: 'conversations',
        timestamps: true,
        paranoid: true
    });
    Conversations.associate = function (models) {
        Conversations.belongsTo(models.messages, {
           foreignKey: 'lastMessageId',
           as: 'lastMessage'
        });
        Conversations.belongsTo(models.users, {
            foreignKey: 'creatorId',
            as: 'creators'
        })
    };
    return Conversations;
};
