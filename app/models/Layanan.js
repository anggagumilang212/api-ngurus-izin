const Sequelize = require("../configs/database");

module.exports = (sequelize, Sequelize) => {
  const Layanan = sequelize.define("Layanan", {
    nama: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gambar: {
      type: Sequelize.STRING,
    },
    urlGambar: {
      type: Sequelize.STRING,
    },
    harga: {
      type: Sequelize.INTEGER,
    },
    deskripsi: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.ENUM("active", "inactive"),
    },
  });
  return Layanan;
};
