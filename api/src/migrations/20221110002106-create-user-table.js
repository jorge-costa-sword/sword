module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "user",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        name: {
          type: Sequelize.STRING(128),
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(128),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(64),
          allowNull: false,
        },
        role: {
          type: Sequelize.INTEGER,
          allowNull: false,
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
        tableName: "user",
        timestamps: false,
        createdAt: "created",
        updatedAt: "updated",
        indexes: [
          {
            name: "user_pk",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      }
    );
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("user");
  },
};
