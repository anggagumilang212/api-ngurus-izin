// const { Layanan } = require("./Layanan");
// Mengimpor Layanan dari db
// Assuming Layanan.js is in the same directory

const sequelize = require("../configs/database");
const { Model } = require("sequelize");
const Layanan = require("./Layanan");
class Order extends Model {}

module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("order", {
    nama: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING(15),
    },
    domisili: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.ENUM("pending", "success", "on process", "cancel"),
      defaultValue: "pending",
    },
    layananId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      // references: {
      //   model: "Layanan", // Model yang direferensikan
      //   key: "id", // Primary key dari model Layanan
      // },
    },
  });

  Order.associate = (models) => {
    // Optionally use this approach if you want to define the association here
    Order.belongsTo(models.Layanan, {
      foreignKey: "layananId",
      as: "layanan",
    });
  };

  // Layanan &&
  //   Order.belongsTo(Layanan, { foreignKey: "layananId", as: "layanan" });
  // Order.associate = (models) => {
  //   Order.belongsTo(models.Layanan, {
  //     foreignKey: "layananId",
  //     as: "layanans",
  //   });
  // };
  // Order.belongsTo(Layanan, { foreignKey: "layananId", as: "layanan" });
  return Order;
};
