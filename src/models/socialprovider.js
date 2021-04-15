module.exports = (sequelize, DataTypes) => {
    const SocialProviders = sequelize.define('socialProviders', {
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
            field: 'name'
        },
        socialId: {
            type: DataTypes.STRING(200),
            allowNull: false,
            field: 'socialId'
        },
        accessToken: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'accessToken'
        },
        usersId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'usersId'
        },
        type: {
            type: DataTypes.ENUM('facebook', 'google', 'twitter'),
            allowNull: false,
            defaultValue: 'facebook',
            field: 'type'
        }
    }, {
        tableName: 'social_providers',
        timestamps: false
    });
    SocialProviders.associate = function (models) {
        // define association of this model
    };
    return SocialProviders;
};
