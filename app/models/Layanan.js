const Transaksi = require("./Transaksi");

module.exports = (sequelize, Sequelize) => {
    const Layanan = sequelize.define("layanan", {
      nama: {
        type: Sequelize.STRING
      },
      gambar: {
        type: Sequelize.STRING
      },
      url_gambar: {
        type: Sequelize.STRING
      },
      harga: {
        type: Sequelize.INTEGER
      },
      deskripsi: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
      }
    });

    return Layanan;
  };