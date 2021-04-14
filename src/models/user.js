module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'name'
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'phone'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'email'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password'
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'birthday'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'isActive'
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
      field: 'avatar'
    },
    dateCreated: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'dateCreated'
    }
  }, {
    tableName: 'users',
    timestamps: false
  });
  User.associate = function (models) {
    User.belongsTo(models.socialProviders, {
      targetKey: 'usersId',
      foreignKey: 'id',
      as: 'socialProviders'
    });
  };
  return User;
};
