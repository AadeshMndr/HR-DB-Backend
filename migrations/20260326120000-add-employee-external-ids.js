"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const table = await queryInterface.describeTable("employee", {
        transaction,
      });

      if (!table.ioeEmployeeId) {
        await queryInterface.addColumn(
          "employee",
          "ioeEmployeeId",
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction }
        );
      }

      if (!table.tuEmployeeId) {
        await queryInterface.addColumn(
          "employee",
          "tuEmployeeId",
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction }
        );
      }

      await queryInterface.sequelize.query(
        `
          UPDATE employee
          SET "ioeEmployeeId" = CONCAT('IOE-', LPAD(CAST("empId" AS TEXT), 5, '0'))
          WHERE "ioeEmployeeId" IS NULL OR BTRIM("ioeEmployeeId") = '';
        `,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `
          UPDATE employee
          SET "tuEmployeeId" = CONCAT('TU-', LPAD(CAST("empId" AS TEXT), 7, '0'))
          WHERE "tuEmployeeId" IS NULL OR BTRIM("tuEmployeeId") = '';
        `,
        { transaction }
      );

      const [ioeDuplicates] = await queryInterface.sequelize.query(
        `
          SELECT "ioeEmployeeId", COUNT(*)::int AS count
          FROM employee
          WHERE "ioeEmployeeId" IS NOT NULL AND BTRIM("ioeEmployeeId") <> ''
          GROUP BY "ioeEmployeeId"
          HAVING COUNT(*) > 1
          LIMIT 5;
        `,
        { transaction }
      );

      if (ioeDuplicates.length > 0) {
        throw new Error(
          "Cannot create unique index employee_ioeEmployeeId_unique because duplicate ioeEmployeeId values exist."
        );
      }

      const [tuDuplicates] = await queryInterface.sequelize.query(
        `
          SELECT "tuEmployeeId", COUNT(*)::int AS count
          FROM employee
          WHERE "tuEmployeeId" IS NOT NULL AND BTRIM("tuEmployeeId") <> ''
          GROUP BY "tuEmployeeId"
          HAVING COUNT(*) > 1
          LIMIT 5;
        `,
        { transaction }
      );

      if (tuDuplicates.length > 0) {
        throw new Error(
          "Cannot create unique index employee_tuEmployeeId_unique because duplicate tuEmployeeId values exist."
        );
      }

      const indexes = await queryInterface.showIndex("employee", {
        transaction,
      });
      const hasIoeIndex = indexes.some(
        (index) => index.name === "employee_ioeEmployeeId_unique"
      );
      const hasTuIndex = indexes.some(
        (index) => index.name === "employee_tuEmployeeId_unique"
      );

      if (!hasIoeIndex) {
        await queryInterface.addIndex("employee", ["ioeEmployeeId"], {
          name: "employee_ioeEmployeeId_unique",
          unique: true,
          transaction,
        });
      }

      if (!hasTuIndex) {
        await queryInterface.addIndex("employee", ["tuEmployeeId"], {
          name: "employee_tuEmployeeId_unique",
          unique: true,
          transaction,
        });
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const table = await queryInterface.describeTable("employee", {
        transaction,
      });
      const indexes = await queryInterface.showIndex("employee", {
        transaction,
      });

      if (
        indexes.some(
          (index) => index.name === "employee_ioeEmployeeId_unique"
        )
      ) {
        await queryInterface.removeIndex(
          "employee",
          "employee_ioeEmployeeId_unique",
          { transaction }
        );
      }

      if (
        indexes.some(
          (index) => index.name === "employee_tuEmployeeId_unique"
        )
      ) {
        await queryInterface.removeIndex(
          "employee",
          "employee_tuEmployeeId_unique",
          { transaction }
        );
      }

      if (table.ioeEmployeeId) {
        await queryInterface.removeColumn("employee", "ioeEmployeeId", {
          transaction,
        });
      }

      if (table.tuEmployeeId) {
        await queryInterface.removeColumn("employee", "tuEmployeeId", {
          transaction,
        });
      }
    });
  },
};
