"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("employee");
    if (!table.bankAccountNumber) {
      await queryInterface.addColumn("employee", "bankAccountNumber", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable("employee");
    if (table.bankAccountNumber) {
      await queryInterface.removeColumn("employee", "bankAccountNumber");
    }
  },
};
