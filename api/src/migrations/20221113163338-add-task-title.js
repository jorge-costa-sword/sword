module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.addColumn("task", "title", {
      type: Sequelize.STRING(128),
    }),
  down: async (queryInterface) => queryInterface.removeColumn("task", "title"),
};
