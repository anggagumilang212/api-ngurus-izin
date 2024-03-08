module.exports = (sequelize, Sequelize) => {
  const Administrators = sequelize.define("administrators", {
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.INTEGER,
    },
    role: {
      type: Sequelize.ENUM("affiliate", "merchant"),
    },
  });

  return Administrators;
};
