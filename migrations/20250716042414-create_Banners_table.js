'use strict';
const { Status } = require('../src/config/constants'); // Importing the Status enum from constants
const sequelize = require('../src/config/sql.config');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("banners", {
      _id: {
        type: Sequelize.UUID, //universally uinique identifier 
        allowNull: false, 
        unique: true,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4 //default value is generated using UUID version 4
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false, 
      },
      url: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null 
      },
      status: {
        type: Sequelize.ENUM(Object.values(Status)),
        defaultValue: Status.INACTIVE 
      },
        image:{
          type: Sequelize.JSON, 
          allowNull: false
        },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue:Sequelize.literal("CURRENT_TIMESTAMP") 
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP")
      },
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("banners"); 
  }
};
