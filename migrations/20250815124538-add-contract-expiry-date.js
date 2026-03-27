"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("employee");
    if (!tableInfo.contractExpiryDate) {
      await queryInterface.addColumn("employee", "contractExpiryDate", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("employee");
    if (tableInfo.contractExpiryDate) {
      await queryInterface.removeColumn("employee", "contractExpiryDate");
    }
  },
};
