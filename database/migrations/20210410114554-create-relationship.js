'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('relationships', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      senderId: {
        type: Sequelize.INTEGER.UNSIGNED,
      },
      receiverId: {
        type: Sequelize.INTEGER.UNSIGNED,
      },
      status: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      userActionId: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('relationships');
  }
};