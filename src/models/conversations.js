module.exports = (sequelize, DataTypes) => {
    const Conversations = sequelize.define('conversations', {
        name: {
            type: DataTypes.STRING(200),
            allowNull: true,
            defaultValue: null,
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
            allowNull: true,
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
        });
        Conversations.hasMany(models.messages, {
            foreignKey: 'conversationsId',
            as: 'messages'
        });
        Conversations.hasMany(models.participants, {
            foreignKey: 'conversationsId',
            as: 'participants'
        })
    };
    return Conversations;
};
