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
  });
  
  return Order;
};
