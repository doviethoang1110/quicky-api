'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('social_providers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(200)
      },
      socialId: {
        type: Sequelize.STRING(200)
      },
      usersId: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('facebook', 'google', 'twitter'),
      },
      accessToken: {
        allowNull: false,
        type: Sequelize.TEXT
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('social_providers');
  }
};