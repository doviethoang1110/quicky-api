module.exports = (sequelize, DataTypes) => {
    const UserToken = sequelize.define('userTokens', {
        usersId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'usersId'
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'token'
        },
        type: {
            type: DataTypes.ENUM('reset_password', 'active_user', 'refresh_token'),
            allowNull: false,
            defaultValue: 'active_user',
            field: 'type'
        },
        expiredAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'expiredAt'
        }
    }, {
        tableName: 'user_tokens',
        updatedAt: false
    });
    UserToken.associate = function (models) {
        // define association of this model
    };
    return UserToken;
};
