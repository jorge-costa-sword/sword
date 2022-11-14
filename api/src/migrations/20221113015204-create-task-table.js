module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "task",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        summary: {
          type: Sequelize.STRING(2500),
          allowNull: false,
        },
        creator_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "user",
            key: "id",
          },
        },
        performer_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "user",
            key: "id",
          },
        },
        performed_at: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null,
        },
        updated: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        created: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        tableName: "task",
        timestamps: false,
        createdAt: "created",
        updatedAt: "updated",
        indexes: [
          {
            name: "task_pk",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      }
    );
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("task");
  },
};
