'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('relationships', {
      senderId: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true
      },
      receiverId: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true
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