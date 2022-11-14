module.exports = (sequelize, DataTypes) => {
  // eslint-disable-next-line global-require
  const User = require("./user")(sequelize, DataTypes);

  const Task = sequelize.define(
    "Task",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      summary: {
        type: DataTypes.STRING(2500),
        allowNull: false,
      },
      creator_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      performer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      performed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "task",
      createdAt: "created",
      updatedAt: "updated",
    }
  );

  User.hasMany(Task, { foreignKey: "performer_id", as: "Performer" });
  Task.belongsTo(User, { foreignKey: "performer_id", as: "Performer" });

  return Task;
};
