module.exports = (sequelize, DataTypes) => {
    const Participants = sequelize.define('participants', {
        usersId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'usersId'
        },
        conversationsId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'conversationsId'
        }
    }, {
        tableName: 'participants',
        timestamps: true
    });
    Participants.associate = function (models) {
        // define association of this model
    };
    return Participants;
};
