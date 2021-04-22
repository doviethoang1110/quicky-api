'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('conversations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(200)
      },
      creatorId: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED
      },
      lastMessageId: {
        allowNull: true,
        type:Sequelize.INTEGER.UNSIGNED
      },
      image: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('group', 'single')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('conversations');
  }
};