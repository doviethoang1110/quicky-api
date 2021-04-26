'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('messages', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER.UNSIGNED
            },
            conversationsId: {
                allowNull: false,
                type: Sequelize.INTEGER.UNSIGNED
            },
            usersId: {
                allowNull: false,
                type: Sequelize.INTEGER.UNSIGNED
            },
            type: {
                allowNull: false,
                type: Sequelize.ENUM('text', 'image', 'file')
            },
            message: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            createdAt: {
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
        await queryInterface.dropTable('messages');
    }
};